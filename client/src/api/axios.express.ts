import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8008/'

export const axiosMainApi = axios.create({
  baseURL: BASE_URL,
})

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})