import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserLayout from '../components/layout/UserLayout'
import { notificationService, Notification } from '../services/notification'

const typeIcons: Record<string, string> = {
  BOOKING_PENDING: 'hourglass_top',
  BOOKING_CONFIRMED: 'check_circle',
  BOOKING_REJECTED: 'cancel',
  BOOKING_CANCELLED: 'event_busy',
  BOOKING_COMPLETED: 'task_alt',
  NEW_USER: 'person_add',
  PAYMENT: 'payments',
  SYSTEM: 'info',
  CHAT_MESSAGE: 'chat',
}

const typeColors: Record<string, string> = {
  BOOKING_PENDING: 'text-tertiary-fixed-dim',
  BOOKING_CONFIRMED: 'text-primary-fixed-dim',
  BOOKING_REJECTED: 'text-error',
  BOOKING_CANCELLED: 'text-error',
  BOOKING_COMPLETED: 'text-primary-fixed-dim',
  NEW_USER: 'text-secondary',
  PAYMENT: 'text-primary-fixed-dim',
  SYSTEM: 'text-on-surface-variant',
  CHAT_MESSAGE: 'text-secondary',
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notificationService.list()
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleMarkRead = async (id: string) => {
    try {
      await notificationService.markRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch {}
  }

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch {}
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-text-primary mb-2">Bildirishnomalar</h1>
            <p className="font-body-md text-on-surface-variant">
              {unreadCount > 0 ? `${unreadCount} ta o'qilmagan` : 'Barchasi o\'qilgan'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-primary font-label-caps text-label-caps hover:underline"
            >
              Barchasini o'qilgan belgilash
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 ghost-border rounded-xl bg-surface-container-low">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">notifications_none</span>
            <h3 className="font-headline-md text-headline-md text-text-primary mb-2">Bildirishnomalar yo'q</h3>
            <p className="text-on-surface-variant">Hali birorta bildirishnoma kelmagan</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  notif.is_read
                    ? 'bg-surface-container-low border-border-subtle/50'
                    : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`material-symbols-outlined text-2xl ${typeColors[notif.type] || 'text-on-surface-variant'}`}>
                    {typeIcons[notif.type] || 'info'}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-text-primary font-body-md font-semibold">{notif.title}</p>
                      {!notif.is_read && <span className="w-2 h-2 rounded-full bg-primary-container"></span>}
                    </div>
                    <p className="text-on-surface-variant text-body-sm">{notif.message}</p>
                    <p className="text-on-surface-variant/60 text-[11px] mt-1">
                      {new Date(notif.created_at).toLocaleString('uz-UZ')}
                    </p>
                  </div>
                  {notif.link && (
                    <Link to={notif.link} className="text-primary text-sm hover:underline">
                      Ko'rish
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  )
}
