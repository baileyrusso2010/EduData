<template>
  <v-container fluid>
    <!-- Top Metric Cards -->
    <v-row>
      <v-col cols="12" sm="4" v-for="(metric, index) in metrics" :key="index">
        <v-card :class="['pa-4 mb-4', metric.color]" elevation="4">
          <v-card-title class="text-white">{{ metric.title }}</v-card-title>
          <v-card-text>
            <h1 class="display-1 text-white">
              <v-progress-circular
                v-if="(index === 0 && isLoadingBehavior) || (index === 1 && isLoadingAttendance)"
                indeterminate
                color="white"
                size="24"
              ></v-progress-circular>
              <span v-else>{{ metric.value }}</span>
            </h1>
            <p class="text-white">{{ metric.description }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Section -->
    <v-row>
      <!-- Chart Card -->
      <v-col cols="12" sm="8">
        <v-card class="pa-4 mb-4" elevation="3" style="height: 600px">
          <v-card-title class="text-primary">Final Grade</v-card-title>
          <Line :data="data" />
        </v-card>
      </v-col>

      <!-- Failing Metrics + Students -->
      <v-col cols="12" sm="4">
        <v-card class="pa-4 mb-4 d-flex flex-column" elevation="3" style="height: 600px">
          <v-row>
            <v-col cols="12">
              <v-card class="pa-2 mb-2 bg-red-darken-1 text-white" elevation="2">
                <v-card-title>Total Failing</v-card-title>
                <v-card-text class="text-center">
                  <h2>67</h2>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row class="mb-2">
            <v-col cols="4">
              <v-card class="pa-2 bg-orange-darken-1 text-white" elevation="2">
                <v-card-title>Poverty</v-card-title>
                <v-card-text class="text-center">
                  <h2>8</h2>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card class="pa-2 bg-orange-darken-1 text-white" elevation="2">
                <v-card-title>IEP</v-card-title>
                <v-card-text class="text-center">
                  <h2>4</h2>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card class="pa-2 bg-orange-darken-1 text-white" elevation="2">
                <v-card-title>504</v-card-title>
                <v-card-text class="text-center">
                  <h2>3</h2>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Student List -->
          <div class="flex-grow-1 d-flex flex-column" style="overflow-y: auto; min-height: 0">
            <v-divider></v-divider>
            <v-virtual-scroll :items="students" :height="440" item-height="56">
              <template v-slot:default="{ item }">
                <v-list-item
                  :subtitle="item.teacher"
                  :title="item.name"
                  @click="() => handleItemClick(item)"
                  link
                >
                  <template v-slot:prepend>
                    <v-avatar size="32" class="bg-primary text-white">
                      <v-icon>mdi-account</v-icon>
                    </v-avatar>
                  </template>
                  <template v-slot:append>
                    <v-btn icon size="x-small" variant="tonal">
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Line } from 'vue-chartjs'
import axios from 'axios'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
)

