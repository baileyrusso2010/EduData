import { createRouter, createWebHistory } from 'vue-router'
import { components } from 'vuetify/dist/vuetify.js'
import Behavior from '../views/Behavior.vue'
import Attendance from '../views/Attendance.vue'
import Profile from '../views/Profile.vue'
import HomePage from '../views/HomePage.vue'
import PageNotFound from '../views/PageNotFound.vue'
import StudentSearch from '../views/StudentSearch.vue'
import ClassFinder from '../views/ClassFinder.vue'
import ClassView from '../views/ClassView.vue'
import DataIngest from '../views/DataIngest.vue'
import BandEditor from '../views/assessments/BandEditor.vue'
import ClassRoomPerofrmance from '../views/ClassRoomPerofrmance.vue'
import StudentInterventions from '../views/StudentInterventions.vue'
import AssessmentHome from '../views/assessments/AssessmentHome.vue'
// import Support from '../views/Support.vue'
import Updates from '../views/Updates.vue'
import ExecutiveDashboard from '../views/ExecutiveDashboard.vue'
import StudentProfile from '../views/StudentProfile.vue'
import StudentJeopardy from '../views/StudentJeopardy.vue'

const routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/behavior',
    component: Behavior,
  },
  {
    path: '/attendance',
    component: Attendance,
  },
  {
    path: '/profile/:id',
    name: 'profile',
    component: Profile,
    props: true,
  },
  {
    path: '/student_search',
    component: StudentSearch,
  },
  {
    path: '/ClassFinder',
    component: ClassFinder,
  },
  {
    path: '/classview',
    component: ClassView,
  },
  {
    path: '/assessments',
    component: AssessmentHome,
  },
  {
    path: '/data',
    component: DataIngest,
  },
  {
    path: '/classPerformance',
    component: ClassRoomPerofrmance,
  },
  {
    path: '/studentIntervention/:studentId',
    component: StudentInterventions,
  },
  {
    path: '/support',
    component: StudentJeopardy,
  },
  {
    path: '/:pathMatch(.*)*',
    component: PageNotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
