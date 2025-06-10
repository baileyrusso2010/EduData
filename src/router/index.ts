import { createRouter, createWebHistory } from 'vue-router'
import { components } from 'vuetify/dist/vuetify.js'
import Behavior from '../views/Behavior.vue'
import Attendance from '../views/Attendance.vue'
import Profile from '../views/Profile.vue'
import HomePage from '../views/HomePage.vue'
import PageNotFound from '../views/PageNotFound.vue'
import UploadAssessment from '../views/UploadAssessment.vue'
import StudentSearch from '../views/StudentSearch.vue'
import ClassFinder from '../views/ClassFinder.vue'

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
    path: '/upload',
    component: UploadAssessment,
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
    path: '/:pathMatch(.*)*',
    component: PageNotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
