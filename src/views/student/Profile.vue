<template>
  <v-container fluid class="pa-6">
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="8" class="pa-6" color="primary" dark>
          <v-row align="center">
            <v-col cols="auto">
              <v-avatar size="120" color="white">
                <v-icon size="60" color="primary">mdi-account</v-icon>
              </v-avatar>
            </v-col>
            <v-col>
              <h1 class="text-h3 font-weight-bold mb-2">
                {{ student.first_name }} {{ student.last_name }}
              </h1>
              <div class="text-h6 mb-3">
                <v-chip color="white" text-color="primary" class="mr-2">
                  <v-icon class="mr-1">mdi-school</v-icon>
                  Grade {{ student.grade }}
                </v-chip>
                <v-chip color="white" text-color="primary" class="mr-2">
                  <v-icon class="mr-1">mdi-identifier</v-icon>
                  ID: {{ student.id }}
                </v-chip>
                <!-- <v-chip color="white" text-color="primary">
                  <v-icon class="mr-1">mdi-calendar</v-icon>
                  Age: {{ student.age }}
                </v-chip> -->
              </div>
              <div class="text-body-1">
                <strong>School:</strong> {{ student.school }} | <strong>Email:</strong>
                {{ student.email }} | <strong>Counselor:</strong> {{ student.counselor }}
              </div>
            </v-col>
            <v-col cols="auto">
              <v-btn color="warning" size="large" @click="openFlagDialog" class="mr-2">
                <v-icon class="mr-2">mdi-flag-plus</v-icon>
                Add Flag
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Active Flags Section -->
    <v-row class="mb-6" v-if="activeFlags && activeFlags.length > 0">
      <v-col cols="12">
        <v-card elevation="4" class="pa-4" color="orange-lighten-5">
          <v-card-title class="d-flex align-center text-orange-darken-2">
            <v-icon class="mr-2" color="orange-darken-2">mdi-flag-variant</v-icon>
            Active Flags ({{ activeFlags.length }})
          </v-card-title>
          <v-card-text>
            <v-row dense>
              <v-col v-for="flag in activeFlags" :key="flag.id" cols="12" sm="6" md="4">
                <v-card
                  class="pa-3 mb-2"
                  :color="getFlagColor(flag.flag_type)"
                  variant="outlined"
                  elevation="2"
                >
                  <div class="d-flex justify-space-between align-start">
                    <div class="flex-grow-1">
                      <v-chip
                        :color="getFlagColor(flag.flag_type)"
                        size="small"
                        class="mb-2"
                        variant="flat"
                      >
                        <v-icon start size="small">{{ getFlagIcon(flag.flag_type) }}</v-icon>
                        {{ flag.flag_type }}
                      </v-chip>
                      <div class="text-body-2 mb-2">
                        <strong>Reason:</strong> {{ flag.flag_reason }}
                      </div>
                      <div class="text-caption text-grey-darken-1">
                        Added: {{ formatDate(flag.created_at) }}
                      </div>
                    </div>
                    <v-btn
                      icon
                      size="small"
                      color="success"
                      variant="text"
                      @click="removeFlag(flag.id)"
                      title="Resolve this flag"
                    >
                      <v-icon size="small">mdi-check</v-icon>
                    </v-btn>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="8" md="4">
        <v-card color="success" dark class="pa-4">
          <v-card-title class="d-flex justify-space-between">
            <span>Quarter Avg.</span>
            <v-icon>mdi-trending-up</v-icon>
          </v-card-title>
          <v-card-text>
            <div class="text-h3 font-weight-bold">
              {{
                quarterAverages[0] && quarterAverages[0].average != null
                  ? quarterAverages[0].average.toFixed(2)
                  : 'N/A'
              }}%
            </div>
            <div class="text-body-2">
              {{
                quarterAverages[0] && quarterAverages[0].term != null
                  ? quarterAverages[0].term
                  : 'N/A'
              }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="8" md="4">
        <v-card color="info" dark class="pa-4">
          <v-card-title class="d-flex justify-space-between">
            <span>Attendance</span>
            <v-icon>mdi-calendar-check</v-icon>
          </v-card-title>
          <v-card-text>
            <div class="text-h3 font-weight-bold">{{ attendancePercentage }}%</div>
            <div class="text-body-2">This Year</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="8" md="4">
        <v-card dark class="pa-4">
          <v-card-title class="d-flex justify-space-between">
            <span>MTSS Tier</span>
            <v-icon>mdi-layers</v-icon>
          </v-card-title>
          <v-card-text>
            <div class="text-h3 font-weight-bold">{{ activeTierId }}</div>
            <div class="text-body-2">Current</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card elevation="6">
          <v-tabs v-model="activeTab" color="primary" grow>
            <v-tab value="academics">
              <v-icon class="mr-2">mdi-book-open</v-icon>
              Academics
            </v-tab>
            <v-tab value="assessments">
              <v-icon class="mr-2">mdi-clipboard-list</v-icon>
              Assessments
            </v-tab>
            <v-tab value="mtss">
              <v-icon class="mr-2">mdi-account-check</v-icon>
              MTSS
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <v-window-item value="academics">
              <v-card class="mt-6 pa-6 elevation-2 rounded-xl">
                <v-card-title class="text-h6">Gradebook</v-card-title>
                <v-divider class="my-4" />
                <v-container class="pa-6">
                  <div v-for="(course, index) in gradebook" :key="index" class="mb-8">
                    <div class="text-subtitle-1 mb-4 course-title">{{ course.class }}</div>

                    <v-row class="mb-2" no-gutters>
                      <v-col
                        cols="12"
                        md="3"
                        v-for="(quarter, qIdx) in [
                          {
                            name: 'Quarter 1',
                            values: [`Q1: ${course.q1}`, `5W: ${course.five_week}`],
                          },
                          {
                            name: 'Quarter 2',
                            values: [`Q2: ${course.q2}`, `15W: ${course.ten_week}`],
                          },
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
                </v-container>
              </v-card>
            </v-window-item>

            <v-window-item value="assessments">
              <v-container class="pa-6">
                <v-card class="mt-6 pa-6 elevation-2 rounded-xl">
                  <v-card-title class="text-h6">Assessments</v-card-title>
                  <v-divider class="my-4" />

                  <div v-if="assessments && assessments.length > 0">
                    <v-row dense>
                      <v-col
                        v-for="(assessment, i) in assessments"
                        :key="i"
                        cols="12"
                        sm="6"
                        md="4"
                      >
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
                              assessment.date
                                ? new Date(assessment.date).toLocaleDateString()
                                : 'No date'
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
              </v-container>
            </v-window-item>
            <v-window-item value="mtss">
              <v-container class="pa-6">
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
                              tier.interventions.length > 0
                                ? tier.interventions[0].focus_area
                                : 'Unknown'
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
                                  tier.interventions.length > 0
                                    ? tier.interventions[0].frequency
                                    : 'N/A'
                                }}
                              </v-chip>
                            </v-col>
                            <v-col cols="12" sm="6">
                              <v-chip
                                color="green lighten-4"
                                class="ma-1 py-3 px-4"
                                text-color="black"
                              >
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
              </v-container>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Flag Management Dialog -->
  <v-dialog v-model="flagDialog" max-width="500px">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2" color="warning">mdi-flag-plus</v-icon>
        Add Student Flag
      </v-card-title>

      <v-card-text>
        <v-form ref="flagForm" v-model="flagFormValid">
          <v-select
            v-model="newFlag.flag_type"
            :items="flagTypes"
            label="Flag Type"
            outlined
            required
            :rules="[(v) => !!v || 'Flag type is required']"
            prepend-inner-icon="mdi-flag"
            class="mb-3"
          />

          <v-textarea
            v-model="newFlag.flag_reason"
            label="Flag Reason"
            outlined
            required
            :rules="[(v) => !!v || 'Flag reason is required']"
            rows="3"
            prepend-inner-icon="mdi-text"
            hint="Please provide a detailed reason for this flag"
            persistent-hint
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" variant="text" @click="closeFlagDialog"> Cancel </v-btn>
        <v-btn
          color="warning"
          :disabled="!flagFormValid || isSubmittingFlag"
          :loading="isSubmittingFlag"
          @click="submitFlag"
        >
          <v-icon class="mr-2">mdi-flag-plus</v-icon>
          Add Flag
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

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
          <p class="text-body-1 text-medium-emphasis">No questions available for this assessment</p>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" @click="assessmentDialog = false"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
      activeTab: 'academics', // Default active tab
      activeTierId: null,
      quarterAverages: [],
      // Flag management
      activeFlags: [],
      flagDialog: false,
      flagFormValid: false,
      isSubmittingFlag: false,
      newFlag: {
        flag_type: '',
        flag_reason: '',
      },
      flagTypes: [
        'Academic Concern',
        'Behavioral Alert',
        'Attendance Issue',
        'Health/Medical',
        'Safety Concern',
        'Special Needs',
        'Family Situation',
        'Emotional Support',
        'Intervention Required',
        'Monitoring Required',
      ],
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
          axios
            .get(`http://localhost:3000/grades/${studentId}/quarter-averages`)
            .then((res) => res.data),
        ])

        console.log('Fetch results:', results)

        const [
          profileResult,
          tierResult,
          gradesResult,
          attendanceResult,
          assessmentResult,
          quarterAvgResults,
        ] = results

        const profile = profileResult.status === 'fulfilled' ? profileResult.value : {}
        const tier = tierResult.status === 'fulfilled' ? tierResult.value : []
        const grades = gradesResult.status === 'fulfilled' ? gradesResult.value : []
        const attendance = attendanceResult.status === 'fulfilled' ? attendanceResult.value : {}
        const assessments = assessmentResult.status === 'fulfilled' ? assessmentResult.value : []
        const quarterAverages =
          quarterAvgResults.status === 'fulfilled' ? quarterAvgResults.value : []

        this.quarterAverages = quarterAverages

        this.assessments = assessments

        this.student = profile
        this.iepStatus = profile?.iepStatus || ''
        this.attendancePercentage =
          attendance?.statusPercentages?.find((s) => s.status === 'present')?.percentage || 0

        this.interventions = tier || []
        // Find active tier (no end_date) and save its tierId
        let activeTierId = null
        if (this.interventions?.length && Array.isArray(this.interventions[0].student_tier)) {
          const activeTier = this.interventions[0].student_tier.find((tier) => !tier.end_date)
          if (activeTier) {
            activeTierId = activeTier.tierId
          }
        }
        this.activeTierId = activeTierId
        console.log('Active Tier ID:', this.activeTierId)

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

        // Fetch active flags
        await this.fetchActiveFlags()
      } catch (e) {
        console.error('Error fetching student:', e)
      } finally {
        this.loading = false
      }
    },
    async fetchActiveFlags() {
      try {
        const studentId = this.$route.params.id
        const response = await axios.get(`http://localhost:3000/flags/${studentId}`)
        this.activeFlags = response.data || []
        console.log('Active flags loaded:', this.activeFlags)
      } catch (error) {
        console.error('Error fetching flags:', error)
        this.activeFlags = []
      }
    },
    openFlagDialog() {
      this.flagDialog = true
      this.newFlag = {
        flag_type: '',
        flag_reason: '',
      }
    },
    closeFlagDialog() {
      this.flagDialog = false
      this.newFlag = {
        flag_type: '',
        flag_reason: '',
      }
      if (this.$refs.flagForm) {
        this.$refs.flagForm.reset()
      }
    },
    async submitFlag() {
      if (!this.flagFormValid) return

      try {
        this.isSubmittingFlag = true
        const studentId = this.$route.params.id

        const flagData = {
          student_id: parseInt(studentId),
          flag_type: this.newFlag.flag_type,
          flag_reason: this.newFlag.flag_reason,
        }

        await axios.post('http://localhost:3000/flags', flagData)

        // Refresh the flags list
        await this.fetchActiveFlags()

        // Close dialog and show success message
        this.closeFlagDialog()

        // You could add a snackbar success message here
        console.log('Flag added successfully')
      } catch (error) {
        console.error('Error adding flag:', error)
        // You could add error handling/snackbar here
      } finally {
        this.isSubmittingFlag = false
      }
    },
    async removeFlag(flagId) {
      try {
        await axios.put(`http://localhost:3000/flags/${flagId}/end`)

        // Refresh the flags list
        await this.fetchActiveFlags()

        console.log('Flag resolved successfully')
      } catch (error) {
        console.error('Error resolving flag:', error)
      }
    },
    getFlagColor(flagType) {
      const colorMap = {
        'Academic Concern': 'orange',
        'Behavioral Alert': 'red',
        'Attendance Issue': 'amber',
        'Health/Medical': 'pink',
        'Safety Concern': 'deep-orange',
        'Special Needs': 'purple',
        'Family Situation': 'indigo',
        'Emotional Support': 'cyan',
        'Intervention Required': 'deep-purple',
        'Monitoring Required': 'blue-grey',
      }
      return colorMap[flagType] || 'grey'
    },
    getFlagIcon(flagType) {
      const iconMap = {
        'Academic Concern': 'mdi-book-alert',
        'Behavioral Alert': 'mdi-alert-octagon',
        'Attendance Issue': 'mdi-calendar-alert',
        'Health/Medical': 'mdi-medical-bag',
        'Safety Concern': 'mdi-shield-alert',
        'Special Needs': 'mdi-account-heart',
        'Family Situation': 'mdi-home-alert',
        'Emotional Support': 'mdi-heart',
        'Intervention Required': 'mdi-hand-heart',
        'Monitoring Required': 'mdi-eye-check',
      }
      return iconMap[flagType] || 'mdi-flag'
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
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
