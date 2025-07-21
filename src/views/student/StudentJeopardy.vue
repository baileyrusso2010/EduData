<template>
  <v-container fluid class="pa-6">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center">
          <div>
            <h1 class="text-h3 text-error font-weight-bold">Students in Jeopardy</h1>
            <p class="text-h6 text-grey-darken-1">
              Students requiring immediate attention and intervention
            </p>
          </div>
          <div class="d-flex align-center">
            <v-chip color="error" class="mr-3">
              <v-icon class="mr-2">mdi-alert</v-icon>
              {{ filteredStudents.length }} Students at Risk
            </v-chip>
            <v-btn color="primary" @click="exportData">
              <v-icon class="mr-2">mdi-download</v-icon>
              Export
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Alert Summary Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card color="error" dark class="pa-4">
          <v-card-title class="d-flex justify-space-between">
            <span>High Priority</span>
            <v-icon>mdi-alert-circle</v-icon>
          </v-card-title>
          <v-card-text>
            <div class="text-h3 font-weight-bold">{{ getStudentsByPriority('high').length }}</div>
            <div class="text-body-2">Immediate Action Required</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card color="warning" dark class="pa-4">
          <v-card-title class="d-flex justify-space-between">
            <span>Medium Priority</span>
            <v-icon>mdi-alert</v-icon>
          </v-card-title>
          <v-card-text>
            <div class="text-h3 font-weight-bold">{{ getStudentsByPriority('medium').length }}</div>
            <div class="text-body-2">Monitoring Required</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card color="info" dark class="pa-4">
          <v-card-title class="d-flex justify-space-between">
            <span>Low Priority</span>
            <v-icon>mdi-information</v-icon>
          </v-card-title>
          <v-card-text>
            <div class="text-h3 font-weight-bold">{{ getStudentsByPriority('low').length }}</div>
            <div class="text-body-2">Watch List</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card color="success" dark class="pa-4">
          <v-card-title class="d-flex justify-space-between">
            <span>Improved</span>
            <v-icon>mdi-trending-up</v-icon>
          </v-card-title>
          <v-card-text>
            <div class="text-h3 font-weight-bold">
              {{ getStudentsByPriority('improved').length }}
            </div>
            <div class="text-body-2">Recently Improved</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="6" class="pa-4">
          <v-card-title class="text-h5 primary white--text">
            <v-icon class="mr-2">mdi-filter</v-icon>
            Filter Criteria
          </v-card-title>
          <v-card-text>
            <v-row>
              <!-- Academic Filters -->
              <v-col cols="12" md="3">
                <h4 class="mb-3 text-primary">Academic Performance</h4>
                <v-text-field
                  v-model="filters.minGPA"
                  type="number"
                  step="0.1"
                  min="0"
                  max="4"
                  label="Min GPA"
                  outlined
                  dense
                  prepend-icon="mdi-trending-down"
                ></v-text-field>

                <v-text-field
                  v-model="filters.failingGrades"
                  type="number"
                  min="0"
                  label="Min Failing Grades"
                  outlined
                  dense
                  prepend-icon="mdi-close-circle"
                ></v-text-field>

                <v-select
                  v-model="filters.proficiencyLevel"
                  :items="proficiencyLevels"
                  label="State Test Performance"
                  outlined
                  dense
                  clearable
                  prepend-icon="mdi-school"
                ></v-select>
              </v-col>

              <!-- Attendance Filters -->
              <v-col cols="12" md="3">
                <h4 class="mb-3 text-warning">Attendance Issues</h4>
                <v-text-field
                  v-model="filters.maxAttendance"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  label="Max Attendance %"
                  outlined
                  dense
                  prepend-icon="mdi-calendar-remove"
                ></v-text-field>

                <v-text-field
                  v-model="filters.minAbsences"
                  type="number"
                  min="0"
                  label="Min Total Absences"
                  outlined
                  dense
                  prepend-icon="mdi-account-remove"
                ></v-text-field>

                <v-text-field
                  v-model="filters.minTardies"
                  type="number"
                  min="0"
                  label="Min Tardies"
                  outlined
                  dense
                  prepend-icon="mdi-clock-alert"
                ></v-text-field>
              </v-col>

              <!-- Behavior Filters -->
              <v-col cols="12" md="3">
                <h4 class="mb-3 text-error">Behavior Concerns</h4>
                <v-text-field
                  v-model="filters.minBehaviorIncidents"
                  type="number"
                  min="0"
                  label="Min Behavior Incidents"
                  outlined
                  dense
                  prepend-icon="mdi-alert-circle"
                ></v-text-field>

                <v-select
                  v-model="filters.incidentSeverity"
                  :items="incidentSeverities"
                  label="Incident Severity"
                  outlined
                  dense
                  clearable
                  prepend-icon="mdi-traffic-light"
                ></v-select>

                <v-text-field
                  v-model="filters.minSuspensions"
                  type="number"
                  min="0"
                  label="Min Suspensions"
                  outlined
                  dense
                  prepend-icon="mdi-gavel"
                ></v-text-field>
              </v-col>

              <!-- Support & Demographics -->
              <v-col cols="12" md="3">
                <h4 class="mb-3 text-info">Demographics & Support</h4>
                <v-select
                  v-model="filters.grades"
                  :items="gradeOptions"
                  label="Grade Levels"
                  outlined
                  dense
                  multiple
                  clearable
                  prepend-icon="mdi-school"
                ></v-select>

                <v-select
                  v-model="filters.mtssLevels"
                  :items="mtssOptions"
                  label="MTSS Tiers"
                  outlined
                  dense
                  multiple
                  clearable
                  prepend-icon="mdi-layers"
                ></v-select>

                <v-select
                  v-model="filters.specialServices"
                  :items="specialServicesOptions"
                  label="Special Services"
                  outlined
                  dense
                  multiple
                  clearable
                  prepend-icon="mdi-heart"
                ></v-select>
              </v-col>
            </v-row>

            <!-- Filter Actions -->
            <v-row class="mt-4">
              <v-col cols="12" class="d-flex justify-space-between">
                <div>
                  <v-btn color="primary" @click="applyFilters" class="mr-3">
                    <v-icon class="mr-2">mdi-filter</v-icon>
                    Apply Filters
                  </v-btn>
                  <v-btn color="grey" @click="clearFilters" outlined>
                    <v-icon class="mr-2">mdi-filter-remove</v-icon>
                    Clear All
                  </v-btn>
                </div>
                <div>
                  <v-btn color="success" @click="saveFilterPreset">
                    <v-icon class="mr-2">mdi-content-save</v-icon>
                    Save Preset
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Results Table -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="6">
          <v-card-title class="text-h5 error white--text">
            <v-icon class="mr-2">mdi-account-alert</v-icon>
            Students Requiring Intervention ({{ filteredStudents.length }})
          </v-card-title>
          <v-card-text class="pa-0">
            <v-data-table
              :headers="tableHeaders"
              :items="filteredStudents"
              :items-per-page="25"
              :search="searchText"
              class="elevation-1"
              :loading="loading"
              show-expand
              item-key="studentId"
            >
              <!-- Search toolbar -->
              <template v-slot:top>
                <v-toolbar flat>
                  <v-text-field
                    v-model="searchText"
                    prepend-icon="mdi-magnify"
                    label="Search students..."
                    single-line
                    hide-details
                    clearable
                    class="mr-4"
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="bulkIntervention">
                    <v-icon class="mr-2">mdi-account-multiple-plus</v-icon>
                    Bulk Intervention
                  </v-btn>
                </v-toolbar>
              </template>

              <!-- Custom column renderers -->
              <template v-slot:item.priority="{ item }">
                <v-chip :color="getPriorityColor(item.priority)" dark small>
                  {{ item.priority.toUpperCase() }}
                </v-chip>
              </template>

              <template v-slot:item.gpa="{ item }">
                <v-chip :color="getGPAColor(item.gpa)" small>
                  {{ item.gpa }}
                </v-chip>
              </template>

              <template v-slot:item.attendanceRate="{ item }">
                <div class="d-flex align-center">
                  <v-progress-circular
                    :value="item.attendanceRate"
                    :color="getAttendanceColor(item.attendanceRate)"
                    size="30"
                    width="3"
                  >
                    <span class="text-caption">{{ item.attendanceRate }}%</span>
                  </v-progress-circular>
                </div>
              </template>

              <template v-slot:item.mtssTier="{ item }">
                <v-chip :color="getMtssColor(item.mtssTier)" dark small>
                  Tier {{ item.mtssTier }}
                </v-chip>
              </template>

              <template v-slot:item.behaviorIncidents="{ item }">
                <v-chip :color="getBehaviorColor(item.behaviorIncidents)" small>
                  {{ item.behaviorIncidents }}
                </v-chip>
              </template>

              <template v-slot:item.actions="{ item }">
                <v-btn icon small color="primary" @click="viewStudent(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn icon small color="warning" @click="createIntervention(item)">
                  <v-icon>mdi-plus-circle</v-icon>
                </v-btn>
                <v-btn icon small color="success" @click="contactParent(item)">
                  <v-icon>mdi-phone</v-icon>
                </v-btn>
              </template>

              <!-- Expandable row content -->
              <template v-slot:expanded-row="{ item }">
                <td :colspan="tableHeaders.length">
                  <v-card flat class="ma-4">
                    <v-card-text>
                      <v-row>
                        <v-col cols="12" md="4">
                          <h4 class="mb-2">Risk Factors</h4>
                          <v-chip-group column>
                            <v-chip
                              v-for="factor in item.riskFactors"
                              :key="factor"
                              small
                              color="error"
                              dark
                            >
                              {{ factor }}
                            </v-chip>
                          </v-chip-group>
                        </v-col>
                        <v-col cols="12" md="4">
                          <h4 class="mb-2">Current Interventions</h4>
                          <v-list dense>
                            <v-list-item
                              v-for="intervention in item.currentInterventions"
                              :key="intervention"
                            >
                              <v-list-item-content>
                                <v-list-item-title class="text-body-2">{{
                                  intervention
                                }}</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-col>
                        <v-col cols="12" md="4">
                          <h4 class="mb-2">Contact Information</h4>
                          <div class="text-body-2 mb-1">
                            <strong>Parent:</strong> {{ item.parentContact.name }}
                          </div>
                          <div class="text-body-2 mb-1">
                            <strong>Phone:</strong> {{ item.parentContact.phone }}
                          </div>
                          <div class="text-body-2">
                            <strong>Last Contact:</strong> {{ item.lastParentContact }}
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Intervention Planning Dialog -->
    <v-dialog v-model="interventionDialog" max-width="800px">
      <v-card>
        <v-card-title class="text-h5 primary white--text">
          <v-icon class="mr-2">mdi-plus-circle</v-icon>
          Create Intervention Plan
        </v-card-title>
        <v-card-text class="pa-6">
          <div v-if="selectedStudent">
            <h3 class="mb-4">{{ selectedStudent.firstName }} {{ selectedStudent.lastName }}</h3>

            <v-select
              v-model="newIntervention.type"
              :items="interventionTypes"
              label="Intervention Type"
              outlined
              class="mb-4"
            ></v-select>

            <v-textarea
              v-model="newIntervention.description"
              label="Description"
              outlined
              rows="3"
              class="mb-4"
            ></v-textarea>

            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="newIntervention.startDate"
                  type="date"
                  label="Start Date"
                  outlined
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="newIntervention.reviewDate"
                  type="date"
                  label="Review Date"
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>

            <v-select
              v-model="newIntervention.assignedTo"
              :items="staffMembers"
              label="Assigned To"
              outlined
            ></v-select>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="interventionDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveIntervention">Create Intervention</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Data interfaces
