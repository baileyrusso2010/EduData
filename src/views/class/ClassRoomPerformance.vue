<template>
  <v-container>
    <v-row>
      <!-- Select Course -->
      <v-col cols="12" sm="6">
        <v-select
          v-model="selectedCourse"
          :items="courses"
          item-title="name"
          item-value="id"
          label="Select Course"
          @update:modelValue="fetchSections"
        />
      </v-col>

      <!-- Select Section -->
      <v-col cols="12" sm="6">
        <v-select
          v-model="selectedSection"
          :items="sections"
          item-title="label"
          item-value="id"
          label="Select Section"
          @update:modelValue="fetchGrades"
          :disabled="!selectedCourse"
        />
      </v-col>
    </v-row>

    <!-- Scatter Plot -->
    <v-row v-if="chartData">
      <v-col cols="12">
        <Scatter :data="chartData" :options="chartOptions" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Scatter } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LinearScale,
  CategoryScale,
  ChartOptions,
  ChartData,
} from 'chart.js'

// Register Chart.js components for scatter plot
ChartJS.register(Title, Tooltip, Legend, PointElement, LinearScale, CategoryScale)

// Interfaces for type safety
interface Course {
  id: number
  name: string
}

interface Section {
  id: number
  label: string
}

interface Grade {
  studentName: string
  score: number
}

// Reactive state
const courses = ref<Course[]>([
  { id: 1, name: 'Math' },
  { id: 2, name: 'Science' },
  { id: 3, name: 'History' },
])
const sections = ref<Section[]>([])
const selectedCourse = ref<number | null>(null)
const selectedSection = ref<number | null>(null)
const chartData = ref<ChartData<'scatter'> | null>(null)

// Chart options
const chartOptions = computed<ChartOptions<'scatter'>>(() => ({
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: `Grades for ${
        courses.value.find((c) => c.id === selectedCourse.value)?.name || 'Course'
      } - ${sections.value.find((s) => s.id === selectedSection.value)?.label || 'Section'}`,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const idx = context.dataIndex
          const student = (chartData.value?.labels as string[])[idx]
          const score = context.raw.y
          return `${student}: ${score}`
        },
      },
    },
  },
  scales: {
    x: {
      title: { display: true, text: 'Student' },
      type: 'category',
      labels: (chartData.value?.labels as string[]) || [],
    },
    y: {
      beginAtZero: true,
      max: 100,
      title: { display: true, text: 'Score' },
    },
  },
}))

// Fake data
const fakeSections: Record<number, { id: number; period: number; teacher_name: string }[]> = {
  1: [
    { id: 101, period: 1, teacher_name: 'Mr. Smith' },
    { id: 102, period: 2, teacher_name: 'Ms. Johnson' },
  ],
  2: [
    { id: 201, period: 1, teacher_name: 'Dr. Brown' },
    { id: 202, period: 2, teacher_name: 'Ms. Lee' },
  ],
  3: [{ id: 301, period: 1, teacher_name: 'Mr. White' }],
}

const fakeGrades: Record<number, Grade[]> = {
  101: [
    { studentName: 'Alice', score: 85 },
    { studentName: 'Bob', score: 90 },
    { studentName: 'Charlie', score: 78 },
  ],
  102: [
    { studentName: 'David', score: 88 },
    { studentName: 'Eva', score: 92 },
  ],
  201: [
    { studentName: 'Frank', score: 80 },
    { studentName: 'Grace', score: 87 },
  ],
  202: [
    { studentName: 'Hannah', score: 95 },
    { studentName: 'Ian', score: 89 },
  ],
  301: [
    { studentName: 'Jack', score: 82 },
    { studentName: 'Karen', score: 91 },
  ],
}

// Fetch sections for a selected course
function fetchSections() {
  selectedSection.value = null
  sections.value = []
  chartData.value = null

  if (!selectedCourse.value) return

  sections.value =
    fakeSections[selectedCourse.value]?.map((s) => ({
      id: s.id,
      label: `Period ${s.period} - ${s.teacher_name || 'Unknown'}`,
    })) || []
}

// Fetch grades for the selected section
function fetchGrades() {
  if (!selectedSection.value) {
    chartData.value = null
    return
  }

  const grades = fakeGrades[selectedSection.value] || []
  chartData.value = {
    labels: grades.map((g) => g.studentName),
    datasets: [
      {
        label: 'Grades',
        backgroundColor: '#4CAF50',
        pointRadius: 6,
        pointHoverRadius: 8,
        data: grades.map((g, idx) => ({
          x: idx,
          y: g.score,
        })),
      },
    ],
  }
}
</script>
