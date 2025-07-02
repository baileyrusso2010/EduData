<template>
  <v-container fluid>
    <!-- Loading and Error States -->
    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" size="64" />
    </v-overlay>
    <v-snackbar v-model="errorSnackbar" color="error" timeout="3000">
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="errorSnackbar = false">Close</v-btn>
      </template>
    </v-snackbar>

    <!-- Key Metrics -->
    <v-row>
      <v-col cols="12" sm="4" v-for="(metric, index) in metrics" :key="index">
        <v-card class="pa-4 mb-4" elevation="2">
          <v-card-title class="text-h6">{{ metric.title }}</v-card-title>
          <v-card-text>
            <h1 class="display-1">{{ metric.value }}</h1>
            <p class="text-body-2">{{ metric.description }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Attendance Trends -->
    <v-card class="pa-4 mb-6" elevation="2">
      <v-card-title class="text-h6">Attendance Trends (Weekdays)</v-card-title>
      <v-card-text>
        <Bar :data="trendChartData" :options="chartOptions" :style="{ height: '350px' }" />
      </v-card-text>
    </v-card>

    <!-- Attendance by Status and Grade -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4 mb-4" elevation="2">
          <v-card-title class="text-h6">Attendance by Status</v-card-title>
          <v-card-text>
            <Pie :data="statusChartData" :options="pieChartOptions" :style="{ height: '300px' }" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-4 mb-4" elevation="2">
          <v-card-title class="text-h6">Attendance by Grade</v-card-title>
          <v-card-text>
            <Bar :data="gradeChartData" :options="chartOptions" :style="{ height: '300px' }" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  PieController,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar, Pie } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
)

