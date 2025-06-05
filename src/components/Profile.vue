<template>
  <v-container fluid>
    <v-row>
      <!-- Left Sidebar: Profile Details -->
      <v-col cols="12" md="3" class="pa-4">
        <v-card class="pa-4 h-100" elevation="4">
          <!-- Avatar -->
          <v-row justify="center">
            <v-col cols="12" class="text-center">
              <v-avatar size="150">
                <v-img
                  src="https://via.placeholder.com/150"
                  alt="Student Avatar"
                  class="rounded-circle"
                />
              </v-avatar>
            </v-col>
          </v-row>
          <!-- Student Details -->
          <v-card-title class="text-h5 text-center">{{ student.name }}</v-card-title>
          <v-card-subtitle class="text-center"
            >Student ID: {{ student.student_number }}</v-card-subtitle
          >
          <v-card-text class="text-center">
            <p><strong>Grade:</strong> {{ student.grade }}</p>
            <p><strong>School:</strong> {{ student?.school }}</p>
            <p><strong>DOB:</strong> {{ student?.dob }}</p>
            <p><strong>Guardian:</strong> {{ student?.guardian }}</p>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Main Area: Summary Cards -->
      <v-col cols="12" md="9" class="pa-4">
        <v-row>
          <!-- Attendance Percentage Card -->
          <v-col cols="12" sm="6" md="4">
            <v-card class="pa-4 mb-4" elevation="2">
              <v-card-title>Attendance Percentage</v-card-title>
              <v-card-text class="text-center">
                <h1 class="display-1 text-success">{{ attendancePercentage }}%</h1>
                <p>Year-to-Date (as of May 28, 2025)</p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Behavior Incidents Card -->
          <v-col cols="12" sm="6" md="4">
            <v-card class="pa-4 mb-4" elevation="2">
              <v-card-title>Behavior Incidents</v-card-title>
              <v-card-text class="text-center">
                <h1 class="display-1 text-warning">{{ student.behavior?.length }}</h1>
                <p>This Year (2025)</p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- 504/IEP Status Card -->
          <v-col cols="12" sm="6" md="4">
            <v-card class="pa-4 mb-4" elevation="2">
              <v-card-title>504/IEP Status</v-card-title>
              <v-card-text class="text-center">
                <h1 class="display-1 text-info">{{ iepStatus || 'N/A' }}</h1>
                <p>Current Plan Status</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from 'vue'
import axios from 'axios'

export default defineComponent({
  data() {
    return {
      student: {},
      attendancePercentage: 0,
      behaviorIncidents: 0,
      iepStatus: '',
    }
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:3000/profile/098377') // Adjust API endpoint as needed
      console.log(response.data)
      this.student = response.data
    } catch (error) {
      console.error('Error fetching student data:', error)
    }
  },
})
</script>

<style scoped>
.v-card {
  border-radius: 10px;
  transition: box-shadow 0.3s;
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
.text-info {
  color: #1976d2; /* Blue for IEP */
}
.rounded-circle {
  border-radius: 50% !important;
}
</style>
