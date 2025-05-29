// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { Chart, registerables } from 'chart.js'
import { Bar, Line } from 'vue-chartjs'

Chart.register(...registerables)
const app = createApp(App)

// Register Vue ChartJS components globally
app.component('BarChart', Bar)
app.component('LineChart', Line)

// Use plugins and mount the app
app.use(vuetify).use(router).mount('#app')
