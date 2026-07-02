import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserLayout from '../components/layout/UserLayout'
import { useAuth } from '../hooks/useAuth'
import { bookingService, Booking } from '../services/booking'
import { chatService, ChatRoom } from '../services/chat'

const statusTabs = [
  { key: '', label: 'Barchasi' },
  { key: 'PENDING', label: 'Kutilmoqda' },
  { key: 'CONFIRMED', label: 'Tasdiqlangan' },
  { key: 'REJECTED', label: 'Rad etilgan' },
  { key: 'COMPLETED', label: 'Tugallangan' },
]

const statusLabel: Record<string, string> = {
  PENDING: 'Kutilmoqda',
  CONFIRMED: 'Tasdiqlangan',
  REJECTED: 'Rad etilgan',
  CANCELLED: 'Bekor qilingan',
  COMPLETED: 'Tugallangan',
}

const statusColor: Record<string, string> = {
  PENDING: 'text-tertiary-fixed-dim',
  CONFIRMED: 'text-primary-fixed-dim',
  REJECTED: 'text-error',
  CANCELLED: 'text-error',
  COMPLETED: 'text-primary-fixed-dim',
}

const statusIcon: Record<string, string> = {
  PENDING: 'hourglass_top',
  CONFIRMED: 'check_circle',
  REJECTED: 'cancel',
  CANCELLED: 'event_busy',
  COMPLETED: 'task_alt',
}

export default function UserDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  useEffect(() => {
    bookingService.getMyBookings()
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    chatService.getRooms()
      .then(setChatRooms)
      .catch(() => {})
  }, [])

  const filteredBookings = activeTab
    ? bookings.filter(b => b.status === activeTab)
    : bookings

  const handleCancel = async (id: string) => {
    if (!confirm('Bronni bekor qilishni xohlaysizmi?')) return
    try {
      await bookingService.cancelBooking(id)
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b))
    } catch {}
  }

  const getChatRoom = (bookingId: string) => {
    return chatRooms.find(r => r.booking === bookingId)
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-text-primary mb-2">
              Xush kelibsiz, {user?.first_name || 'Foydalanuvchi'}!
            </h1>
            <p className="font-body-md text-on-surface-variant">Mening bronlarim</p>
          </div>
          <Link to="/stadionlar" className="bg-primary-container text-on-primary font-button-text px-8 py-3 rounded-lg hover:scale-95 transition-transform stadium-glow w-fit inline-block text-center">
            Yangi bron qilish
          </Link>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full font-label-caps text-label-caps whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-primary-container text-on-primary-container'
                  : 'ghost-border text-on-surface-variant hover:bg-surface-variant/10'
              }`}
            >
              {tab.label}
              {tab.key && (
                <span className="ml-1 text-[10px]">
                  ({bookings.filter(b => b.status === tab.key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-16 ghost-border rounded-xl bg-surface-container-low">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">calendar_today</span>
            <h3 className="font-headline-md text-headline-md text-text-primary mb-2">Bronlar topilmadi</h3>
            <p className="text-on-surface-variant mb-6">
              {activeTab ? 'Bu kategoriyada bronlar yo\'q' : 'Hali birorta bron qilmagansiz'}
            </p>
            <Link to="/stadionlar" className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-button-text inline-block hover:brightness-110 transition-all">
              Stadion topish
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const chatRoom = getChatRoom(booking.id)
              return (
                <div key={booking.id} className="ghost-border rounded-xl bg-surface-container-low p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant">sports_soccer</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`material-symbols-outlined text-[18px] ${statusColor[booking.status]}`}>
                            {statusIcon[booking.status]}
                          </span>
                          <span className={`font-label-caps text-label-caps ${statusColor[booking.status]}`}>
                            {statusLabel[booking.status]}
                          </span>
                        </div>
                        <p className="text-text-primary font-body-md font-semibold">
                          {booking.slot?.date} • {booking.slot?.start_time?.slice(0, 5)} - {booking.slot?.end_time?.slice(0, 5)}
                        </p>
                        <p className="text-on-surface-variant text-body-sm">
                          {Number(booking.total_price).toLocaleString()} so'm
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {booking.status === 'CONFIRMED' && chatRoom && (
                        <Link
                          to={`/chat/${chatRoom.id}`}
                          className="px-4 py-2 rounded-lg ghost-border text-primary hover:bg-primary/10 font-label-caps text-label-caps flex items-center gap-1 transition-all"
                        >
                          <span className="material-symbols-outlined text-[16px]">chat</span>
                          Admin bilan yozish
                        </Link>
                      )}
                      {booking.status === 'PENDING' && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="px-4 py-2 rounded-lg ghost-border text-error hover:bg-error/10 font-label-caps text-label-caps transition-all"
                        >
                          Bekor qilish
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </UserLayout>
  )
}
