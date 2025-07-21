<template>
  <v-container class="pa-6">
    <v-card class="elevation-4 rounded-lg">
      <v-card-title class="text-h5 deep-purple white--text d-flex align-center pa-6">
        <v-icon class="mr-3" size="28">mdi-chart-box</v-icon>
        Performance Band Editor
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Assessment Selection -->
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
          class="mb-6"
        />

        <!-- Bands Form -->
        <div v-if="selectedAssessmentId">
          <v-card class="elevation-2 rounded-lg mb-4" color="grey-lighten-5">
            <v-card-title class="text-h6 pa-4">
              <v-icon class="mr-2" color="primary">mdi-tune</v-icon>
              Configure Score Bands
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-4">
              <v-row v-for="(band, index) in bands" :key="index" class="mb-4 align-center">
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model="band.label"
                    label="Band Label"
                    outlined
                    dense
                    prepend-inner-icon="mdi-label"
                  />
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model.number="band.min_score"
                    label="Min Score"
                    type="number"
                    outlined
                    dense
                    prepend-inner-icon="mdi-arrow-down"
                  />
                </v-col>
                <v-col cols="12" md="2">
                  <v-text-field
                    v-model.number="band.max_score"
                    label="Max Score"
                    type="number"
                    outlined
                    dense
                    prepend-inner-icon="mdi-arrow-up"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    v-model="band.color_hex"
                    label="Color (Hex)"
                    outlined
                    dense
                    placeholder="#FF0000"
                    prepend-inner-icon="mdi-palette"
                  >
                    <template v-slot:append-inner>
                      <div
                        :style="{
                          backgroundColor: band.color_hex,
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                        }"
                        class="border"
                      ></div>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="2">
                  <v-btn
                    icon
                    color="error"
                    variant="outlined"
                    @click="removeBand(index)"
                    size="small"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
              </v-row>

              <v-btn
                @click="addBand"
                color="primary"
                variant="outlined"
                class="mb-4"
                prepend-icon="mdi-plus"
              >
                Add New Band
              </v-btn>
            </v-card-text>
          </v-card>
        </div>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer></v-spacer>
        <v-btn
          color="deep-purple"
          size="large"
          :disabled="!selectedAssessmentId || !bands.length"
          @click="submitBands"
          class="px-8"
        >
          <v-icon class="mr-2">mdi-check-circle</v-icon>
          Save Bands
        </v-btn>
      </v-card-actions>
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
