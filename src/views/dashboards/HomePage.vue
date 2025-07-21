<template>
  <v-container fluid>
    <!-- Top Metric Cards -->
    <v-row>
      <v-col cols="12" sm="4" v-for="(metric, index) in metrics" :key="index">
        <v-card :class="['pa-4 mb-4', metric.color]" elevation="4">
          <v-card-title class="text-white">{{ metric.title }}</v-card-title>
          <v-card-text>
            <h1 class="display-1 text-white">{{ metric.value }}</h1>
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
          <v-card-title class="text-primary">Passing Rate</v-card-title>
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
      metrics: [
        {
          title: 'Incidents Yesterday',
          value: 5,
          description: 'As of 10:11 AM EDT, May 28, 2025',
          color: 'bg-red-darken-2',
        },
        {
          title: 'Attendance Rate',
          value: '96.3%',
          description: 'From May 21 to May 28, 2025',
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
        labels: ['March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'Attendance Rate',
            data: [92.1, 94, 93.9, 93, 92.7],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.5,
          },
          {
            label: 'Full Day Attendance',
            data: [90.1, 91.5, 92.8, 91.9, 92.2],
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.5,
          },
        ],
      },
    }
  },
  methods: {
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
