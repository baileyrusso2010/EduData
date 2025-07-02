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

            <v-card-title class="text-center text-h6 mt-4"
              >{{ student.first_name }} {{ student.last_name }}</v-card-title
            >
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
                <h2 class="text-h3 text-success mt-2">
                  {{ student.attendance?.presentPercentage }}%
                </h2>
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

          <!-- Gradebook -->
          <!-- Gradebook Section -->
          <v-card class="mt-6 pa-6 elevation-2 rounded-xl">
            <v-card-title class="text-h6">Gradebook</v-card-title>
            <v-divider class="my-4" />

            <div v-for="(course, index) in gradebook" :key="index" class="mb-8">
              <div class="text-subtitle-1 mb-2">{{ course.class }}</div>

              <!-- Quarter Cards -->
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
                  <v-sheet class="pa-4 me-2 bg-grey-lighten-4 rounded-lg text-center">
                    <h4 class="text-body-1 mb-2">{{ quarter.name }}</h4>
                    <div v-for="(val, i) in quarter.values" :key="i">
                      <strong>{{ val }}</strong>
                    </div>
                  </v-sheet>
                </v-col>
              </v-row>
            </div>
          </v-card>

          <!-- Assessments Section (Now its Own Card) -->
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

          <!-- MTSS Panel -->
          <v-card class="mt-6 pa-6 elevation-2 rounded-xl">
            <v-card-title class="d-flex justify-space-between align-center">
              <span class="text-h6">MTSS Support</span>
              <v-btn size="small" color="primary" @click="showAssignDialog = true">
                Assign New Intervention
              </v-btn>
            </v-card-title>

            <v-divider class="my-4" />

            <v-row dense>
              <v-col cols="12" md="6">
                <v-sheet class="pa-4 rounded-lg bg-blue-lighten-5">
                  <div class="text-subtitle-1 mb-2">Current Tier</div>
                  <p>
                    <strong>Tier:</strong> {{ student.currentTier?.name || 'Tier 1 (Default)' }}
                  </p>
                  <p>
                    <strong>Assigned:</strong> {{ student.currentTier?.assigned_date || 'N/A' }}
                  </p>
                  <p>
                    <strong>Notes:</strong> {{ student.currentTier?.notes || 'No notes provided.' }}
                  </p>
                </v-sheet>
              </v-col>

              <v-col cols="12" md="6">
                <v-sheet class="pa-4 rounded-lg bg-green-lighten-5">
                  <div class="text-subtitle-1 mb-2">Active Interventions</div>
                  <div v-if="student.activeInterventions?.length">
                    <div
                      v-for="(intervention, i) in student.activeInterventions"
                      :key="i"
                      class="mb-4"
                    >
                      <p>
                        <strong>{{ intervention.name }}</strong>
                      </p>
                      <p>
                        Focus: {{ intervention.focus_area }} | Tier: {{ intervention.tier_level }}
                      </p>
                      <p>Frequency: {{ intervention.frequency }}</p>
                      <p>Started: {{ intervention.start_date }}</p>
                      <v-divider class="my-2" />
                    </div>
                  </div>
                  <div v-else>
                    <p class="text-medium-emphasis">No active interventions assigned.</p>
                  </div>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Assign Tier Dialog -->
    <v-dialog v-model="showAssignDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6">Assign Tier & Intervention</v-card-title>
        <v-card-text>
          <v-form>
            <v-select label="Tier Level" :items="[1, 2, 3]" v-model="form.tier" required />
            <v-select
              label="Focus Area"
              :items="['Reading', 'Math', 'Behavior']"
              v-model="form.focus_area"
              required
            />
            <v-text-field label="Intervention Name" v-model="form.interventionName" required />
            <v-text-field label="Frequency" v-model="form.frequency" placeholder="e.g. 3x/week" />
            <v-textarea label="Notes" v-model="form.notes" rows="3" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="showAssignDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="submitTierAssignment">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <!-- Loading State -->
  <div v-else>
    <v-container class="text-center">
      <v-row>
        <v-col cols="12">
          <v-progress-circular indeterminate color="primary" class="my-8" size="64" />
          <p>Loading student profile data...</p>
        </v-col>
      </v-row>
    </v-container>
  </div>

  <v-dialog v-model="showAssessmentDialog" max-width="800">
    <v-card>
      <v-card-title>
        <div>
          <h3 class="text-h6 mb-1">{{ selectedAssessment?.title }}</h3>
          <div class="text-caption text-medium-emphasis">{{ selectedAssessment?.date }}</div>
        </div>
        <v-spacer />
        <v-btn icon @click="selectedAssessment = null">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <!-- Final Score -->
        <div class="mb-6">
          <h4 class="text-subtitle-1 mb-2">Final Score</h4>
          <div class="d-flex align-center text-h5 font-weight-bold">
            <span class="text-primary me-2">{{ selectedAssessment?.score }}</span>
            <span class="mx-2">|</span>
            <span class="text-orange-darken-2">Avg: {{ finalAverageScore }}%</span>
          </div>
          <v-progress-linear
            :model-value="parseInt(selectedAssessment?.score)"
            height="8"
            color="primary"
            class="mt-2"
          ></v-progress-linear>
        </div>

        <!-- Per-Question Table -->
        <div class="mb-6">
          <h4 class="text-subtitle-1 mb-2">Question Breakdown</h4>
          <v-simple-table dense>
            <thead>
              <tr>
                <th>Question</th>
                <th>Your Answer</th>
                <th>Correct</th>
                <th>Score</th>
                <th>Class Avg</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(q, i) in selectedAssessment?.questions" :key="i">
                <td>{{ q.question }}</td>
                <td :class="{ 'text-error': q.answer !== q.correct }">{{ q.answer }}</td>
                <td>{{ q.correct }}</td>
                <td>{{ q.score }}%</td>
                <td>{{ q.average }}%</td>
              </tr>
            </tbody>
          </v-simple-table>
        </div>

        <!-- Chart Area Placeholder -->
        <div>
          <h4 class="text-subtitle-1 mb-2">Comparison Chart</h4>
          <p class="text-caption text-medium-emphasis">
            <Bar :data="gradeChartData" :options="chartOptions" :style="{ height: '350px' }" />
          </p>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import { motion } from 'motion-v'
