<!-- src/components/NavDrawer.vue -->
<template>
  <div>
    <!-- App Bar -->
    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app :temporary="$vuetify.display.smAndDown">
      <!-- Drawer Header -->
      <v-sheet color="primary" class="pa-4">
        <v-row align="center">
          <v-col>
            <h2 class="white--text">EduData</h2>
            <p class="caption white--text mb-0">Staff Dashboard</p>
          </v-col>
        </v-row>
      </v-sheet>

      <!-- Navigation List -->
      <v-list dense nav>
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          :to="item.to"
          link
          class="nav-item"
          active-class="active-nav-item"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Drawer state
const drawer = ref(true)

// Navigation items
const navItems = [
  { title: 'Home', to: '/', icon: 'mdi-home' },
  // { title: 'Test', to: '/test', icon: 'mdi-filter' },
  // { title: 'Behavior', to: '/behavior', icon: 'mdi-account-group' },
  { title: 'Attendance', to: '/attendance', icon: 'mdi-account-group' },
  // { title: 'Profile', to: '/profile', icon: 'mdi-account-group' },
  { title: 'Upload', to: '/upload', icon: 'mdi-account-group' },
  { title: 'Search', to: '/student_search', icon: 'mdi-account-group' },
  { title: 'Class Finder', to: '/ClassFinder', icon: 'mdi-account-group' },
  { title: 'Breakdown', to: '/breakdown', icon: 'mdi-account-group' },
]

// Logout function (placeholder)
const logout = () => {
  console.log('Logout clicked')
  // Implement logout logic here (e.g., clear auth token, redirect to login)
}
</script>

<style scoped>
.title-text {
  font-size: 1.5rem;
  font-weight: 500;
}

.nav-item {
  transition: background-color 0.3s;
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.active-nav-item {
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--v-primary-base) !important;
}

.caption {
  font-size: 0.75rem;
}
</style>
