import api from './api'

export interface StadiumFeature {
  id: string
  name: string
  icon: string
}

export interface Stadium {
  id: string
  name: string
  description: string
  region: string
  region_display: string
  address: string
  district: string
  latitude: number | null
  longitude: number | null
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
  features: StadiumFeature[]
  photos: { id: string; url: string; caption: string }[]
  comments: Comment[]
  is_favorited: boolean
  working_hours_start: string
  working_hours_end: string
  created_at: string
}

export interface Comment {
  id: string
  user: string
  user_name: string
  stadium: string
  rating: number
  text: string
  created_at: string
}

export interface StadiumFilters {
  search?: string
  region?: string
  district?: string
  field_type?: string
  surface_type?: string
  min_rating?: number
  max_price?: number
  sort?: string
  page?: number
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export const stadiumService = {
  async list(filters?: StadiumFilters): Promise<PaginatedResponse<Stadium>> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }
    const res = await api.get(`/field/stadiums/?${params.toString()}`)
    return res.data
  },

  async getFeatured(): Promise<Stadium[]> {
    const res = await api.get('/field/stadiums/featured/')
    return res.data.results || res.data
  },

  async getDetail(id: string): Promise<Stadium> {
    const res = await api.get(`/field/stadiums/${id}/`)
    return res.data
  },

  async toggleFavorite(stadiumId: string): Promise<{ is_favorited: boolean }> {
    const res = await api.post(`/field/favorites/${stadiumId}/toggle/`)
    return res.data
  },

  async getFavorites(): Promise<Stadium[]> {
    const res = await api.get('/field/favorites/')
    return res.data.results || res.data
  },

  async getComments(stadiumId: string): Promise<Comment[]> {
    const res = await api.get(`/comments/?stadium=${stadiumId}`)
    return res.data.results || res.data
  },

  async createComment(data: { stadium: string; rating: number; text: string }): Promise<Comment> {
    const res = await api.post('/comments/create/', data)
    return res.data
  },
}
