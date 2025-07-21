<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <h1 class="text-h4 text-center mb-4 font-weight-light">Student Search</h1>
        <p class="text-body-1 text-center text-medium-emphasis mb-8">
          Find any student by typing their name or student ID below.
        </p>

        <v-text-field
          v-model="search"
          label="Search by name or ID..."
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          clearable
          autofocus
          :loading="loading"
          density="comfortable"
          class="mx-auto"
        />
      </v-col>
    </v-row>

    <!-- Results Section -->
    <v-row v-if="search && !loading">
      <v-col v-if="students.length === 0" class="text-center mt-8">
        <v-icon size="64" color="grey-lighten-1">mdi-account-search-outline</v-icon>
        <p class="text-h6 mt-4">No students found</p>
        <p class="text-medium-emphasis">Try a different name or ID.</p>
      </v-col>

      <v-col v-for="student in students" :key="student.id" cols="12" sm="6" md="4">
        <v-card class="student-card" hover @click="selectStudent(student)">
          <v-card-text class="d-flex align-center pa-4">
            <v-avatar color="primary" class="me-4">
              <span class="white--text text-h6">{{
                getInitials(student.first_name, student.last_name)
              }}</span>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">
                {{ student.first_name }} {{ student.last_name }}
              </div>
              <div class="text-body-2 text-medium-emphasis">ID: {{ student.student_number }}</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Initial State Prompt -->
    <v-row v-if="!search && !loading" justify="center">
      <v-col cols="12" class="text-center mt-12">
        <v-icon size="64" color="grey-lighten-1">mdi-magnify-scan</v-icon>
        <p class="text-h6 mt-4 font-weight-regular">Start typing to find a student</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../../services/api'

const search = ref('')
const students = ref([])
const loading = ref(false)
const router = useRouter()
let debounceTimer = null

watch(search, (newVal) => {
  loading.value = true
  clearTimeout(debounceTimer)

  if (!newVal) {
    students.value = []
    loading.value = false
    return
  }

  debounceTimer = setTimeout(async () => {
    try {
      const response = await api.get(`student/search?search=${newVal}`)
      students.value = response.data
    } catch (error) {
      console.error('Error fetching students:', error)
      students.value = []
    } finally {
      loading.value = false
    }
  }, 300) // 300ms debounce delay
})

const selectStudent = (student) => {
  router.push(`/students/${student.id}/profile`)
}

const getInitials = (firstName, lastName) => {
  if (!firstName || !lastName) return '?'
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}
</script>

<style scoped>
.student-card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  cursor: pointer;
  border-radius: 8px;
}

.student-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}
</style>
