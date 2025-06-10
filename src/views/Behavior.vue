<template>
  <v-container fluid>
    <v-row>
      <!-- Incidents Overview -->
      <v-col cols="4" v-for="(metric, index) in metrics" :key="index">
        <v-card class="pa-4 mb-4" elevation="2">
          <v-card-title>{{ metric.title }}</v-card-title>
          <v-card-text>
            <h1 class="display-1">{{ metric.value }}</h1>
            <p>{{ metric.description }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Incident Trends with vue-chartjs -->
    <v-card class="pa-4 mb-4" elevation="2">
      <v-card-title>Behavior Trends (Past Week)</v-card-title>
      <v-card-text>
        <!-- Line Chart will be rendered here -->
        <Bar :data="data" :options="options" />
      </v-card-text>
    </v-card>

    <!-- Additional Details -->
    <v-card class="pa-4" elevation="2">
      <v-card-title>Additional Behavior Insights</v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="(insight, index) in additionalInsights" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ insight.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ insight.details }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
  components: {
    Bar,
  },
  data() {
    return {
      metrics: [
        { title: 'Incidents Today', value: 5, description: 'As of 10:11 AM EDT, May 28, 2025' },
        { title: 'Incidents Past Week', value: 32, description: 'From May 21 to May 28, 2025' },
        { title: 'Average Daily Incidents', value: 4.6, description: 'Weekly average' },
      ],
      data: {
        labels: ['Monday', 'Tuesday', 'Wednsday', 'Thursday', 'Friday'],
        datasets: [{ data: [40, 20, 12, 3, 33] }],
      },
      options: {
        responsive: true,
      },
      additionalInsights: [
        { title: 'Highest Incident Type', details: 'Disruptive Behavior - 12 incidents' },
        { title: 'Pending Reviews', details: '3 cases awaiting action' },
        { title: 'Resolution Rate', details: '85% of incidents resolved this week' },
      ],
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
</style>
