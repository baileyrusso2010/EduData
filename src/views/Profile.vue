<template>
  <div v-if="!loading">
    <v-container fluid>
      <v-row>
        <!-- Left Sidebar -->
        <v-col cols="12" md="3" class="pa-4">
          <v-card class="pa-4 h-100" elevation="4">
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
            <v-card-title class="text-h5 text-center"> {{ student.name }}</v-card-title>
            <v-card-subtitle class="text-center"
              >Student ID: {{ student.student_number }}</v-card-subtitle
            >
            <v-card-text class="text-center">
              <p><strong>Grade:</strong> {{ student.grade }}</p>
              <p><strong>School:</strong> {{ student.school }}</p>
              <p><strong>DOB:</strong> {{ student.dob }}</p>
              <p><strong>Guardian:</strong> {{ student.guardian }}</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Main Area -->
        <v-col cols="12" md="9" class="pa-4">
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-card class="pa-4 mb-4" elevation="2">
                <v-card-title>Attendance Percentage</v-card-title>
                <v-card-text class="text-center">
                  <h1 class="display-1 text-success">{{ attendancePercentage }}%</h1>
                  <p>Year-to-Date</p>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4">
              <v-card class="pa-4 mb-4" elevation="2">
                <v-card-title>Behavior Incidents</v-card-title>
                <v-card-text class="text-center">
                  <h1 class="display-1 text-warning">{{ student.behavior?.length || 0 }}</h1>
                  <p>This Year</p>
                </v-card-text>
              </v-card>
            </v-col>

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

          <!-- MTSS Section -->
          <v-card elevation="2" class="pa-4 mb-6">
            <v-card-title class="d-flex justify-space-between align-center">
              <span>MTSS Support</span>
              <v-btn color="primary" @click="showAssignDialog = true"
                >Assign New Tier/Intervention</v-btn
              >
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-card flat class="bg-blue-lighten-5 pa-4">
                    <h3 class="text-subtitle-1 mb-2">Current Tier</h3>
                    <p>
                      <strong>Tier:</strong> {{ student.currentTier?.name || 'Tier 1 (Default)' }}
                    </p>
                    <p>
                      <strong>Assigned:</strong> {{ student.currentTier?.assigned_date || 'N/A' }}
                    </p>
                    <p>
                      <strong>Notes:</strong>
                      {{ student.currentTier?.notes || 'No notes provided.' }}
                    </p>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-card flat class="bg-green-lighten-5 pa-4">
                    <h3 class="text-subtitle-1 mb-2">Active Interventions</h3>
                    <div v-if="student.activeInterventions?.length">
                      <div
                        v-for="(intervention, i) in student.activeInterventions"
                        :key="i"
                        class="mb-3"
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
                      <p>No active interventions assigned.</p>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialog -->
    <v-dialog v-model="showAssignDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6">Assign Tier & Intervention</v-card-title>
        <v-card-text>
          <v-form>
            <v-select label="Tier Level" :items="[1, 2, 3]" v-model="form.tier" required></v-select>
            <v-select
              label="Focus Area"
              :items="['Reading', 'Math', 'Behavior']"
              v-model="form.focus_area"
              required
            ></v-select>
            <v-text-field
              label="Intervention Name"
              v-model="form.interventionName"
              required
            ></v-text-field>
            <v-text-field label="Frequency" v-model="form.frequency" placeholder="e.g. 3x/week" />
            <v-textarea label="Notes" v-model="form.notes" rows="3" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showAssignDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="submitTierAssignment">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <div v-else>
    <v-container class="text-center">
      <v-row>
        <v-col cols="12">
          <v-alert type="info" class="mt-5">Loading student profile data...</v-alert>
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
        id: null,
        name: null,
        assessments: [],
        behavior: [],
        currentTier: null,
        activeInterventions: [],
      },
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
    }
  },
  methods: {
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
        await this.fetchStudent() // reload updated profile
      } catch (err) {
        console.error('Error assigning intervention:', err)
      }
    },
    async fetchStudent() {
      const studentId = this.$route.params.id
      this.loading = true
      try {
        const res = await axios.get(`http://localhost:3000/profile/${studentId}`)
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
</style>
