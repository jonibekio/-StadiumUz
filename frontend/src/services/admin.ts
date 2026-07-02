import api from './api'

export interface DashboardStats {
  today_bookings: number
  monthly_income: number
  available_today: number
  booked_today: number
  total_users: number
  total_stadiums: number
  total_bookings: number
}

export interface DashboardCharts {
  labels: string[]
  bookings: number[]
  income: number[]
}

export interface AdminBooking {
  id: string
  slot: {
    id: string
    date: string
    start_time: string
    end_time: string
    price: number
    status: string
  }
  customer: string
  customer_name: string
  total_price: number
  status: string
  created_at: string
}

export interface AdminUser {
  id: string
  phone: string
  username: string
  first_name: string
  last_name: string
  email: string
  role: string
  avatar: string | null
  is_active: boolean
  created_at: string
}

export interface AdminPayment {
  id: string
  user: string
  user_name: string
  booking: string
  amount: number
  method: string
  status: string
  transaction_id: string
  description: string
  created_at: string
}

export interface AdminStadium {
  id: string
  name: string
  description: string
  region: string
  region_display: string
  address: string
  district: string
  phone: string
  field_type: string
  surface_type: string
  price_per_hour: number
  rating: number
  reviews_count: number
  is_active: boolean
  is_premium: boolean
  badge: string
  image_url: string
  features: { id: string; name: string }[]
  working_hours_start: string
  working_hours_end: string
}

export interface AnalyticsData {
  monthly_data: { month: string; income: number; bookings: number }[]
  cancelled_count: number
  cancel_rate: number
  avg_booking_price: number
  total_bookings: number
  total_revenue: number
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export const adminService = {
  // Dashboard
  async getStats(): Promise<DashboardStats> {
    const res = await api.get('/admin/dashboard/')
    return res.data
  },

  async getCharts(period = 'week'): Promise<DashboardCharts> {
    const res = await api.get(`/admin/dashboard/charts/?period=${period}`)
    return res.data
  },

  async getAnalytics(): Promise<AnalyticsData> {
    const res = await api.get('/admin/dashboard/analytics/')
    return res.data
  },

  // Bookings
  async getBookings(params?: { status?: string; date?: string; search?: string; page?: number }): Promise<PaginatedResponse<AdminBooking>> {
    const q = new URLSearchParams()
    if (params?.status) q.set('status', params.status)
    if (params?.date) q.set('date', params.date)
    if (params?.search) q.set('search', params.search)
    if (params?.page) q.set('page', String(params.page))
    const res = await api.get(`/admin/bookings/?${q.toString()}`)
    return res.data
  },

  async approveBooking(id: string): Promise<AdminBooking> {
    const res = await api.post(`/bookings/${id}/approve/`)
    return res.data
  },

  async rejectBooking(id: string, reason = ''): Promise<AdminBooking> {
    const res = await api.post(`/bookings/${id}/reject/`, { reason })
    return res.data
  },

  // Users
  async getUsers(params?: { search?: string; role?: string; page?: number }): Promise<PaginatedResponse<AdminUser>> {
    const q = new URLSearchParams()
    if (params?.search) q.set('search', params.search)
    if (params?.role) q.set('role', params.role)
    if (params?.page) q.set('page', String(params.page))
    const res = await api.get(`/admin/users/?${q.toString()}`)
    return res.data
  },

  async updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
    const res = await api.patch(`/admin/users/${id}/`, data)
    return res.data
  },

  async toggleUserActive(id: string): Promise<AdminUser> {
    const res = await api.post(`/admin/users/${id}/toggle-active/`)
    return res.data
  },

  // Stadiums
  async getStadiums(params?: { search?: string; region?: string; page?: number }): Promise<PaginatedResponse<AdminStadium>> {
    const q = new URLSearchParams()
    if (params?.search) q.set('search', params.search)
    if (params?.region) q.set('region', params.region)
    if (params?.page) q.set('page', String(params.page))
    const res = await api.get(`/admin/field/stadiums/?${q.toString()}`)
    return res.data
  },

  async createStadium(data: Partial<AdminStadium>): Promise<AdminStadium> {
    const res = await api.post('/admin/field/stadiums/create/', data)
    return res.data
  },

  async updateStadium(id: string, data: Partial<AdminStadium>): Promise<AdminStadium> {
    const res = await api.put(`/admin/field/stadiums/${id}/`, data)
    return res.data
  },

  async deleteStadium(id: string): Promise<void> {
    await api.delete(`/admin/field/stadiums/${id}/`)
  },

  // Payments
  async getPayments(params?: { status?: string; method?: string; search?: string; page?: number }): Promise<PaginatedResponse<AdminPayment>> {
    const q = new URLSearchParams()
    if (params?.status) q.set('status', params.status)
    if (params?.method) q.set('method', params.method)
    if (params?.search) q.set('search', params.search)
    if (params?.page) q.set('page', String(params.page))
    const res = await api.get(`/admin/payments/?${q.toString()}`)
    return res.data
  },
}
