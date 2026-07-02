import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/layout/AdminLayout'
import { adminService, AdminBooking } from '../services/admin'
import { chatService, ChatRoom } from '../services/chat'

const statusOptions = [
  { value: '', label: 'Barchasi' },
  { value: 'PENDING', label: 'Kutilmoqda' },
  { value: 'CONFIRMED', label: 'Tasdiqlangan' },
  { value: 'REJECTED', label: 'Rad etilgan' },
  { value: 'CANCELLED', label: 'Bekor qilingan' },
  { value: 'COMPLETED', label: 'Tugallangan' },
]

const statusLabel: Record<string, string> = { PENDING: 'Kutilmoqda', CONFIRMED: 'Tasdiqlangan', REJECTED: 'Rad etilgan', CANCELLED: 'Bekor qilingan', COMPLETED: 'Tugallangan' }
const statusClass: Record<string, string> = { PENDING: 'status-badge-pending', CONFIRMED: 'status-badge-paid', REJECTED: 'status-badge-cancelled', CANCELLED: 'status-badge-cancelled', COMPLETED: 'status-badge-paid' }

export default function AdminBookings() {
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  const fetchBookings = () => {
    setLoading(true)
    adminService.getBookings({ status: statusFilter, search, page })
      .then((res) => { setBookings(res.results); setCount(res.count) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBookings() }, [page, statusFilter, search])

  useEffect(() => {
    chatService.getRooms().then(setChatRooms).catch(() => {})
  }, [])

  const handleApprove = async (id: string) => {
    if (!confirm('Bronni tasdiqlashni xohlaysizmi?')) return
    try {
      await adminService.approveBooking(id)
      fetchBookings()
      // Refresh chat rooms
      chatService.getRooms().then(setChatRooms).catch(() => {})
    } catch {}
  }

  const handleReject = async (id: string) => {
    const reason = prompt('Rad etish sababi (ixtiyoriy):')
    if (reason === null) return
    try {
      await adminService.rejectBooking(id, reason)
      fetchBookings()
    } catch {}
  }

  const getChatRoom = (bookingId: string) => {
    return chatRooms.find(r => r.booking === bookingId)
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-text-primary">Bronlar</h2>
        <p className="text-on-surface-variant font-body-md">{count} ta bron</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input type="text" placeholder="Foydalanuvchi qidirish..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none" />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none">
          {statusOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="ghost-border rounded-xl overflow-hidden bg-surface-container-low">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-surface-container border-b border-border-subtle">
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">FOYDALANUVCHI</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">SANA</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">VAQT</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">NARX</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">STATUS</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">HARAKAT</th>
              </tr></thead>
              <tbody className="divide-y divide-border-subtle">
                {bookings.map((b) => {
                  const chatRoom = getChatRoom(b.id)
                  return (
                    <tr key={b.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-4 py-3 text-text-primary font-body-md">{b.customer_name || 'Noma\'lum'}</td>
                      <td className="px-4 py-3 text-on-surface font-label-caps text-[13px]">{b.slot?.date}</td>
                      <td className="px-4 py-3 text-on-surface font-label-caps text-[13px]">{b.slot?.start_time?.slice(0, 5)} - {b.slot?.end_time?.slice(0, 5)}</td>
                      <td className="px-4 py-3 text-primary-fixed-dim font-body-md">{Number(b.total_price).toLocaleString()} so'm</td>
                      <td className="px-4 py-3"><span className={`${statusClass[b.status] || ''} px-2 py-0.5 rounded text-[11px] font-label-caps`}>{statusLabel[b.status] || b.status}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {b.status === 'PENDING' && (
                            <>
                              <button onClick={() => handleApprove(b.id)} className="px-2 py-1 rounded bg-primary/10 text-primary text-[11px] font-label-caps hover:bg-primary/20 transition-colors">Tasdiqlash</button>
                              <button onClick={() => handleReject(b.id)} className="px-2 py-1 rounded bg-error/10 text-error text-[11px] font-label-caps hover:bg-error/20 transition-colors">Rad etish</button>
                            </>
                          )}
                          {chatRoom && (
                            <Link to={`/chat/${chatRoom.id}`} className="px-2 py-1 rounded bg-secondary/10 text-secondary text-[11px] font-label-caps hover:bg-secondary/20 transition-colors flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">chat</span> Chat
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {count > 20 && (
            <div className="flex justify-center items-center gap-4 py-4 border-t border-border-subtle">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded ghost-border text-on-surface disabled:opacity-30">Oldingi</button>
              <span className="text-on-surface-variant text-sm">{page} / {Math.ceil(count / 20)}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(count / 20)} className="px-4 py-2 rounded ghost-border text-on-surface disabled:opacity-30">Keyingi</button>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}
