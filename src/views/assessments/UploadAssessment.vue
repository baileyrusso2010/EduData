<template>
  <v-container class="py-10">
    <v-card class="pa-6 elevation-3 rounded-xl">
      <v-card-title class="text-h5 mb-4">📥 Question Importer</v-card-title>

      <!-- Assessment Dropdown -->
      <v-select
        v-model="selectedAssessmentId"
        :items="assessments"
        item-title="test_name"
        item-value="id"
        label="Select Assessment"
        :loading="isLoading"
        :disabled="isLoading"
        class="mb-4"
        outlined
      />

      <!-- File Upload -->
      <v-file-input
        label="Upload CSV File"
        accept=".csv"
        @change="handleQuestionsUpload"
        prepend-icon="mdi-upload"
        outlined
        dense
        class="mb-6"
      />

      <!-- Preview Section -->
      <div v-if="parsedQuestions.length > 0">
        <v-card class="mb-4 pa-4 elevation-1" color="grey-lighten-4">
          <v-card-title class="text-h6"
            >Preview ({{ parsedQuestions.length }} Questions)</v-card-title
          >
          <v-divider class="my-2" />
          <v-list>
            <v-list-item v-for="(q, index) in parsedQuestions" :key="index" class="px-0">
              <v-list-item-content>
                <strong>Q{{ q.question_num }}:</strong> {{ q.text }}
                <div class="mt-1">
                  <v-chip v-if="q.subscore_type" color="blue lighten-4" class="mr-2" label small>
                    Subscore: {{ q.subscore_type }}
                  </v-chip>
                  <v-chip v-if="q.category" color="green lighten-4" label small>
                    Category: {{ q.category }}
                  </v-chip>
                  <span v-if="!q.subscore_type && !q.category" class="text-caption text-grey">
                    No subscore or category
                  </span>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </div>

      <!-- Submit Button -->
      <v-btn
        :loading="isSubmitting"
        :disabled="!selectedAssessmentId || parsedQuestions.length === 0"
        color="primary"
        class="mt-2"
        @click="submitQuestions"
      >
        Submit Questions
      </v-btn>
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
