<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 80vh">
    <v-card elevation="8" max-width="500" class="pa-6">
      <v-card-title class="text-h5 font-weight-bold mb-4"> Create Assessment </v-card-title>
      <v-form @submit.prevent="createAssessment">
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              v-model="assessmentName"
              label="Assessment Name"
              :rules="[(v) => !!v || 'Assessment Name is required']"
              required
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="assessmentType"
              :items="assessmentTypes"
              label="Assessment Type"
              :rules="[(v) => !!v || 'Assessment Type is required']"
              required
              outlined
              dense
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-switch v-model="standard" label="Standard" inset></v-switch>
          </v-col>
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              type="submit"
              color="primary"
              :disabled="isLoading || !assessmentName || !assessmentType"
              class="px-6"
              large
            >
              <v-progress-circular
                v-if="isLoading"
                indeterminate
                color="white"
                size="20"
                class="mr-2"
              ></v-progress-circular>
              <span v-else>Create Assessment</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'

let isLoading = false
let assessmentName = ref('')
let standard = ref(false)
let assessmentType = ref('')
let assessmentTypes = ref(['Quiz', 'Test', 'Exam', 'Project'])

async function createAssessment() {
  isLoading = true

  try {
    await axios.post('http://localhost:3000/assessments/create', {
      test_name: assessmentName.value.replace(/[^a-zA-Z0-9 ]/g, ''),
      standardized: standard.value,
      assessment_type: assessmentType.value,
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
