<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    :temporary="$vuetify.display.smAndDown"
    width="280"
    class="elevation-2"
  >
    <!-- Drawer Header -->
    <v-sheet color="primary" class="pa-4">
      <v-row align="center" no-gutters>
        <v-col>
          <h2 class="text-h6 font-weight-bold white--text">Chalk Records</h2>
          <p class="text-caption white--text mb-1">Staff Dashboard</p>
          <p class="text-caption white--text mb-0">v{{ packageVersion }}</p>
        </v-col>
        <v-col cols="auto" v-if="$vuetify.display.smAndDown">
          <v-btn icon small @click="drawer = !drawer" class="white--text">
            <v-icon>mdi-close</v-icon>
          </v-btn>
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
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" class="group-header">
            <v-list-item-icon class="mr-3">
              <v-icon size="20">mdi-school</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="text-subtitle-2">Student Management</v-list-item-title>
          </v-list-item>
        </template>
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
      <!-- Logout Button -->
      <!-- <v-list-item @click="logout" class="mt-2 nav-item">
        <v-list-item-icon class="mr-3">
          <v-icon size="20">mdi-logout</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="text-body-2">Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item> -->
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'
import packageJson from '../../package.json'

const packageVersion = packageJson.version
const drawer = ref(true)
const generalExpanded = ref(true) // Controls General group collapse state
const studentExpanded = ref(true) // Controls Student Management group collapse state
const dashboardsExpanded = ref(true) // Controls Student Management group collapse state
const adminExpanded = ref(true) // Controls Student Management group collapse state

// Organized navigation items into groups
const generalItems = [
  { title: 'Home', to: '/', icon: 'mdi-home' },
  { title: 'Search', to: '/student_search', icon: 'mdi-magnify' },
  { title: 'Class Finder', to: '/ClassFinder', icon: 'mdi-domain' },
]

const studentItems = [{ title: 'Class View', to: '/ClassView', icon: 'mdi-view-list' }]

const dashboards = [
  { title: 'Attendance', to: '/attendance', icon: 'mdi-account-check-outline' },
  { title: 'Breakdown', to: '/breakdown', icon: 'mdi-chart-bar' },
  { title: 'Data', to: '/data', icon: 'mdi-database-outline' },
  { title: 'Class', to: '/classPerformance', icon: 'mdi-database-outline' },
]

const admin = [
  { title: 'Upload Questions', to: '/upload', icon: 'mdi-upload' },
  { title: 'Create Assessment', to: '/createAssessment', icon: 'mdi-file-document-edit-outline' },
  { title: 'Score Importer', to: '/scoreImporter', icon: 'mdi-upload' },
  { title: 'Band Editor', to: '/bandEditor', icon: 'mdi-edit' },
]

const logout = () => {
  console.log('Logout clicked')
  // Implement logout logic here
}
</script>

<style scoped>
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
}

.v-list-group--active .group-header {
  background-color: rgba(0, 0, 0, 0.08);
}
</style>