export default defineComponent({
  components: {
    Bar,
    Pie,
  },
  data() {
    return {
      attendance: [
        {
          date: '2025-05-22',
          studentName: 'Alice Smith',
          grade: '5th',
          school: 'Elementary School',
          status: 'Present',
        },
        {
          date: '2025-05-22',
          studentName: 'Bob Johnson',
          grade: '7th',
          school: 'Middle School',
          status: 'Absent',
        },
        {
          date: '2025-05-23',
          studentName: 'Charlie Brown',
          grade: '9th',
          school: 'High School',
          status: 'Present',
        },
        {
          date: '2025-05-24',
          studentName: 'Diana Lee',
          grade: '3rd',
          school: 'Elementary School',
          status: 'Tardy',
        },
        {
          date: '2025-05-25',
          studentName: 'Eve Davis',
          grade: '11th',
          school: 'High School',
          status: 'Present',
        },
        {
          date: '2025-05-26',
          studentName: 'Frank Wilson',
          grade: '6th',
          school: 'Middle School',
          status: 'Absent',
        },
        {
          date: '2025-05-27',
          studentName: 'Grace Kim',
          grade: '2nd',
          school: 'Elementary School',
          status: 'Present',
        },
        {
          date: '2025-05-28',
          studentName: 'Henry Clark',
          grade: '10th',
          school: 'High School',
          status: 'Present',
        },
        {
          date: '2025-05-28',
          studentName: 'Ivy Taylor',
          grade: '8th',
          school: 'Middle School',
          status: 'Tardy',
        },
      ],
      metrics: [
        {
          title: 'Attendance Today',
          value: '75%',
          description: 'As of 02:07 PM EDT, May 28, 2025',
        },
        { title: 'Absent Past Week', value: 2, description: 'From May 21 to May 28, 2025' },
        { title: 'Average Daily Attendance', value: '66.7%', description: 'Weekly average' },
      ],
      trendChartData: {
        labels: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
          'Today',
        ],
        datasets: [
          {
            label: 'Present Count',
            data: [78, 88, 101, 111, 56, 98, 83, 1],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      statusChartData: {
        labels: ['Present', 'Absent', 'Tardy'],
        datasets: [
          {
            label: 'Attendance by Status',
            data: [4, 2, 2],
            backgroundColor: ['#4CAF50', '#F44336', '#FFCA28'],
            borderColor: ['#388E3C', '#D32F2F', '#FFB300'],
            borderWidth: 1,
          },
        ],
      },
      gradeChartData: {
        labels: [
          'Kindergarten',
          '1st',
          '2nd',
          '3rd',
          '4th',
          '5th',
          '6th',
          '7th',
          '8th',
          '9th',
          '10th',
          '11th',
          '12th',
        ],
        datasets: [
          {
            label: 'Present Count',
            data: [15, 12, 18, 10, 9, 22, 13, 17, 11, 20, 19, 16, 14],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Attendance Trends',
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0,
            },
          },
        },
      },
      pieChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Attendance by Status',
          },
        },
      },
      loading: false,
      errorSnackbar: false,
      errorMessage: '',
    }
  },
  methods: {
    updateMetrics() {
      const today = '2025-05-28'
      const pastWeek = this.attendance.filter((record) => {
        const startDate = new Date('2025-05-21')
        const endDate = new Date(today)
        return new Date(record.date) >= startDate && new Date(record.date) <= endDate
      })

      // Attendance Today
      const todayRecords = pastWeek.filter((record) => record.date === today)
      const totalToday = todayRecords.length
      const presentToday = todayRecords.filter((record) => record.status === 'Present').length
      const attendanceRateToday =
        totalToday > 0 ? ((presentToday / totalToday) * 100).toFixed(1) : 0

      // Absent Past Week
      const absentPastWeek = pastWeek.filter((record) => record.status === 'Absent').length

      // Average Daily Attendance
      const dailyAttendance = {}
      pastWeek.forEach((record) => {
        if (!dailyAttendance[record.date]) {
          dailyAttendance[record.date] = { total: 0, present: 0 }
        }
        dailyAttendance[record.date].total += 1
        if (record.status === 'Present') {
          dailyAttendance[record.date].present += 1
        }
      })
      const avgAttendanceRate =
        Object.values(dailyAttendance).reduce((sum, day) => {
          const rate = day.total > 0 ? (day.present / day.total) * 100 : 0
          return sum + rate
        }, 0) / (Object.keys(dailyAttendance).length || 1)

      this.metrics = [
        {
          title: 'Attendance Today',
          value: '92.3%',
          description: 'As of 02:07 PM EDT, May 28, 2025',
        },
        {
          title: 'Absent Past Week',
          value: 64,
          description: 'From May 21 to May 28, 2025',
        },
        {
          title: 'Average Daily Attendance',
          value: '94.8%',
          description: 'Weekly average',
        },
      ]
    },
    updateTrendChart() {
      const filteredDates = [
        '2025-05-22', // Thursday
        '2025-05-23', // Friday
        '2025-05-27', // Tuesday
        '2025-05-28', // Wednesday (Today)
      ]

      const dateMap = filteredDates.reduce((acc, date) => ({ ...acc, [date]: 0 }), {})

      this.attendance.forEach((record) => {
        if (dateMap[record.date] !== undefined && record.status === 'Present') {
          // Increase the present count by a larger (fake) number for demo purposes
          dateMap[record.date] += Math.floor(Math.random() * 20) + 15 // random between 15 and 34
        }
      })

      const dayLabels = filteredDates.map((date) => {
        const d = new Date(date)
        const dayIndex = d.getDay()
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return date === '2025-05-28' ? 'Today' : days[dayIndex]
      })

      this.trendChartData = {
        labels: dayLabels,
        datasets: [
          {
            label: 'Present Count',
            data: Object.values(dateMap),
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderWidth: 2,
            fill: false,
          },
        ],
      }
    },
    updateStatusChart() {
      const statusCounts = { Present: 0, Absent: 0, Tardy: 0 }
      this.attendance.forEach((record) => {
        if (statusCounts[record.status] !== undefined) {
          statusCounts[record.status] += 1
        }
      })

      this.statusChartData = {
        labels: ['Present', 'Absent', 'Tardy'],
        datasets: [
          {
            label: 'Attendance by Status',
            data: [statusCounts.Present, statusCounts.Absent, statusCounts.Tardy],
            backgroundColor: ['#4CAF50', '#F44336', '#FFCA28'],
            borderColor: ['#388E3C', '#D32F2F', '#FFB300'],
            borderWidth: 1,
          },
        ],
      }
    },
    updateGradeChart() {
      const gradeCounts = this.gradeChartData.labels.reduce((acc, grade) => {
        acc[grade] = 0
        return acc
      }, {})

      // Generate random attendance counts between 70 and 101 for demo
      this.gradeChartData.labels.forEach((grade) => {
        gradeCounts[grade] = Math.floor(Math.random() * 32) + 70 // 70-101
      })

      const chartDataValues = Object.values(gradeCounts)

      // Interpolate color from red (low) to green (high)
      function interpolateColor(value, min, max) {
        // value: 70-101, min: 70, max: 101
        const percent = (value - min) / (max - min)
        // Red to Green: (r,g,b)
        const r = Math.round(244 + (76 - 244) * percent) // 244 (red) to 76 (green)
        const g = Math.round(67 + (175 - 67) * percent) // 67 (red) to 175 (green)
        const b = Math.round(54 + (80 - 54) * percent) // 54 (red) to 80 (green)
        return `rgb(${r},${g},${b})`
      }

      const min = 70
      const max = 101
      const barColors = chartDataValues.map((v) => interpolateColor(v, min, max))

      this.gradeChartData = {
        labels: this.gradeChartData.labels,
        datasets: [
          {
            label: 'Present Count',
            data: chartDataValues,
            borderColor: barColors,
            backgroundColor: barColors.map((c) => c.replace('rgb', 'rgba').replace(')', ',0.3)')),
            borderWidth: 2,
            fill: false,
          },
        ],
      }
    },
  },
  created() {
    this.updateMetrics()
    this.updateTrendChart()
    this.updateStatusChart()
    this.updateGradeChart()
  },
})
</script>

<style scoped>
.v-card {
  border-radius: 10px;
}
.display-1 {
  font-size: 2.5rem;
  font-weight: bold;
}
</style>
