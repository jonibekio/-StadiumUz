import api from './api'

export interface ChatMessage {
  id: string
  room: string
  sender: string
  sender_name: string
  sender_role: string
  message_type: string
  content: string
  file: string | null
  image: string | null
  attachments: { id: string; file: string; filename: string }[]
  is_read: boolean
  created_at: string
}

export interface ChatRoom {
  id: string
  booking: string
  created_at: string
  updated_at: string
  last_message: ChatMessage | null
  unread_count: number
  other_user: { id?: string; name: string } | null
}

export const chatService = {
  async getRooms(): Promise<ChatRoom[]> {
    const res = await api.get('/chat/rooms/')
    return res.data.results || res.data
  },

  async getRoom(id: string): Promise<ChatRoom> {
    const res = await api.get(`/chat/rooms/${id}/`)
    return res.data
  },

  async getMessages(roomId: string): Promise<ChatMessage[]> {
    const res = await api.get(`/chat/rooms/${roomId}/messages/`)
    return res.data.results || res.data
  },

  async sendMessage(roomId: string, content: string, messageType = 'TEXT'): Promise<ChatMessage> {
    const res = await api.post(`/chat/rooms/${roomId}/send/`, {
      content,
      message_type: messageType,
    })
    return res.data
  },

  async sendFile(roomId: string, file: File): Promise<ChatMessage> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('content', file.name)
    formData.append('message_type', 'FILE')
    const res = await api.post(`/chat/rooms/${roomId}/send/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async sendImage(roomId: string, file: File): Promise<ChatMessage> {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('content', file.name)
    formData.append('message_type', 'IMAGE')
    const res = await api.post(`/chat/rooms/${roomId}/send/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async markAsRead(roomId: string): Promise<void> {
    await api.post(`/chat/rooms/${roomId}/read/`)
  },
}
