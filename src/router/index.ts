import { createRouter, createWebHistory } from 'vue-router'
import { components } from 'vuetify/dist/vuetify.js'
import Printing from '../components/Printing.vue'
import Behavior from '../components/Behavior.vue'
import Test from '../components/Test.vue'
import Attendance from '../components/Attendance.vue'
import Profile from '../components/Profile.vue'
import HomePage from '../components/HomePage.vue'
import PageNotFound from '../components/PageNotFound.vue'
import UploadAssessment from '../components/UploadAssessment.vue'

const routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/test',
    component: Test,
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
    path: '/profile',
    component: Profile,
  },
  {
    path: '/upload',
    component: UploadAssessment,
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
