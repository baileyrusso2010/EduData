<template>
  <div class="dropdown">
    <select v-model="selected">
      <option disabled value="">Please select one</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script>
import { api } from '../services/api'

export default {
  data() {
    return {
      selected: '',
      options: [],
    }
  },
  async created() {
    try {
      console.log('API URL:', api.defaults.baseURL)
      const response = await api.get('/teacher/teachers')
      this.options = response.data.map((teacher) => ({
        value: teacher.,
        text: teacher.name,
      }))
    } catch (error) {
      console.error('Error fetching teachers:', error)
    }
  },
}
</script>
