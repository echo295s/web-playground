import axios from 'axios'
import { apiURL } from './config.js'

const api = axios.create({
  baseURL: apiURL
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.dispatchEvent(new Event('logout'))
    }
    return Promise.reject(error)
  }
)

export default api
