<template>
  <v-container>
    <v-card class="pa-6" elevation="3">
      <v-card-title>Class Search</v-card-title>
      <v-card-text>
        <!-- Teacher Selection -->
        <v-select
          v-model="selectedTeacher"
          :items="teachers"
          item-title="name"
          item-value="id"
          label="Select Teacher"
          @update:model-value="fetchClasses"
          class="mb-4"
        />

        <!-- Class Selection -->
        <v-select
          v-if="selectedTeacher"
          v-model="selectedClass"
          :items="classes"
          item-title="name"
          item-value="id"
          label="Select Class"
          @update:model-value="fetchStudents"
          class="mb-6"
        />

        <!-- Summary Cards -->
        <v-row v-if="students.length">
          <v-col cols="12" sm="4">
            <v-card class="pa-4" color="indigo-lighten-5" outlined>
              <div class="text-subtitle-1 font-weight-medium">Avg Attendance</div>
              <div class="text-h5 mt-2">{{ avgAttendance.toFixed(1) }}%</div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="pa-4" color="red-lighten-5" outlined>
              <div class="text-subtitle-1 font-weight-medium">Behavior Incidents</div>
              <div class="text-h5 mt-2">{{ totalBehavior }}</div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="pa-4" color="deep-purple-lighten-5" outlined>
              <div class="text-subtitle-1 font-weight-medium">IEP/504 Students</div>
              <div class="text-h5 mt-2">{{ totalIEP }}</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Students Display -->
        <v-row v-if="students.length" class="mt-4">
          <v-col cols="12" v-for="student in students" :key="student.id">
            <v-sheet elevation="1" rounded class="pa-4">
              <v-row align="center" no-gutters>
                <v-col cols="auto" class="pr-4">
                  <v-avatar size="64">
                    <v-img :src="student.avatar || 'https://via.placeholder.com/64'" />
                  </v-avatar>
                </v-col>

                <v-col cols="12" sm="3">
                  <div class="text-h6">
                    {{ student.student.first_name }} {{ student.student.last_name }}
                  </div>
                  <div class="text-caption">ID: {{ student.student.student_number }}</div>
                </v-col>

                <v-col cols="12" sm="2" class="text-center">
                  <div class="text-subtitle-2">Attendance</div>
                  <v-chip
                    :color="student.attendance >= 90 ? 'green' : 'orange'"
                    text-color="white"
                    small
                  >
                    {{ student.attendance }}%
                  </v-chip>
                </v-col>

                <v-col cols="12" sm="2" class="text-center">
                  <div class="text-subtitle-2">Behavior</div>
                  <v-chip
                    :color="student.behavior_count > 0 ? 'red' : 'blue-grey'"
                    text-color="white"
                    small
                  >
                    {{ student.behavior_count }} incidents
                  </v-chip>
                </v-col>

                <v-col cols="12" sm="2" class="text-center">
                  <div class="text-subtitle-2">504/IEP</div>
                  <v-chip :color="student.iep ? 'deep-purple' : 'grey'" text-color="white" small>
                    {{ student.iep ? 'Yes' : 'None' }}
                  </v-chip>
                </v-col>

                <v-col cols="12" sm="1" class="text-center">
                  <v-btn icon @click="viewProfile(student.student.id)">
                    <v-icon>mdi-account-arrow-right</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const teachers = ref([])
const classes = ref([])
const students = ref([])

const selectedTeacher = ref(null)
const selectedClass = ref(null)

const fetchTeachers = async () => {
  try {
    const res = await axios.get('http://localhost:3000/teacher/')
    teachers.value = res.data
  } catch (err) {
    console.error('Error fetching teachers:', err)
  }
}

const fetchClasses = async (teacherId) => {
  try {
    selectedClass.value = null
    classes.value = []
    students.value = []

    const res = await axios.get(`http://localhost:3000/teacher/courses/${teacherId}`)
    // Assuming response contains the full teacher object with `sections`
    classes.value = res.data.sections.map((s) => ({
      id: s.sectionID,
      name: `${s.course.course_name} - ${s.section} (${s.period}, ${s.term})`,
    }))
  } catch (err) {
    console.error('Error fetching classes:', err)
  }
}

const fetchStudents = async (classId) => {
  try {
    students.value = []
    const res = await axios.get(`http://localhost:3000/teacher/students/${classId}`)
    students.value = res.data
  } catch (err) {
    console.error('Error fetching students:', err)
  }
}

const avgAttendance = computed(() => {
  if (!students.value.length) return 0
  return students.value.reduce((sum, s) => sum + s.attendance, 0) / students.value.length
})

const totalBehavior = computed(() => students.value.reduce((sum, s) => sum + s.behavior_count, 0))

const totalIEP = computed(() => students.value.filter((s) => s.iep).length)

import { useRouter } from 'vue-router'

const router = useRouter()

const viewProfile = (studentId) => {
  console.log(studentId)
  router.push({ name: 'profile', params: { id: studentId } })
  // Optional: use router to navigate
}

onMounted(fetchTeachers)
</script>
