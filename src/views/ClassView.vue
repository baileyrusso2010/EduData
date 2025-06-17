<template>
  <v-container fluid class="mt-10">
    <!-- Top-Right Stats Box -->
    <div class="position-fixed bottom-0 right-0 ma-3" style="z-index: 5">
      <v-card class="pa-4 rounded-xl elevation-5" max-width="220">
        <div class="text-subtitle-2 text-grey-darken-1 mb-2 font-weight-medium">Summary</div>
        <div class="d-flex justify-space-between">
          <span class="font-weight-medium">Students:</span>
          <span class="font-weight-bold">{{ totalStudents }}</span>
        </div>
        <div class="d-flex justify-space-between mt-1">
          <span class="font-weight-medium">Completers:</span>
          <span class="font-weight-bold">{{ totalCompleters }}</span>
        </div>
      </v-card>
    </div>
    <!-- Row 1: Student Demographics -->
    <v-row>
      <v-col cols="12" class="text-center mb-6">
        <h2 class="text-h5 font-weight-bold">Student Demographics</h2>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col v-for="(card, index) in demographics" :key="index" cols="12" sm="6" md="3">
        <v-card elevation="4" class="pa-4 rounded-xl text-center">
          <v-card-title class="justify-center text-h6 font-weight-medium">
            {{ card.title }}
          </v-card-title>
          <v-card-text>
            <div class="text-h4 font-weight-bold">{{ card.count }}</div>
            <div class="text-subtitle-1 text-grey-darken-1">{{ card.percentage }}%</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Row 2: Endorsements -->
    <v-row class="mt-10">
      <v-col cols="12" class="text-center mb-6">
        <h2 class="text-h5 font-weight-bold">Student Endorsements</h2>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col v-for="(card, index) in endorsements" :key="index" cols="12" sm="6" md="3">
        <v-card elevation="2" class="pa-4 rounded-xl text-center bg-grey-lighten-4">
          <v-card-title class="justify-center text-h6 font-weight-medium">
            {{ card.title }}
          </v-card-title>
          <v-card-text>
            <div class="text-h4 font-weight-bold">{{ card.count }}</div>
            <div class="text-subtitle-2 text-grey-darken-1">{{ card.percentage }}%</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Row 1: Student Demographics -->
    <v-row>
      <v-col cols="12" class="text-center mb-6">
        <h2 class="text-h5 font-weight-bold">Student Demographics</h2>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col v-for="(card, index) in demographics" :key="index" cols="12" sm="6" md="3">
        <v-card elevation="4" class="pa-4 rounded-xl text-center">
          <v-card-title class="justify-center text-h6 font-weight-medium">
            {{ card.title }}
          </v-card-title>
          <v-card-text>
            <div class="text-h4 font-weight-bold">{{ card.count }}</div>
            <div class="text-subtitle-1 text-grey-darken-1">{{ card.percentage }}%</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Row 2: Endorsements -->
    <v-row class="mt-10">
      <v-col cols="12" class="text-center mb-6">
        <h2 class="text-h5 font-weight-bold">Student Endorsements</h2>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col v-for="(card, index) in endorsements" :key="index" cols="12" sm="6" md="3">
        <v-card elevation="2" class="pa-4 rounded-xl text-center bg-grey-lighten-4">
          <v-card-title class="justify-center text-h6 font-weight-medium">
            {{ card.title }}
          </v-card-title>
          <v-card-text>
            <div class="text-h4 font-weight-bold">{{ card.count }}</div>
            <div class="text-subtitle-2 text-grey-darken-1">{{ card.percentage }}%</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Section Title -->
    <v-row>
      <v-col cols="12" class="text-center mb-6">
        <h2 class="text-h5 font-weight-bold">Work-Based Learning (WBL)</h2>
      </v-col>
    </v-row>

    <!-- Highlighted Completion Card -->
    <v-row justify="center" class="mb-8">
      <v-col cols="12" md="8">
        <v-card elevation="6" class="pa-6 rounded-2xl bg-blue-lighten-5 text-center">
          <v-card-title class="text-h5 font-weight-bold text-blue-darken-2 mb-2">
            Completion of Required 54 Hours
          </v-card-title>
          <v-card-text>
            <div class="text-h3 font-weight-bold text-blue-darken-3">
              {{ wblCompletion.students }} Students
            </div>
            <div class="text-subtitle-1 text-blue-darken-1">
              {{ wblCompletion.percentage }}% of total students
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Activity Breakdown Table -->
    <v-row>
      <v-col cols="12" md="10" class="mx-auto">
        <v-card elevation="3" class="rounded-xl">
          <v-card-title class="text-h6 font-weight-medium pa-4">
            WBL Activity Breakdown
          </v-card-title>
          <v-data-table
            :headers="activityHeaders"
            :items="wblActivities"
            class="elevation-1"
            hide-default-footer
          >
            <template #item.percentage="{ item }"> {{ item.percentage }}% </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const totalStudents = 250
const totalCompleters = 185
const wblCompletion = {
  students: 185,
  percentage: 74,
}

const activityHeaders = [
  { title: 'Activity', value: 'activity' },
  { title: 'Students', value: 'students' },
  { title: 'Percentage', value: 'percentage' },
]

const wblActivities = [
  { activity: 'Internship', students: 60, percentage: 24 },
  { activity: 'Job Shadowing', students: 50, percentage: 20 },
  { activity: 'Worksite Tours', students: 40, percentage: 16 },
  { activity: 'Guest Speaker Events', students: 35, percentage: 14 },
]

const demographics = [
  { title: 'Male Students', count: 120, percentage: 48 },
  { title: 'Female Students', count: 130, percentage: 52 },
  { title: 'IEP Students', count: 30, percentage: 12 },
  { title: '504 Plan', count: 10, percentage: 4 },
]

const endorsements = [
  { title: 'Written', count: 90, percentage: 36 },
  { title: 'Performance', count: 70, percentage: 28 },
  { title: 'Portfolio', count: 50, percentage: 20 },
  { title: 'Tech Endorsement', count: 40, percentage: 16 },
]
</script>
