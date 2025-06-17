<template>
  <v-sheet rounded="lg">
    <v-form @submit.prevent>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="assessmentName" label="Assessment Name" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-switch v-model="standard" label="Standard"></v-switch>
          </v-col>
          <v-col cols="12">
            <v-btn type="submit" color="primary" @click="createAssessment">
              <v-progress-circular
                v-if="isLoading"
                indeterminate
                color="primary"
              ></v-progress-circular>
              <span v-else>Create Assessment</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-sheet>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import axios from 'axios'

let isLoading = false
let assessmentName = ref('')
let standard = ref(false)

async function createAssessment() {
  isLoading = true

  try {
    await axios.post('http://localhost:3000/assessments/create', {
      test_name: assessmentName.value.replace(/[^a-zA-Z0-9 ]/g, ''),
      standardized: standard.value,
    })

    alert('Assessment created successfully!')
  } catch (e) {
    console.log(e)

    alert('Was not created')
  } finally {
    isLoading = false
  }
}
</script>
