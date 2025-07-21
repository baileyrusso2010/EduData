<template>
  <div v-if="!loading">
    <v-container fluid>
      <motion.div class="box" :animate="{ rotate: 360 }" :transition="{ duration: 1 }" />
      <v-row align="start">
        <v-col cols="12" md="3" class="sidebar-sticky">
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
                <v-list-item-title><strong>Email:</strong> {{ student.email }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title
                  ><strong>Ethnicity:</strong> {{ student.ethnicity }}</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col cols="12" md="9">
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
                <h2 class="text-h3 text-warning mt-2">{{ behaviorIncidents }}</h2>
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
                    { name: 'Quarter 2', values: [`Q2: ${course.q2}`, `15W: ${course.ten_week}`] },
                    {
                      name: 'Quarter 3',
                      values: [`Q3: ${course.q3}`, `25W: ${course.fifteen_week}`],
                    },
                    {
                      name: 'Quarter 4',
                      values: [`Q4: ${course.q4}`, `35: ${course.twenty_week}`],
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

          <v-card class="mt-6 pa-6 elevation-2 rounded-xl">
            <v-card-title class="text-h6">Assessments</v-card-title>
            <v-divider class="my-4" />

            <div v-if="assessments && assessments.length > 0">
              <v-row dense>
                <v-col v-for="(assessment, i) in assessments" :key="i" cols="12" sm="6" md="4">
                  <v-card
                    class="pa-4 rounded-lg hoverable cursor-pointer assessment-card"
                    @click="openAssessmentModal(assessment)"
                    elevation="2"
                  >
                    <div class="text-body-1 font-weight-medium mb-2">
                      {{ assessment.test_name }}
                    </div>
                    <div class="text-caption text-medium-emphasis mb-2">
                      <v-chip
                        :color="assessment.standardized ? 'primary' : 'secondary'"
                        size="small"
                        variant="outlined"
                      >
                        {{ assessment.assessment_type }}
                      </v-chip>
                    </div>
                    <div class="text-caption text-medium-emphasis mb-3">
                      {{
                        assessment.date ? new Date(assessment.date).toLocaleDateString() : 'No date'
                      }}
                    </div>
                    <div class="text-h4 font-weight-bold text-primary">
                      {{
                        assessment.Final_Scores && assessment.Final_Scores.length > 0
                          ? assessment.Final_Scores[0].score_value
                          : 'N/A'
                      }}
                    </div>
                    <div class="text-caption text-medium-emphasis">Final Score</div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
            <div v-else class="text-center py-8">
              <v-icon size="48" color="grey-lighten-1" class="mb-4"
                >mdi-clipboard-text-outline</v-icon
              >
              <p class="text-body-1 text-medium-emphasis">No assessments available</p>
            </div>
          </v-card>

          <v-card class="mt-6 pa-6 elevation-2 rounded-xl">
            <v-card-title class="d-flex justify-space-between align-center">
              <span class="text-h6">MTSS Interventions</span>
              <v-btn
                icon
                color="primary"
                @click="$router.push(`/students/${student.id}/interventions`)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-card-title>
            <v-divider class="my-4" />

            <div v-if="interventions?.length">
              <v-timeline align="start" dense>
                <v-timeline-item
                  v-for="(tier, i) in interventions[0].student_tier"
                  :key="tier.id"
                  color="green"
                  icon="mdi-lifebuoy"
                >
                  <template #opposite>
                    <div class="text-caption text-medium-emphasis">
                      {{ tier.assigned_date.substring(0, 10) }}
                    </div>
                  </template>

                  <v-card class="pa-4" outlined rounded="xl">
                    <v-card-title class="text-h6 mb-2">
                      <v-icon color="primary" class="me-2">mdi-heart-pulse</v-icon>
                      {{
                        tier.interventions.length > 0
                          ? tier.interventions[0].name
                          : 'Unnamed Intervention'
                      }}
                    </v-card-title>

                    <v-card-subtitle class="text-caption text-medium-emphasis mb-2">
                      Tier {{ tier.tierId }} — Focus:
                      {{
                        tier.interventions.length > 0 ? tier.interventions[0].focus_area : 'Unknown'
                      }}
                    </v-card-subtitle>

                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-chip
                          color="blue lighten-4"
                          class="ma-1 py-3 px-4"
                          text-color="blue darken-3"
                        >
                          <strong>Frequency:</strong>
                          {{
                            tier.interventions.length > 0 ? tier.interventions[0].frequency : 'N/A'
                          }}
                        </v-chip>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-chip color="green lighten-4" class="ma-1 py-3 px-4" text-color="black">
                          {{ tier.end_date ? 'Ended' : 'Ongoing' }}
                        </v-chip>
                      </v-col>
                    </v-row>

                    <v-divider class="my-2" />
                    <div class="text-caption text-medium-emphasis">
                      Additional Notes:
                      {{
                        tier.interventions.length > 0
                          ? tier.interventions[0].description
                          : 'No notes provided.'
                      }}
                    </div>
                  </v-card>
                </v-timeline-item>
              </v-timeline>
            </div>
            <div v-else>
              <p>No interventions available.</p>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Assessment Details Modal -->
    <v-dialog v-model="assessmentDialog" max-width="800" scrollable>
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h5">{{ selectedAssessment?.test_name }}</span>
          <v-btn icon variant="text" @click="assessmentDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-subtitle v-if="selectedAssessment">
          <v-row class="ma-0">
            <v-col cols="auto" class="pa-1">
              <v-chip
                :color="selectedAssessment.standardized ? 'primary' : 'secondary'"
                size="small"
                variant="outlined"
              >
                {{ selectedAssessment.assessment_type }}
              </v-chip>
            </v-col>
            <v-col cols="auto" class="pa-1">
              <v-chip color="success" size="small" variant="outlined">
                Final Score:
                {{
                  selectedAssessment.Final_Scores && selectedAssessment.Final_Scores.length > 0
                    ? selectedAssessment.Final_Scores[0].score_value
                    : 'N/A'
                }}
              </v-chip>
            </v-col>
            <v-col cols="auto" class="pa-1" v-if="selectedAssessment.date">
              <v-chip color="info" size="small" variant="outlined">
                {{ new Date(selectedAssessment.date).toLocaleDateString() }}
              </v-chip>
            </v-col>
          </v-row>
        </v-card-subtitle>

        <v-divider />

        <v-card-text style="max-height: 500px">
          <div v-if="selectedAssessment?.questions && selectedAssessment.questions.length > 0">
            <v-card
              v-for="(question, index) in selectedAssessment.questions"
              :key="question.id"
              class="mb-4"
              outlined
              rounded="lg"
            >
              <v-card-title class="text-body-1 pa-4 pb-2">
                <span class="text-primary font-weight-bold">Q{{ question.question_num }}:</span>
                {{ question.text }}
              </v-card-title>

              <v-card-text class="pt-0">
                <div v-if="question.answers && question.answers.length > 0">
                  <v-chip
                    v-for="answer in question.answers"
                    :key="answer.id"
                    :color="getScoreColor(answer.score_value)"
                    class="ma-1"
                    size="small"
                  >
                    Score: {{ answer.score_value }}
                  </v-chip>
                  <div
                    v-if="question.answers[0].metadata"
                    class="text-caption text-medium-emphasis mt-2"
                  >
                    <strong>Notes:</strong> {{ question.answers[0].metadata }}
                  </div>
                </div>
                <div v-else class="text-caption text-medium-emphasis">No answer recorded</div>
              </v-card-text>
            </v-card>
          </div>
          <div v-else class="text-center py-8">
            <v-icon size="48" color="grey-lighten-1" class="mb-4">mdi-help-circle-outline</v-icon>
            <p class="text-body-1 text-medium-emphasis">
              No questions available for this assessment
            </p>
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" variant="text" @click="assessmentDialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      assessments: [],
      loading: true,
      iepStatus: '',
      attendancePercentage: 0,
      behaviorIncidents: 0,
      interventions: [],
      assessmentDialog: false,
      selectedAssessment: null,
    }
  },
  methods: {
    async fetchStudent() {
      const studentId = this.$route.params.id
      try {
        this.loading = true

        const results = await Promise.allSettled([
          axios.get(`http://localhost:3000/profile/${studentId}`).then((res) => res.data),
          axios
            .get(`http://localhost:3000/mtss/student-tiers/${studentId}?active=0`)
            .then((res) => res.data),
          axios.get(`http://localhost:3000/grades/${studentId}`).then((res) => res.data),
          axios
            .get(`http://localhost:3000/attendance/summary/${studentId}`)
            .then((res) => res.data),
          axios
            .get('http://localhost:3000/assessments/student/' + studentId)
            .then((res) => res.data),
        ])

        const [profileResult, tierResult, gradesResult, attendanceResult, assessmentResult] =
          results

        const profile = profileResult.status === 'fulfilled' ? profileResult.value : {}
        const tier = tierResult.status === 'fulfilled' ? tierResult.value : []
        const grades = gradesResult.status === 'fulfilled' ? gradesResult.value : []
        const attendance = attendanceResult.status === 'fulfilled' ? attendanceResult.value : {}
        const assessments = assessmentResult.status === 'fulfilled' ? assessmentResult.value : []

        this.assessments = assessments

        this.student = profile
        this.iepStatus = profile?.iepStatus || ''
        this.attendancePercentage =
          attendance?.statusPercentages?.find((s) => s.status === 'present')?.percentage || 0

        this.interventions = tier || []

        // Gradebook logic remains unchanged
        const gradeMap = {}

        for (const enrollment of grades || []) {
          const courseName = enrollment.Section?.Course?.name || 'Unknown Course'

          if (!gradeMap[courseName]) {
            gradeMap[courseName] = {
              class: courseName,
              q1: 'N/A',
              q2: 'N/A',
              q3: 'N/A',
              q4: 'N/A',
              five_week: 'N/A',
              ten_week: 'N/A',
              fifteen_week: 'N/A',
              twenty_week: 'N/A',
            }
          }

          for (const g of enrollment.Grades || []) {
            const term = g.Term?.name
            const task = g.Task?.type
            const scoreStr = `${g.score}%`

            if (task === 'Final Grade') {
              if (term === 'Q1') gradeMap[courseName].q1 = scoreStr
              else if (term === 'Q2') gradeMap[courseName].q2 = scoreStr
              else if (term === 'Q3') gradeMap[courseName].q3 = scoreStr
              else if (term === 'Q4') gradeMap[courseName].q4 = scoreStr
            } else if (task === 'Interim') {
              if (term === 'Q1') gradeMap[courseName].five_week = scoreStr
              else if (term === 'Q2') gradeMap[courseName].ten_week = scoreStr
              else if (term === 'Q3') gradeMap[courseName].fifteen_week = scoreStr
              else if (term === 'Q4') gradeMap[courseName].twenty_week = scoreStr
            }
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
      this.selectedAssessment = assessment
      this.assessmentDialog = true
      console.log('Opening assessment modal:', assessment)
    },
    getScoreColor(score) {
      const numScore = parseInt(score)
      if (numScore >= 4) return 'success'
      if (numScore >= 3) return 'warning'
      if (numScore >= 2) return 'orange'
      return 'error'
    },
    getGradeBackground(values) {
      const grades = values
        .filter((val) => val.includes('%'))
        .map((val) => parseFloat(val.split(': ')[1]))
      if (grades.length === 0) return 'linear-gradient(135deg, #f5f5f5, #e0e0e0)' // Default
      const avgGrade = grades.reduce((sum, grade) => sum + grade, 0) / grades.length
      if (avgGrade >= 80) return 'linear-gradient(135deg, #e8f5e9, #c8e6c9)'
      if (avgGrade >= 60) return 'linear-gradient(135deg, #fff3e0, #ffe0b2)'
      return 'linear-gradient(135deg, #ffebee, #ffcdd2)'
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

.sidebar-sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 20px;
  align-self: start; /* Helps when parent uses flex */
  z-index: 1;
}

.assessment-card {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.assessment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  border-color: #1976d2;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