export default {
  components: {
    Line,
  },
  data() {
    return {
      behaviorCount: 0,
      isLoadingBehavior: false,
      attendanceRate: '0%',
      isLoadingAttendance: false,
      metrics: [
        {
          title: 'Incidents Yesterday',
          value: 0, // Will be updated from API
          description: `As of ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
          color: 'bg-red-darken-2',
        },
        {
          title: 'Attendance Rate',
          value: '0%', // Will be updated from API
          description: 'Current attendance summary',
          color: 'bg-green-darken-2',
        },
        {
          title: 'Avg Daily Incidents',
          value: 4.6,
          description: 'Weekly average',
          color: 'bg-blue-darken-2',
        },
      ],
      students: [
        { name: 'Emma Thompson', teacher: 'Mr. Bennett' },
        { name: 'Liam Johnson', teacher: 'Ms. Chang' },
        { name: 'Olivia Smith', teacher: 'Mr. Patel' },
        { name: 'Noah Martinez', teacher: 'Ms. Gomez' },
        { name: 'Ava Brown', teacher: 'Mr. Lee' },
        { name: 'Sophia Davis', teacher: 'Ms. Moore' },
        { name: 'Lucas Wilson', teacher: 'Mr. Turner' },
        { name: 'Mia Taylor', teacher: 'Ms. Kim' },
        { name: 'Elijah Anderson', teacher: 'Ms. Rivera' },
        { name: 'Charlotte Thomas', teacher: 'Mr. Reed' },
        { name: 'James Jackson', teacher: 'Ms. Scott' },
        { name: 'Amelia White', teacher: 'Mr. Murphy' },
        // repeat to fill virtual scroll if needed
      ],
      data: {
        labels: [],
        datasets: [],
      },
    }
  },
  async mounted() {
    await Promise.all([
      this.fetchBehaviorCount(),
      this.fetchAttendanceSummary(),
      this.fetchGradeScoresChart(),
    ])
  },
  methods: {
    async fetchBehaviorCount() {
      try {
        this.isLoadingBehavior = true
        // Get yesterday's date in MM-DD-YYYY format
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const dateStr = yesterday.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        })

        const response = await axios.get(`http://localhost:3000/behavior/count/day?date=${dateStr}`)
        this.behaviorCount = response.data.count

        // Update the metrics array with the fetched count
        this.metrics[0].value = this.behaviorCount

        console.log('Behavior count loaded:', this.behaviorCount)
      } catch (error) {
        console.error('Failed to fetch behavior count:', error)
        // Keep default value if API fails
        this.metrics[0].value = 'N/A'
      } finally {
        this.isLoadingBehavior = false
      }
    },
    async fetchAttendanceSummary() {
      try {
        this.isLoadingAttendance = true

        const response = await axios.get('http://localhost:3000/attendance/summary/')
        const statusPercentages = response.data.statusPercentages

        // Find the "present" percentage
        const presentStatus = statusPercentages.find((status) => status.status === 'present')

        if (presentStatus) {
          this.attendanceRate = `${parseFloat(presentStatus.percentage).toFixed(1)}%`
          this.metrics[1].value = this.attendanceRate
        } else {
          this.metrics[1].value = 'N/A'
        }

        console.log('Attendance summary loaded:', statusPercentages)
      } catch (error) {
        console.error('Failed to fetch attendance summary:', error)
        // Keep default value if API fails
        this.metrics[1].value = 'N/A'
      } finally {
        this.isLoadingAttendance = false
      }
    },
    async fetchGradeScoresChart() {
      try {
        const response = await axios.get('http://localhost:3000/stats/grade-scores')
        const gradeData = response.data.data || []
        // Filter for Final Grade only, group by term_name
        const terms = ['Q1', 'Q2', 'Q3', 'Q4']
        const avgScores = terms.map((term) => {
          const entry = gradeData.find((g) => g.term_name === term && g.task_type === 'Final Grade')
          return entry ? Number(entry.average_score) : null
        })
        this.data = {
          labels: terms,
          datasets: [
            {
              label: 'Average Final Grade',
              data: avgScores,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.08)',
              tension: 0.4,
              pointBackgroundColor: 'rgb(75, 192, 192)',
              pointBorderColor: '#fff',
              pointRadius: 6,
              pointHoverRadius: 8,
              fill: true,
            },
          ],
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
            },
            scales: {
              y: {
                min: 60,
                max: 100,
                ticks: {
                  stepSize: 5,
                  callback: function (value) {
                    return value + '%'
                  },
                },
                grid: { color: '#e0e0e0' },
              },
              x: {
                grid: { display: false },
              },
            },
          },
        }
      } catch (error) {
        console.error('Failed to fetch grade scores:', error)
      }
    },
    handleItemClick(student) {
      console.log('Student clicked:', student)
    },
  },
}
</script>

<style scoped>
.v-card {
  border-radius: 12px;
}
.display-1 {
  font-size: 2.5rem;
  font-weight: 700;
}
.v-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}
.text-white {
  color: white;
}
</style>
