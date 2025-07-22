<template>
  <v-container fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <h1 class="text-h4 font-weight-bold">MTSS Dashboard</h1>
        <h2 class="student-name" v-if="studentName">{{ studentName }}</h2>
      </div>
      <v-text-field
        v-model="searchQuery"
        label="Filter by Student or Intervention"
        prepend-inner-icon="mdi-magnify"
        clearable
        style="max-width: 300px"
      />
    </div>

    <v-expansion-panels accordion>
      <v-expansion-panel v-for="tierEntry in filteredTiers" :key="tierEntry.id" class="mb-4">
        <v-expansion-panel-title>
          <div class="d-flex justify-space-between align-center w-100">
            <div>
              <span class="text-h6 font-weight-bold">{{
                tierEntry.Tier?.name || 'Unknown Tier'
              }}</span>
              <v-chip
                :color="tierEntry.end_date ? 'grey lighten-1' : 'green lighten-1'"
                class="ml-2"
                small
              >
                {{ tierEntry.end_date ? 'Inactive' : 'Active' }}
              </v-chip>
            </div>
            <div class="text-caption">
              Assigned: {{ formatDate(tierEntry.assigned_date) }}
              <span v-if="tierEntry.end_date"> | Ended: {{ formatDate(tierEntry.end_date) }}</span>
            </div>
          </div>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <v-card flat class="pa-6">
            <!-- Tier Actions -->
            <div class="d-flex justify-end gap-2 mb-4">
              <v-btn
                v-if="!tierEntry.end_date"
                color="error"
                variant="outlined"
                size="small"
                @click.stop="endTier(tierEntry.id)"
              >
                <v-icon left size="18">mdi-stop</v-icon>
                End Tier
              </v-btn>
              <v-btn
                v-if="!tierEntry.end_date"
                color="primary"
                variant="flat"
                size="small"
                @click.stop="openAddInterventionDialog(tierEntry.id)"
              >
                <v-icon left size="18">mdi-plus</v-icon>
                Add Intervention
              </v-btn>
            </div>

            <!-- Progress Monitoring Indicators -->
            <v-card class="pa-4 mb-4 elevation-3 rounded-lg progress-overview-card">
              <h3 class="text-subtitle-1 font-weight-medium mb-3">Progress Overview</h3>
              <v-row dense>
                <v-col cols="4">
                  <v-chip
                    :color="getProgressColor(tierEntry, 'academics')"
                    variant="flat"
                    size="small"
                    class="progress-chip"
                  >
                    <v-icon left size="16">mdi-book-open-variant</v-icon>
                    Academics: {{ getProgressStatus(tierEntry, 'academics') }}
                  </v-chip>
                </v-col>
                <v-col cols="4">
                  <v-chip
                    :color="getProgressColor(tierEntry, 'behavior')"
                    variant="flat"
                    size="small"
                    class="progress-chip"
                  >
                    <v-icon left size="16">mdi-account-check</v-icon>
                    Behavior: {{ getProgressStatus(tierEntry, 'behavior') }}
                  </v-chip>
                </v-col>
                <v-col cols="4">
                  <v-chip
                    :color="getProgressColor(tierEntry, 'attendance')"
                    variant="flat"
                    size="small"
                    class="progress-chip"
                  >
                    <v-icon left size="16">mdi-calendar-check</v-icon>
                    Attendance: {{ getProgressStatus(tierEntry, 'attendance') }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-card>

            <!-- Notes Section -->
            <v-card class="pa-4 mb-4 elevation-3 rounded-lg notes-card">
              <h3 class="text-subtitle-1 font-weight-medium mb-3">Tier Notes</h3>
              <v-textarea
                v-model="tierEntry.notes"
                placeholder="Add notes about this tier assignment..."
                rows="3"
                variant="outlined"
                density="compact"
                @blur="saveTierNotes(tierEntry.id, tierEntry.notes)"
              />
            </v-card>

            <!-- Interventions -->
            <div class="interventions-section">
              <h3 class="text-subtitle-1 font-weight-medium mb-3">
                <v-icon left color="primary">mdi-heart-pulse</v-icon>
                Interventions ({{ tierEntry.interventions.length }})
              </h3>

              <div v-if="tierEntry.interventions.length === 0" class="no-interventions">
                <v-card class="pa-6 text-center elevation-1 rounded-lg">
                  <v-icon size="48" color="grey lighten-1" class="mb-3"
                    >mdi-help-circle-outline</v-icon
                  >
                  <div class="text-body-1 text-medium-emphasis">No interventions assigned yet</div>
                  <div class="text-caption text-medium-emphasis">
                    Click "Add Intervention" to get started
                  </div>
                </v-card>
              </div>

              <v-row v-else dense>
                <v-col
                  v-for="intervention in tierEntry.interventions"
                  :key="intervention.id"
                  cols="12"
                  md="6"
                >
                  <v-card
                    class="intervention-card pa-4 elevation-2 rounded-lg hoverable"
                    @click="editIntervention(intervention)"
                  >
                    <div class="d-flex justify-space-between align-start mb-3">
                      <div class="intervention-header">
                        <h4 class="text-body-1 font-weight-medium mb-1">
                          {{ intervention.name }}
                        </h4>
                        <v-chip
                          :color="getFocusAreaColor(intervention.focus_area)"
                          variant="flat"
                          size="small"
                          class="focus-chip"
                        >
                          {{ intervention.focus_area }}
                        </v-chip>
                      </div>
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        @click.stop="editIntervention(intervention)"
                      >
                        <v-icon size="18">mdi-pencil</v-icon>
                      </v-btn>
                    </div>

                    <div class="intervention-details">
                      <div class="detail-item mb-2">
                        <v-icon left size="16" color="primary">mdi-clock-outline</v-icon>
                        <span class="text-body-2 font-weight-medium">Frequency:</span>
                        <span class="text-body-2 ml-1">{{ intervention.frequency }}</span>
                      </div>

                      <div v-if="intervention.description" class="detail-item">
                        <v-icon left size="16" color="primary">mdi-text</v-icon>
                        <span class="text-body-2 font-weight-medium">Description:</span>
                        <div class="text-body-2 ml-1 description-text">
                          {{ intervention.description }}
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <!-- Charts Section -->
            <div class="charts-section mt-6">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-card class="pa-4 elevation-3 rounded-lg chart-card">
                    <h4 class="text-subtitle-1 font-weight-medium mb-3">
                      <v-icon left color="orange">mdi-chart-line</v-icon>
                      Behavior Incidents
                    </h4>
                    <div class="chart-container">
                      <svg width="100%" height="200" viewBox="0 0 400 200" class="behavior-chart">
                        <!-- Chart background -->
                        <rect width="400" height="200" fill="#f8f9fa" rx="8" />

                        <!-- Grid lines -->
                        <g stroke="#e0e0e0" stroke-width="1">
                          <line x1="50" y1="20" x2="50" y2="160" />
                          <line x1="50" y1="160" x2="380" y2="160" />
                          <!-- Horizontal grid lines -->
                          <line x1="45" y1="40" x2="380" y2="40" stroke-dasharray="2,2" />
                          <line x1="45" y1="80" x2="380" y2="80" stroke-dasharray="2,2" />
                          <line x1="45" y1="120" x2="380" y2="120" stroke-dasharray="2,2" />
                        </g>

                        <!-- Y-axis labels -->
                        <g font-size="12" fill="#666" text-anchor="end">
                          <text x="45" y="45">6</text>
                          <text x="45" y="85">4</text>
                          <text x="45" y="125">2</text>
                          <text x="45" y="165">0</text>
                        </g>

                        <!-- X-axis labels -->
                        <g font-size="10" fill="#666" text-anchor="middle">
                          <text x="80" y="180">Jan</text>
                          <text x="140" y="180">Feb</text>
                          <text x="200" y="180">Mar</text>
                          <text x="260" y="180">Apr</text>
                          <text x="320" y="180">May</text>
                        </g>

                        <!-- Behavior data line -->
                        <polyline
                          points="80,120 140,80 200,100 260,60 320,80"
                          fill="none"
                          stroke="#f57c00"
                          stroke-width="3"
                          stroke-linecap="round"
                        />

                        <!-- Data points -->
                        <g fill="#f57c00">
                          <circle cx="80" cy="120" r="4" />
                          <circle cx="140" cy="80" r="4" />
                          <circle cx="200" cy="100" r="4" />
                          <circle cx="260" cy="60" r="4" />
                          <circle cx="320" cy="80" r="4" />
                        </g>
                      </svg>
                      <div class="chart-summary mt-2">
                        <div class="text-caption text-medium-emphasis">
                          Average: 3.2 incidents/month | Trend:
                          <span class="text-success">↓ Decreasing</span>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card class="pa-4 elevation-3 rounded-lg chart-card">
                    <h4 class="text-subtitle-1 font-weight-medium mb-3">
                      <v-icon left color="purple">mdi-calendar-check</v-icon>
                      Attendance Rate
                    </h4>
                    <div class="chart-container">
                      <svg width="100%" height="200" viewBox="0 0 400 200" class="attendance-chart">
                        <!-- Chart background -->
                        <rect width="400" height="200" fill="#f8f9fa" rx="8" />

                        <!-- Grid lines -->
                        <g stroke="#e0e0e0" stroke-width="1">
                          <line x1="50" y1="20" x2="50" y2="160" />
                          <line x1="50" y1="160" x2="380" y2="160" />
                          <!-- Horizontal grid lines -->
                          <line x1="45" y1="40" x2="380" y2="40" stroke-dasharray="2,2" />
                          <line x1="45" y1="80" x2="380" y2="80" stroke-dasharray="2,2" />
                          <line x1="45" y1="120" x2="380" y2="120" stroke-dasharray="2,2" />
                        </g>

                        <!-- Y-axis labels -->
                        <g font-size="12" fill="#666" text-anchor="end">
                          <text x="45" y="45">100%</text>
                          <text x="45" y="85">80%</text>
                          <text x="45" y="125">60%</text>
                          <text x="45" y="165">40%</text>
                        </g>

                        <!-- X-axis labels -->
                        <g font-size="10" fill="#666" text-anchor="middle">
                          <text x="80" y="180">Jan</text>
                          <text x="140" y="180">Feb</text>
                          <text x="200" y="180">Mar</text>
                          <text x="260" y="180">Apr</text>
                          <text x="320" y="180">May</text>
                        </g>

                        <!-- Attendance data line -->
                        <polyline
                          points="80,100 140,80 200,70 260,60 320,50"
                          fill="none"
                          stroke="#9c27b0"
                          stroke-width="3"
                          stroke-linecap="round"
                        />

                        <!-- Data points -->
                        <g fill="#9c27b0">
                          <circle cx="80" cy="100" r="4" />
                          <circle cx="140" cy="80" r="4" />
                          <circle cx="200" cy="70" r="4" />
                          <circle cx="260" cy="60" r="4" />
                          <circle cx="320" cy="50" r="4" />
                        </g>
                      </svg>
                      <div class="chart-summary mt-2">
                        <div class="text-caption text-medium-emphasis">
                          Current: 92% | Goal: 95% | Trend:
                          <span class="text-success">↑ Improving</span>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- FAB for adding new tier -->
    <v-btn color="primary" fab large fixed bottom right @click="openAddTierDialog">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>

  <!-- Modal: Edit Intervention -->
  <v-dialog v-model="editDialog" max-width="500px">
    <v-card>
      <v-card-title>Edit Intervention</v-card-title>
      <v-card-text>
        <v-text-field v-model="editItem.name" label="Name" />
        <v-text-field v-model="editItem.focus_area" label="Focus Area" />
        <v-text-field v-model="editItem.frequency" label="Frequency" />
        <v-textarea v-model="editItem.description" label="Description" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="editDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="saveEdit">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal: Add Tier -->
  <v-dialog v-model="addTierDialog" max-width="500px">
    <v-card>
      <v-card-title>Add New Tier</v-card-title>
      <v-card-text>
        <v-select
          v-model="newTier.tierId"
          :items="availableTiers"
          item-text="name"
          item-value="id"
          label="Tier"
          required
        />
        <v-text-field v-model="newTier.assigned_date" label="Assigned Date" type="date" required />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="addTierDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="saveNewTier">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal: Add Intervention -->
  <v-dialog v-model="addInterventionDialog" max-width="500px">
    <v-card>
      <v-card-title>Add New Intervention</v-card-title>
      <v-card-text>
        <v-text-field v-model="newIntervention.name" label="Name" required />
        <v-text-field v-model="newIntervention.focus_area" label="Focus Area" required />
        <v-text-field v-model="newIntervention.frequency" label="Frequency" required />
        <v-textarea v-model="newIntervention.description" label="Description" />
        <v-textarea v-model="newIntervention.notes" label="Notes" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="addInterventionDialog = false">Cancel</v-btn>
        <v-btn color="primary" @click="saveNewIntervention">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const studentId = route.params.id
const tiers = ref([])
const studentName = ref('')
const editDialog = ref(false)
const editItem = ref({})
const addTierDialog = ref(false)
const addInterventionDialog = ref(false)
const searchQuery = ref('')
const newTier = ref({
  tierId: '',
  assigned_date: new Date().toISOString().split('T')[0],
})
const newIntervention = ref({
  name: '',
  focus_area: '',
  frequency: '',
  description: '',
  notes: '',
  student_tier_id: null,
})
const availableTiers = ref([
  { id: 1, name: 'Tier 1' },
  { id: 2, name: 'Tier 2' },
  { id: 3, name: 'Tier 3' },
])

// Mocked progress data
const progressData = ref({
  9: [
    { date: '2025-07-08', note: 'Initial meeting', detail: 'Reviewed goals with team' },
    { date: '2025-07-09', note: 'Checked behavior', detail: 'Improved focus in class' },
  ],
  16: [{ date: '2025-07-09', note: 'Math check-in', detail: 'Still missing assignments' }],
})

const getProgress = (interventionId) => progressData.value[interventionId] || []

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString()

// Progress monitoring logic (simplified)
const getProgressStatus = (tierEntry, type) => {
  const interventionCount = tierEntry.interventions.length
  if (!interventionCount) return 'No Data'
  const progress = getProgress(tierEntry.interventions[0].id)
  return progress.length > 0 ? 'On Track' : 'Needs Attention'
}

const getProgressColor = (tierEntry, type) => {
  const status = getProgressStatus(tierEntry, type)
  return status === 'On Track'
    ? 'green lighten-3'
    : status === 'Needs Attention'
      ? 'orange lighten-3'
      : 'grey lighten-3'
}

const getFocusAreaColor = (focusArea) => {
  const colors = {
    Reading: 'blue',
    Math: 'green',
    Behavior: 'orange',
    Attendance: 'purple',
    Writing: 'teal',
  }
  return colors[focusArea] || 'primary'
}

// Filter tiers based on search query
const filteredTiers = computed(() => {
  if (!searchQuery.value) return tiers.value
  const query = searchQuery.value.toLowerCase()
  return tiers.value.filter(
    (tier) =>
      tier.Tier?.name.toLowerCase().includes(query) ||
      tier.interventions.some((int) => int.name.toLowerCase().includes(query)),
  )
})

const editIntervention = (intervention) => {
  editItem.value = { ...intervention }
  editDialog.value = true
}

const openAddTierDialog = () => {
  newTier.value = { tierId: '', assigned_date: new Date().toISOString().split('T')[0] }
  addTierDialog.value = true
}

const openAddInterventionDialog = (tierId) => {
  newIntervention.value = {
    name: '',
    focus_area: '',
    frequency: '',
    description: '',
    notes: '',
    student_tier_id: tierId,
  }
  addInterventionDialog.value = true
}

const saveEdit = async () => {
  try {
    await axios.put(
      `http://localhost:3000/mtss/student-interventions/${editItem.value.id}`,
      editItem.value,
    )
    await loadData()
    editDialog.value = false
  } catch (e) {
    console.error('Failed to save intervention', e)
  }
}

const saveNewTier = async () => {
  try {
    await axios.post(`http://localhost:3000/mtss/student-tiers`, {
      studentId: studentId,
      tierId: newTier.value.tierId,
      assignedDate: newTier.value.assigned_date,
    })
    await loadData()
    addTierDialog.value = false
  } catch (e) {
    console.error('Failed to add tier', e)
  }
}

const saveNewIntervention = async () => {
  try {
    await axios.post(`http://localhost:3000/mtss/student-interventions`, {
      studentId: studentId,
      name: newIntervention.value.name,
      focus_area: newIntervention.value.focus_area,
      frequency: newIntervention.value.frequency,
      description: newIntervention.value.description,
      notes: newIntervention.value.notes,
      student_tier_id: newIntervention.value.student_tier_id,
    })
    await loadData()
    addInterventionDialog.value = false
  } catch (e) {
    console.error('Failed to add intervention', e)
  }
}

const endTier = async (tierId) => {
  try {
    await axios.put(`http://localhost:3000/mtss/student-tiers/${tierId}`, {
      end_date: new Date().toISOString().split('T')[0],
    })
    await loadData()
  } catch (e) {
    console.error('Failed to end tier', e)
  }
}

const saveTierNotes = async (tierId, notes) => {
  try {
    await axios.put(`http://localhost:3000/mtss/student-tiers/${tierId}`, { notes })
    await loadData()
  } catch (e) {
    console.error('Failed to save tier notes', e)
  }
}

const loadData = async () => {
  try {
    const res = await axios.get(`http://localhost:3000/mtss/students/${studentId}/interventions`)
    tiers.value = res.data

    // Also fetch student name
    const studentRes = await axios.get(`http://localhost:3000/profile/${studentId}`)
    studentName.value = `${studentRes.data.first_name} ${studentRes.data.last_name}`
  } catch (err) {
    console.error('Failed to load student interventions', err)
  }
}

onMounted(loadData)
</script>

<style scoped>
.student-name {
  font-size: 1.5rem;
  font-weight: 500;
  color: #1976d2;
  margin-bottom: 0;
  margin-top: 4px;
}

.text-caption {
  font-size: 0.75rem;
}
.gap-2 {
  gap: 0.5rem;
}

/* Profile-cohesive styling for tier content */
.progress-overview-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #e0e0e0;
}

.progress-chip {
  width: 100%;
  justify-content: flex-start;
  padding: 8px 12px;
}

.notes-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
}

.interventions-section {
  margin-top: 16px;
}

.charts-section {
  margin-top: 24px;
}

.chart-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  height: 100%;
}

.chart-container {
  position: relative;
}

.behavior-chart,
.attendance-chart {
  border-radius: 8px;
  max-width: 100%;
  height: auto;
}

.chart-summary {
  text-align: center;
  padding: 8px 0;
}

.intervention-card {
  border: 1px solid #e0e0e0;
  background-color: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
}

.intervention-card:hover.hoverable {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #1976d2;
}

.intervention-header {
  flex: 1;
}

.focus-chip {
  margin-top: 4px;
}

.intervention-details {
  margin-top: 12px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.description-text {
  line-height: 1.4;
  color: #666;
  margin-top: 2px;
}

.no-interventions {
  margin: 16px 0;
}

.hoverable {
  transition: all 0.3s ease;
}

.v-card {
  border-radius: 10px;
}

/* Profile.vue cohesive styles */
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
</style>
