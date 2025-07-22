<template>
  <!-- Floating Edge Toggle Button -->
  <!-- <v-btn icon class="edge-toggle-btn" @click="toggleDrawer" :class="{ 'drawer-open': drawer }">
    <v-icon>{{ drawer ? 'mdi-chevron-left' : 'mdi-menu' }}</v-icon>
  </v-btn> -->

  <v-navigation-drawer
    v-model="drawer"
    app
    :temporary="$vuetify.display.smAndDown"
    width="280"
    class="elevation-2 nav-drawer"
  >
    <!-- Drawer Header -->
    <v-sheet color="primary" class="pa-4">
      <v-row align="center" no-gutters>
        <v-col>
          <h2 class="text-h6 font-weight-bold white--text">Chalk Records</h2>
          <p class="text-caption white--text mb-1">Staff Dashboard</p>
          <p class="text-caption white--text mb-0">v{{ packageVersion }}</p>
        </v-col>
      </v-row>
    </v-sheet>

    <!-- Navigation List with Collapsible Groups -->
    <v-list dense nav class="py-0">
      <!-- General Group -->
      <v-list-group v-model="generalExpanded" color="primary">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" class="group-header">
            <v-list-item-icon class="mr-3">
              <v-icon size="20">mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="text-subtitle-2">General</v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item
          v-for="item in generalItems"
          :key="item.title"
          :to="item.to"
          link
          class="pl-8 nav-item"
          active-class="active-nav-item"
        >
          <v-list-item-icon class="mr-3">
            <v-icon size="20">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-body-2">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <!-- Student Management Group -->
      <v-list-group v-model="studentExpanded" color="primary">
        <!-- <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" class="group-header">
            <v-list-item-icon class="mr-3">
              <v-icon size="20">mdi-school</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="text-subtitle-2">Student Management</v-list-item-title>
          </v-list-item>
        </template> -->
        <v-list-item
          v-for="item in studentItems"
          :key="item.title"
          :to="item.to"
          link
          class="pl-8 nav-item"
          active-class="active-nav-item"
        >
          <v-list-item-icon class="mr-3">
            <v-icon size="20">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-body-2">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-list-group v-model="dashboardsExpanded" color="primary">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" class="group-header">
            <v-list-item-icon class="mr-3">
              <v-icon size="20">mdi-chart-bar</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="text-subtitle-2">Dashboards</v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item
          v-for="item in dashboards"
          :key="item.title"
          :to="item.to"
          link
          class="pl-8 nav-item"
          active-class="active-nav-item"
        >
          <v-list-item-icon class="mr-3">
            <v-icon size="20">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-body-2">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-list-group v-model="adminExpanded" color="primary">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" class="group-header">
            <v-list-item-icon class="mr-3">
              <v-icon size="20">mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="text-subtitle-2">Admin</v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item
          v-for="item in admin"
          :key="item.title"
          :to="item.to"
          link
          class="pl-8 nav-item"
          active-class="active-nav-item"
        >
          <v-list-item-icon class="mr-3">
            <v-icon size="20">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-body-2">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>

    <!-- Settings Icon Bottom Right -->
    <v-btn icon class="settings-btn" @click="goToSettings">
      <v-icon size="28">mdi-cog-outline</v-icon>
    </v-btn>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import packageJson from '../../package.json'

const packageVersion = packageJson.version
const drawer = ref(true)
const generalExpanded = ref(true)
const studentExpanded = ref(true)
const dashboardsExpanded = ref(true)
const adminExpanded = ref(true)
const router = useRouter()

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const goToSettings = () => {
  router.push('/admin/permissions')
}

// Updated navigation items to match new endpoints/routes
const generalItems = [
  { title: 'Home', to: '/', icon: 'mdi-home' },
  { title: 'Student Search', to: '/students', icon: 'mdi-magnify' },
]

// const studentItems = [{ title: 'Student Jeopardy', to: '/students/jeopardy', icon: 'mdi-alert' }]

const dashboards = [
  { title: 'Executive Dashboard', to: '/dashboard', icon: 'mdi-view-dashboard' },
  { title: 'Interventions', to: '/interventions', icon: 'mdi-account-alert' },
  { title: 'Attendance', to: '/students/attendance', icon: 'mdi-account-check-outline' },
]

const admin = [
  { title: 'Data Ingest', to: '/admin/data-ingest', icon: 'mdi-database-import' },
  { title: 'Permissions', to: '/admin/permissions', icon: 'mdi-shield-account' },
]
</script>

<style scoped>
.edge-toggle-btn {
  position: fixed;
  top: 16px;
  left: 16px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1005; /* Above v-navigation-drawer */
  transition: left 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.edge-toggle-btn.drawer-open {
  left: 250px; /* drawer width (280) + 16px */
}

.nav-item {
  transition: all 0.2s ease-in-out;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  border-left-color: var(--v-primary-base);
}

.active-nav-item {
  background-color: rgba(0, 0, 0, 0.08);
  border-left-color: var(--v-primary-base);
  color: var(--v-primary-base) !important;
}

.group-header {
  background-color: rgba(0, 0, 0, 0.03);
  border-left: 3px solid transparent;
  transition: all 0.2s ease-in-out;
}

.group-header:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.v-list-item-title {
  font-weight: 500;
}

.v-navigation-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  position: relative;
}

.v-list-group--active .group-header {
  background-color: rgba(0, 0, 0, 0.08);
}

.settings-btn {
  position: absolute;
  right: 16px;
  bottom: 16px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 50%;
  z-index: 2;
  transition: background 0.2s;
}
.settings-btn:hover {
  background: #f5f5f5;
}

.nav-drawer {
  min-height: 100vh;
}
</style>
