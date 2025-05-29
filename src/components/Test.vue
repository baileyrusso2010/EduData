<template>
  <v-container fluid>
    <!-- Loading and Error States -->
    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-overlay>
    <v-snackbar v-model="errorSnackbar" color="error" timeout="3000">
      {{ errorMessage }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="errorSnackbar = false">Close</v-btn>
      </template>
    </v-snackbar>

    <!-- Filtering Controls -->
    <v-card class="pa-4 mb-4" elevation="2">
      <v-card-title>Filter Incidents</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-select
              v-model="selectedGrade"
              :items="grades"
              label="Grade"
              outlined
              dense
              @update:modelValue="applyFilters"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="selectedEthnicity"
              :items="ethnicities"
              label="Ethnicity"
              outlined
              dense
              @update:modelValue="applyFilters"
            ></v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              v-model="selectedSchool"
              :items="schools"
              label="School"
              outlined
              dense
              @update:modelValue="applyFilters"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Bar Chart with vue-chartjs -->
    <v-card class="pa-4 mb-4" elevation="2">
      <v-card-title>Incident Trends (Past Week)</v-card-title>
      <v-card-text>
        <!-- Bar Chart will be rendered here -->
        <Bar :data="chartData" :options="chartOptions" :style="{ height: '350px' }" />
      </v-card-text>
    </v-card>

    <!-- Filtered Data Table -->
    <v-card class="pa-4" elevation="2">
      <v-card-title>Filtered Incident Data</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="filteredIncidents"
          :items-per-page="5"
          class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Incidents Overview</v-toolbar-title>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
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
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import axios from 'axios'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default defineComponent({
  components: {
    Bar,
  },
  data() {
    return {
      selectedGrade: null,
      selectedEthnicity: null,
      selectedSchool: null,
      grades: [
        'All',
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
      ethnicities: ['All', 'Asian', 'Black', 'Hispanic', 'White', 'Other'],
      schools: ['All', 'Elementary School', 'Middle School', 'High School'],
      headers: [
        { title: 'Date', key: 'date' },
        { title: 'Student Name', key: 'studentName' },
        { title: 'Grade', key: 'grade' },
        { title: 'Ethnicity', key: 'ethnicity' },
        { title: 'School', key: 'school' },
        { title: 'Incident', key: 'incident' },
        { title: 'Incident Count', key: 'count' },
      ],
      incidents: [],
      filteredIncidents: [],
      chartData: {
        labels: [],
        datasets: [{ label: 'Incidents', data: [] }],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Incidents Over the Past Week',
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
      loading: false,
      errorSnackbar: false,
      errorMessage: '',
      schoolIdMap: {
        'Elementary School': 1,
        'Middle School': 2,
        'High School': 3,
      },
    }
  },
  methods: {
    async fetchIncidents() {
      this.loading = true
      this.errorSnackbar = false

      try {
        // Construct query parameters based on selected filters
        const params = {}
        if (this.selectedEthnicity && this.selectedEthnicity !== 'All') {
          params.race = this.selectedEthnicity
        }
        if (this.selectedGrade && this.selectedGrade !== 'All') {
          params.grade = this.selectedGrade.replace(/[^0-9]/g, '') || 'Kindergarten'
        }
        if (this.selectedSchool && this.selectedSchool !== 'All') {
          params.school_id = this.schoolIdMap[this.selectedSchool]
        }

        // Make API request
        const response = await axios.get('http://localhost:5000/api/behavior-records', { params })

        // Map API response to expected format
        this.incidents = response.data.map((item) => ({
          date: new Date(item.date).toISOString().split('T')[0], // Convert to YYYY-MM-DD
          studentName: item.studentName,
          grade: item.grade === 'Kindergarten' ? 'Kindergarten' : `${item.grade}th`,
          ethnicity: item.race,
          school: Object.keys(this.schoolIdMap).find(
            (key) => this.schoolIdMap[key] === item.school_id,
          ),
          incident: item.incident,
          count: 1, // API doesn't provide count, so assume 1 incident per record
        }))

        // Update filtered incidents and chart
        this.filteredIncidents = [...this.incidents]
        this.updateChartData()
      } catch (error) {
        this.errorMessage = 'Failed to fetch incident data. Please try again later.'
        this.errorSnackbar = true
        console.error('Error fetching incidents:', error)
      } finally {
        this.loading = false
      }
    },
    updateChartData() {
      // Dynamically generate date range for the past week (May 22 to May 28, 2025)
      const today = new Date('2025-05-28') // Current date: May 28, 2025
      const dates = []
      const dateMap = {}

      // Generate dates for the past 7 days including today
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        const dateString = date.toISOString().split('T')[0] // YYYY-MM-DD
        dates.push(dateString)
        dateMap[dateString] = 0
      }

      // Aggregate incidents by date
      this.filteredIncidents.forEach((incident) => {
        const incidentDate = incident.date
        if (dateMap[incidentDate] !== undefined) {
          dateMap[incidentDate] += incident.count
        }
      })

      // Map dates to day names for chart labels
      const dayNames = dates.map((date) => {
        const d = new Date(date)
        const dayIndex = d.getDay()
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        return date === '2025-05-28' ? 'Today' : days[dayIndex]
      })

      const chartDataValues = Object.values(dateMap)

      // Update chart data
      this.chartData = {
        labels: dayNames,
        datasets: [
          {
            label: 'Incidents',
            data: chartDataValues,
            borderColor: '#42A5F5',
            backgroundColor: 'rgba(66, 165, 245, 0.2)',
            borderWidth: 2,
            fill: false,
          },
        ],
      }
    },
    applyFilters() {
      // Fetch data with updated filters
      this.fetchIncidents()
    },
  },
  created() {
    // Fetch initial data on component creation
    this.fetchIncidents()
  },
})
</script>

<style scoped>
.v-card {
  border-radius: 10px;
}
</style>