interface Student {
  studentId: string
  firstName: string
  lastName: string
  grade: number
  school: string
  gpa: number
  attendanceRate: number
  totalAbsences: number
  tardies: number
  behaviorIncidents: number
  suspensions: number
  mtssTier: number
  priority: string
  failingGrades: number
  proficiencyLevel: string
  specialServices: string[]
  riskFactors: string[]
  currentInterventions: string[]
  parentContact: {
    name: string
    phone: string
  }
  lastParentContact: string
}

interface Filters {
  minGPA: number | null
  maxAttendance: number | null
  minAbsences: number | null
  minTardies: number | null
  minBehaviorIncidents: number | null
  minSuspensions: number | null
  failingGrades: number | null
  grades: number[]
  mtssLevels: number[]
  proficiencyLevel: string | null
  incidentSeverity: string | null
  specialServices: string[]
}

// Reactive data
const loading = ref(false)
const searchText = ref('')
const interventionDialog = ref(false)
const selectedStudent = ref<Student | null>(null)

const filters = ref<Filters>({
  minGPA: null,
  maxAttendance: null,
  minAbsences: null,
  minTardies: null,
  minBehaviorIncidents: null,
  minSuspensions: null,
  failingGrades: null,
  grades: [],
  mtssLevels: [],
  proficiencyLevel: null,
  incidentSeverity: null,
  specialServices: [],
})

