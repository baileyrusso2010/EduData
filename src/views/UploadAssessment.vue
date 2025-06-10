<template>
  <div class="p-4 space-y-4">
    <input type="file" accept=".csv,.xlsx" @change="onFileChange" />

    <div v-if="rawHeaders.length">
      <h2 class="text-xl font-semibold mt-4">Map Fields</h2>

      <div v-for="(field, index) in fieldsToMap" :key="index" class="mb-2">
        <label class="mr-2">{{ field.label }}:</label>
        <select v-model="field.binding" class="border p-1">
          <option disabled value="">-- Select Column --</option>
          <option v-for="col in rawHeaders" :key="col" :value="col">
            {{ col }}
          </option>
        </select>
      </div>

      <h2 class="text-lg mt-6 font-semibold">Detected Questions</h2>
      <div v-if="detectedQuestions.length">
        <div v-for="(q, index) in detectedQuestions" :key="index" class="border rounded p-2 mb-2">
          <div>Group: q{{ q.qNum }}</div>
          <div>Question: {{ q.questionField }}</div>
          <div>Student Points: {{ q.studentPointsField }}</div>
          <div>Max Points: {{ q.maxPointsField }}</div>
        </div>
      </div>

      <button class="bg-blue-600 text-white px-4 py-2 rounded mt-4" @click="handleSubmit">
        Submit Mapped Data
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import { ref } from 'vue'
import axios from 'axios'

const rawHeaders = ref<string[]>([])
const rawRows = ref<any[]>([])

const fieldsToMap = ref([
  { key: 'studentUid', label: 'Student UID', binding: '' },
  { key: 'testName', label: 'Test Name', binding: '' },
  { key: 'resPercent', label: 'Result Percent', binding: '' },
])

const detectedQuestions = ref<
  {
    qNum: string
    questionField: string
    studentPointsField: string
    maxPointsField: string
  }[]
>([])

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const data = e.target?.result
    const ext = file.name.split('.').pop()

    if (ext === 'csv') {
      const parsed = Papa.parse(data as string, { header: true })
      rawRows.value = parsed.data
      rawHeaders.value = Object.keys(parsed.data[0] || {})
    } else {
      const workbook = XLSX.read(data, { type: 'binary' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(sheet)
      rawRows.value = json as any[]
      rawHeaders.value = Object.keys(json[0] || {})
    }

    detectQuestionGroups()
  }

  if (file.name.endsWith('.csv')) {
    reader.readAsText(file)
  } else {
    reader.readAsBinaryString(file)
  }
}

function detectQuestionGroups() {
  const questionMap: Record<
    string,
    {
      questionField?: string
      studentPointsField?: string
      maxPointsField?: string
    }
  > = {}

  rawHeaders.value.forEach((header) => {
    const match = header.match(/^q(\d+)_(question|student points|max points)$/i)
    if (match) {
      const [_, qNum, type] = match
      if (!questionMap[qNum]) questionMap[qNum] = {}
      if (type.toLowerCase().includes('question')) questionMap[qNum].questionField = header
      if (type.toLowerCase().includes('student')) questionMap[qNum].studentPointsField = header
      if (type.toLowerCase().includes('max')) questionMap[qNum].maxPointsField = header
    }
  })

  detectedQuestions.value = Object.entries(questionMap)
    .filter(
      ([_, fields]) => fields.questionField && fields.studentPointsField && fields.maxPointsField,
    )
    .map(([qNum, fields]) => ({
      qNum,
      questionField: fields.questionField!,
      studentPointsField: fields.studentPointsField!,
      maxPointsField: fields.maxPointsField!,
    }))
}

async function handleSubmit() {
  const mappedData = rawRows.value.map((row) => {
    const studentData: Record<string, any> = {}
    fieldsToMap.value.forEach((f) => {
      studentData[f.key] = row[f.binding]
    })

    const questions = detectedQuestions.value.map((q) => ({
      text: row[q.questionField],
      studentPoints: Number(row[q.studentPointsField]),
      maxPoints: Number(row[q.maxPointsField]),
    }))

    return {
      ...studentData,
      questions,
    }
  })

  const result = await axios.post('http://localhost:3000/assessments/upload', mappedData)

  console.log(result)

  // You can now POST mappedData to your Express route
}
</script>
