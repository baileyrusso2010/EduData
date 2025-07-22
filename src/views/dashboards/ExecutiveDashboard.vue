<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center">
          <div>
            <h1 class="text-h3 text-primary font-weight-bold">Executive Dashboard</h1>
            <p class="text-h6 text-grey-darken-1">
              {{ districtInfo.name }} - {{ getCurrentDate() }}
            </p>
          </div>
          <div class="d-flex align-center gap-3">
            <!-- School Selector -->
            <v-select
              v-model="selectedSchool"
              :items="schoolOptions"
              item-title="name"
              item-value="value"
              label="Select School"
              outlined
              dense
              style="min-width: 250px"
              prepend-inner-icon="mdi-school"
              clearable
              :loading="isLoadingSchools"
              @update:model-value="onSchoolChange"
            >
              <template v-slot:selection="{ item }">
                <v-chip color="primary" size="small">
                  <v-icon start size="small">{{ item.raw.icon }}</v-icon>
                  {{ item.raw.name }}
                </v-chip>
              </template>
            </v-select>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Key Performance Indicators -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3" v-for="(kpi, index) in keyMetrics" :key="index">
        <v-card :color="kpi.color" dark elevation="8" class="pa-4">
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h6">{{ kpi.title }}</span>
            <v-icon size="32">{{ kpi.icon }}</v-icon>
          </v-card-title>
          <v-card-text>
            <div class="text-h3 font-weight-bold mb-2">{{ kpi.value }}</div>
            <div class="d-flex align-center">
              <v-icon
                :color="kpi.trend > 0 ? 'success' : kpi.trend < 0 ? 'error' : 'warning'"
                class="mr-2"
              >
                {{
                  kpi.trend > 0
                    ? 'mdi-trending-up'
                    : kpi.trend < 0
                      ? 'mdi-trending-down'
                      : 'mdi-trending-neutral'
                }}
              </v-icon>
              <span class="text-body-2"
                >{{ Math.abs(kpi.trend) }}%
                {{ kpi.trend > 0 ? 'increase' : kpi.trend < 0 ? 'decrease' : 'no change' }}</span
              >
            </div>
            <div class="text-caption mt-1">{{ kpi.description }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Row 1 -->
    <v-row class="mb-6">
      <!-- Student Performance Overview -->
      <v-col cols="12" md="8">
        <v-card elevation="6" class="pa-4" style="height: 450px">
          <v-card-title class="text-h5 text-primary">
            <v-icon class="mr-2">mdi-chart-line</v-icon>
            Academic Performance Trends
          </v-card-title>
          <v-card-subtitle>Monthly performance across all schools</v-card-subtitle>
          <v-card-text style="height: 350px">
            <Line :data="performanceData" :options="performanceOptions" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Attendance Overview -->
      <v-col cols="12" md="4">
        <v-card elevation="6" class="pa-4" style="height: 450px">
          <v-card-title class="text-h5 text-success">
            <v-icon class="mr-2">mdi-account-check</v-icon>
            Attendance Rate
          </v-card-title>
          <v-card-subtitle>Current month average</v-card-subtitle>
          <v-card-text class="d-flex flex-column justify-center align-center" style="height: 350px">
            <Doughnut :data="attendanceData" :options="attendanceOptions" />
            <div class="text-center mt-4">
              <div class="text-h3 font-weight-bold text-success">{{ overallAttendance }}%</div>
              <div class="text-body-1">Overall Attendance</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Row 2 -->
    <v-row class="mb-6">
      <!-- Student Demographics -->
      <v-col cols="12" md="6">
        <v-card elevation="6" class="pa-4" style="height: 400px">
          <v-card-title class="text-h5 text-info">
            <v-icon class="mr-2">mdi-account-group</v-icon>
            Student Demographics
          </v-card-title>
          <v-card-subtitle>District-wide breakdown</v-card-subtitle>
          <v-card-text style="height: 320px">
            <Pie :data="demographicsData" :options="pieOptions" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Grade Distribution -->
      <v-col cols="12" md="6">
        <v-card elevation="6" class="pa-4" style="height: 400px">
          <v-card-title class="text-h5 text-warning">
            <v-icon class="mr-2">mdi-chart-bar</v-icon>
            Grade Distribution
          </v-card-title>
          <v-card-subtitle>Current semester averages</v-card-subtitle>
          <v-card-text style="height: 320px">
            <Bar :data="gradeData" :options="gradeOptions" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- School Performance Table -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="6" class="pa-4">
          <v-card-title class="text-h5 text-primary">
            <v-icon class="mr-2">mdi-school</v-icon>
            School Performance Summary
          </v-card-title>
          <v-card-subtitle>Key metrics by school</v-card-subtitle>
          <v-card-text>
            <v-data-table
              :headers="schoolHeaders"
              :items="schoolData"
              :items-per-page="10"
              class="elevation-2"
            >
              <template v-slot:item.attendanceRate="{ item }">
                <v-chip
                  :color="
                    item.attendanceRate >= 95
                      ? 'success'
                      : item.attendanceRate >= 90
                        ? 'warning'
                        : 'error'
                  "
                  small
                >
                  {{ item.attendanceRate }}%
                </v-chip>
              </template>
              <template v-slot:item.proficiencyRate="{ item }">
                <v-chip
                  :color="
                    item.proficiencyRate >= 80
                      ? 'success'
                      : item.proficiencyRate >= 70
                        ? 'warning'
                        : 'error'
                  "
                  small
                >
                  {{ item.proficiencyRate }}%
                </v-chip>
              </template>
              <template v-slot:item.behaviorIncidents="{ item }">
                <v-chip
                  :color="
                    item.behaviorIncidents <= 5
                      ? 'success'
                      : item.behaviorIncidents <= 15
                        ? 'warning'
                        : 'error'
                  "
                  small
                >
                  {{ item.behaviorIncidents }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alert/Action Items -->
    <!-- Bottom Stats Row -->
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Line, Bar, Pie, Doughnut } from 'vue-chartjs'
import axios from 'axios'

// Data interfaces
interface KeyMetric {
  title: string
  value: string
  trend: number
  description: string
  color: string
  icon: string
}

interface SchoolData {
  schoolName: string
  enrollment: number
  attendanceRate: number
  proficiencyRate: number
  behaviorIncidents: number
  staffCount: number
}

interface School {
  id: number
  name: string
  type?: string
  principal?: string
  enrollment?: number
  // Add other properties as needed based on your API response
}

// Reactive data
const districtInfo = ref({
  name: 'Riverside Unified School District',
  totalSchools: 24,
  totalStudents: 15847,
})

const lastUpdated = ref('2 hours ago')
const overallAttendance = ref(92.3)
const selectedSchool = ref('all')
const schools = ref<School[]>([])
const isLoadingSchools = ref(false)

// School selector options - will be populated from API
const schoolOptions = ref([
  { name: 'All Schools (District View)', value: 'all', icon: 'mdi-view-dashboard' },
])

const keyMetrics = ref<KeyMetric[]>([
  {
    title: 'Total Enrollment',
    value: '15,847',
    trend: 2.3,
    description: 'vs last year',
    color: 'primary',
    icon: 'mdi-account-group',
  },
  {
    title: 'Overall Proficiency',
    value: '78.4%',
    trend: 4.1,
    description: 'state assessments',
    color: 'success',
    icon: 'mdi-chart-line',
  },
  {
    title: 'Attendance Rate',
    value: '92.3%',
    trend: -1.2,
    description: 'this month',
    color: 'info',
    icon: 'mdi-calendar-check',
  },
  {
    title: 'Graduation Rate',
    value: '94.7%',
    trend: 3.2,
    description: 'Class of 2024',
    color: 'warning',
    icon: 'mdi-school',
  },
])

// Chart data and options
const performanceData = ref({
  labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Math Proficiency',
      data: [72, 74, 76, 75, 78, 80, 82, 81, 83, 85, 84, 86],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4,
    },
    {
      label: 'Reading Proficiency',
      data: [78, 79, 81, 80, 82, 84, 85, 86, 88, 87, 89, 90],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.4,
    },
    {
      label: 'Science Proficiency',
      data: [70, 71, 73, 72, 74, 76, 77, 78, 79, 80, 81, 82],
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      tension: 0.4,
    },
  ],
})

const performanceOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: function (value: any) {
          return value + '%'
        },
      },
    },
  },
})

const attendanceData = ref({
  labels: ['Present', 'Absent', 'Tardy'],
  datasets: [
    {
      data: [92.3, 5.2, 2.5],
      backgroundColor: ['#4CAF50', '#F44336', '#FF9800'],
      borderWidth: 2,
      borderColor: '#fff',
    },
  ],
})

const attendanceOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
})

const demographicsData = ref({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#BDBDBD',
      ],
    },
  ],
})

const fetchDemographics = async () => {
  try {
    let schoolId =
      selectedSchool.value && selectedSchool.value !== 'all'
        ? selectedSchool.value.replace('school-', '')
        : undefined
    const params = schoolId ? { school: schoolId } : {}
    const res = await axios.get('http://localhost:3000/stats/ethnicity', { params })
    const ethData = res.data.data || []
    demographicsData.value = {
      labels: ethData.map((e: any) => e.ethnicity || 'Other'),
      datasets: [
        {
          data: ethData.map((e: any) => Number(e.count)),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#BDBDBD',
          ],
        },
      ],
    }
  } catch (err) {
    console.error('Failed to fetch ethnicity stats:', err)
    demographicsData.value = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#BDBDBD',
          ],
        },
      ],
    }
  }
}

const gradeData = ref({
  labels: ['A', 'B', 'C', 'D', 'F'],
  datasets: [
    {
      label: 'Percentage of Students',
      data: [28.5, 34.2, 25.1, 8.7, 3.5],
      backgroundColor: ['#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'],
    },
  ],
})

const gradeOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value: any) {
          return value + '%'
        },
      },
    },
  },
})

const pieOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
})

// School performance table
const schoolHeaders = ref([
  { title: 'School Name', key: 'schoolName', sortable: true },
  { title: 'Enrollment', key: 'enrollment', sortable: true },
  { title: 'Attendance Rate', key: 'attendanceRate', sortable: true },
  { title: 'Proficiency Rate', key: 'proficiencyRate', sortable: true },
  { title: 'Behavior Incidents', key: 'behaviorIncidents', sortable: true },
  { title: 'Staff Count', key: 'staffCount', sortable: true },
])

const schoolData = ref<SchoolData[]>([])

const fetchSchoolPerformance = async () => {
  try {
    let schoolId =
      selectedSchool.value && selectedSchool.value !== 'all'
        ? selectedSchool.value.replace('school-', '')
        : undefined
    const params = schoolId ? { school: schoolId } : {}
    const res = await axios.get('http://localhost:3000/stats/school-performance', { params })
    const perfData = res.data.data || []
    schoolData.value = perfData.map((s: any) => ({
      schoolName: s.name,
      enrollment: Number(s.total_students),
      attendanceRate: Number(s.attendance_rate),
      proficiencyRate: Number(s.average_current_grade),
      behaviorIncidents: Number(s.behavior_incidents),
      staffCount: Number(s.teacher_count),
    }))
  } catch (err) {
    console.error('Failed to fetch school performance:', err)
    schoolData.value = []
  }
}

// Alerts and achievements
const priorityAlerts = ref([
  {
    id: 1,
    title: 'Low Attendance at Washington High',
    description: 'Attendance dropped to 88.7% this week',
    severity: 'high',
  },
  {
    id: 2,
    title: 'Budget Variance in Technology Dept',
    description: 'Spending 15% over budget this quarter',
    severity: 'medium',
  },
  {
    id: 3,
    title: 'Staff Shortage at Roosevelt Middle',
    description: '3 substitute teachers needed',
    severity: 'medium',
  },
])

const recentAchievements = ref([
  {
    id: 1,
    title: 'State Recognition for STEM Program',
    school: 'Lincoln Elementary',
    date: 'July 8, 2025',
    description: 'Received state award for innovative STEM curriculum',
  },
  {
    id: 2,
    title: '100% College Acceptance Rate',
    school: 'Washington High School',
    date: 'June 15, 2025',
    description: 'Class of 2025 achieved 100% college acceptance',
  },
  {
    id: 3,
    title: 'Perfect Attendance Month',
    school: 'Jefferson Elementary',
    date: 'May 30, 2025',
    description: 'Achieved 99.8% attendance rate in May',
  },
])

// Bottom stats
const staffStats = ref({
  total: 847,
  teachers: 612,
  administrators: 45,
  support: 190,
})

const budgetStats = ref({
  total: 142.5,
  spent: 98.7,
  remaining: 43.8,
})

const techStats = ref({
  devices: 8420,
  active: 7986,
  maintenance: 434,
  wifiUptime: 99.2,
})

const specialPrograms = ref({
  total: 2847,
  iep: 1247,
  f504: 892,
  ell: 708,
})

// Methods
const getCurrentDate = (): string => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const fetchSchools = async (): Promise<void> => {
  try {
    isLoadingSchools.value = true
    const response = await axios.get('http://localhost:3000/school/')
    schools.value = response.data

    // Transform API data into dropdown options
    const apiSchoolOptions = schools.value.map((school) => ({
      name: school.name,
      value: `school-${school.id}`,
      icon: getSchoolIcon(school.type || 'school'),
    }))

    // Combine with "All Schools" option
    schoolOptions.value = [
      { name: 'All Schools (District View)', value: 'all', icon: 'mdi-view-dashboard' },
      ...apiSchoolOptions,
    ]

    console.log('Schools loaded:', schools.value.length)
  } catch (error) {
    console.error('Failed to fetch schools:', error)
    // Keep default options if API fails
  } finally {
    isLoadingSchools.value = false
  }
}

const getSchoolIcon = (schoolType: string): string => {
  switch (schoolType?.toLowerCase()) {
    case 'elementary':
      return 'mdi-school'
    case 'middle':
    case 'middle school':
      return 'mdi-school-outline'
    case 'high':
    case 'high school':
      return 'mdi-school'
    default:
      return 'mdi-school'
  }
}

const onSchoolChange = (schoolValue: string | null): void => {
  selectedSchool.value = schoolValue || 'all'
  lastUpdated.value = 'Just now'
  fetchDemographics()
  fetchSchoolPerformance()
}

const viewAlert = (alert: any): void => {
  // Navigate to alert details or open modal
  console.log('Viewing alert:', alert)
}

onMounted(() => {
  fetchSchools()
  fetchDemographics()
  fetchSchoolPerformance()
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}

.text-h3 {
  line-height: 1.2;
}

.v-timeline-item {
  padding-bottom: 16px;
}

.gap-3 {
  gap: 12px;
}

.v-select {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
}

.v-chip {
  font-weight: 500;
}
</style>
