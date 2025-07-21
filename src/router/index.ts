import { createRouter, createWebHistory } from 'vue-router'
// Student views
import Profile from '../views/student/Profile.vue'
import StudentInterventions from '../views/student/StudentInterventions.vue'
import StudentJeopardy from '../views/student/StudentJeopardy.vue'
import StudentProfile from '../views/student/StudentProfile.vue'
import StudentSearch from '../views/student/StudentSearch.vue'
// Class views
import ClassView from '../views/class/ClassView.vue'
// Admin views
import DataIngest from '../views/admin/DataIngest.vue'
// Assessment views
import AssessmentHome from '../views/assessments/AssessmentHome.vue'
import BandEditor from '../views/assessments/BandEditor.vue'
// Dashboard/meta views
import HomePage from '../views/dashboards/HomePage.vue'
import ExecutiveDashboard from '../views/dashboards/ExecutiveDashboard.vue'
import Support from '../views/meta/Support.vue'
import Updates from '../views/meta/Updates.vue'
import PageNotFound from '../views/PageNotFound.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/dashboard', component: ExecutiveDashboard },
  // Student
  { path: '/students', component: StudentSearch },
  { path: '/students/:id', name: 'student-profile', component: StudentProfile, props: true },
  { path: '/students/:id/profile', component: Profile, props: true },
  { path: '/students/:id/interventions', component: StudentInterventions, props: true },
  { path: '/students/jeopardy', component: StudentJeopardy },
  // Class
  { path: '/classes/:id', component: ClassView, props: true },
  // Assessments
  { path: '/assessments', component: AssessmentHome },
  { path: '/assessments/bands', component: BandEditor },
  // Admin
  { path: '/admin/data-ingest', component: AssessmentHome },
  // Meta
  { path: '/support', component: Support },
  { path: '/updates', component: Updates },
  // Fallback
  { path: '/:pathMatch(.*)*', component: PageNotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
