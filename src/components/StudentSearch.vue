<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="search"
            label="Search by name or ID"
            prepend-icon="mdi-magnify"
            clearable
          />
        </v-col>
      </v-row>
  
      <!-- Search Results -->
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="student in filteredStudents" :key="student.id">
          <v-card class="pa-4" outlined @click="selectStudent(student)">
            <v-card-title>{{ student.first_name }} {{ student.last_name }}</v-card-title>
            <v-card-subtitle>Student ID: {{ student.student_number }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- Student Profile Preview -->
      <!-- <v-row v-if="selectedStudent">
        <v-col cols="12">
          <v-card class="pa-4 mt-6" elevation="2">
            <v-card-title class="text-h5">{{ selectedStudent.name }}'s Profile</v-card-title>
            <v-card-text>
              <p><strong>ID:</strong> {{ selectedStudent.student_number }}</p>
              <p><strong>Grade:</strong> {{ selectedStudent.grade }}</p>
              <p><strong>School:</strong> {{ selectedStudent.school }}</p>
              <p><strong>DOB:</strong> {{ selectedStudent.dob }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row> -->
    </v-container>
  </template>
  
  <script>
  import axios from "axios"

  export default {
    data() {
      return {
        search: "",
        selectedStudent: null,
        students: [],
      };
    },
    computed: {
      filteredStudents() {
        const term = this.search.toLowerCase();
        if (!term) return this.students;

        return this.students.filter(student =>
          student.first_name.toLowerCase().includes(term) ||
          student.last_name.toLowerCase().includes(term) ||
          student.student_number.toString().includes(term)
        );
      },
    },
    watch: {
      search: {
        async handler(newSearch) {
          try {
            const url = `https://api.chalkrecords.com/student/search?search=${newSearch}`;
            const response = await axios.get(url);
            this.students = response.data;
          } catch (error) {
            console.error("Error fetching students:", error);
          }
        },
        immediate: true,
      },
    },
    methods: {
      selectStudent(student) {
        this.$router.push({ name: 'profile', params: { id: student.student_number } })

      },
    },
  };
  </script>
  