<template>
  <v-container class="py-10" style="max-width: 1400px">
    <v-card elevation="6" class="rounded-xl pa-8" mx-auto>
      <v-card-title class="text-h5 mb-4">
        <v-icon start icon="mdi-filter-variant" class="mr-2" />
        Student Filter Panel
      </v-card-title>

      <v-divider class="mb-6"></v-divider>

      <v-row dense align="center" class="mb-4">
        <!-- Grade -->
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="filters.grade"
            :items="grades"
            label="Grade"
            multiple
            clearable
            chips
            density="comfortable"
            variant="outlined"
            prepend-icon="mdi-school"
          />
        </v-col>

        <!-- Gender -->
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="filters.gender"
            :items="genders"
            label="Gender"
            clearable
            density="comfortable"
            variant="outlined"
            prepend-icon="mdi-gender-male-female"
          />
        </v-col>

        <!-- Ethnicity -->
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="filters.ethnicity"
            :items="ethnicities"
            label="Ethnicity"
            multiple
            clearable
            chips
            density="comfortable"
            variant="outlined"
            prepend-icon="mdi-account-group"
          />
        </v-col>
      </v-row>

      <v-divider class="my-6"></v-divider>

      <v-row dense>
        <!-- Poverty -->
        <v-col cols="12" sm="4">
          <v-checkbox
            v-model="filters.poverty"
            label="Poverty"
            density="comfortable"
            prepend-icon="mdi-currency-usd"
          />
        </v-col>

        <!-- IEP -->
        <v-col cols="12" sm="4">
          <v-checkbox
            v-model="filters.iep"
            label="IEP"
            density="comfortable"
            prepend-icon="mdi-school-outline"
          />
        </v-col>

        <!-- 504 Plan -->
        <v-col cols="12" sm="4">
          <v-checkbox
            v-model="filters['504']"
            label="504 Plan"
            density="comfortable"
            prepend-icon="mdi-clipboard-text"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-container>

  <Bar :data="data" />
  <div v-for="student in filteredStudents" :key="student.studentID" class="mb-4">
    <v-col cols="12">
      <v-sheet elevation="1" rounded class="pa-4">
        <v-row align="center" no-gutters>
          <!-- Avatar -->
          <v-col cols="auto" class="pr-4">
            <v-avatar size="64">
              <v-img :src="student.avatar || 'https://via.placeholder.com/64'" />
            </v-avatar>
          </v-col>

          <!-- Name and Meta -->
          <v-col cols="12" sm="3">
            <div class="text-h6">{{ student.firstName }} {{ student.lastName }}</div>
            <div class="text-caption">Student ID: {{ student.studentID }}</div>
          </v-col>

          <!-- Attendance -->
          <v-col cols="12" sm="2" class="text-center">
            <div class="text-subtitle-2">Attendance</div>
            <v-chip
              :color="student.attendanceRate >= 90 ? 'green' : 'orange'"
              text-color="white"
              small
            >
              {{ student.attendanceRate }}%
            </v-chip>
          </v-col>

          <!-- Behavior -->
          <v-col cols="12" sm="2" class="text-center">
            <div class="text-subtitle-2">Behavior</div>
            <v-chip
              :color="student.behaviorIncidents > 0 ? 'red' : 'blue-grey'"
              text-color="white"
              small
            >
              {{ student.behaviorIncidents }} incidents
            </v-chip>
          </v-col>

          <!-- IEP/504 -->
          <v-col cols="12" sm="2" class="text-center">
            <div class="text-subtitle-2">504/IEP</div>
            <v-chip
              :color="student.iep || student['504'] ? 'deep-purple' : 'grey'"
              text-color="white"
              small
            >
              {{ student.iep ? 'IEP' : student['504'] ? '504' : 'None' }}
            </v-chip>
          </v-col>

          <!-- Profile -->
          <v-col cols="12" sm="1" class="text-center">
            <v-btn icon @click="viewProfile(student.studentID)">
              <v-icon>mdi-account-arrow-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>
    </v-col>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import ChartRough from 'chartjs-plugin-rough'

ChartJS.register(ChartRough)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const filters = ref({
  grade: [],
  gender: null,
  ethnicity: [],
  poverty: false,
  iep: false,
  504: false,
})

const grades = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const genders = ['Male', 'Female', 'Non-Binary', 'Other']
const ethnicities = [
  'White',
  'Black',
  'Hispanic',
  'Asian',
  'South Asian',
  'Native American',
  'Pacific Islander',
  'Two or More Races',
]

