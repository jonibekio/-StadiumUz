import { useState, useEffect } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import api from '../services/api'

interface Slot {
  id: string
  date: string
  start_time: string
  end_time: string
  price: number
  status: string
  stadium: string | null
}

export default function AdminSlots() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [dateFilter, setDateFilter] = useState('')
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkForm, setBulkForm] = useState({
    date: new Date().toISOString().split('T')[0],
    start_hour: 8,
    end_hour: 23,
    slot_duration_minutes: 60,
    price: 150000,
  })
  const [bulkLoading, setBulkLoading] = useState(false)
  const [bulkResult, setBulkResult] = useState('')

  const fetchSlots = () => {
    setLoading(true)
    const q = new URLSearchParams()
    if (dateFilter) q.set('date', dateFilter)
    if (page > 1) q.set('page', String(page))
    api.get(`/admin/slots/?${q.toString()}`)
      .then((res) => { setSlots(res.data.results || res.data); setCount(res.data.count || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchSlots() }, [page, dateFilter])

  const handleBulkCreate = async () => {
    setBulkLoading(true); setBulkResult('')
    try {
      const res = await api.post('/admin/slots/bulk/', bulkForm)
      const created = Array.isArray(res.data) ? res.data.length : 0
      setBulkResult(`${created} ta slot yaratildi!`)
      setShowBulkModal(false)
      fetchSlots()
    } catch (err: any) {
      setBulkResult(err.response?.data?.error || 'Xatolik yuz berdi')
    } finally { setBulkLoading(false) }
  }

  const handleDeleteSlot = async (id: string) => {
    if (!confirm('Slotni o\'chirishni xohlaysizmi?')) return
    try {
      await api.delete(`/admin/slots/${id}/`)
      fetchSlots()
    } catch {}
  }

  const statusLabel: Record<string, string> = { AVAILABLE: 'Bo\'sh', BOOKED: 'Band', CANCELLED: 'Bekor' }
  const statusClass: Record<string, string> = { AVAILABLE: 'bg-primary/10 text-primary-fixed-dim', BOOKED: 'bg-error/10 text-error', CANCELLED: 'bg-surface-variant text-on-surface-variant' }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-text-primary">Vaqt slotlari</h2>
          <p className="text-on-surface-variant font-body-md">{count} ta slot</p>
        </div>
        <button onClick={() => setShowBulkModal(true)} className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-button-text hover:brightness-110 flex items-center gap-2 transition-all">
          <span className="material-symbols-outlined">add</span> Slotlar qo'shish
        </button>
      </div>

      {/* Date Filter */}
      <div className="flex gap-4 mb-6">
        <input type="date" value={dateFilter} onChange={(e) => { setDateFilter(e.target.value); setPage(1) }}
          className="bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none" />
        {dateFilter && (
          <button onClick={() => { setDateFilter(''); setPage(1) }} className="text-primary text-sm hover:underline">Tozalash</button>
        )}
      </div>

      {bulkResult && (
        <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">{bulkResult}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="ghost-border rounded-xl overflow-hidden bg-surface-container-low">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-surface-container border-b border-border-subtle">
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">SANA</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">BOSHLANISH</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">TUGASH</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">NARX</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">HOLAT</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant"></th>
              </tr></thead>
              <tbody className="divide-y divide-border-subtle">
                {slots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-3 text-text-primary font-body-md">{slot.date}</td>
                    <td className="px-4 py-3 text-on-surface font-label-caps">{slot.start_time?.slice(0, 5)}</td>
                    <td className="px-4 py-3 text-on-surface font-label-caps">{slot.end_time?.slice(0, 5)}</td>
                    <td className="px-4 py-3 text-primary-fixed-dim font-body-md">{Number(slot.price).toLocaleString()} so'm</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-label-caps ${statusClass[slot.status] || ''}`}>
                        {statusLabel[slot.status] || slot.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDeleteSlot(slot.id)} className="text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {count > 50 && (
            <div className="flex justify-center items-center gap-4 py-4 border-t border-border-subtle">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded ghost-border text-on-surface disabled:opacity-30">Oldingi</button>
              <span className="text-on-surface-variant text-sm">{page} / {Math.ceil(count / 50)}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(count / 50)} className="px-4 py-2 rounded ghost-border text-on-surface disabled:opacity-30">Keyingi</button>
            </div>
          )}
        </div>
      )}

      {/* Bulk Create Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowBulkModal(false)}>
          <div className="bg-surface-container border border-border-subtle rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-headline-md text-headline-md text-text-primary mb-6">Slotlar yaratish</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[11px]">Sana</label>
                <input type="date" value={bulkForm.date} onChange={(e) => setBulkForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full bg-surface border border-border-subtle text-on-surface rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[11px]">Boshlanish (soat)</label>
                  <select value={bulkForm.start_hour} onChange={(e) => setBulkForm(f => ({ ...f, start_hour: Number(e.target.value) }))}
                    className="w-full bg-surface border border-border-subtle text-on-surface rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none">
                    {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[11px]">Tugash (soat)</label>
                  <select value={bulkForm.end_hour} onChange={(e) => setBulkForm(f => ({ ...f, end_hour: Number(e.target.value) }))}
                    className="w-full bg-surface border border-border-subtle text-on-surface rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none">
                    {Array.from({ length: 24 }, (_, i) => <option key={i} value={i + 1}>{String(i + 1).padStart(2, '0')}:00</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[11px]">Davomiylik (daqiqa)</label>
                  <select value={bulkForm.slot_duration_minutes} onChange={(e) => setBulkForm(f => ({ ...f, slot_duration_minutes: Number(e.target.value) }))}
                    className="w-full bg-surface border border-border-subtle text-on-surface rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none">
                    <option value={30}>30 daqiqa</option>
                    <option value={60}>60 daqiqa</option>
                    <option value={90}>90 daqiqa</option>
                    <option value={120}>120 daqiqa</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[11px]">Narx (so'm)</label>
                  <input type="number" value={bulkForm.price} onChange={(e) => setBulkForm(f => ({ ...f, price: Number(e.target.value) }))}
                    className="w-full bg-surface border border-border-subtle text-on-surface rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowBulkModal(false)} className="px-6 py-2 rounded-lg ghost-border text-on-surface-variant hover:bg-surface-variant/10 font-button-text transition-all">Bekor</button>
              <button onClick={handleBulkCreate} disabled={bulkLoading} className="px-6 py-2 rounded-lg bg-primary-container text-on-primary-container font-button-text hover:brightness-110 disabled:opacity-50 transition-all">
                {bulkLoading ? 'Yaratilmoqda...' : 'Yaratish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
