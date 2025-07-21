<template>
  <v-container class="pa-6">
    <v-card class="elevation-4 rounded-lg">
      <v-card-title class="text-h5 deep-purple white--text d-flex align-center pa-6">
        <v-icon class="mr-3" size="28">mdi-upload</v-icon>
        Import Assessment Scores
      </v-card-title>

      <v-card-text class="pa-6">
        <v-select
          v-model="selectedAssessmentId"
          :items="assessments"
          item-title="test_name"
          item-value="id"
          label="Select Assessment"
          outlined
          prepend-inner-icon="mdi-clipboard-check"
          class="mb-4"
        />

        <v-file-input
          label="Upload CSV File (Student Scores)"
          accept=".csv"
          @change="handleScoreUpload"
          prepend-inner-icon="mdi-file-upload"
          outlined
          class="mb-6"
          hint="CSV format: student_id, question_1, question_2, ..."
          persistent-hint
        />

        <div v-if="parsedScores.length" class="mt-6">
          <v-card class="elevation-2 rounded-lg" color="blue-lighten-5">
            <v-card-title class="text-h6 pa-4">
              <v-icon class="mr-2" color="primary">mdi-eye</v-icon>
              Preview Data ({{ parsedScores.length }} Students)
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-4">
              <v-list class="bg-transparent">
                <v-list-item
                  v-for="(row, index) in parsedScores.slice(0, 5)"
                  :key="index"
                  class="px-0 mb-2"
                  rounded
                >
                  <v-list-item-content>
                    <v-row align="center">
                      <v-col cols="3">
                        <v-chip color="primary" size="small">
                          <v-icon start size="small">mdi-account</v-icon>
                          {{ row.student_id }}
                        </v-chip>
                      </v-col>
                      <v-col cols="9">
                        <div class="text-caption">
                          Scores:
                          {{
                            Object.entries(row.answers)
                              .map(([q, val]) => `${q}: ${val}`)
                              .join(', ')
                          }}
                        </div>
                      </v-col>
                    </v-row>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="parsedScores.length > 5" class="text-center">
                  <v-list-item-content>
                    <div class="text-caption text-grey">
                      ... and {{ parsedScores.length - 5 }} more students
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
          :disabled="!selectedAssessmentId || parsedScores.length === 0"
          :loading="isSubmitting"
          @click="submitScores"
          class="px-8"
        >
          <v-icon class="mr-2">mdi-check-circle</v-icon>
          Import Scores
        </v-btn>
      </v-card-actions>
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
            const { student_id, total_score, ...answers } = row

            return {
              student_id: parseInt(student_id),
              answers,
              final_scores: total_score
                ? [
                    {
                      score_type: 'total',
                      score_value: total_score,
                    },
                  ]
                : [],
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
    const results = await axios.post('http://localhost:3000/assessments/scores', {
      assessment_id: selectedAssessmentId.value,
      scores: parsedScores.value,
    })
    alert('Scores imported successfully!')
    console.log(results)
  } catch (err) {
    console.error(err)
    alert('Failed to import scores.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
