<template>
  <v-container fluid>
    <!-- FILTER BAR -->
    <v-row dense class="mb-4">
      <v-col cols="12">
        <v-sheet class="pa-4 rounded-xl elevation-2">
          <v-row dense align="center" justify="space-between">
            <v-col cols="12" sm="3" md="2">
              <v-select
                v-model="filters.school"
                :items="['All', ...schools]"
                label="School"
                dense
                clearable
              />
            </v-col>
            <v-col cols="12" sm="3" md="2">
              <v-select
                v-model="filters.student"
                :items="['All', ...studentNames]"
                label="Student"
                dense
                clearable
              />
            </v-col>
            <v-col cols="12" sm="3" md="2">
              <v-select
                v-model="filters.ethnicity"
                :items="['All', ...ethnicities]"
                label="Ethnicity"
                dense
                clearable
              />
            </v-col>
            <v-col cols="12" sm="3" md="2">
              <v-select
                v-model="filters.attendance"
                :items="['All', ...attendanceStatuses]"
                label="Attendance"
                dense
                clearable
              />
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>

    <!-- SCATTER PLOT CHART -->
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4 rounded-xl elevation-3 mb-6">
          <v-card-title class="text-h6">Students in Jeopardy Scatter Plot</v-card-title>
          <v-divider class="mb-4" />
          <canvas ref="chartCanvas" style="min-height: 350px"></canvas>
        </v-card>
      </v-col>
    </v-row>

    <!-- STUDENT LIST -->
    <v-row>
      <v-col
        cols="12"
        v-for="student in filteredStudentDetails"
        :key="student.studentID"
        class="mb-4"
      >
        <v-sheet elevation="1" rounded class="pa-4">
          <v-row align="center" no-gutters>
            <v-col cols="auto" class="pr-4">
              <v-avatar size="64">
                <v-img :src="student.avatar || 'https://via.placeholder.com/64'" />
              </v-avatar>
            </v-col>
            <v-col cols="12" sm="3">
              <div class="text-h6">{{ student.firstName }} {{ student.lastName }}</div>
              <div class="text-caption">Student ID: {{ student.studentID }}</div>
            </v-col>
            <v-col cols="12" sm="2" class="text-center">
              <div class="text-subtitle-2">Attendance</div>
              <v-chip
                :color="student.attendanceRate >= 90 ? 'green' : 'orange'"
                text-color="white"
                small
              >
                {{ student.attendanceRate }}%
              </v-chip>
            </v-col>
            <v-col cols="12" sm="2" class="text-center">
              <div class="text-subtitle-2">Behavior</div>
              <v-chip
                :color="student.behaviorIncidents > 0 ? 'red' : 'blue-grey'"
                text-color="white"
                small
              >
                {{ student.behaviorIncidents }} incidents
              </v-chip>
            </v-col>
            <v-col cols="12" sm="2" class="text-center">
              <div class="text-subtitle-2">504/IEP</div>
              <v-chip
                :color="student.iep || student['504'] ? 'deep-purple' : 'grey'"
                text-color="white"
                small
              >
                {{ student.iep ? 'IEP' : student['504'] ? '504' : 'None' }}
              </v-chip>
            </v-col>
            <v-col cols="12" sm="1" class="text-center">
              <v-btn icon @click="viewProfile(student.studentID)">
                <v-icon>mdi-account-arrow-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue'
import Chart from 'chart.js/auto'

// Sample data interface & data
interface StudentData {
  studentID: number
  firstName: string
  lastName: string
  name: string
  school: string
  ethnicity: string
  attendance: string
  attendanceRate: number
  behaviorIncidents: number
  iep: boolean
  '504': boolean
  avatar: string
  score: number
}

