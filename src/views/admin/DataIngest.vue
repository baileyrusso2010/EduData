<template>
  <v-container fluid>
    <v-row dense>
      <!-- FILTER CARD -->
      <v-col cols="12" md="3">
        <v-card class="pa-4 rounded-xl elevation-3">
          <v-card-title class="text-h6">Filters</v-card-title>
          <v-divider class="mb-3" />

          <v-select
            v-model="filters.school"
            :items="['All', ...schools]"
            label="School"
            clearable
          />

          <v-select
            v-model="filters.student"
            :items="['All', ...filteredStudents]"
            label="Student"
            clearable
          />

          <v-select
            v-model="filters.ethnicity"
            :items="['All', ...ethnicities]"
            label="Ethnicity"
            clearable
          />

          <v-select
            v-model="filters.attendance"
            :items="['All', ...attendanceStatuses]"
            label="Attendance"
            clearable
          />
        </v-card>
      </v-col>

      <!-- CHART CARD -->
      <v-col cols="12" md="9">
        <v-card class="pa-4 rounded-xl elevation-3">
          <v-card-title class="text-h6">Student Scores</v-card-title>
          <v-divider class="mb-4" />
          <canvas ref="chartCanvas" style="min-height: 300px"></canvas>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, computed } from 'vue'
import Chart from 'chart.js/auto'

// ---------- TYPES ----------
interface StudentData {
  name: string
  school: string
  ethnicity: string
  attendance: string
  score: number
}

// ---------- DATA ----------
const rawData: StudentData[] = [
  { name: 'Alice', school: 'North High', ethnicity: 'Hispanic', attendance: 'Present', score: 85 },
  { name: 'Bob', school: 'North High', ethnicity: 'White', attendance: 'Absent', score: 72 },
  { name: 'Charlie', school: 'East High', ethnicity: 'Black', attendance: 'Present', score: 90 },
  { name: 'Daisy', school: 'West High', ethnicity: 'Asian', attendance: 'Present', score: 95 },
  { name: 'Eve', school: 'East High', ethnicity: 'White', attendance: 'Absent', score: 60 },
]

// ---------- CHART SETUP ----------
const chartCanvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// ---------- FILTERS ----------
const filters = ref({
  school: 'All',
  student: 'All',
  ethnicity: 'All',
  attendance: 'All',
})

// ---------- OPTIONS ----------
const schools = [...new Set(rawData.map((s) => s.school))]
const ethnicities = [...new Set(rawData.map((s) => s.ethnicity))]
const attendanceStatuses = [...new Set(rawData.map((s) => s.attendance))]

const filteredStudents = computed(() => {
  const base =
    filters.value.school !== 'All'
      ? rawData.filter((s) => s.school === filters.value.school)
      : rawData
  return [...new Set(base.map((s) => s.name))]
})

// ---------- FILTERED DATA ----------
const filteredData = computed(() => {
  return rawData.filter((s) => {
    return (
      (filters.value.school === 'All' || s.school === filters.value.school) &&
      (filters.value.student === 'All' || s.name === filters.value.student) &&
      (filters.value.ethnicity === 'All' || s.ethnicity === filters.value.ethnicity) &&
      (filters.value.attendance === 'All' || s.attendance === filters.value.attendance)
    )
  })
})

// ---------- UPDATE CHART ----------
const updateChart = () => {
  const labels = filteredData.value.map((s) => s.name)
  const scores = filteredData.value.map((s) => s.score)

  if (chartInstance) {
    chartInstance.data.labels = labels
    chartInstance.data.datasets[0].data = scores
    chartInstance.update()
  } else if (chartCanvas.value) {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Score',
            data: scores,
            backgroundColor: '#42a5f5',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Score',
            },
          },
        },
      },
    })
  }
}

watch(filters, updateChart, { deep: true })
onMounted(() => updateChart())
</script>
