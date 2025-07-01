<template>
  <v-container class="py-10">
    <v-card class="pa-6 elevation-3 rounded-xl">
      <v-card-title class="text-h5 mb-4">📊 Score Importer</v-card-title>

      <v-select
        v-model="selectedAssessmentId"
        :items="assessments"
        item-title="test_name"
        item-value="id"
        label="Select Assessment"
        outlined
        class="mb-4"
      />

      <v-file-input
        label="Upload CSV File (Scores)"
        accept=".csv"
        @change="handleScoreUpload"
        prepend-icon="mdi-upload"
        outlined
        dense
        class="mb-6"
      />

      <div v-if="parsedScores.length">
        <v-card class="mb-4 pa-4 elevation-1" color="blue-lighten-5">
          <v-card-title class="text-h6">Preview ({{ parsedScores.length }} Students)</v-card-title>
          <v-divider class="my-2" />
          <v-list>
            <v-list-item v-for="(row, index) in parsedScores" :key="index" class="px-0">
              <v-list-item-content>
                <strong>Student ID:</strong> {{ row.student_id }} —
                <span class="text-caption"
                  >Scores:
                  {{
                    Object.entries(row.answers)
                      .map(([q, val]) => `${q}: ${val}`)
                      .join(', ')
                  }}</span
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </div>

      <v-btn
        color="primary"
        :disabled="!selectedAssessmentId || parsedScores.length === 0"
        :loading="isSubmitting"
        @click="submitScores"
      >
        Submit Scores
      </v-btn>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Papa from 'papaparse'
import axios from 'axios'

interface ScoreRow {
  student_id: number
  answers: Record<string, string | number>
}

const selectedAssessmentId = ref<number | null>(null)
const parsedScores = ref<ScoreRow[]>([])
const isSubmitting = ref(false)

// Example static data; replace with API call if needed
const assessments = ref<any[]>([])

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/assessments/')
    console.log(response)
    assessments.value = response.data
  } catch (err) {
    console.error('Error fetching assessments:', err)
    alert('Error loading assessments.')
  } finally {
  }
})

const handleScoreUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.length) {
    const file = target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result as string

      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const cleaned: ScoreRow[] = results.data.map((row: any) => {
            const { student_id, ...rest } = row
            return {
              student_id: parseInt(student_id),
              answers: rest,
            }
          })
          parsedScores.value = cleaned
        },
      })
    }

    reader.readAsText(file)
  }
}

const submitScores = async () => {
  if (!selectedAssessmentId.value || parsedScores.value.length === 0) return
  isSubmitting.value = true
  try {
    await axios.post('http://localhost:3000/assessments/scores', {
      assessment_id: selectedAssessmentId.value,
      scores: parsedScores.value,
    })
    alert('Scores imported successfully!')
  } catch (err) {
    console.error(err)
    alert('Failed to import scores.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
