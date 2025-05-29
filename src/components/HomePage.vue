<template>
  <v-container fluid>
    <!-- Top Metric Cards -->
    <v-row>
      <v-col cols="12" sm="4" v-for="(metric, index) in metrics" :key="index">
        <v-card class="pa-4 mb-4" elevation="2">
          <v-card-title>{{ metric.title }}</v-card-title>
          <v-card-text>
            <h1 class="display-1 text-info">{{ metric.value }}</h1>
            <p>As of 10:11 AM EDT, May 28, 2025</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Section with Matching Heights -->
    <v-row>
      <!-- Left: Chart Card -->
      <v-col cols="12" sm="8">
        <v-card class="pa-4 mb-4" elevation="2" style="height: 600px">
          <v-card-title>Passing Rate</v-card-title>
          <Line :data="data" />
        </v-card>
      </v-col>

      <!-- Right: Metrics + Student List -->
      <v-col cols="12" sm="4">
        <v-card class="pa-4 mb-4 d-flex flex-column" elevation="2" style="height: 600px">
          <!-- <v-card-title>Students Failing</v-card-title> -->
          <!-- Top Metrics Row -->
          <v-row>
            <v-col cols="12">
              <v-card class="pa-2" elevation="1">
                <v-card-title class="text-body-1">Total Failing</v-card-title>
                <v-card-text class="text-center">
                  <h2 class="text-danger">67</h2>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row class="mb-2">
            <v-col cols="4">
              <v-card class="pa-2" elevation="1">
                <v-card-title class="text-body-1">Poverty</v-card-title>
                <v-card-text class="text-center">
                  <h2 class="text-warning">8</h2>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card class="pa-2" elevation="1">
                <v-card-title class="text-body-1">IEP</v-card-title>
                <v-card-text class="text-center">
                  <h2 class="text-warning">4</h2>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-card class="pa-2" elevation="1">
                <v-card-title class="text-body-1">504</v-card-title>
                <v-card-text class="text-center">
                  <h2 class="text-warning">3</h2>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Student List Scroll Section -->
          <!-- Student List Scroll Section -->
          <div class="flex-grow-1 d-flex flex-column" style="overflow-y: auto; min-height: 0">
            <v-divider></v-divider>
            <v-virtual-scroll :items="items" :height="440" item-height="48">
              <template v-slot:default="{ item }">
                <v-list-item
                  :subtitle="`Teacher Name`"
                  :title="`Student Name`"
                  @click="() => handleItemClick(item)"
                  link
                >
                  <template v-slot:prepend>
                    <v-icon class="bg-primary">mdi-account</v-icon>
                  </template>
                  <template v-slot:append>
                    <v-btn icon="mdi-pencil" size="x-small" variant="tonal"></v-btn>
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
import { components } from 'vuetify/dist/vuetify.js'
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
export default {
  components: {
    Line,
  },
  data() {
    return {
      items: Array.from({ length: 47 }, (k, v) => v + 1),
      metrics: [
        { title: 'Incidents Yesterday', value: 5, description: 'As of 10:11 AM EDT, May 28, 2025' },
        { title: 'Attendance Rate', value: 96.3, description: 'From May 21 to May 28, 2025' },
        { title: 'Average Daily Incidents', value: 4.6, description: 'Weekly average' },
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
}
</script>

<style scoped>
.v-card {
  border-radius: 10px;
}
.display-1 {
  font-size: 2.5rem;
  font-weight: bold;
}

.v-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}
.text-h5 {
  font-weight: 600;
  color: #2e7d32; /* Green for consistency */
}
.text-center {
  text-align: center;
}
.display-1 {
  font-size: 2.5rem;
  font-weight: bold;
}
.text-success {
  color: #2e7d32; /* Green for attendance */
}
.text-warning {
  color: #f57c00; /* Orange for behavior */
}
.text-danger {
  color: red; /* Green for attendance */
}
.text-info {
  color: #1976d2; /* Blue for IEP */
}
.rounded-circle {
  border-radius: 50% !important;
}
</style>
