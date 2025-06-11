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
          @update:model-value="onTeacherSelect"
          class="mb-4"
        />

        <!-- Class Selection -->
        <v-select
          v-if="selectedTeacher"
          v-model="selectedClass"
          :items="filteredClasses"
          item-title="name"
          item-value="id"
          label="Select Class"
          @update:model-value="onClassSelect"
          class="mb-4"
        />

        <!-- Summary Cards -->
        <v-row v-if="selectedClass" class="mb-6">
          <v-col cols="12" sm="4">
            <v-card color="indigo-lighten-5" class="pa-4" outlined>
              <div class="text-subtitle-1 font-weight-medium">Avg Attendance</div>
              <div class="text-h5 mt-2">{{ avgAttendance.toFixed(1) }}%</div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card color="red-lighten-5" class="pa-4" outlined>
              <div class="text-subtitle-1 font-weight-medium">Behavior Incidents</div>
              <div class="text-h5 mt-2">
                {{ totalBehavior }}
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card color="deep-purple-lighten-5" class="pa-4" outlined>
              <div class="text-subtitle-1 font-weight-medium">IEP/504 Students</div>
              <div class="text-h5 mt-2">
                {{ totalIEP }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Students Display -->
        <div v-if="selectedClass">
          <div v-for="student in filteredStudents" :key="student.id" class="mb-4">
            <v-col cols="12">
              <v-sheet elevation="1" rounded class="pa-4">
                <v-row align="center" no-gutters>
                  <!-- Avatar -->
                  <v-col cols="auto" class="pr-4">
                    <v-avatar size="64">
                      <v-img :src="student.avatar" />
                    </v-avatar>
                  </v-col>

                  <!-- Name and Meta -->
                  <v-col cols="12" sm="3">
                    <div class="text-h6">{{ student.name }}</div>
                    <div class="text-caption">Student ID: {{ student.student_number }}</div>
                  </v-col>

                  <!-- Attendance -->
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

                  <!-- Behavior -->
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

                  <!-- IEP -->
                  <v-col cols="12" sm="2" class="text-center">
                    <div class="text-subtitle-2">504/IEP</div>
                    <v-chip :color="student.iep ? 'deep-purple' : 'grey'" text-color="white" small>
                      {{ student.iep ? 'Yes' : 'None' }}
                    </v-chip>
                  </v-col>

                  <!-- Profile -->
                  <v-col cols="12" sm="1" class="text-center">
                    <v-btn icon @click="viewProfile(student.id)">
                      <v-icon>mdi-account-arrow-right</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-sheet>
            </v-col>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'

const teachers = [
  { id: 1, name: 'Ms. Johnson' },
  { id: 2, name: 'Mr. Smith' },
]

const classes = [
  { id: 101, teacher_id: 1, name: 'Math - Period 1' },
  { id: 102, teacher_id: 1, name: 'Math - Period 3' },
  { id: 201, teacher_id: 2, name: 'Science - Period 2' },
]

const students = [
  {
    id: 1,
    name: 'Alice Brown',
    student_number: '1001',
    class_id: 101,
    behavior_count: 3,
    iep: 1,
    attendance: 100,
  },
  {
    id: 2,
    name: 'Bob Smith',
    student_number: '1002',
    class_id: 101,
    behavior_count: 1,
    attendance: 94,
  },
  {
    id: 3,
    name: 'Charlie Green',
    student_number: '1003',
    class_id: 102,
    behavior_count: 0,
    attendance: 76,
  },
  {
    id: 4,
    name: 'Dana White',
    student_number: '1004',
    class_id: 201,
    behavior_count: 0,
    attendance: 34,
  },
]

const selectedTeacher = ref(null)
const selectedClass = ref(null)

const filteredClasses = computed(() =>
  classes.filter((c) => c.teacher_id === selectedTeacher.value),
)

const filteredStudents = computed(() => students.filter((s) => s.class_id === selectedClass.value))

const avgAttendance = computed(() => {
  const relevant = filteredStudents.value
  if (!relevant.length) return 0
  return relevant.reduce((acc, s) => acc + s.attendance, 0) / relevant.length
})

const totalBehavior = computed(() =>
  filteredStudents.value.reduce((acc, s) => acc + s.behavior_count, 0),
)

const totalIEP = computed(() => filteredStudents.value.filter((s) => s.iep).length)

const onTeacherSelect = () => {
  selectedClass.value = null
}

const onClassSelect = () => {
  // No-op for now
}

const viewProfile = (id) => {
  // Navigate or emit event
  console.log(`Viewing profile for student ${id}`)
}
</script>
