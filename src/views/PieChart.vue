<template>
  <v-card class="pa-4">
    <v-card-title class="text-h6 font-weight-bold">Student Overview (30 Days)</v-card-title>
    <div class="chart-wrapper">
      <canvas ref="canvas" />
    </div>
  </v-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
)

// Chart canvas
const canvas = ref(null)
let chart = null

// Generate 30 days of fake data
const generateStudentData = () => {
  const labels = []
  const attendance = []
  const grades = []
  const behavior = []

  const today = new Date()
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    attendance.push(Math.random() < 0.1 ? 0 : Math.random() < 0.2 ? 1 : 2) // mostly present
    grades.push(Math.floor(Math.random() * 21) + 75) // 75–95 range
    behavior.push(Math.floor(Math.random() * 4)) // 0–3 incidents
  }

  return { labels, attendance, grades, behavior }
}

const { labels, attendance, grades, behavior } = generateStudentData()

// Vertical Line Plugin
const verticalLinePlugin = {
  id: 'verticalLinePlugin',
  afterDraw(chart) {
    if (chart.config.options.verticalLine) {
      const { xIndex, color, label } = chart.config.options.verticalLine
      const ctx = chart.ctx
      const x = chart.scales.x.getPixelForValue(xIndex)

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(x, chart.chartArea.top)
      ctx.lineTo(x, chart.chartArea.bottom)
      ctx.lineWidth = 2
      ctx.strokeStyle = color || 'red'
      ctx.stroke()
      ctx.restore()

      if (label) {
        ctx.fillStyle = color
        ctx.textAlign = 'center'
        ctx.font = '12px sans-serif'
        ctx.fillText(label, x, chart.chartArea.top - 8)
      }
    }
  },
}

Chart.register(verticalLinePlugin)

onMounted(() => {
  if (chart) chart.destroy()

  chart = new Chart(canvas.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Attendance',
          data: attendance,
          yAxisID: 'yAttendance',
          borderColor: '#42A5F5',
          backgroundColor: '#42A5F5',
          tension: 0.3,
          pointRadius: 4,
        },
        {
          label: 'Grades',
          data: grades,
          yAxisID: 'yGrades',
          borderColor: '#66BB6A',
          backgroundColor: '#66BB6A',
          tension: 0.3,
          pointRadius: 4,
        },
        {
          label: 'Behavior Incident',
          data: behavior.map((val, i) => (val ? 1 : null)), // only show when incident exists
          yAxisID: 'yBehavior',
          pointStyle: 'circle',
          pointRadius: 6,
          pointBackgroundColor: '#EF5350',
          borderWidth: 0, // No connecting line
          showLine: false, // Only dots
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      stacked: false,
      verticalLine: {
        xIndex: 15,
        color: '#FFA000',
        label: 'Tier 2 Start',
      },
      scales: {
        yAttendance: {
          type: 'linear',
          position: 'left',
          min: 0,
          max: 2,
          ticks: {
            stepSize: 1,
            callback: (val) => (val === 0 ? 'Absent' : val === 1 ? 'Tardy' : 'Present'),
          },
          title: { display: true, text: 'Attendance' },
        },
        yGrades: {
          type: 'linear',
          position: 'right',
          min: 0,
          max: 100,
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Grades (%)' },
        },
        yBehavior: {
          type: 'linear',
          position: 'right',
          offset: true,
          min: 0,
          max: 3,
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Behavior Incidents' },
        },
      },
    },
  })
})
</script>

<style scoped>
.chart-wrapper {
  height: 300px;
  overflow: hidden;
  position: relative;
}
canvas {
  height: 100% !important;
}
</style>
