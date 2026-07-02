import api from './api'

export interface BookingSlot {
  id: string
  stadium: string
  date: string
  start_time: string
  end_time: string
  price: number
  status: string
}

export interface Booking {
  id: string
  slot: BookingSlot
  customer: string
  customer_name: string
  total_price: number
  status: string
  created_at: string
}

export const bookingService = {
  async getAvailableSlots(date?: string, stadiumId?: string): Promise<BookingSlot[]> {
    const params = new URLSearchParams()
    if (date) params.set('date', date)
    if (stadiumId) params.set('stadium', stadiumId)
    const res = await api.get(`/bookings/slots/?${params.toString()}`)
    return res.data.results || res.data
  },

  async getStadiumSlots(stadiumId: string, date?: string): Promise<BookingSlot[]> {
    const params = new URLSearchParams()
    if (date) params.set('date', date)
    const res = await api.get(`/field/stadiums/${stadiumId}/slots/?${params.toString()}`)
    return res.data.results || res.data
  },

  async createBooking(slotId: string): Promise<Booking> {
    const res = await api.post('/bookings/', { slot_id: slotId })
    return res.data
  },

  async getMyBookings(status?: string): Promise<Booking[]> {
    const params = status ? `?status=${status}` : ''
    const res = await api.get(`/bookings/my/${params}`)
    return res.data.results || res.data
  },

  async cancelBooking(bookingId: string): Promise<Booking> {
    const res = await api.post(`/bookings/${bookingId}/cancel/`)
    return res.data
  },
}
