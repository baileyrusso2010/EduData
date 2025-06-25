<template>
  <v-container class="py-10">
    <v-select
      v-model="selectedAssessmentId"
      :items="assessments"
      item-title="test_name"
      item-value="id"
      label="Select Assessment"
      :loading="isLoading"
      :disabled="isLoading"
    ></v-select>

    <v-file-input
      v-model="selectedFile"
      label="Upload CSV File"
      accept=".csv"
      class="mt-4"
      prepend-icon="mdi-upload"
      :disabled="!selectedAssessmentId"
    />

    <v-btn
      class="mt-4"
      color="primary"
      @click="submitToServer"
      :disabled="!parsedResults.length || !selectedAssessmentId"
    >
      Submit to Server
    </v-btn>

    <v-card class="mt-6" v-if="parsedResults.length">
      <v-card-title>Parsed Preview (First Record)</v-card-title>
      <v-card-text>
        <pre>{{ JSON.stringify(parsedResults[0], null, 2) }}</pre>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import Papa from 'papaparse'

// State
const isLoading = ref(false)
const assessments = ref<any[]>([])
const selectedAssessmentId = ref<number | null>(null)
const selectedFile = ref<File | null>(null)
const parsedResults = ref<any[]>([])

// Fetch assessments
onMounted(async () => {
  isLoading.value = true
  try {
    const response = await axios.get('http://localhost:3000/assessments/')
    assessments.value = response.data
  } catch (err) {
    console.error('Error fetching assessments:', err)
    alert('Error loading assessments.')
  } finally {
    isLoading.value = false
  }
})

// Watch for file upload and parse
watch(selectedFile, (file) => {
  if (!file) return

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {
      const rawRows = result.data as any[]
      parsedResults.value = formatStandardCsv(rawRows)
      console.log('Formatted Results:', parsedResults.value)
    },
  })
})

// Format CSV rows based on standardized template
interface Question {
  question_id: string
  question: string | null
  score: number | null
  max_score: number | null
}

function formatStandardCsv(rows: any[]) {
  const formatted = []

  for (const row of rows) {
    const person_id = row.personId || row.person_id || row.ID
    const final_score = row.final || row.final_score
    const result_data = []

    for (const key of Object.keys(row)) {
      const match = key.match(/^Q(\d+)(_points|_max)?$/i)
      if (match) {
        const qNum = match[1]
        const suffix = match[2] || ''
        const qId = `q${qNum}`

        let question: Question | undefined = result_data.find((q) => q.question_id === qId)
        if (!question) {
          question = { question_id: qId, question: null, score: null, max_score: null }
          result_data.push(question)
        }

        if (!suffix) question!.question = row[key]
        else if (suffix === '_points') question!.score = parseFloat(row[key])
        else if (suffix === '_max') question!.max_score = parseFloat(row[key])
      }
    }

    formatted.push({ person_id, final_score, result_data })
  }

  return formatted
}

// Submit to backend
async function submitToServer() {
  if (!selectedAssessmentId.value) return

  try {
    const payload = {
      assessment_id: selectedAssessmentId.value,
      results: parsedResults.value,
    }

    let result = await axios.post('http://localhost:3000/assessments/upload', payload)
    console.log(result)
    alert('Results submitted successfully!')
  } catch (err) {
    console.error('Submission failed:', err)
    alert('Submission failed.')
  }
}
</script>
