<template>
  <v-container class="pa-6">
    <v-card class="elevation-4 rounded-lg">
      <v-card-title class="text-h5 deep-purple white--text d-flex align-center pa-6">
        <v-icon class="mr-3" size="28">mdi-plus-circle</v-icon>
        Create New Assessment
      </v-card-title>

      <v-card-text class="pa-6">
        <v-form @submit.prevent="createAssessment">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="assessmentName"
                label="Assessment Name"
                :rules="[(v) => !!v || 'Assessment Name is required']"
                required
                outlined
                prepend-inner-icon="mdi-file-document-edit"
                class="mb-3"
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
                prepend-inner-icon="mdi-format-list-bulleted-type"
                class="mb-3"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-card outlined class="pa-4 mb-3">
                <v-row align="center">
                  <v-col cols="auto">
                    <v-icon color="primary">mdi-star-check</v-icon>
                  </v-col>
                  <v-col>
                    <div class="text-subtitle-1 font-weight-medium">Standardized Assessment</div>
                    <div class="text-caption text-grey">
                      Mark this assessment as a standardized test
                    </div>
                  </v-col>
                  <v-col cols="auto">
                    <v-switch v-model="standard" color="primary" inset></v-switch>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          type="submit"
          color="deep-purple"
          size="large"
          :disabled="isLoading || !assessmentName || !assessmentType"
          :loading="isLoading"
          @click="createAssessment"
          class="px-8"
        >
          <v-icon class="mr-2">mdi-check-circle</v-icon>
          Create Assessment
        </v-btn>
      </v-card-actions>
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
