import axios from 'axios'
import { getTokenFromLocalStorage } from '@/shared/utils/tokenUtil'
import { API_URL } from './config'

export const instance = axios.create({
  baseURL: `${API_URL}/api`,
})

instance.interceptors.request.use((config) => {
  const token = getTokenFromLocalStorage()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const setAuthHeader = (token) => {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const clearAuthHeader = () => {
  delete instance.defaults.headers.common['Authorization']
}