const newIntervention = ref({
  type: '',
  description: '',
  startDate: '',
  reviewDate: '',
  assignedTo: '',
})

// Sample data
const studentsAtRisk = ref<Student[]>([
  {
    studentId: 'STU-2025-0123',
    firstName: 'Marcus',
    lastName: 'Johnson',
    grade: 9,
    school: 'Washington High School',
    gpa: 1.8,
    attendanceRate: 72,
    totalAbsences: 28,
    tardies: 15,
    behaviorIncidents: 8,
    suspensions: 2,
    mtssTier: 3,
    priority: 'high',
    failingGrades: 4,
    proficiencyLevel: 'Below Proficient',
    specialServices: ['IEP', 'Free Lunch'],
    riskFactors: [
      'Chronic Absenteeism',
      'Multiple Failing Grades',
      'Behavior Issues',
      'Suspension History',
    ],
    currentInterventions: ['Daily Check-in', 'Counseling Services', 'Academic Support'],
    parentContact: { name: 'Sharon Johnson', phone: '(555) 123-4567' },
    lastParentContact: '2025-07-05',
  },
  {
    studentId: 'STU-2025-0456',
    firstName: 'Isabella',
    lastName: 'Garcia',
    grade: 7,
    school: 'Roosevelt Middle School',
    gpa: 2.3,
    attendanceRate: 85,
    totalAbsences: 15,
    tardies: 8,
    behaviorIncidents: 3,
    suspensions: 0,
    mtssTier: 2,
    priority: 'medium',
    failingGrades: 2,
    proficiencyLevel: 'Approaching Proficient',
    specialServices: ['ELL', 'Free Lunch'],
    riskFactors: ['Language Barrier', 'Academic Struggles', 'Attendance Concerns'],
    currentInterventions: ['ESL Support', 'Tutoring', 'Parent Communication'],
    parentContact: { name: 'Maria Garcia', phone: '(555) 234-5678' },
    lastParentContact: '2025-07-08',
  },
  {
    studentId: 'STU-2025-0789',
    firstName: 'Tyler',
    lastName: 'Smith',
    grade: 11,
    school: 'Washington High School',
    gpa: 2.1,
    attendanceRate: 88,
    totalAbsences: 12,
    tardies: 5,
    behaviorIncidents: 5,
    suspensions: 1,
    mtssTier: 2,
    priority: 'medium',
    failingGrades: 3,
    proficiencyLevel: 'Approaching Proficient',
    specialServices: ['504 Plan'],
    riskFactors: ['Credit Deficiency', 'Behavior Issues', 'At Risk of Not Graduating'],
    currentInterventions: ['Credit Recovery', 'Behavioral Plan', 'Mentoring'],
    parentContact: { name: 'David Smith', phone: '(555) 345-6789' },
    lastParentContact: '2025-07-02',
  },
  {
    studentId: 'STU-2025-1012',
    firstName: 'Aisha',
    lastName: 'Williams',
    grade: 6,
    school: 'Lincoln Elementary',
    gpa: 2.8,
    attendanceRate: 91,
    totalAbsences: 8,
    tardies: 12,
    behaviorIncidents: 2,
    suspensions: 0,
    mtssTier: 1,
    priority: 'low',
    failingGrades: 1,
    proficiencyLevel: 'Proficient',
    specialServices: ['Free Lunch'],
    riskFactors: ['Frequent Tardiness', 'One Failing Grade'],
    currentInterventions: ['Morning Check-in', 'Reading Support'],
    parentContact: { name: 'Jennifer Williams', phone: '(555) 456-7890' },
    lastParentContact: '2025-07-10',
  },
  {
    studentId: 'STU-2025-1345',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    grade: 10,
    school: 'Washington High School',
    gpa: 1.5,
    attendanceRate: 68,
    totalAbsences: 32,
    tardies: 20,
    behaviorIncidents: 12,
    suspensions: 4,
    mtssTier: 3,
    priority: 'high',
    failingGrades: 5,
    proficiencyLevel: 'Below Proficient',
    specialServices: ['IEP', 'Free Lunch', 'Transportation'],
    riskFactors: [
      'Chronic Absenteeism',
      'Multiple Failing Grades',
      'Serious Behavior Issues',
      'Multiple Suspensions',
    ],
    currentInterventions: [
      'Intensive Case Management',
      'Alternative Placement Consideration',
      'Family Support Services',
    ],
    parentContact: { name: 'Ana Rodriguez', phone: '(555) 567-8901' },
    lastParentContact: '2025-06-28',
  },
])

