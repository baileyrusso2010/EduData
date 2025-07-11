<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 mb-6">
          <v-icon class="mr-3">mdi-update</v-icon>
          Updates & Release Notes
        </h1>
      </v-col>
    </v-row>

    <!-- Recent Updates Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-title class="text-h4 primary white--text">
            <v-icon class="mr-2">mdi-history</v-icon>
            Recent Updates
          </v-card-title>
          <v-card-text class="pa-0">
            <v-timeline dense>
              <v-timeline-item
                v-for="update in recentUpdates"
                :key="update.id"
                :color="
                  update.type === 'major' ? 'primary' : update.type === 'minor' ? 'success' : 'info'
                "
                small
              >
                <template v-slot:icon>
                  <v-icon>{{ getUpdateIcon(update.type) }}</v-icon>
                </template>

                <v-card outlined>
                  <v-card-title class="text-h6">
                    {{ update.title }}
                    <v-chip
                      :color="
                        update.type === 'major'
                          ? 'primary'
                          : update.type === 'minor'
                            ? 'success'
                            : 'info'
                      "
                      small
                      class="ml-2"
                    >
                      v{{ update.version }}
                    </v-chip>
                  </v-card-title>
                  <v-card-subtitle>{{ formatDate(update.date) }}</v-card-subtitle>
                  <v-card-text>
                    <p class="mb-3">{{ update.description }}</p>

                    <div v-if="update.features.length > 0" class="mb-3">
                      <h4 class="text-h6 mb-2">
                        <v-icon class="mr-1" color="success">mdi-plus-circle</v-icon>
                        New Features
                      </h4>
                      <v-list dense>
                        <v-list-item v-for="feature in update.features" :key="feature">
                          <v-list-item-icon>
                            <v-icon small color="success">mdi-check</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>{{ feature }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>

                    <div v-if="update.improvements.length > 0" class="mb-3">
                      <h4 class="text-h6 mb-2">
                        <v-icon class="mr-1" color="info">mdi-trending-up</v-icon>
                        Improvements
                      </h4>
                      <v-list dense>
                        <v-list-item v-for="improvement in update.improvements" :key="improvement">
                          <v-list-item-icon>
                            <v-icon small color="info">mdi-arrow-up</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>{{ improvement }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>

                    <div v-if="update.bugFixes.length > 0">
                      <h4 class="text-h6 mb-2">
                        <v-icon class="mr-1" color="warning">mdi-bug-check</v-icon>
                        Bug Fixes
                      </h4>
                      <v-list dense>
                        <v-list-item v-for="fix in update.bugFixes" :key="fix">
                          <v-list-item-icon>
                            <v-icon small color="warning">mdi-wrench</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title>{{ fix }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Upcoming Features Section -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="text-h4 purple white--text">
            <v-icon class="mr-2">mdi-rocket-launch</v-icon>
            Upcoming Features
          </v-card-title>
          <v-card-text class="pa-4">
            <p class="text-h6 mb-4">What's coming next? Here's what we're working on:</p>

            <v-row>
              <v-col v-for="feature in upcomingFeatures" :key="feature.id" cols="12" md="6" lg="4">
                <v-card outlined class="h-100">
                  <v-card-title class="text-h6">
                    <v-icon
                      :color="
                        feature.priority === 'high'
                          ? 'red'
                          : feature.priority === 'medium'
                            ? 'orange'
                            : 'green'
                      "
                      class="mr-2"
                    >
                      {{ getFeatureIcon(feature.category) }}
                    </v-icon>
                    {{ feature.title }}
                  </v-card-title>
                  <v-card-subtitle>
                    <v-chip
                      :color="
                        feature.priority === 'high'
                          ? 'red'
                          : feature.priority === 'medium'
                            ? 'orange'
                            : 'green'
                      "
                      small
                      outlined
                    >
                      {{ feature.priority }} priority
                    </v-chip>
                    <v-chip small outlined class="ml-2">{{ feature.category }}</v-chip>
                  </v-card-subtitle>
                  <v-card-text>
                    <p>{{ feature.description }}</p>

                    <div v-if="feature.details.length > 0" class="mt-3">
                      <h5 class="mb-2">Key Features:</h5>
                      <v-list dense>
                        <v-list-item v-for="detail in feature.details" :key="detail">
                          <v-list-item-icon>
                            <v-icon small>mdi-circle-small</v-icon>
                          </v-list-item-icon>
                          <v-list-item-content>
                            <v-list-item-title class="text-body-2">{{ detail }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-progress-linear
                      :value="feature.progress"
                      :color="
                        feature.priority === 'high'
                          ? 'red'
                          : feature.priority === 'medium'
                            ? 'orange'
                            : 'green'
                      "
                      height="6"
                      rounded
                    ></v-progress-linear>
                    <span class="text-caption ml-2">{{ feature.progress }}%</span>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <v-alert type="info" class="mt-6">
              <v-icon class="mr-2">mdi-information</v-icon>
              <strong>Note:</strong> Feature priorities and timelines may change based on user
              feedback and technical considerations. We appreciate your patience as we continue to
              improve EduData!
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Feedback Section -->
    <v-row>
      <v-col cols="12">
        <v-card class="mt-6">
          <v-card-title class="text-h5 success white--text">
            <v-icon class="mr-2">mdi-comment-text</v-icon>
            Share Your Feedback
          </v-card-title>
          <v-card-text class="pa-4">
            <p class="mb-4">
              Have ideas for new features or suggestions for improvements? We'd love to hear from
              you!
            </p>

            <v-row>
              <v-col cols="12" md="4">
                <v-btn color="primary" block large>
                  <v-icon class="mr-2">mdi-lightbulb</v-icon>
                  Request Feature
                </v-btn>
              </v-col>
              <v-col cols="12" md="4">
                <v-btn color="info" block large>
                  <v-icon class="mr-2">mdi-bug</v-icon>
                  Report Bug
                </v-btn>
              </v-col>
              <v-col cols="12" md="4">
                <v-btn color="success" block large>
                  <v-icon class="mr-2">mdi-star</v-icon>
                  General Feedback
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Update {
  id: number
  title: string
  version: string
  date: string
  type: 'major' | 'minor' | 'patch'
  description: string
  features: string[]
  improvements: string[]
  bugFixes: string[]
}

interface UpcomingFeature {
  id: number
  title: string
  description: string
  category: 'analytics' | 'ui' | 'integration' | 'performance' | 'security'
  priority: 'high' | 'medium' | 'low'
  progress: number
  details: string[]
}

const recentUpdates = ref<Update[]>([
  {
    id: 1,
    title: 'Enhanced Student Analytics',
    version: '2.1.0',
    date: '2025-07-08',
    type: 'major',
    description:
      'Major update introducing advanced student analytics and improved data visualization capabilities.',
    features: [
      'Interactive student performance dashboards',
      'Advanced filtering and search capabilities',
      'New chart types for data visualization',
      'Export functionality for reports',
    ],
    improvements: [
      'Faster loading times for large datasets',
      'Improved mobile responsiveness',
      'Enhanced user interface design',
    ],
    bugFixes: [
      'Fixed issue with date picker not displaying selected dates',
      'Resolved chart rendering problems on Safari',
      'Fixed file upload validation errors',
    ],
  },
  {
    id: 2,
    title: 'Assessment Management System',
    version: '2.0.5',
    date: '2025-07-01',
    type: 'minor',
    description: 'New assessment creation and management tools for educators.',
    features: [
      'Create custom assessments',
      'Upload assessment data from CSV/Excel',
      'Assessment scoring and grading tools',
      'Performance band configuration',
    ],
    improvements: ['Streamlined assessment workflow', 'Better error handling for file uploads'],
    bugFixes: ['Fixed assessment date validation', 'Resolved score calculation errors'],
  },
  {
    id: 3,
    title: 'Navigation and UI Improvements',
    version: '2.0.3',
    date: '2025-06-24',
    type: 'patch',
    description: 'Minor improvements to navigation and user interface components.',
    features: [],
    improvements: [
      'Updated navigation drawer design',
      'Improved icon consistency',
      'Better color scheme and typography',
    ],
    bugFixes: [
      'Fixed navigation drawer toggle issues',
      'Resolved responsive design problems on tablets',
      'Fixed tooltip positioning',
    ],
  },
  {
    id: 4,
    title: 'Data Security Enhancement',
    version: '2.0.1',
    date: '2025-06-15',
    type: 'patch',
    description: 'Security updates and data protection improvements.',
    features: [],
    improvements: [
      'Enhanced data encryption',
      'Improved user authentication',
      'Better session management',
    ],
    bugFixes: ['Fixed session timeout issues', 'Resolved data export security vulnerabilities'],
  },
])

const upcomingFeatures = ref<UpcomingFeature[]>([
  {
    id: 1,
    title: 'AI-Powered Insights',
    description:
      'Machine learning algorithms to provide predictive analytics and personalized recommendations for student interventions.',
    category: 'analytics',
    priority: 'high',
    progress: 75,
    details: [
      'Predictive risk modeling',
      'Automated intervention suggestions',
      'Trend analysis and forecasting',
      'Personalized learning recommendations',
    ],
  },
  {
    id: 2,
    title: 'Real-time Collaboration',
    description:
      'Enable real-time collaboration between teachers, administrators, and support staff with live data sharing.',
    category: 'ui',
    priority: 'medium',
    progress: 45,
    details: [
      'Live data synchronization',
      'Collaborative note-taking',
      'Shared dashboard views',
      'Real-time notifications',
    ],
  },
  {
    id: 3,
    title: 'Mobile Application',
    description:
      'Native mobile app for iOS and Android with offline capabilities and push notifications.',
    category: 'ui',
    priority: 'high',
    progress: 60,
    details: [
      'Native iOS and Android apps',
      'Offline data access',
      'Push notifications',
      'Mobile-optimized interface',
    ],
  },
  {
    id: 4,
    title: 'Advanced Integrations',
    description:
      'Connect with popular education platforms and student information systems for seamless data flow.',
    category: 'integration',
    priority: 'medium',
    progress: 30,
    details: [
      'SIS integration (PowerSchool, Infinite Campus)',
      'Google Classroom integration',
      'Microsoft Teams integration',
      'Canvas LMS integration',
    ],
  },
  {
    id: 5,
    title: 'Enhanced Performance',
    description:
      'Significant performance improvements for handling larger datasets and faster processing.',
    category: 'performance',
    priority: 'high',
    progress: 85,
    details: [
      'Database optimization',
      'Caching improvements',
      'Faster chart rendering',
      'Reduced memory usage',
    ],
  },
  {
    id: 6,
    title: 'Advanced Security Features',
    description:
      'Enhanced security measures including SSO, role-based permissions, and audit trails.',
    category: 'security',
    priority: 'medium',
    progress: 20,
    details: [
      'Single Sign-On (SSO)',
      'Granular role-based permissions',
      'Comprehensive audit trails',
      'Two-factor authentication',
    ],
  },
])

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getUpdateIcon = (type: string): string => {
  switch (type) {
    case 'major':
      return 'mdi-star'
    case 'minor':
      return 'mdi-plus-circle'
    case 'patch':
      return 'mdi-wrench'
    default:
      return 'mdi-update'
  }
}

const getFeatureIcon = (category: string): string => {
  switch (category) {
    case 'analytics':
      return 'mdi-chart-line'
    case 'ui':
      return 'mdi-palette'
    case 'integration':
      return 'mdi-connection'
    case 'performance':
      return 'mdi-speedometer'
    case 'security':
      return 'mdi-shield-check'
    default:
      return 'mdi-feature-search'
  }
}
</script>

<style scoped>
.v-timeline-item {
  padding-bottom: 24px;
}

.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}

.h-100 {
  height: 100%;
}
</style>
