<template>
  <v-container fluid>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h4 font-weight-bold">MTSS Dashboard</h1>
      <v-text-field
        v-model="searchQuery"
        label="Filter by Student or Intervention"
        prepend-inner-icon="mdi-magnify"
        clearable
        style="max-width: 300px"
      />
    </div>

    <!-- <PieChart :data="[30, 70]" /> -->

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
          <v-card flat>
            <v-card-text>
              <!-- Tier Actions -->
              <div class="d-flex justify-end gap-2 mb-4">
                <v-btn
                  v-if="!tierEntry.end_date"
                  color="red"
                  small
                  @click.stop="endTier(tierEntry.id)"
                >
                  End Tier
                </v-btn>
                <v-btn
                  v-if="!tierEntry.end_date"
                  color="primary"
                  small
                  @click.stop="openAddInterventionDialog(tierEntry.id)"
                >
                  Add Intervention
                </v-btn>
              </div>

              <!-- Progress Monitoring Indicators -->
              <div class="mb-4">
                <h3 class="text-subtitle-1 font-weight-medium">Progress Overview</h3>
                <v-row>
                  <v-col cols="4">
                    <v-chip :color="getProgressColor(tierEntry, 'academics')" small>
                      Academics: {{ getProgressStatus(tierEntry, 'academics') }}
                    </v-chip>
                  </v-col>
                  <v-col cols="4">
                    <v-chip :color="getProgressColor(tierEntry, 'behavior')" small>
                      Behavior: {{ getProgressStatus(tierEntry, 'behavior') }}
                    </v-chip>
                  </v-col>
                  <v-col cols="4">
                    <v-chip :color="getProgressColor(tierEntry, 'attendance')" small>
                      Attendance: {{ getProgressStatus(tierEntry, 'attendance') }}
                    </v-chip>
                  </v-col>
                </v-row>
              </div>

              <!-- Notes Section -->
              <v-textarea
                v-model="tierEntry.notes"
                label="Tier Notes"
                rows="3"
                outlined
                @blur="saveTierNotes(tierEntry.id, tierEntry.notes)"
                class="mb-4"
              />

              <!-- Interventions -->
              <v-expansion-panels accordion>
                <v-expansion-panel
                  v-for="intervention in tierEntry.interventions"
                  :key="intervention.id"
                >
                  <v-expansion-panel-title>
                    <div class="d-flex justify-space-between w-100">
                      <span class="font-weight-medium">{{ intervention.name }}</span>
                      <div class="d-flex gap-2 align-center">
                        <v-chip color="blue lighten-4" small>{{ intervention.focus_area }}</v-chip>
                        <v-btn icon size="x-small" @click.stop="editIntervention(intervention)">
                          <v-icon size="18">mdi-pencil</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </v-expansion-panel-title>

                  <v-expansion-panel-text>
                    <p><strong>Frequency:</strong> {{ intervention.frequency }}</p>
                    <p><strong>Description:</strong> {{ intervention.description || '—' }}</p>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
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
import PieChart from './PieChart.vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const studentId = route.params.studentId
const tiers = ref([])
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
  } catch (err) {
    console.error('Failed to load student interventions', err)
  }
}

onMounted(loadData)
</script>

<style scoped>
.text-caption {
  font-size: 0.75rem;
}
.gap-2 {
  gap: 0.5rem;
}
</style>
