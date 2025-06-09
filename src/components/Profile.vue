<template>

<div v-if="!loading">
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
          <v-card-subtitle class="text-center">
            Student ID: {{ student.student_number }}
          </v-card-subtitle>
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
          <!-- Attendance -->
          <v-col cols="12" sm="6" md="4">
            <v-card class="pa-4 mb-4" elevation="2">
              <v-card-title>Attendance Percentage</v-card-title>
              <v-card-text class="text-center">
                <h1 class="display-1 text-success">{{ attendancePercentage }}%</h1>
                <p>Year-to-Date (as of May 28, 2025)</p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Behavior -->
          <v-col cols="12" sm="6" md="4">
            <v-card class="pa-4 mb-4" elevation="2">
              <v-card-title>Behavior Incidents</v-card-title>
              <v-card-text class="text-center">
                <h1 class="display-1 text-warning">{{ student.behavior?.length || 0 }}</h1>
                <p>This Year (2025)</p>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- IEP -->
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


    <!-- Gradebook Section -->
    <v-row>
  <v-col cols="12">
    <v-card elevation="2" class="pa-4">
      <v-card-title>Gradebook</v-card-title>
      <v-card-text>
        <v-row v-for="(course, i) in gradebook" :key="i" class="mb-6">
          <v-col cols="12">
            <v-card outlined>
              <v-card-title class="text-h6">{{ course.course_name }}</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="3"
                    v-for="(quarter, qIndex) in course.quarters"
                    :key="qIndex"
                  >
                    <v-card flat class="pa-2" :class="gradeColorClass(quarter.final)">
                      <div class="text-subtitle-1 font-weight-medium">Q{{ qIndex + 1 }}</div>
                      <div>Interim: 
                        <span :class="gradeTextColorClass(quarter.interim)">
                          {{ quarter.interim }}
                        </span>
                      </div>
                      <div>Final: 
                        <span :class="gradeTextColorClass(quarter.final)">
                          {{ quarter.final }}
                        </span>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</v-row>


    <!-- Assessment Results -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="pa-4">
          <v-card-title>Assessment Results</v-card-title>
          <v-card-text>
            <v-expansion-panels accordion>
              <v-expansion-panel v-for="(a, i) in student.assessments" :key="i">
                <v-expansion-panel-title>
                  {{ a.assessmentName }} — Score: {{ a.score }}%
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <p><strong>Standardized:</strong> {{ a.standardized ? 'Yes' : 'No' }}</p>
                  <v-table class="mt-2">
                    <thead>
                      <tr>
                        <th>Question</th>
                        <th>Max Points</th>
                        <th>Earned Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(q, j) in a.questions" :key="j">
                        <td>{{ q.question }}</td>
                        <td>{{ q.maxPoints }}</td>
                        <td>{{ q.earnedPoints }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
  </div>  
  <div v-else>
    <v-container class="text-center">
      <v-row>
        <v-col cols="12">
          <v-alert type="info" class="mt-5">
            Loading student profile data...
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
    </div>  
</template>

<script>
import { defineComponent } from 'vue'
import axios from 'axios'

export default defineComponent({
  data() {
    return {
      student: {
        assessments: [],
        behavior: [],
      },
      loading: false,
      attendancePercentage: 0,
      behaviorIncidents: 0,
      iepStatus: '',
      gradebook: [
        {
          course_name: 'Mathematics',
          quarters: [
            { interim: '88%', final: '92%' },
            { interim: '85%', final: '87%' },
            { interim: '90%', final: '93%' },
            { interim: '91%', final: '94%' },
          ],
        },
        {
          course_name: 'English',
          quarters: [
            { interim: '82%', final: '85%' },
            { interim: '84%', final: '86%' },
            { interim: '87%', final: '89%' },
            { interim: '88%', final: '90%' },
          ],
        },
        {
          course_name: 'Science',
          quarters: [
            { interim: '90%', final: '93%' },
            { interim: '89%', final: '91%' },
            { interim: '92%', final: '94%' },
            { interim: '93%', final: '95%' },
          ],
        },
      ],
      fakeGrades: [
        {
          subject: 'Math',
          q1: 'A-',
          q2: 'B+',
          q3: 'A',
          q4: 'A',
          final: 'A',
        },
        {
          subject: 'English',
          q1: 'B',
          q2: 'B',
          q3: 'B+',
          q4: 'A-',
          final: 'B+',
        },
        {
          subject: 'Science',
          q1: 'A',
          q2: 'A-',
          q3: 'A',
          q4: 'A',
          final: 'A',
        },
        {
          subject: 'History',
          q1: 'B+',
          q2: 'A',
          q3: 'A-',
          q4: 'B+',
          final: 'A-',
        },
      ],
    }
  },
    methods: {
  gradeColorClass(grade) {
    if (typeof grade === 'string') {
      grade = parseInt(grade.replace('%', ''), 10);
    }
    if (grade >= 90) return 'bg-green-lighten-4'
    if (grade >= 80) return 'bg-blue-lighten-4'
    if (grade >= 70) return 'bg-amber-lighten-4'
    return 'bg-red-lighten-4'
  },
  gradeTextColorClass(grade) {
    if (grade >= 90) return 'text-green-darken-2'
    if (grade >= 80) return 'text-blue-darken-2'
    if (grade >= 70) return 'text-amber-darken-2'
    return 'text-red-darken-2'
  }
  },
  async mounted() {
    const studentId = this.$route.params.id;

    this.loading = true;
    try {
      const response = await axios.get(`http://localhost:3000/profile/${studentId}`); // adjust as needed
      this.student = response.data;
      this.iepStatus = response.data?.iepStatus || '';
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      this.loading = false;
    }
  }
}
)
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
  color: #2e7d32;
}
.text-center {
  text-align: center;
}
.display-1 {
  font-size: 2.5rem;
  font-weight: bold;
}
.text-success {
  color: #2e7d32;
}
.text-warning {
  color: #f57c00;
}
.text-info {
  color: #1976d2;
}
.rounded-circle {
  border-radius: 50% !important;
}
</style>