// Filter options
const gradeOptions = ref([
  { title: 'Kindergarten', value: 0 },
  { title: '1st Grade', value: 1 },
  { title: '2nd Grade', value: 2 },
  { title: '3rd Grade', value: 3 },
  { title: '4th Grade', value: 4 },
  { title: '5th Grade', value: 5 },
  { title: '6th Grade', value: 6 },
  { title: '7th Grade', value: 7 },
  { title: '8th Grade', value: 8 },
  { title: '9th Grade', value: 9 },
  { title: '10th Grade', value: 10 },
  { title: '11th Grade', value: 11 },
  { title: '12th Grade', value: 12 },
])

const mtssOptions = ref([
  { title: 'Tier 1 - Universal', value: 1 },
  { title: 'Tier 2 - Targeted', value: 2 },
  { title: 'Tier 3 - Intensive', value: 3 },
])

const proficiencyLevels = ref([
  'Advanced',
  'Proficient',
  'Approaching Proficient',
  'Below Proficient',
])

const incidentSeverities = ref(['Low', 'Medium', 'High'])

const specialServicesOptions = ref([
  'IEP',
  '504 Plan',
  'ELL',
  'Free Lunch',
  'Transportation',
  'Gifted',
])

const interventionTypes = ref([
  'Academic Support',
  'Behavioral Intervention',
  'Attendance Intervention',
  'Counseling Services',
  'Family Support',
  'Mentoring',
  'Credit Recovery',
  'Alternative Placement',
])

