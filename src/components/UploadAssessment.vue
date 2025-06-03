<template>
  <div class="p-6 max-w-xl mx-auto">
    <h2 class="text-xl font-bold mb-4">Upload Assessment File</h2>

    <input type="file" @change="handleFileUpload" accept=".csv" class="mb-4" />

    <div v-if="columns.length" class="mb-4">
      <h3 class="font-semibold mb-2">Map Columns</h3>
      <div v-for="(col, index) in columns" :key="index" class="mb-2">
        <label class="block mb-1">{{ col }}</label>
        <select v-model="mapping[col]" class="border p-2 w-full">
          <option value="">-- Ignore --</option>
          <option v-for="field in internalFields" :key="field" :value="field">{{ field }}</option>
        </select>
      </div>
      <v-btn @click="submitMappedData" class=""> Submit Mapped Data </v-btn>
    </div>

    <div>
      <v-table v-if="fileData.length">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col">{{ col }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in fileData" :key="index">
            <td v-for="col in columns" :key="col">{{ row[col] }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script setup>
import Papa from 'papaparse'
import { ref, reactive } from 'vue'
import axios from 'axios'

const fileData = ref([])
const columns = ref([])
const mapping = reactive({})
const internalFields = ['studentName', 'subject', 'score']

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete(results) {
      fileData.value = results.data
      columns.value = results.meta.fields
      columns.value.forEach((col) => {
        mapping[col] = '' // default: not mapped
      })
    },
  })
}

async function submitMappedData() {
  const mapped = fileData.value.map((row) => {
    const result = {}
    for (const [csvCol, internalKey] of Object.entries(mapping)) {
      if (internalKey) {
        result[internalKey] = row[csvCol]
      }
    }
    return result
  })

  try {
    await axios.post('https://your-api-url.com/api/assessments/bulk', mapped)
    alert('Uploaded successfully!')
  } catch (err) {
    console.error(err)
    alert('Failed to upload data.')
  }
}
</script>