const students = ref([
  {
    studentID: 'S001',
    firstName: 'Emma',
    lastName: 'Rodriguez',
    gradeLevel: 9,
    gender: 'Female',
    ethnicity: 'Hispanic',
    povertyStatus: 'Low-Income',
    iep: true,
    504: false,
    attendanceRate: 95.2,
    behaviorIncidents: 1,
    academicScore: 82,
    independence: 'Above',
    peerRelationship: 'Positive',
  },
  {
    studentID: 'S002',
    firstName: 'Liam',
    lastName: 'Chen',
    gradeLevel: 10,
    gender: 'Male',
    ethnicity: 'Asian',
    povertyStatus: 'Non-Low-Income',
    iep: false,
    504: true,
    attendanceRate: 88.7,
    behaviorIncidents: 3,
    academicScore: 78,
    independence: 'Average',
    peerRelationship: 'Neutral',
  },
  {
    studentID: 'S003',
    firstName: 'Ava',
    lastName: 'Johnson',
    gradeLevel: 11,
    gender: 'Female',
    ethnicity: 'White',
    povertyStatus: 'Low-Income',
    iep: true,
    504: false,
    attendanceRate: 92.1,
    behaviorIncidents: 0,
    academicScore: 90,
    independence: 'Above',
    peerRelationship: 'Positive',
  },
  {
    studentID: 'S004',
    firstName: 'Noah',
    lastName: 'Patel',
    gradeLevel: 12,
    gender: 'Male',
    ethnicity: 'South Asian',
    povertyStatus: 'Non-Low-Income',
    iep: false,
    504: false,
    attendanceRate: 96.5,
    behaviorIncidents: 2,
    academicScore: 85,
    independence: 'Average',
    peerRelationship: 'Positive',
  },
  {
    studentID: 'S005',
    firstName: 'Sophia',
    lastName: 'Martinez',
    gradeLevel: 9,
    gender: 'Female',
    ethnicity: 'Hispanic',
    povertyStatus: 'Low-Income',
    iep: true,
    504: true,
    attendanceRate: 90.3,
    behaviorIncidents: 4,
    academicScore: 75,
    independence: 'Below',
    peerRelationship: 'Neutral',
  },
  {
    studentID: 'S006',
    firstName: 'Jackson',
    lastName: 'Brown',
    gradeLevel: 10,
    gender: 'Male',
    ethnicity: 'Black',
    povertyStatus: 'Low-Income',
    iep: false,
    504: true,
    attendanceRate: 87.9,
    behaviorIncidents: 5,
    academicScore: 70,
    independence: 'Below',
    peerRelationship: 'Negative',
  },
  {
    studentID: 'S007',
    firstName: 'Isabella',
    lastName: 'Nguyen',
    gradeLevel: 11,
    gender: 'Female',
    ethnicity: 'Asian',
    povertyStatus: 'Non-Low-Income',
    iep: false,
    504: false,
    attendanceRate: 98.0,
    behaviorIncidents: 0,
    academicScore: 92,
    independence: 'Above',
    peerRelationship: 'Positive',
  },
  {
    studentID: 'S008',
    firstName: 'Oliver',
    lastName: 'Davis',
    gradeLevel: 12,
    gender: 'Male',
    ethnicity: 'White',
    povertyStatus: 'Low-Income',
    iep: true,
    504: false,
    attendanceRate: 91.4,
    behaviorIncidents: 2,
    academicScore: 80,
    independence: 'Average',
    peerRelationship: 'Neutral',
  },
  {
    studentID: 'S009',
    firstName: 'Mia',
    lastName: 'Garcia',
    gradeLevel: 9,
    gender: 'Female',
    ethnicity: 'Hispanic',
    povertyStatus: 'Low-Income',
    iep: false,
    504: true,
    attendanceRate: 89.6,
    behaviorIncidents: 3,
    academicScore: 77,
    independence: 'Below',
    peerRelationship: 'Neutral',
  },
  {
    studentID: 'S010',
    firstName: 'Elijah',
    lastName: 'Wilson',
    gradeLevel: 10,
    gender: 'Male',
    ethnicity: 'Black',
    povertyStatus: 'Non-Low-Income',
    iep: true,
    504: false,
    attendanceRate: 94.8,
    behaviorIncidents: 1,
    academicScore: 83,
    independence: 'Above',
    peerRelationship: 'Positive',
  },
  {
    studentID: 'S011',
    firstName: 'Charlotte',
    lastName: 'Lee',
    gradeLevel: 11,
    gender: 'Female',
    ethnicity: 'Asian',
    povertyStatus: 'Low-Income',
    iep: false,
    504: false,
    attendanceRate: 93.2,
    behaviorIncidents: 0,
    academicScore: 88,
    independence: 'Average',
    peerRelationship: 'Positive',
  },
  {
    studentID: 'S012',
    firstName: 'Lucas',
    lastName: 'Taylor',
    gradeLevel: 12,
    gender: 'Male',
    ethnicity: 'White',
    povertyStatus: 'Non-Low-Income',
    iep: true,
    504: true,
    attendanceRate: 90.1,
    behaviorIncidents: 2,
    academicScore: 79,
    independence: 'Below',
    peerRelationship: 'Neutral',
  },
  {
    studentID: 'S013',
    firstName: 'Amelia',
    lastName: 'Hernandez',
    gradeLevel: 9,
    gender: 'Female',
    ethnicity: 'Hispanic',
    povertyStatus: 'Low-Income',
    iep: false,
    504: false,
    attendanceRate: 92.7,
    behaviorIncidents: 1,
    academicScore: 84,
    independence: 'Above',
    peerRelationship: 'Positive',
  },
  {
    studentID: 'S014',
    firstName: 'Henry',
    lastName: 'Moore',
    gradeLevel: 10,
    gender: 'Male',
    ethnicity: 'Black',
    povertyStatus: 'Low-Income',
    iep: true,
    504: false,
    attendanceRate: 86.5,
    behaviorIncidents: 4,
    academicScore: 73,
    independence: 'Below',
    peerRelationship: 'Negative',
  },
  {
    studentID: 'S015',
    firstName: 'Harper',
    lastName: 'Kim',
    gradeLevel: 11,
    gender: 'Female',
    ethnicity: 'Asian',
    povertyStatus: 'Non-Low-Income',
    iep: false,
    504: true,
    attendanceRate: 97.3,
    behaviorIncidents: 0,
    academicScore: 91,
    independence: 'Above',
    peerRelationship: 'Positive',
  },
  {
    studentID: 'S016',
    firstName: 'Alexander',
    lastName: 'Clark',
    gradeLevel: 12,
    gender: 'Male',
    ethnicity: 'White',
    povertyStatus: 'Low-Income',
    iep: true,
    504: false,
    attendanceRate: 89.9,
    behaviorIncidents: 3,
    academicScore: 76,
    independence: 'Average',
    peerRelationship: 'Neutral',
  },
  {
    studentID: 'S017',
    firstName: 'Evelyn',
    lastName: 'Lopez',
    gradeLevel: 9,
    gender: 'Female',
    ethnicity: 'Hispanic',
    povertyStatus: 'Low-Income',
    iep: false,
    504: true,
    attendanceRate: 91.8,
    behaviorIncidents: 2,
    academicScore: 80,
    independence: 'Below',
    peerRelationship: 'Neutral',
  },
  {
    studentID: 'S018',
    firstName: 'James',
    lastName: 'Walker',
    gradeLevel: 10,
    gender: 'Male',
    ethnicity: 'Black',
    povertyStatus: 'Non-Low-Income',
    iep: true,
    504: false,
    attendanceRate: 93.5,
    behaviorIncidents: 1,
    academicScore: 85,
    independence: 'Above',
    peerRelationship: 'Positive',
  },
  {
    studentID: 'S019',
    firstName: 'Aria',
    lastName: 'Young',
    gradeLevel: 11,
    gender: 'Female',
    ethnicity: 'White',
    povertyStatus: 'Low-Income',
    iep: false,
    504: false,
    attendanceRate: 94.1,
    behaviorIncidents: 0,
    academicScore: 89,
    independence: 'Average',
    peerRelationship: 'Positive',
  },
])

