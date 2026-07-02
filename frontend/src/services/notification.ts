import api from './api'

export interface Notification {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  link: string
  created_at: string
}

export const notificationService = {
  async list(): Promise<Notification[]> {
    const res = await api.get('/notifications/')
    return res.data.results || res.data
  },

  async getUnreadCount(): Promise<number> {
    const res = await api.get('/notifications/?is_read=false')
    const data = res.data.results || res.data
    return Array.isArray(data) ? data.length : (res.data.count || 0)
  },

  async markRead(id: string): Promise<Notification> {
    const res = await api.put(`/notifications/${id}/read/`)
    return res.data
  },

  async markAllRead() {
    const res = await api.post('/notifications/read-all/')
    return res.data
  },
}