const staffMembers = ref([
  'Ms. Rodriguez - Counselor',
  'Mr. Thompson - MTSS Coordinator',
  'Dr. Chen - School Psychologist',
  'Ms. Davis - Social Worker',
  'Mr. Martinez - Assistant Principal',
])

// Table configuration
const tableHeaders = ref([
  { title: 'Student Name', key: 'firstName', sortable: true },
  { title: 'Grade', key: 'grade', sortable: true },
  { title: 'School', key: 'school', sortable: true },
  { title: 'Priority', key: 'priority', sortable: true },
  { title: 'GPA', key: 'gpa', sortable: true },
  { title: 'Attendance', key: 'attendanceRate', sortable: true },
  { title: 'Absences', key: 'totalAbsences', sortable: true },
  { title: 'Behavior Inc.', key: 'behaviorIncidents', sortable: true },
  { title: 'MTSS Tier', key: 'mtssTier', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
])

// Computed properties
const filteredStudents = computed(() => {
  let filtered = studentsAtRisk.value

  if (filters.value.minGPA !== null) {
    filtered = filtered.filter((s) => s.gpa <= filters.value.minGPA!)
  }
  if (filters.value.maxAttendance !== null) {
    filtered = filtered.filter((s) => s.attendanceRate <= filters.value.maxAttendance!)
  }
  if (filters.value.minAbsences !== null) {
    filtered = filtered.filter((s) => s.totalAbsences >= filters.value.minAbsences!)
  }
  if (filters.value.minTardies !== null) {
    filtered = filtered.filter((s) => s.tardies >= filters.value.minTardies!)
  }
  if (filters.value.minBehaviorIncidents !== null) {
    filtered = filtered.filter((s) => s.behaviorIncidents >= filters.value.minBehaviorIncidents!)
  }
  if (filters.value.minSuspensions !== null) {
    filtered = filtered.filter((s) => s.suspensions >= filters.value.minSuspensions!)
  }
  if (filters.value.failingGrades !== null) {
    filtered = filtered.filter((s) => s.failingGrades >= filters.value.failingGrades!)
  }
  if (filters.value.grades.length > 0) {
    filtered = filtered.filter((s) => filters.value.grades.includes(s.grade))
  }
  if (filters.value.mtssLevels.length > 0) {
    filtered = filtered.filter((s) => filters.value.mtssLevels.includes(s.mtssTier))
  }
  if (filters.value.proficiencyLevel) {
    filtered = filtered.filter((s) => s.proficiencyLevel === filters.value.proficiencyLevel)
  }
  if (filters.value.specialServices.length > 0) {
    filtered = filtered.filter((s) =>
      filters.value.specialServices.some((service) => s.specialServices.includes(service)),
    )
  }

  return filtered
})

// Helper functions
const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'high':
      return 'error'
    case 'medium':
      return 'warning'
    case 'low':
      return 'info'
    case 'improved':
      return 'success'
    default:
      return 'grey'
  }
}

