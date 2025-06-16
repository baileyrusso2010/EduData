<template>
  <v-container fluid class="py-12 px-6">
    <v-card class="rounded-2xl pa-6" elevation="6" style="">
      <v-card-title class="text-h3 font-weight-bold mb-6">
        {{ teacher.name }}
      </v-card-title>
      <v-card-title class="text-h5 font-weight-bold mb-6">
        {{ teacher.totalStudents }} Students
      </v-card-title>

      <h1 style="text-align: left">Student Demographics</h1>
      <v-row dense>
        <v-col cols="12" sm="6" md="4" lg="3" v-for="(stat, key) in demographics" :key="key">
          <v-card class="pa-5 rounded-xl" elevation="2" color="grey-lighten-4">
            <div class="text-body-2 text-grey-darken-1 mb-2">{{ stat.label }}</div>
            <div class="d-flex justify-space-between align-center mb-1">
              <div class="text-h5 font-weight-bold">{{ stat.count }}</div>
              <div class="text-subtitle-2 text-primary font-weight-medium">{{ stat.percent }}%</div>
            </div>
            <v-progress-linear :model-value="stat.percent" color="primary" height="6" rounded />
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>

  <v-container fluid class="py-12 px-6">
    <v-card class="rounded-2xl pa-6" elevation="6" style="">
      <h1 style="text-align: left">Technical Assessments</h1>
      <v-row dense>
        <v-col cols="12" sm="6" md="4" lg="3" v-for="(stat, key) in technicalAssessment" :key="key">
          <v-card class="pa-5 rounded-xl" elevation="2" color="grey-lighten-4">
            <div class="text-body-2 text-grey-darken-1 mb-2">{{ stat.label }}</div>
            <div class="d-flex justify-space-between align-center mb-1">
              <div class="text-h5 font-weight-bold">{{ stat.count }}</div>
              <div class="text-subtitle-2 text-primary font-weight-medium">{{ stat.percent }}%</div>
            </div>
            <v-progress-linear :model-value="stat.percent" color="primary" height="6" rounded />
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
  <v-container fluid class="py-12 px-6">
    <v-card class="rounded-2xl pa-6" elevation="6">
      <h1 style="text-align: left">Program Completion & Activities</h1>
      <v-row dense>
        <!-- Completion Card -->
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-card class="pa-5 rounded-xl" elevation="2" color="light-green-lighten-4">
            <div class="text-body-2 text-grey-darken-1 mb-2">54-Hour Completion</div>
            <div class="d-flex justify-space-between align-center mb-1">
              <div class="text-h5 font-weight-bold">{{ completion.count }} Students</div>
              <div class="text-subtitle-2 text-success font-weight-medium">
                {{ completion.percent }}%
              </div>
            </div>
            <v-progress-linear
              :model-value="completion.percent"
              color="success"
              height="6"
              rounded
            />
          </v-card>
        </v-col>

        <!-- Activity Cards -->
        <v-col cols="12" sm="6" md="4" lg="3" v-for="(stat, key) in activities" :key="key">
          <v-card class="pa-5 rounded-xl" elevation="2" color="indigo-lighten-5">
            <div class="text-body-2 text-grey-darken-1 mb-2">{{ stat.label }}</div>
            <div class="d-flex justify-space-between align-center mb-1">
              <div class="text-h5 font-weight-bold">{{ stat.count }} Students</div>
              <div class="text-subtitle-2 text-primary font-weight-medium">{{ stat.percent }}%</div>
            </div>
            <v-progress-linear :model-value="stat.percent" color="primary" height="6" rounded />
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
const teacher = {
  name: 'Mr. Russo',
  totalStudents: 30,
}

const demographics = {
  male: { label: 'Male', count: 16, percent: Math.round((16 / 30) * 100) },
  female: { label: 'Female', count: 14, percent: Math.round((14 / 30) * 100) },
  iep: { label: 'IEP', count: 6, percent: Math.round((6 / 30) * 100) },
  plan504: { label: '504 Plan', count: 3, percent: Math.round((3 / 30) * 100) },
  econDis: {
    label: 'Econ. Disadvantaged',
    count: 10,
    percent: Math.round((10 / 30) * 100),
  },
}

const technicalAssessment = {
  written: { label: 'Written', count: 16, percent: Math.round((16 / 30) * 100) },
  performance: { label: 'Performance', count: 16, percent: Math.round((16 / 30) * 100) },
  portfolio: { label: 'Portfolio', count: 16, percent: Math.round((16 / 30) * 100) },
  techEndorsement: { label: 'Tech Endorsement', count: 16, percent: Math.round((16 / 30) * 100) },
}
const completion = {
  label: '54-Hour Completion',
  count: 22,
  percent: Math.round((22 / teacher.totalStudents) * 100),
}

const activities = {
  careerPrep: {
    label: 'Career Prep',
    count: 18,
    percent: Math.round((18 / teacher.totalStudents) * 100),
  },
  internships: {
    label: 'Internships',
    count: 12,
    percent: Math.round((12 / teacher.totalStudents) * 100),
  },
  certifications: {
    label: 'Certifications',
    count: 10,
    percent: Math.round((10 / teacher.totalStudents) * 100),
  },
}
</script>

<style scoped>
.text-grey-darken-1 {
  color: #424242;
}
</style>