import axios from 'axios'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  PieController,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar, Pie } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
)

export default defineComponent({
  components: {
    Bar,
    Pie,
  },
  data() {
    return {
      student: {
        id: null,
        name: null,
        assessments: [],
        behavior: [],
        currentTier: null,
        activeInterventions: [],
      },
      selectedAssessment: null,
      showAssessmentDialog: false,
      loading: false,
      iepStatus: '',
      attendancePercentage: 0,
      showAssignDialog: false,
      form: {
        tier: null,
        interventionName: '',
        focus_area: '',
        frequency: '',
        notes: '',
      },
      assessments: [
        {
          title: 'Linear Equations Test',
          date: '2025-09-15',
          score: '87%',
          questions: [
            {
              question: 'Solve 2x + 3 = 7',
              answer: '2',
              correct: '2',
              score: 100,
              average: 84,
            },
            {
              question: 'Graph y = 3x + 1',
              answer: 'Incorrect slope',
              correct: '3x + 1',
              score: 50,
              average: 71,
            },
          ],
        },
        // More assessments...
      ],
      gradeChartData: {
        labels: ['Solve 2x + 3 = 7', 'Graph y = 3x + 1'],
        datasets: [
          {
            label: 'Your Score',
            data: [100, 50],
            backgroundColor: '#42A5F5',
          },
          {
            label: 'Class Average',
            data: [84, 71],
            backgroundColor: '#9CCC65',
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Your Score vs Class Average',
          },
        },
        scales: {
          x: {
            stacked: false,
          },
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },

      gradebook: [
        {
          class: 'Algebra II',
          q1: '89%',
          q2: '91%',
          q3: '87%',
          q4: '90%',
          five_week: '85%',
          ten_week: '88%',
          fifteen_week: '89%',
          twenty_week: '91%',
          assessments: [
            { title: 'Linear Equations Test', date: '2025-09-15', score: '87%' },
            { title: 'Polynomials Quiz', date: '2025-10-02', score: '92%' },
          ],
        },
        {
          class: 'English 11',
          q1: '92%',
          q2: '95%',
          q3: '90%',
          q4: '93%',
          five_week: '90%',
          ten_week: '92%',
          fifteen_week: '94%',
          twenty_week: '95%',
          assessments: [
            { title: 'Poetry Essay', date: '2025-09-20', score: '93%' },
            { title: 'Midterm Exam', date: '2025-11-10', score: '96%' },
          ],
        },
      ],
    }
  },
  methods: {
    openAssessmentModal(assessment) {
      this.selectedAssessment = assessment
      this.showAssessmentDialog = true
    },

    async submitTierAssignment() {
      try {
        await axios.post('http://localhost:3000/mtss/student-tier/', {
          studentId: this.student.id,
          tierId: this.form.tier,
          name: this.form.interventionName,
          focus_area: this.form.focus_area,
          frequency: this.form.frequency,
          notes: this.form.notes,
        })
        this.showAssignDialog = false
        await this.fetchStudent()
      } catch (err) {
        console.error('Error assigning intervention:', err)
      }
    },
    async fetchStudent() {
      const studentId = this.$route.params.id
      this.loading = true
      try {
        const res = await axios.get(`http://localhost:3000/profile/${studentId}`)
        console.log(res.data)
        this.student = res.data
        this.iepStatus = res.data?.iepStatus || ''
        this.attendancePercentage = res.data?.attendancePercentage || 0
      } catch (e) {
        console.error('Error fetching student:', e)
      } finally {
        this.loading = false
      }
    },
  },
  mounted() {
    this.fetchStudent()
  },
  computed: {
    finalAverageScore() {
      // if (!this.selectedAssessment?.questions?.length) return 0
      // const total = this.selectedAssessment.questions.reduce((sum, q) => sum + q.average, 0)
      // return Math.round(total / this.selectedAssessment.questions.length)
      return '85' // Placeholder for average score calculation
    },
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
.rounded-circle {
  border-radius: 50% !important;
}
.v-simple-table th,
.v-simple-table td {
  padding: 8px 12px;
  text-align: center;
  font-size: 0.875rem;
}
.v-sheet {
  transition: background-color 0.3s ease;
}

.v-sheet h4 {
  font-weight: 600;
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