const getGPAColor = (gpa: number): string => {
  if (gpa >= 3.0) return 'success'
  if (gpa >= 2.0) return 'warning'
  return 'error'
}

const getAttendanceColor = (rate: number): string => {
  if (rate >= 95) return 'success'
  if (rate >= 90) return 'warning'
  return 'error'
}

const getMtssColor = (tier: number): string => {
  switch (tier) {
    case 1:
      return 'success'
    case 2:
      return 'warning'
    case 3:
      return 'error'
    default:
      return 'grey'
  }
}

const getBehaviorColor = (incidents: number): string => {
  if (incidents === 0) return 'success'
  if (incidents <= 3) return 'warning'
  return 'error'
}

const getStudentsByPriority = (priority: string) => {
  return filteredStudents.value.filter((s) => s.priority === priority)
}

// Methods
const applyFilters = (): void => {
  // Filters are automatically applied via computed property
  console.log('Filters applied')
}

const clearFilters = (): void => {
  filters.value = {
    minGPA: null,
    maxAttendance: null,
    minAbsences: null,
    minTardies: null,
    minBehaviorIncidents: null,
    minSuspensions: null,
    failingGrades: null,
    grades: [],
    mtssLevels: [],
    proficiencyLevel: null,
    incidentSeverity: null,
    specialServices: [],
  }
}

const saveFilterPreset = (): void => {
  // Save current filter configuration
  console.log('Saving filter preset')
}

const exportData = (): void => {
  // Export filtered data to CSV/Excel
  console.log('Exporting data')
}

const viewStudent = (student: Student): void => {
  // Navigate to student profile
  console.log('Viewing student:', student.firstName, student.lastName)
}

const createIntervention = (student: Student): void => {
  selectedStudent.value = student
  interventionDialog.value = true
}

const contactParent = (student: Student): void => {
  // Open contact parent dialog or make call
  console.log('Contacting parent for:', student.firstName, student.lastName)
}

const bulkIntervention = (): void => {
  // Create interventions for multiple students
  console.log('Creating bulk interventions')
}

const saveIntervention = (): void => {
  // Save the new intervention
  console.log('Saving intervention for:', selectedStudent.value?.firstName)
  interventionDialog.value = false
}

onMounted(() => {
  // Initialize data
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}

.v-data-table >>> .v-data-table__expanded__content {
  box-shadow: none;
}

.text-caption {
  font-size: 10px !important;
}
</style>