const filteredStudents = ref(students.value)

const data = ref({
  labels: grades,
  datasets: [
    {
      label: 'Number of Students',
      data: [],
      backgroundColor: 'rgba(255, 159, 64, 0.2)',
      borderColor: 'rgb(255, 159, 64)',
      borderWidth: 1,
    },
  ],
})

const filterStudents = () => {
  let result = students.value

  // Filter by grade
  if (filters.value.grade.length > 0) {
    result = result.filter((student) => {
      const studentGrade = student.gradeLevel === 0 ? 'K' : String(student.gradeLevel)
      return filters.value.grade.includes(studentGrade)
    })
  }

  // Filter by gender
  if (filters.value.gender) {
    result = result.filter((student) => student.gender === filters.value.gender)
  }

  // Filter by ethnicity
  if (filters.value.ethnicity.length > 0) {
    result = result.filter((student) => filters.value.ethnicity.includes(student.ethnicity))
  }

  // Filter by poverty
  if (filters.value.poverty) {
    result = result.filter((student) => student.povertyStatus === 'Low-Income')
  }

  // Filter by IEP
  if (filters.value.iep) {
    result = result.filter((student) => student.iep === true)
  }

  // Filter by 504
  if (filters.value['504']) {
    result = result.filter((student) => student['504'] === true)
  }

  filteredStudents.value = result

  // Update chart data
  const gradeCount = grades.map((grade) => {
    const numericGrade = grade === 'K' ? 0 : parseInt(grade)
    return result.filter((student) => student.gradeLevel === numericGrade).length
  })

  data.value = {
    labels: grades,
    datasets: [
      {
        label: 'Number of Students',
        data: gradeCount,
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgb(255, 159, 64)',
        borderWidth: 1,
      },
    ],
  }
}

const viewProfile = (studentID) => {
  console.log(`View profile for student ID: ${studentID}`)
  // Implement navigation or modal logic here
}

onMounted(() => {
  filterStudents()
})

watch(
  filters,
  () => {
    filterStudents()
  },
  { deep: true },
)
</script>
