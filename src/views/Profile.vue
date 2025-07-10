<template>
  <div v-if="!loading">
    <v-container fluid>
      <motion.div class="box" :animate="{ rotate: 360 }" :transition="{ duration: 1 }" />
      <v-row align="start">
        <!-- SIDEBAR -->
        <v-col cols="12" md="3">
          <v-card class="pa-6 rounded-xl elevation-6" style="min-height: 100%">
            <v-row justify="center">
              <v-avatar size="120">
                <v-img
                  src="https://via.placeholder.com/150"
                  alt="Student Avatar"
                  class="rounded-circle"
                />
              </v-avatar>
            </v-row>

            <v-card-title class="text-center text-h6 mt-4">
              {{ student.first_name }} {{ student.last_name }}
            </v-card-title>
            <v-card-subtitle class="text-center text-caption">
              ID: {{ student.student_number }}
            </v-card-subtitle>

            <v-divider class="my-4" />

            <v-list dense nav>
              <v-list-item>
                <v-list-item-title><strong>Grade:</strong> {{ student.grade }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><strong>School:</strong> {{ student.school }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title><strong>DOB:</strong> {{ student.dob }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title
                  ><strong>Guardian:</strong> {{ student.guardian }}</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- MAIN CONTENT -->
        <v-col cols="12" md="9">
          <!-- Metric Cards -->
          <v-row dense>
            <v-col cols="12" sm="4">
              <v-card class="pa-4 elevation-3 rounded-lg text-center">
                <div class="text-caption text-medium-emphasis">Attendance</div>
                <h2 class="text-h3 text-success mt-2">{{ attendancePercentage }}%</h2>
                <div class="text-caption">Year-to-Date</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card class="pa-4 elevation-3 rounded-lg text-center">
                <div class="text-caption text-medium-emphasis">Behavior Incidents</div>
                <h2 class="text-h3 text-warning mt-2">{{ student.behaviors?.length }}</h2>
                <div class="text-caption">This Year</div>
              </v-card>
            </v-col>
            <v-col cols="12" sm="4">
              <v-card class="pa-4 elevation-3 rounded-lg text-center">
                <div class="text-caption text-medium-emphasis">504 / IEP Status</div>
                <h2 class="text-h3 text-info mt-2">{{ iepStatus || 'N/A' }}</h2>
                <div class="text-caption">Current Plan</div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Gradebook Section -->
          <v-card class="mt-6 pa-6 elevation-2 rounded-xl">
            <v-card-title class="text-h6">Gradebook</v-card-title>
            <v-divider class="my-4" />

            <div v-for="(course, index) in gradebook" :key="index" class="mb-8">
              <div class="text-subtitle-1 mb-4 course-title">{{ course.class }}</div>

              <v-row class="mb-2" no-gutters>
                <v-col
                  cols="12"
                  md="3"
                  v-for="(quarter, qIdx) in [
                    { name: 'Quarter 1', values: [`Q1: ${course.q1}`, `5W: ${course.five_week}`] },
                    { name: 'Quarter 2', values: [`Q2: ${course.q2}`, `10W: ${course.ten_week}`] },
                    {
                      name: 'Quarter 3',
                      values: [`Q3: ${course.q3}`, `15W: ${course.fifteen_week}`],
                    },
                    {
                      name: 'Quarter 4',
                      values: [`Q4: ${course.q4}`, `20W: ${course.twenty_week}`],
                    },
                  ]"
                  :key="qIdx"
                >
                  <v-sheet
                    :class="[
                      'pa-4',
                      'me-2',
                      'rounded-lg',
                      'text-center',
                      'grade-sheet',
                      { hoverable: quarter.values.some((val) => val.includes('%')) },
                    ]"
                    :style="{ background: getGradeBackground(quarter.values) }"
                  >
                    <h4 class="text-body-1 mb-2 quarter-name">{{ quarter.name }}</h4>
                    <div v-for="(val, i) in quarter.values" :key="i">
                      <strong :class="getGradeTextClass(val)">{{ val }}</strong>
                    </div>
                  </v-sheet>
                </v-col>
              </v-row>
            </div>
          </v-card>

          <!-- Assessments Section -->
          <v-card class="mt-6 pa-6 elevation-2 rounded-xl">
            <v-card-title class="text-h6">Assessments</v-card-title>
            <v-divider class="my-4" />

            <div v-for="(course, cIdx) in gradebook" :key="cIdx" class="mb-6">
              <h4 class="text-subtitle-2 text-medium-emphasis mb-3">{{ course.class }}</h4>
              <v-row dense>
                <v-col
                  v-for="(assessment, i) in course.assessments"
                  :key="i"
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <v-card
                    class="pa-4 rounded-lg hoverable cursor-pointer"
                    @click="openAssessmentModal(assessment)"
                  >
                    <div class="text-body-1 font-weight-medium mb-1">
                      {{ assessment.title }}
                    </div>
                    <div class="text-caption text-medium-emphasis mb-2">
                      {{ assessment.date }}
                    </div>
                    <div class="text-h5 font-weight-bold text-primary">
                      {{ assessment.score }}
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card>

          <!-- MTSS Interventions Section -->
          <v-card class="mt-6 pa-6 elevation-2 rounded-xl">
            <v-card-title class="d-flex justify-space-between align-center">
              <span class="text-h6">MTSS Interventions</span>
            </v-card-title>
            <v-divider class="my-4" />

            <div v-if="student.StudentInterventions?.length">
              <v-timeline align="start" dense>
                <v-timeline-item
                  v-for="(intervention, i) in student.StudentInterventions.filter(
                    (i) => !i.end_date,
                  )"
                  :key="i"
                  color="green"
                  icon="mdi-lifebuoy"
                >
                  <template #opposite>
                    <div class="text-caption text-medium-emphasis">
                      {{ intervention.start_date.substring(0, 10) }}
                    </div>
                  </template>

                  <v-card class="pa-4" outlined rounded="xl">
                    <v-card-title class="text-h6 mb-2">
                      <v-icon color="primary" class="me-2">mdi-heart-pulse</v-icon>
                      {{ intervention.name }}
                    </v-card-title>

                    <v-card-subtitle class="text-caption text-medium-emphasis mb-2">
                      Tier {{ intervention.tier_level }} — Focus:
                      {{ intervention.Intervention.focus_area }}
                    </v-card-subtitle>

                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-chip
                          color="blue lighten-4"
                          class="ma-1 py-3 px-4"
                          text-color="blue darken-3"
                        >
                          <strong>Frequency:</strong> {{ intervention.Intervention.frequency }}
                        </v-chip>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-chip
                          :color="intervention.end_date ? 'grey lighten-4' : 'green lighten-4'"
                          class="ma-1 py-3 px-4"
                          text-color="black"
                        >
                          {{
                            intervention.end_date
                              ? `Ended: ${intervention.Intervention.end_date}`
                              : 'Ongoing'
                          }}
                        </v-chip>
                      </v-col>
                    </v-row>

                    <v-divider class="my-2" />
                    <div class="text-caption text-medium-emphasis">
                      Additional Notes: {{ intervention.notes || 'No notes provided.' }}
                    </div>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </div>

            <div v-else class="text-caption text-medium-emphasis">
              No active interventions assigned.
            </div>
          </v-card>

          <!-- Dialog for Adding/Editing Interventions -->
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
      student: {},
      gradebook: [],
      loading: true,
      iepStatus: '',
      attendancePercentage: 0,
      interventionDialog: {
        show: false,
        editing: false,
        data: {
          name: '',
          focus_area: '',
          tier_level: '',
          frequency: '',
          notes: '',
          start_date: '',
          end_date: '',
        },
      },
    }
  },
  methods: {
    async fetchStudent() {
      const studentId = this.$route.params.id
      try {
        const res = await axios.get(`http://localhost:3000/profile/${studentId}`)
        console.log(res.data)
        this.student = res.data
        this.iepStatus = res.data?.iepStatus || ''
        this.attendancePercentage = res.data?.attendance?.presentPercentage || 0

        const gradeMap = {}
        for (const g of res.data.grades || []) {
          if (!gradeMap[g.course]) {
            gradeMap[g.course] = {
              class: g.course,
              q1: 'N/A',
              q2: 'N/A',
              q3: 'N/A',
              q4: 'N/A',
              five_week: 'N/A',
              ten_week: 'N/A',
              fifteen_week: 'N/A',
              twenty_week: 'N/A',
              assessments: [],
            }
          }

          if (g.task === 'Quarter') {
            if (g.term === 'Q1') gradeMap[g.course].q1 = `${g.score}%`
            else if (g.term === 'Q2') gradeMap[g.course].q2 = `${g.score}%`
            else if (g.term === 'Q3') gradeMap[g.course].q3 = `${g.score}%`
            else if (g.term === 'Q4') gradeMap[g.course].q4 = `${g.score}%`
          } else if (g.task === 'Interim') {
            if (g.term === 'Q1') gradeMap[g.course].five_week = `${g.score}%`
            else if (g.term === 'Q2') gradeMap[g.course].ten_week = `${g.score}%`
            else if (g.term === 'Q3') gradeMap[g.course].fifteen_week = `${g.score}%`
            else if (g.term === 'Q4') gradeMap[g.course].twenty_week = `${g.score}%`
          }
        }

        this.gradebook = Object.values(gradeMap)
      } catch (e) {
        console.error('Error fetching student:', e)
      } finally {
        this.loading = false
      }
    },
    openAssessmentModal(assessment) {
      console.log('Open assessment modal:', assessment)
    },
    getGradeBackground(values) {
      // Extract numeric grades from values (e.g., "Q1: 85%" or "5W: 90%")
      const grades = values
        .filter((val) => val.includes('%'))
        .map((val) => parseFloat(val.split(': ')[1]))
      if (grades.length === 0) return 'linear-gradient(135deg, #f5f5f5, #e0e0e0)' // Default for N/A
      const avgGrade = grades.reduce((sum, grade) => sum + grade, 0) / grades.length
      if (avgGrade >= 80) return 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' // Green for high grades
      if (avgGrade >= 60) return 'linear-gradient(135deg, #fff3e0, #ffe0b2)' // Yellow for medium grades
      return 'linear-gradient(135deg, #ffebee, #ffcdd2)' // Red for low grades
    },
    getGradeTextClass(value) {
      if (!value.includes('%')) return 'text-grey'
      const grade = parseFloat(value.split(': ')[1])
      if (grade >= 80) return 'text-success'
      if (grade >= 60) return 'text-warning'
      return 'text-error'
    },
  },
  mounted() {
    this.fetchStudent()
  },
})
</script>

<style scoped>
.v-card {
  border-radius: 10px;
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
.text-error {
  color: #d32f2f;
}
.text-grey {
  color: #757575;
}
.rounded-circle {
  border-radius: 50% !important;
}
.v-simple-table th,
.v-simple-table td {
  padding: 8px 12px;
  text-align: center;
  font-size: 0.875rem;
}
.grade-sheet {
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.grade-sheet:hover.hoverable {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.grade-sheet h4.quarter-name {
  font-weight: 600;
  color: #424242;
}
.course-title {
  font-weight: 700;
  color: #1976d2;
  font-size: 1.1rem;
  padding-bottom: 4px;
  border-bottom: 2px solid #1976d2;
}
.v-list-item-title {
  font-size: 0.95rem;
}
.v-list-item-subtitle {
  font-size: 0.85rem;
  color: #555;
}
.box {
  width: 100px;
  height: 100px;
  background-color: #0cdcf7;
  border-radius: 5px;
}
</style>
