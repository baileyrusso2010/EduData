<template>
  <v-card>
    <v-tabs v-model="tab" align-tabs="center" color="deep-purple-accent-4">
      <v-tab :value="1">Create</v-tab>
      <v-tab :value="2">Scores</v-tab>
      <v-tab :value="3">Questions</v-tab>
      <v-tab :value="4">Bands</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :key="1" :value="1">
        <v-container fluid>
          <CreateAssessment />
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :key="2" :value="2">
        <v-container fluid>
          <ScoreImporter />
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :key="3" :value="3">
        <UploadAssessment />
      </v-tabs-window-item>
    </v-tabs-window>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item :key="4" :value="4">
        <v-container fluid>
          <BandEditor />
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CreateAssessment from './CreateAssessment.vue'
import ScoreImporter from './ScoreImporter.vue'
import UploadAssessment from './UploadAssessment.vue'
import BandEditor from './BandEditor.vue'

let tab = ref(null)
</script>
