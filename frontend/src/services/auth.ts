import api, { setTokens, clearTokens } from './api'

export interface User {
  id: string
  phone: string
  username: string
  first_name: string
  last_name: string
  email: string
  role: string
  avatar: string | null
  created_at: string
}

export interface AuthResponse {
  user: User
  tokens: {
    access: string
    refresh: string
  }
}

export const authService = {
  async register(data: {
    phone: string
    username: string
    first_name: string
    last_name: string
    password: string
  }): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register/', data)
    setTokens(res.data.tokens.access, res.data.tokens.refresh)
    return res.data
  },

  async login(phone: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login/', { phone, password })
    setTokens(res.data.tokens.access, res.data.tokens.refresh)
    return res.data
  },

  async getProfile(): Promise<User> {
    const res = await api.get<User>('/auth/me/')
    return res.data
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const res = await api.patch<User>('/auth/me/', data)
    return res.data
  },

  async changePassword(oldPassword: string, newPassword: string) {
    const res = await api.post('/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
    })
    return res.data
  },

  logout() {
    clearTokens()
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },
}
