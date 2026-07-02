import api from './api'

export interface Payment {
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
  updated_at: string
}

export const paymentService = {
  async list(): Promise<Payment[]> {
    const res = await api.get('/bookings/payments/')
    return res.data.results || res.data
  },

  async getDetail(id: string): Promise<Payment> {
    const res = await api.get(`/bookings/payments/${id}/`)
    return res.data
  },

  async create(data: { booking_id: string; method: string; description?: string }): Promise<Payment> {
    const res = await api.post('/bookings/payments/create/', data)
    return res.data
  },
}
