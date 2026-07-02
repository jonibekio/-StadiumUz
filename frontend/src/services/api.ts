import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

// Token management
let accessToken: string | null = localStorage.getItem('access_token')
let refreshToken: string | null = localStorage.getItem('refresh_token')

export function setTokens(access: string, refresh: string) {
  accessToken = access
  refreshToken = refresh
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

export function clearTokens() {
  accessToken = null
  refreshToken = null
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export function getAccessToken() {
  return accessToken
}

// Request interceptor - add auth header
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Don't redirect on 401 for public endpoints - just reject
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we have a refresh token, try to refresh
      if (refreshToken) {
        originalRequest._retry = true
        try {
          const res = await axios.post(`${API_BASE}/auth/refresh/`, { refresh: refreshToken })
          const newAccess = res.data.access
          setTokens(newAccess, refreshToken)
          originalRequest.headers.Authorization = `Bearer ${newAccess}`
          return api(originalRequest)
        } catch {
          clearTokens()
          // Don't redirect - let the component handle it
        }
      }
      // If no refresh token or refresh failed, just reject
      // The component will handle the error appropriately
    }
    return Promise.reject(error)
  }
)

export default api
