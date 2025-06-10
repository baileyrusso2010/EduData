import axios from 'axios'

const API_URL = import.meta.env.VITE_APP_API_URL as string

export const api = axios.create({
  baseURL: API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})
