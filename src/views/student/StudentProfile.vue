<template>
  <v-container fluid class="pa-6">
    <!-- Student Header -->
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
                {{ student.firstName }} {{ student.lastName }}
              </h1>
              <div class="text-h6 mb-3">
                <v-chip color="white" text-color="primary" class="mr-2">
                  <v-icon class="mr-1">mdi-school</v-icon>
                  Grade {{ student.grade }}
                </v-chip>
                <v-chip color="white" text-color="primary" class="mr-2">
                  <v-icon class="mr-1">mdi-identifier</v-icon>
                  ID: {{ student.studentId }}
                </v-chip>
                <v-chip color="white" text-color="primary">
                  <v-icon class="mr-1">mdi-calendar</v-icon>
                  Age: {{ student.age }}
                </v-chip>
              </div>
              <div class="text-body-1">
                <strong>School:</strong> {{ student.school }} | <strong>Teacher:</strong>
                {{ student.teacher }} | <strong>Counselor:</strong> {{ student.counselor }}
              </div>
            </v-col>
            <v-col cols="auto">
              <v-btn color="white" text @click="editStudent">
                <v-icon class="mr-2">mdi-pencil</v-icon>
                Edit Profile
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card color="success" dark class="pa-4">
          <v-card-title class="d-flex justify-space-between">
            <span>GPA</span>
            <v-icon>mdi-trending-up</v-icon>
          </v-card-title>
          <v-card-text>
            <div class="text-h3 font-weight-bold">{{ student.gpa }}</div>
            <div class="text-body-2">Current Semester</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card color="info" dark class="pa-4">
          <v-card-title class="d-flex justify-space-between">
            <span>Attendance</span>
            <v-icon>mdi-calendar-check</v-icon>
          </v-card-title>
          <v-card-text>
            <div class="text-h3 font-weight-bold">{{ student.attendanceRate }}%</div>
            <div class="text-body-2">This Year</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card :color="getMtssColor(student.mtssTier)" dark class="pa-4">
          <v-card-title class="d-flex justify-space-between">
            <span>MTSS Tier</span>
            <v-icon>mdi-layers</v-icon>
          </v-card-title>
          <v-card-text>
            <div class="text-h3 font-weight-bold">{{ student.mtssTier }}</div>
            <div class="text-body-2">{{ getMtssDescription(student.mtssTier) }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card color="warning" dark class="pa-4">
          <v-card-title class="d-flex justify-space-between">
            <span>Credits</span>
            <v-icon>mdi-book-multiple</v-icon>
          </v-card-title>
          <v-card-text>
            <div class="text-h3 font-weight-bold">
              {{ student.creditsEarned }}/{{ student.creditsNeeded }}
            </div>
            <div class="text-body-2">For Graduation</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Main Content Tabs -->
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
            <v-tab value="behavior">
              <v-icon class="mr-2">mdi-account-check</v-icon>
              Behavior
            </v-tab>
            <v-tab value="support">
              <v-icon class="mr-2">mdi-heart</v-icon>
              Support Services
            </v-tab>
            <v-tab value="demographics">
              <v-icon class="mr-2">mdi-account-details</v-icon>
              Demographics
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <!-- Academics Tab -->
            <v-window-item value="academics">
              <v-container class="pa-6">
                <v-row>
                  <!-- Current Grades -->
                  <v-col cols="12" md="6">
                    <v-card outlined class="mb-4">
                      <v-card-title class="text-h5 primary white--text">
                        <v-icon class="mr-2">mdi-report-card</v-icon>
                        Current Grades
                      </v-card-title>
                      <v-card-text class="pa-0">
                        <v-list>
                          <v-list-item v-for="grade in student.currentGrades" :key="grade.subject">
                            <v-list-item-content>
                              <v-list-item-title>{{ grade.subject }}</v-list-item-title>
                              <v-list-item-subtitle>{{ grade.teacher }}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                              <v-chip :color="getGradeColor(grade.grade)" dark large>
                                {{ grade.grade }}
                              </v-chip>
                            </v-list-item-action>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Grade Trends Chart -->
                  <v-col cols="12" md="6">
                    <v-card outlined class="mb-4" style="height: 400px">
                      <v-card-title class="text-h5 success white--text">
                        <v-icon class="mr-2">mdi-chart-line</v-icon>
                        Grade Trends
                      </v-card-title>
                      <v-card-text style="height: 320px">
                        <Line :data="gradeTrendsData" :options="chartOptions" />
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Assignment Performance -->
                  <v-col cols="12">
                    <v-card outlined>
                      <v-card-title class="text-h5 info white--text">
                        <v-icon class="mr-2">mdi-assignment</v-icon>
                        Recent Assignments
                      </v-card-title>
                      <v-card-text>
                        <v-data-table
                          :headers="assignmentHeaders"
                          :items="student.recentAssignments"
                          :items-per-page="5"
                        >
                          <template v-slot:item.score="{ item }">
                            <v-chip :color="getScoreColor(item.score)" small>
                              {{ item.score }}%
                            </v-chip>
                          </template>
                          <template v-slot:item.status="{ item }">
                            <v-chip
                              :color="
                                item.status === 'Completed'
                                  ? 'success'
                                  : item.status === 'Late'
                                    ? 'warning'
                                    : 'error'
                              "
                              small
                            >
                              {{ item.status }}
                            </v-chip>
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>

            <!-- Assessments Tab -->
            <v-window-item value="assessments">
              <v-container class="pa-6">
                <v-row>
                  <!-- State Test Scores -->
                  <v-col cols="12" md="6">
                    <v-card outlined class="mb-4">
                      <v-card-title class="text-h5 purple white--text">
                        <v-icon class="mr-2">mdi-school</v-icon>
                        State Assessment Scores
                      </v-card-title>
                      <v-card-text>
                        <div
                          v-for="assessment in student.stateAssessments"
                          :key="assessment.subject"
                          class="mb-4"
                        >
                          <div class="d-flex justify-space-between align-center mb-2">
                            <h3>{{ assessment.subject }}</h3>
                            <v-chip :color="getProficiencyColor(assessment.proficiencyLevel)" dark>
                              {{ assessment.proficiencyLevel }}
                            </v-chip>
                          </div>
                          <v-progress-linear
                            :value="assessment.percentile"
                            :color="getProficiencyColor(assessment.proficiencyLevel)"
                            height="20"
                            rounded
                          >
                            <template v-slot:default>
                              <strong
                                >{{ assessment.score }} ({{ assessment.percentile }}th
                                percentile)</strong
                              >
                            </template>
                          </v-progress-linear>
                          <div class="text-caption mt-1">Test Date: {{ assessment.testDate }}</div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Local Assessments -->
                  <v-col cols="12" md="6">
                    <v-card outlined class="mb-4">
                      <v-card-title class="text-h5 teal white--text">
                        <v-icon class="mr-2">mdi-clipboard-check</v-icon>
                        Local Assessments
                      </v-card-title>
                      <v-card-text>
                        <v-list>
                          <v-list-item
                            v-for="assessment in student.localAssessments"
                            :key="assessment.id"
                          >
                            <v-list-item-content>
                              <v-list-item-title>{{ assessment.name }}</v-list-item-title>
                              <v-list-item-subtitle>{{ assessment.date }}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                              <v-chip :color="getScoreColor(assessment.score)" dark>
                                {{ assessment.score }}%
                              </v-chip>
                            </v-list-item-action>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Assessment History Chart -->
                  <v-col cols="12">
                    <v-card outlined style="height: 400px">
                      <v-card-title class="text-h5 deep-purple white--text">
                        <v-icon class="mr-2">mdi-chart-bar</v-icon>
                        Assessment Score History
                      </v-card-title>
                      <v-card-text style="height: 320px">
                        <Bar :data="assessmentHistoryData" :options="chartOptions" />
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>

            <!-- Behavior Tab -->
            <v-window-item value="behavior">
              <v-container class="pa-6">
                <v-row>
                  <!-- MTSS Information -->
                  <v-col cols="12" md="4">
                    <v-card outlined class="mb-4">
                      <v-card-title
                        class="text-h5"
                        :class="getMtssColor(student.mtssTier) + ' white--text'"
                      >
                        <v-icon class="mr-2">mdi-layers</v-icon>
                        MTSS Tier {{ student.mtssTier }}
                      </v-card-title>
                      <v-card-text>
                        <p class="mb-3">{{ getMtssDescription(student.mtssTier) }}</p>
                        <div class="mb-2">
                          <strong>Last Review:</strong> {{ student.mtssLastReview }}
                        </div>
                        <div class="mb-2">
                          <strong>Next Review:</strong> {{ student.mtssNextReview }}
                        </div>
                        <div class="mb-3">
                          <strong>Case Manager:</strong> {{ student.mtssCaseManager }}
                        </div>

                        <v-divider class="my-3"></v-divider>

                        <h4 class="mb-2">Current Interventions:</h4>
                        <v-chip-group column>
                          <v-chip
                            v-for="intervention in student.interventions"
                            :key="intervention"
                            small
                          >
                            {{ intervention }}
                          </v-chip>
                        </v-chip-group>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Behavior Incidents -->
                  <v-col cols="12" md="8">
                    <v-card outlined class="mb-4">
                      <v-card-title class="text-h5 warning white--text">
                        <v-icon class="mr-2">mdi-alert</v-icon>
                        Behavior Incidents
                      </v-card-title>
                      <v-card-text>
                        <v-data-table
                          :headers="behaviorHeaders"
                          :items="student.behaviorIncidents"
                          :items-per-page="5"
                        >
                          <template v-slot:item.severity="{ item }">
                            <v-chip
                              :color="
                                item.severity === 'High'
                                  ? 'error'
                                  : item.severity === 'Medium'
                                    ? 'warning'
                                    : 'success'
                              "
                              small
                            >
                              {{ item.severity }}
                            </v-chip>
                          </template>
                        </v-data-table>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Positive Behaviors -->
                  <v-col cols="12">
                    <v-card outlined>
                      <v-card-title class="text-h5 success white--text">
                        <v-icon class="mr-2">mdi-star</v-icon>
                        Positive Behaviors & Recognition
                      </v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col
                            v-for="recognition in student.positiveRecognition"
                            :key="recognition.id"
                            cols="12"
                            md="6"
                          >
                            <v-card outlined color="success lighten-5">
                              <v-card-text>
                                <div class="d-flex align-center mb-2">
                                  <v-icon color="success" class="mr-2">mdi-trophy</v-icon>
                                  <h4>{{ recognition.title }}</h4>
                                </div>
                                <p class="mb-2">{{ recognition.description }}</p>
                                <div class="text-caption">
                                  {{ recognition.date }} - {{ recognition.teacher }}
                                </div>
                              </v-card-text>
                            </v-card>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>

            <!-- Support Services Tab -->
            <v-window-item value="support">
              <v-container class="pa-6">
                <v-row>
                  <!-- Special Education Services -->
                  <v-col cols="12" md="6">
                    <v-card outlined class="mb-4">
                      <v-card-title class="text-h5 indigo white--text">
                        <v-icon class="mr-2">mdi-account-heart</v-icon>
                        Special Education Services
                      </v-card-title>
                      <v-card-text>
                        <div class="mb-3">
                          <strong>IEP Status:</strong>
                          <v-chip :color="student.iepStatus ? 'success' : 'grey'" class="ml-2">
                            {{ student.iepStatus ? 'Active' : 'Not Applicable' }}
                          </v-chip>
                        </div>
                        <div class="mb-3">
                          <strong>504 Plan:</strong>
                          <v-chip :color="student.plan504 ? 'success' : 'grey'" class="ml-2">
                            {{ student.plan504 ? 'Active' : 'Not Applicable' }}
                          </v-chip>
                        </div>

                        <div v-if="student.iepStatus" class="mt-4">
                          <h4 class="mb-2">IEP Details:</h4>
                          <div class="mb-2">
                            <strong>Primary Disability:</strong> {{ student.primaryDisability }}
                          </div>
                          <div class="mb-2"><strong>IEP Date:</strong> {{ student.iepDate }}</div>
                          <div class="mb-2">
                            <strong>Next Review:</strong> {{ student.iepNextReview }}
                          </div>

                          <h4 class="mb-2 mt-4">Related Services:</h4>
                          <v-chip-group column>
                            <v-chip
                              v-for="service in student.relatedServices"
                              :key="service"
                              small
                              color="indigo"
                              dark
                            >
                              {{ service }}
                            </v-chip>
                          </v-chip-group>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Additional Support Services -->
                  <v-col cols="12" md="6">
                    <v-card outlined class="mb-4">
                      <v-card-title class="text-h5 teal white--text">
                        <v-icon class="mr-2">mdi-hand-heart</v-icon>
                        Additional Support
                      </v-card-title>
                      <v-card-text>
                        <div class="mb-3">
                          <strong>ELL Status:</strong>
                          <v-chip :color="student.ellStatus ? 'info' : 'grey'" class="ml-2">
                            {{ student.ellStatus ? 'Active' : 'Not Applicable' }}
                          </v-chip>
                        </div>

                        <div class="mb-3">
                          <strong>Free/Reduced Lunch:</strong>
                          <v-chip
                            :color="student.freeReducedLunch ? 'warning' : 'grey'"
                            class="ml-2"
                          >
                            {{ student.freeReducedLunch ? 'Eligible' : 'Not Eligible' }}
                          </v-chip>
                        </div>

                        <div class="mb-3">
                          <strong>Transportation:</strong>
                          <v-chip :color="student.transportation ? 'primary' : 'grey'" class="ml-2">
                            {{ student.transportation ? 'Bus Provided' : 'Parent Transport' }}
                          </v-chip>
                        </div>

                        <h4 class="mb-2 mt-4">Support Team:</h4>
                        <v-list dense>
                          <v-list-item v-for="member in student.supportTeam" :key="member.role">
                            <v-list-item-content>
                              <v-list-item-title>{{ member.name }}</v-list-item-title>
                              <v-list-item-subtitle>{{ member.role }}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                              <v-btn icon small color="primary">
                                <v-icon>mdi-email</v-icon>
                              </v-btn>
                            </v-list-item-action>
                          </v-list-item>
                        </v-list>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>

            <!-- Demographics Tab -->
            <v-window-item value="demographics">
              <v-container class="pa-6">
                <v-row>
                  <!-- Basic Information -->
                  <v-col cols="12" md="6">
                    <v-card outlined class="mb-4">
                      <v-card-title class="text-h5 blue-grey white--text">
                        <v-icon class="mr-2">mdi-account-details</v-icon>
                        Personal Information
                      </v-card-title>
                      <v-card-text>
                        <v-simple-table>
                          <tbody>
                            <tr>
                              <td class="font-weight-bold">Date of Birth:</td>
                              <td>{{ student.dateOfBirth }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">Gender:</td>
                              <td>{{ student.gender }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">Ethnicity:</td>
                              <td>{{ student.ethnicity }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">Home Language:</td>
                              <td>{{ student.homeLanguage }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">Enrollment Date:</td>
                              <td>{{ student.enrollmentDate }}</td>
                            </tr>
                            <tr>
                              <td class="font-weight-bold">Years in District:</td>
                              <td>{{ student.yearsInDistrict }}</td>
                            </tr>
                          </tbody>
                        </v-simple-table>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Contact Information -->
                  <v-col cols="12" md="6">
                    <v-card outlined class="mb-4">
                      <v-card-title class="text-h5 green white--text">
                        <v-icon class="mr-2">mdi-contacts</v-icon>
                        Emergency Contacts
                      </v-card-title>
                      <v-card-text>
                        <div
                          v-for="contact in student.emergencyContacts"
                          :key="contact.id"
                          class="mb-4"
                        >
                          <div class="d-flex justify-space-between align-center mb-2">
                            <h4>{{ contact.name }}</h4>
                            <v-chip small>{{ contact.relationship }}</v-chip>
                          </div>
                          <div class="text-body-2 mb-1">
                            <v-icon small class="mr-1">mdi-phone</v-icon>
                            {{ contact.phone }}
                          </div>
                          <div class="text-body-2 mb-1">
                            <v-icon small class="mr-1">mdi-email</v-icon>
                            {{ contact.email }}
                          </div>
                          <div class="text-body-2">
                            <v-icon small class="mr-1">mdi-map-marker</v-icon>
                            {{ contact.address }}
                          </div>
                          <v-divider
                            v-if="contact.id !== student.emergencyContacts.length"
                            class="mt-3"
                          ></v-divider>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Medical Information -->
                  <v-col cols="12">
                    <v-card outlined>
                      <v-card-title class="text-h5 red white--text">
                        <v-icon class="mr-2">mdi-medical-bag</v-icon>
                        Medical Information
                      </v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col cols="12" md="6">
                            <h4 class="mb-2">Allergies:</h4>
                            <v-chip-group column>
                              <v-chip
                                v-for="allergy in student.allergies"
                                :key="allergy"
                                color="red"
                                dark
                                small
                              >
                                {{ allergy }}
                              </v-chip>
                              <v-chip v-if="student.allergies.length === 0" color="grey" small>
                                None reported
                              </v-chip>
                            </v-chip-group>
                          </v-col>
                          <v-col cols="12" md="6">
                            <h4 class="mb-2">Medications:</h4>
                            <v-list dense>
                              <v-list-item
                                v-for="medication in student.medications"
                                :key="medication.name"
                              >
                                <v-list-item-content>
                                  <v-list-item-title>{{ medication.name }}</v-list-item-title>
                                  <v-list-item-subtitle
                                    >{{ medication.dosage }} -
                                    {{ medication.frequency }}</v-list-item-subtitle
                                  >
                                </v-list-item-content>
                              </v-list-item>
                              <v-list-item v-if="student.medications.length === 0">
                                <v-list-item-content>
                                  <v-list-item-title class="grey--text"
                                    >None reported</v-list-item-title
                                  >
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Line, Bar } from 'vue-chartjs'

// Data interfaces
interface Student {
  firstName: string
  lastName: string
  studentId: string
  grade: number
  age: number
  school: string
  teacher: string
  counselor: string
  gpa: number
  attendanceRate: number
  mtssTier: number
  creditsEarned: number
  creditsNeeded: number
  currentGrades: any[]
  recentAssignments: any[]
  stateAssessments: any[]
  localAssessments: any[]
  behaviorIncidents: any[]
  positiveRecognition: any[]
  interventions: string[]
  mtssLastReview: string
  mtssNextReview: string
  mtssCaseManager: string
  iepStatus: boolean
  plan504: boolean
  primaryDisability: string
  iepDate: string
  iepNextReview: string
  relatedServices: string[]
  ellStatus: boolean
  freeReducedLunch: boolean
  transportation: boolean
  supportTeam: any[]
  dateOfBirth: string
  gender: string
  ethnicity: string
  homeLanguage: string
  enrollmentDate: string
  yearsInDistrict: number
  emergencyContacts: any[]
  allergies: string[]
  medications: any[]
}

// Reactive data
const activeTab = ref('academics')

const student = ref<Student>({
  firstName: 'Emma',
  lastName: 'Rodriguez',
  studentId: 'STU-2025-1247',
  grade: 8,
  age: 14,
  school: 'Roosevelt Middle School',
  teacher: 'Ms. Johnson',
  counselor: 'Mr. Thompson',
  gpa: 3.2,
  attendanceRate: 94.5,
  mtssTier: 2,
  creditsEarned: 18,
  creditsNeeded: 24,
  currentGrades: [
    { subject: 'Mathematics', grade: 'B+', teacher: 'Mr. Davis', letterGrade: 87 },
    { subject: 'English Language Arts', grade: 'A-', teacher: 'Ms. Wilson', letterGrade: 91 },
    { subject: 'Science', grade: 'B', teacher: 'Dr. Chen', letterGrade: 83 },
    { subject: 'Social Studies', grade: 'B+', teacher: 'Ms. Garcia', letterGrade: 88 },
    { subject: 'Physical Education', grade: 'A', teacher: 'Coach Martinez', letterGrade: 95 },
    { subject: 'Art', grade: 'A', teacher: 'Ms. Taylor', letterGrade: 93 },
  ],
  recentAssignments: [
    {
      assignment: 'Math Quiz Chapter 8',
      subject: 'Mathematics',
      dueDate: '2025-07-10',
      score: 85,
      status: 'Completed',
    },
    {
      assignment: 'Book Report - To Kill a Mockingbird',
      subject: 'English',
      dueDate: '2025-07-08',
      score: 92,
      status: 'Completed',
    },
    {
      assignment: 'Science Lab Report',
      subject: 'Science',
      dueDate: '2025-07-05',
      score: 78,
      status: 'Late',
    },
    {
      assignment: 'History Essay',
      subject: 'Social Studies',
      dueDate: '2025-07-03',
      score: 89,
      status: 'Completed',
    },
    {
      assignment: 'Art Project',
      subject: 'Art',
      dueDate: '2025-06-30',
      score: 95,
      status: 'Completed',
    },
  ],
  stateAssessments: [
    {
      subject: 'Mathematics',
      score: 325,
      percentile: 68,
      proficiencyLevel: 'Proficient',
      testDate: '2025-04-15',
    },
    {
      subject: 'English Language Arts',
      score: 342,
      percentile: 78,
      proficiencyLevel: 'Proficient',
      testDate: '2025-04-16',
    },
    {
      subject: 'Science',
      score: 318,
      percentile: 62,
      proficiencyLevel: 'Approaching Proficient',
      testDate: '2025-04-17',
    },
  ],
  localAssessments: [
    { id: 1, name: 'Fall Math Benchmark', score: 82, date: '2024-10-15' },
    { id: 2, name: 'Winter Reading Assessment', score: 88, date: '2025-01-22' },
    { id: 3, name: 'Spring Science Test', score: 75, date: '2025-05-10' },
  ],
  behaviorIncidents: [
    {
      date: '2025-06-15',
      incident: 'Disruption in Class',
      severity: 'Low',
      action: 'Verbal Warning',
      reportedBy: 'Ms. Wilson',
    },
    {
      date: '2025-05-20',
      incident: 'Tardiness',
      severity: 'Low',
      action: 'Parent Contact',
      reportedBy: 'Mr. Davis',
    },
    {
      date: '2025-04-10',
      incident: 'Incomplete Assignment',
      severity: 'Medium',
      action: 'Lunch Detention',
      reportedBy: 'Dr. Chen',
    },
  ],
  positiveRecognition: [
    {
      id: 1,
      title: 'Student of the Month',
      description: 'Recognized for academic improvement and positive attitude',
      date: '2025-06-30',
      teacher: 'Ms. Johnson',
    },
    {
      id: 2,
      title: 'Math Competition Winner',
      description: '1st place in school math competition',
      date: '2025-05-15',
      teacher: 'Mr. Davis',
    },
    {
      id: 3,
      title: 'Peer Helper Award',
      description: 'Outstanding peer tutoring in English class',
      date: '2025-04-20',
      teacher: 'Ms. Wilson',
    },
  ],
  interventions: [
    'Small Group Math Instruction',
    'Reading Comprehension Support',
    'Organization Skills Training',
  ],
  mtssLastReview: '2025-06-01',
  mtssNextReview: '2025-09-01',
  mtssCaseManager: 'Ms. Rodriguez',
  iepStatus: false,
  plan504: true,
  primaryDisability: 'ADHD',
  iepDate: 'N/A',
  iepNextReview: 'N/A',
  relatedServices: [],
  ellStatus: false,
  freeReducedLunch: true,
  transportation: true,
  supportTeam: [
    { name: 'Ms. Rodriguez', role: 'MTSS Coordinator' },
    { name: 'Mr. Thompson', role: 'School Counselor' },
    { name: 'Ms. Park', role: 'School Psychologist' },
    { name: 'Mrs. Adams', role: 'School Nurse' },
  ],
  dateOfBirth: '2010-08-15',
  gender: 'Female',
  ethnicity: 'Hispanic/Latino',
  homeLanguage: 'English',
  enrollmentDate: '2022-08-25',
  yearsInDistrict: 3,
  emergencyContacts: [
    {
      id: 1,
      name: 'Maria Rodriguez',
      relationship: 'Mother',
      phone: '(555) 123-4567',
      email: 'maria.rodriguez@email.com',
      address: '123 Oak Street, Riverside, CA 92501',
    },
    {
      id: 2,
      name: 'Carlos Rodriguez',
      relationship: 'Father',
      phone: '(555) 234-5678',
      email: 'carlos.rodriguez@email.com',
      address: '123 Oak Street, Riverside, CA 92501',
    },
    {
      id: 3,
      name: 'Ana Garcia',
      relationship: 'Grandmother',
      phone: '(555) 345-6789',
      email: 'ana.garcia@email.com',
      address: '456 Pine Avenue, Riverside, CA 92502',
    },
  ],
  allergies: ['Peanuts', 'Shellfish'],
  medications: [{ name: 'Adderall XR', dosage: '10mg', frequency: 'Once daily in morning' }],
})

// Chart data
const gradeTrendsData = ref({
  labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Mathematics',
      data: [75, 78, 82, 80, 83, 85, 87, 86, 88, 87],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.4,
    },
    {
      label: 'English',
      data: [85, 87, 89, 88, 90, 91, 92, 90, 93, 91],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.4,
    },
    {
      label: 'Science',
      data: [70, 72, 75, 73, 76, 78, 80, 82, 81, 83],
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      tension: 0.4,
    },
  ],
})

const assessmentHistoryData = ref({
  labels: ['Fall 2024', 'Winter 2025', 'Spring 2025'],
  datasets: [
    {
      label: 'Math Benchmark',
      data: [78, 82, 85],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
    {
      label: 'Reading Assessment',
      data: [85, 88, 90],
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
    },
    {
      label: 'Science Test',
      data: [72, 75, 78],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
    },
  },
})

// Table headers
const assignmentHeaders = ref([
  { title: 'Assignment', key: 'assignment', sortable: true },
  { title: 'Subject', key: 'subject', sortable: true },
  { title: 'Due Date', key: 'dueDate', sortable: true },
  { title: 'Score', key: 'score', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
])

const behaviorHeaders = ref([
  { title: 'Date', key: 'date', sortable: true },
  { title: 'Incident', key: 'incident', sortable: true },
  { title: 'Severity', key: 'severity', sortable: true },
  { title: 'Action Taken', key: 'action', sortable: true },
  { title: 'Reported By', key: 'reportedBy', sortable: true },
])

// Helper functions
const getGradeColor = (grade: string): string => {
  if (grade.startsWith('A')) return 'success'
  if (grade.startsWith('B')) return 'info'
  if (grade.startsWith('C')) return 'warning'
  return 'error'
}

const getScoreColor = (score: number): string => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'info'
  if (score >= 70) return 'warning'
  return 'error'
}

const getProficiencyColor = (level: string): string => {
  switch (level) {
    case 'Advanced':
      return 'success'
    case 'Proficient':
      return 'info'
    case 'Approaching Proficient':
      return 'warning'
    case 'Below Proficient':
      return 'error'
    default:
      return 'grey'
  }
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

const getMtssDescription = (tier: number): string => {
  switch (tier) {
    case 1:
      return 'Universal Support'
    case 2:
      return 'Targeted Intervention'
    case 3:
      return 'Intensive Intervention'
    default:
      return 'Not Assigned'
  }
}

const editStudent = (): void => {
  // Navigate to edit student page or open modal
  console.log('Edit student')
}

onMounted(() => {
  // Initialize any data loading
})
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}

.v-simple-table td {
  padding: 12px 16px !important;
}

.v-timeline-item {
  padding-bottom: 16px;
}
</style>
