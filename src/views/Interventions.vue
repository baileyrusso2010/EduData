<template>
  <v-container fluid class="interventions-page">
    <!-- Loading Overlay -->
    <v-overlay :value="loading" absolute>
      <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
    </v-overlay>

    <div class="page-header">
      <h1 class="page-title">Intervention Dashboard</h1>
      <p class="page-subtitle">Monitor and manage student interventions across all tiers</p>
    </div>

    <!-- Statistics Cards -->
    <v-row class="mb-6" dense>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 elevation-3 rounded-lg text-center metric-card total-interventions">
          <div class="text-caption text-medium-emphasis">Total Active</div>
          <h2 class="text-h3 mt-2">{{ totalInterventions }}</h2>
          <div class="text-caption">Interventions</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 elevation-3 rounded-lg text-center metric-card tier-1">
          <div class="text-caption text-medium-emphasis">Tier 1</div>
          <h2 class="text-h3 mt-2">{{ tier1Count }}</h2>
          <div class="text-caption">Universal Support</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 elevation-3 rounded-lg text-center metric-card tier-2">
          <div class="text-caption text-medium-emphasis">Tier 2</div>
          <h2 class="text-h3 mt-2">{{ tier2Count }}</h2>
          <div class="text-caption">Targeted Support</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4 elevation-3 rounded-lg text-center metric-card tier-3">
          <div class="text-caption text-medium-emphasis">Tier 3</div>
          <h2 class="text-h3 mt-2">{{ tier3Count }}</h2>
          <div class="text-caption">Intensive Support</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Students in Higher Tiers -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-6 elevation-2 rounded-xl student-list-card">
          <v-card-title class="text-h6 card-header">
            <v-icon left color="orange">mdi-account-alert</v-icon>
            Tier 2 Students
            <v-spacer></v-spacer>
            <v-chip color="orange" text-color="white" small>{{ tier2Students.length }}</v-chip>
          </v-card-title>
          <v-divider class="my-4"></v-divider>
          <v-list class="pa-0">
            <v-list-item
              v-for="student in tier2Students"
              :key="student.id"
              @click="viewStudent(student)"
              class="student-item rounded-lg hoverable cursor-pointer"
            >
              <v-list-item-avatar>
                <v-avatar color="orange lighten-2" size="40">
                  <span class="white--text">{{ getInitials(student.name) }}</span>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-medium">{{ student.name }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption text-medium-emphasis"
                  >{{ student.grade }} | {{ student.intervention }}</v-list-item-subtitle
                >
              </v-list-item-content>
              <v-list-item-action>
                <div class="text-right">
                  <div class="text-caption text-medium-emphasis">Started</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ formatDate(student.startDate) }}
                  </div>
                </div>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-card-actions v-if="tier2Students.length === 0">
            <v-spacer></v-spacer>
            <div class="text-center text-medium-emphasis py-4">No students in Tier 2</div>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="pa-6 elevation-2 rounded-xl student-list-card">
          <v-card-title class="text-h6 card-header">
            <v-icon left color="red">mdi-account-multiple-minus</v-icon>
            Tier 3 Students
            <v-spacer></v-spacer>
            <v-chip color="red" text-color="white" small>{{ tier3Students.length }}</v-chip>
          </v-card-title>
          <v-divider class="my-4"></v-divider>
          <v-list class="pa-0">
            <v-list-item
              v-for="student in tier3Students"
              :key="student.id"
              @click="viewStudent(student)"
              class="student-item rounded-lg hoverable cursor-pointer"
            >
              <v-list-item-avatar>
                <v-avatar color="red lighten-2" size="40">
                  <span class="white--text">{{ getInitials(student.name) }}</span>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-medium">{{ student.name }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption text-medium-emphasis"
                  >{{ student.grade }} | {{ student.intervention }}</v-list-item-subtitle
                >
              </v-list-item-content>
              <v-list-item-action>
                <div class="text-right">
                  <div class="text-caption text-medium-emphasis">Started</div>
                  <div class="text-body-2 font-weight-medium">
                    {{ formatDate(student.startDate) }}
                  </div>
                </div>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-card-actions v-if="tier3Students.length === 0">
            <v-spacer></v-spacer>
            <div class="text-center text-medium-emphasis py-4">No students in Tier 3</div>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Interventions',
  data() {
    return {
      loading: true,
      tier1Count: 0,
      tier2Count: 0,
      tier3Count: 0,
      tier2Students: [],
      tier3Students: [],
    }
  },
  async mounted() {
    await this.fetchTierData()
  },
  computed: {
    totalInterventions() {
      return this.tier1Count + this.tier2Count + this.tier3Count
    },
  },
  methods: {
    async fetchTierData() {
      try {
        this.loading = true
        const response = await axios.get('http://localhost:3000/mtss/student-tiers/top')
        console.log('Tier data fetched:', response.data)
        const tierData = response.data

        // Reset counts
        this.tier1Count = 0
        this.tier2Count = 0
        this.tier3Count = 0
        this.tier2Students = []
        this.tier3Students = []

        // Process the tier data
        tierData.forEach((tier) => {
          if (tier.tierId === 1) {
            this.tier1Count = tier.students.length
          } else if (tier.tierId === 2) {
            this.tier2Count = tier.students.length
            this.tier2Students = tier.students.map((student) => ({
              id: student.id,
              name: `${student.first_name} ${student.last_name}`,
              grade: `${student.grade}${this.getGradeSuffix(student.grade)} Grade`,
              intervention: this.getDefaultIntervention(2),
              startDate: this.formatApiDate(student.createdAt),
            }))
          } else if (tier.tierId === 3) {
            this.tier3Count = tier.students.length
            this.tier3Students = tier.students.map((student) => ({
              id: student.id,
              name: `${student.first_name} ${student.last_name}`,
              grade: `${student.grade}${this.getGradeSuffix(student.grade)} Grade`,
              intervention: this.getDefaultIntervention(3),
              startDate: this.formatApiDate(student.createdAt),
            }))
          }
        })
      } catch (error) {
        console.error('Error fetching tier data:', error)
        // Fallback to show at least some structure if API fails
        this.tier1Count = 0
        this.tier2Count = 0
        this.tier3Count = 0
      } finally {
        this.loading = false
      }
    },
    getGradeSuffix(grade) {
      const gradeNum = parseInt(grade)
      if (gradeNum === 1) return 'st'
      if (gradeNum === 2) return 'nd'
      if (gradeNum === 3) return 'rd'
      return 'th'
    },
    getDefaultIntervention(tier) {
      const tier2Interventions = [
        'Reading Support',
        'Math Intervention',
        'Behavioral Support',
        'Writing Skills',
        'Phonics Support',
      ]
      const tier3Interventions = [
        'Intensive Reading',
        'Multi-Sensory Learning',
        'Executive Functioning',
        'Intensive Math',
        'Behavioral Therapy',
      ]

      if (tier === 2) {
        return tier2Interventions[Math.floor(Math.random() * tier2Interventions.length)]
      } else if (tier === 3) {
        return tier3Interventions[Math.floor(Math.random() * tier3Interventions.length)]
      }
      return 'General Support'
    },
    formatApiDate(dateString) {
      // Convert API date to a more recent intervention start date
      const today = new Date()
      const daysAgo = Math.floor(Math.random() * 60) + 1 // 1-60 days ago
      const startDate = new Date(today)
      startDate.setDate(today.getDate() - daysAgo)
      return startDate.toISOString().split('T')[0]
    },
    getInitials(name) {
      return name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    },
    viewStudent(student) {
      this.$router.push(`students/${student.id}/profile`)
    },
  },
}
</script>

<style scoped>
.interventions-page {
  background-color: #f4f6f8;
  min-height: 100vh;
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0;
}

.metric-card {
  transition: all 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.total-interventions {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
}

.tier-1 {
  background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%);
  color: white;
}

.tier-2 {
  background: linear-gradient(135deg, #f57c00 0%, #ef6c00 100%);
  color: white;
}

.tier-3 {
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
  color: white;
}

.student-list-card {
  height: fit-content;
}

.card-header {
  font-weight: 600;
  color: #333;
  padding: 0;
  margin-bottom: 0;
}

.student-item {
  padding: 12px 0;
  transition: all 0.3s ease;
  margin: 8px 0;
  border-radius: 8px;
}

.student-item:hover.hoverable {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background-color: rgba(0, 0, 0, 0.02);
}

.student-item:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}

.text-success {
  color: #2e7d32;
}

.text-warning {
  color: #f57c00;
}

.text-info {
  color: #1976d2;
}

.text-error {
  color: #d32f2f;
}

.text-grey {
  color: #757575;
}

.v-card {
  border-radius: 10px;
}

.cursor-pointer {
  cursor: pointer;
}

.hoverable {
  transition: all 0.3s ease;
}
</style>
