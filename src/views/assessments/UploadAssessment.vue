<template>
  <v-container class="pa-6">
    <v-card class="elevation-4 rounded-lg">
      <v-card-title class="text-h5 deep-purple white--text d-flex align-center pa-6">
        <v-icon class="mr-3" size="28">mdi-file-upload</v-icon>
        Upload Assessment Questions
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Assessment Dropdown -->
        <v-select
          v-model="selectedAssessmentId"
          :items="assessments"
          item-title="test_name"
          item-value="id"
          label="Select Assessment"
          :loading="isLoading"
          :disabled="isLoading"
          outlined
          prepend-inner-icon="mdi-clipboard-check"
          class="mb-4"
        />

        <!-- File Upload -->
        <v-file-input
          label="Upload CSV File (Questions)"
          accept=".csv"
          @change="handleQuestionsUpload"
          prepend-inner-icon="mdi-file-upload"
          outlined
          class="mb-6"
          hint="CSV format: question_num, text, subscore_type, category, etc."
          persistent-hint
        />

        <!-- Preview Section -->
        <div v-if="parsedQuestions.length > 0" class="mt-6">
          <v-card class="elevation-2 rounded-lg" color="grey-lighten-4">
            <v-card-title class="text-h6 pa-4">
              <v-icon class="mr-2" color="primary">mdi-eye</v-icon>
              Preview Questions ({{ parsedQuestions.length }} Total)
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-4">
              <v-list class="bg-transparent">
                <v-list-item
                  v-for="(q, index) in parsedQuestions.slice(0, 5)"
                  :key="index"
                  class="px-0 mb-3"
                  rounded
                >
                  <v-list-item-content>
                    <v-row>
                      <v-col cols="12">
                        <div class="d-flex align-center mb-2">
                          <v-chip color="primary" size="small" class="mr-2">
                            Q{{ q.question_num }}
                          </v-chip>
                          <span class="font-weight-medium">{{ q.text }}</span>
                        </div>
                        <div class="d-flex flex-wrap gap-2">
                          <v-chip
                            v-if="q.subscore_type"
                            color="blue-lighten-2"
                            size="small"
                            variant="outlined"
                          >
                            <v-icon start size="small">mdi-tag</v-icon>
                            Subscore: {{ q.subscore_type }}
                          </v-chip>
                          <v-chip
                            v-if="q.category"
                            color="green-lighten-2"
                            size="small"
                            variant="outlined"
                          >
                            <v-icon start size="small">mdi-folder</v-icon>
                            Category: {{ q.category }}
                          </v-chip>
                          <span
                            v-if="!q.subscore_type && !q.category"
                            class="text-caption text-grey"
                          >
                            No subscore or category assigned
                          </span>
                        </div>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="parsedQuestions.length > 5" class="text-center">
                  <v-list-item-content>
                    <div class="text-caption text-grey">
                      ... and {{ parsedQuestions.length - 5 }} more questions
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </div>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          color="deep-purple"
          size="large"
          :disabled="!selectedAssessmentId || parsedQuestions.length === 0"
          :loading="isSubmitting"
          @click="submitQuestions"
          class="px-8"
        >
          <v-icon class="mr-2">mdi-check-circle</v-icon>
          Upload Questions
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Papa from 'papaparse'
import axios from 'axios'
const assessments = ref<any[]>([])
const selectedAssessmentId = ref<number | null>(null)
const isSubmitting = ref(false)

const isLoading = ref(false)

// Fetch assessments
onMounted(async () => {
  isLoading.value = true
  try {
    const response = await axios.get('http://localhost:3000/assessments/')
    console.log(response)
    assessments.value = response.data
  } catch (err) {
    console.error('Error fetching assessments:', err)
    alert('Error loading assessments.')
  } finally {
    isLoading.value = false
  }
})

interface Question {
  question_num: number
  text: string
  subscore_type: string | null
  category: string | null
}

const parsedQuestions = ref<Question[]>([])

const handleQuestionsUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result as string

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const cleaned = results.data
            .map((row: any) => {
              if (!row.question_num || !row.text) return null

              return {
                question_num: parseInt(row.question_num),
                text: row.text.trim(),
                subscore_type: row.subscore_type?.trim() || null,
                category: row.category?.trim() || null,
              }
            })
            .filter(Boolean) as Question[] // Remove nulls and assert type
          parsedQuestions.value = cleaned
          console.log('Parsed Questions:', cleaned)
        },
        error: (err: any) => {
          console.error('CSV Parse Error:', err.message)
        },
      })
    }

    reader.readAsText(file)
  }
}
const submitQuestions = async () => {
  if (!selectedAssessmentId.value || parsedQuestions.value.length === 0) return
  isSubmitting.value = true
  try {
    const response = await axios.post('http://localhost:3000/assessments/createQuestions', {
      assessment_id: selectedAssessmentId.value,
      questions: parsedQuestions.value,
    })

    console.log('Import success:', response.data)
    alert('Questions imported successfully!')
    // Clear out contents after successful import
    parsedQuestions.value = []
    selectedAssessmentId.value = null
    // Optionally, reset file input (if needed, use a ref on v-file-input and reset its value)
  } catch (error: any) {
    console.error('Import failed:', error)
    alert('Error importing questions. Check console.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