// Generate 50 sample students with random data
const firstNames = [
  'Alice',
  'Bob',
  'Charlie',
  'Diana',
  'Ethan',
  'Fiona',
  'George',
  'Hannah',
  'Ivan',
  'Julia',
]
const lastNames = [
  'Smith',
  'Johnson',
  'Lee',
  'Brown',
  'Garcia',
  'Martinez',
  'Davis',
  'Clark',
  'Lewis',
  'Walker',
]
const _schools = ['North High', 'East High', 'West High', 'South High']
const _ethnicities = ['Hispanic', 'White', 'Black', 'Asian', 'Other']
const _attendanceStatuses = ['Present', 'Absent', 'Tardy']

function randomBool(prob = 0.2) {
  return Math.random() < prob
}

const rawData: StudentData[] = Array.from({ length: 550 }, (_, i) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const name = `${firstName} ${lastName}`
  return {
    studentID: i + 1,
    firstName,
    lastName,
    name,
    school: _schools[Math.floor(Math.random() * _schools.length)],
    ethnicity: _ethnicities[Math.floor(Math.random() * _ethnicities.length)],
    attendance: _attendanceStatuses[Math.floor(Math.random() * _attendanceStatuses.length)],
    attendanceRate: Math.floor(Math.random() * 101), // 60-100%
    behaviorIncidents: Math.floor(Math.random() * 4), // 0-3
    iep: randomBool(0.15),
    '504': randomBool(0.1),
    avatar: '',
    score: Math.floor(Math.random() * 101), // 0-100
  }
})

// Filters and options
const filters = ref({
  school: 'All',
  student: 'All',
  ethnicity: 'All',
  attendance: 'All',
})

const schools = [...new Set(rawData.map((s) => s.school))]
const ethnicities = [...new Set(rawData.map((s) => s.ethnicity))]
const attendanceStatuses = [...new Set(rawData.map((s) => s.attendance))]
const studentNames = [...new Set(rawData.map((s) => s.name))]

// Filtered students based on filters
const filteredStudentDetails = computed(() =>
  rawData.filter((s) => {
    return (
      (filters.value.school === 'All' || s.school === filters.value.school) &&
      (filters.value.student === 'All' || s.name === filters.value.student) &&
      (filters.value.ethnicity === 'All' || s.ethnicity === filters.value.ethnicity) &&
      (filters.value.attendance === 'All' || s.attendance === filters.value.attendance)
    )
  }),
)

// Chart setup
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// Helper: Get color based on student risk
function getPointColor(student: StudentData) {
  if (student.behaviorIncidents > 0) return 'rgba(255, 99, 132, 0.8)' // red-ish
  if (student.iep || student['504']) return 'rgba(153, 102, 255, 0.8)' // purple-ish
  return 'rgba(54, 162, 235, 0.8)' // blue-ish
}

const updateChart = () => {
  if (!chartCanvas.value) return

  const dataPoints = filteredStudentDetails.value.map((s) => ({
    x: s.score,
    y: s.attendanceRate,
    studentID: s.studentID,
    backgroundColor: getPointColor(s),
  }))

  if (chartInstance) {
    chartInstance.data.datasets[0].data = dataPoints
    chartInstance.update()
  } else {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Students',
            data: dataPoints,
            backgroundColor: dataPoints.map((p) => p.backgroundColor),
            pointRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label(ctx) {
                const s = filteredStudentDetails.value.find(
                  (st) => st.studentID === ctx.raw.studentID,
                )
                return s ? `${s.name} — Score: ${s.score}, Attendance: ${s.attendanceRate}%` : ''
              },
            },
          },
          legend: { display: false },
        },
        scales: {
          x: {
            title: { display: true, text: 'Score' },
            min: 0,
            max: 100,
          },
          y: {
            title: { display: true, text: 'Attendance Rate (%)' },
            min: 0,
            max: 100,
          },
        },
        hover: {
          mode: 'nearest',
          intersect: true,
        },
      },
    })
  }
}

watch(filters, updateChart, { deep: true })
onMounted(() => updateChart())

const viewProfile = (studentID: number) => {
  alert(`Viewing profile for student ID: ${studentID}`)
}
</script>
