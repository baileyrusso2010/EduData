<template>
  <div>
    <canvas ref="canvas" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js'

Chart.register(PieController, ArcElement, Tooltip, Legend)

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const canvas = ref(null)
let chart = null

const createChart = () => {
  if (chart) chart.destroy()

  chart = new Chart(canvas.value, {
    type: 'pie',
    data: {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: props.data,
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  })
}

onMounted(createChart)
watch(() => props.data, createChart)
</script>

<style scoped>
div {
  position: relative;
  height: 200px;
}
</style>
