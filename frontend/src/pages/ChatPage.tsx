import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import UserLayout from '../components/layout/UserLayout'
import { chatService, ChatMessage, ChatRoom } from '../services/chat'
import { useAuth } from '../hooks/useAuth'

export default function ChatPage() {
  const { roomId } = useParams()
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [activeRoom, setActiveRoom] = useState<string | null>(roomId || null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatService.getRooms()
      .then(setRooms)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (activeRoom) {
      chatService.getMessages(activeRoom)
        .then(setMessages)
        .catch(() => {})
      chatService.markAsRead(activeRoom).catch(() => {})
    }
  }, [activeRoom])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !activeRoom || sending) return
    setSending(true)
    try {
      const msg = await chatService.sendMessage(activeRoom, newMessage)
      setMessages(prev => [...prev, msg])
      setNewMessage('')
    } catch {
    } finally {
      setSending(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !activeRoom) return
    setSending(true)
    try {
      const msg = await chatService.sendFile(activeRoom, file)
      setMessages(prev => [...prev, msg])
    } catch {
    } finally {
      setSending(false)
      e.target.value = ''
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
  }

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="flex h-[calc(100vh-200px)] gap-4">
        {/* Room List */}
        <div className="w-80 ghost-border rounded-xl bg-surface-container-low flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border-subtle">
            <h3 className="font-headline-md text-headline-md text-text-primary">Suhbatlar</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {rooms.length === 0 ? (
              <div className="p-6 text-center text-on-surface-variant text-sm">
                Hali suhbatlar yo'q
              </div>
            ) : (
              rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room.id)}
                  className={`w-full p-4 text-left border-b border-border-subtle/50 transition-colors ${
                    activeRoom === room.id ? 'bg-primary/5' : 'hover:bg-surface-variant/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant">sports_soccer</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary font-body-md truncate">
                        {room.other_user?.name || 'Suhbat'}
                      </p>
                      <p className="text-on-surface-variant text-[12px] truncate">
                        {room.last_message?.content || 'Xabarlar yo\'q'}
                      </p>
                    </div>
                    {room.unread_count > 0 && (
                      <span className="w-5 h-5 rounded-full bg-primary-container text-on-primary-container text-[10px] flex items-center justify-center font-bold">
                        {room.unread_count}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 ghost-border rounded-xl bg-surface-container-low flex flex-col overflow-hidden">
          {activeRoom ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-border-subtle flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant">sports_soccer</span>
                </div>
                <div>
                  <p className="text-text-primary font-body-md font-semibold">
                    {rooms.find(r => r.id === activeRoom)?.other_user?.name || 'Suhbat'}
                  </p>
                  <p className="text-on-surface-variant text-[12px]">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                  const isMine = msg.sender === user?.id
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl p-3 ${
                        isMine
                          ? 'bg-primary-container text-on-primary-container rounded-br-sm'
                          : 'bg-surface-container border border-border-subtle rounded-bl-sm'
                      }`}>
                        {msg.message_type === 'FILE' && msg.file && (
                          <div className="flex items-center gap-2 mb-2 p-2 rounded bg-black/10">
                            <span className="material-symbols-outlined text-sm">attach_file</span>
                            <span className="text-sm truncate">{msg.content}</span>
                          </div>
                        )}
                        {msg.message_type === 'IMAGE' && msg.image && (
                          <img src={msg.image} alt="rasm" className="rounded-lg mb-2 max-w-full" />
                        )}
                        {msg.content && (
                          <p className={`text-body-sm ${isMine ? 'text-on-primary-container' : 'text-on-surface'}`}>
                            {msg.content}
                          </p>
                        )}
                        <p className={`text-[10px] mt-1 ${isMine ? 'text-on-primary-container/60' : 'text-on-surface-variant'}`}>
                          {formatTime(msg.created_at)}
                          {isMine && msg.is_read && ' ✓✓'}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border-subtle">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,.pdf,.doc,.docx" />
                    <span className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">attach_file</span>
                  </label>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Xabar yozing..."
                    className="flex-1 bg-surface-container border border-border-subtle text-on-surface rounded-full px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim() || sending}
                    className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center hover:brightness-110 disabled:opacity-50 transition-all"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-on-surface-variant">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl mb-4">chat</span>
                <p>Suhbatni tanlang</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  )
}
