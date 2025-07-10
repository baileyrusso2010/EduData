<template>
  <v-container>
    <v-card class="pa-6" elevation="6">
      <h2 class="text-xl mb-4">Score Bands Editor</h2>

      <!-- Assessment Selection -->
      <v-select
        v-model="selectedAssessmentId"
        :items="assessments"
        item-title="test_name"
        item-value="id"
        label="Select Assessment"
        :loading="isLoading"
        :disabled="isLoading"
      ></v-select>

      <!-- Bands Form -->
      <div class="mt-6">
        <h3 class="text-lg mb-2">Bands</h3>
        <v-row v-for="(band, index) in bands" :key="index" align="center" class="mb-4">
          <v-col cols="12" md="2">
            <v-text-field v-model="band.label" label="Label" dense />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field v-model.number="band.min_score" label="Min" type="number" dense />
          </v-col>
          <v-col cols="12" md="2">
            <v-text-field v-model.number="band.max_score" label="Max" type="number" dense />
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field v-model="band.color_hex" label="Color Hex" dense placeholder="#FF0000" />
          </v-col>
          <v-col cols="12" md="1">
            <v-btn icon @click="removeBand(index)" color="red">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <v-btn @click="addBand" class="mb-4" variant="tonal" color="primary"> Add Band </v-btn>

        <v-btn
          :disabled="!selectedAssessmentId || !bands.length"
          color="success"
          @click="submitBands"
        >
          Save Bands
        </v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const assessments = ref<any[]>([])
const selectedAssessmentId = ref<number | null>(null)

const bands = ref([
  {
    label: '',
    min_score: 0,
    max_score: 0,
    color_hex: '',
  },
])

const isLoading = ref(false)

const fetchAssessments = async () => {
  isLoading.value = true
  try {
    const res = await axios.get('http://localhost:3000/assessments/')
    assessments.value = res.data
  } catch (err) {
    console.error('Error fetching assessments:', err)
  } finally {
    isLoading.value = false
  }
}

const addBand = () => {
  bands.value.push({
    label: '',
    min_score: 0,
    max_score: 0,
    color_hex: '',
  })
}

const removeBand = (index: number) => {
  bands.value.splice(index, 1)
}

const submitBands = async () => {
  try {
    console.log(bands.value)
    await axios.post('http://localhost:3000/assessments/score-bands', {
      assessment_id: selectedAssessmentId.value,
      bands: bands.value,
    })
    alert('Bands saved successfully!')
  } catch (err) {
    console.error('Error saving bands:', err)
    alert('Failed to save bands.')
  }
}

onMounted(async () => {
  await fetchAssessments()
})
</script>
