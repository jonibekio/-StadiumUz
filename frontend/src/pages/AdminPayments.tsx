import { useState, useEffect } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import { adminService, AdminPayment } from '../services/admin'

const methodLabels: Record<string, string> = { CASH: 'Naqd', CARD: 'Karta', CLICK: 'Click', PAYME: 'Payme', UZUM: 'Uzum' }
const statusLabels: Record<string, string> = { PENDING: 'Kutilmoqda', COMPLETED: "To'langan", FAILED: 'Xatolik', REFUNDED: 'Qaytarilgan' }
const statusClass: Record<string, string> = { PENDING: 'status-badge-pending', COMPLETED: 'status-badge-paid', FAILED: 'status-badge-cancelled', REFUNDED: 'status-badge-pending' }

export default function AdminPayments() {
  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')

  const fetchPayments = () => {
    setLoading(true)
    adminService.getPayments({ status: statusFilter, search, page })
      .then((res) => { setPayments(res.results); setCount(res.count) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPayments() }, [page, statusFilter, search])

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-text-primary">To'lovlar</h2>
        <p className="text-on-surface-variant font-body-md">{count} ta to'lov</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input type="text" placeholder="Qidirish..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none" />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none">
          <option value="">Barchasi</option>
          <option value="COMPLETED">To'langan</option>
          <option value="PENDING">Kutilmoqda</option>
          <option value="FAILED">Xatolik</option>
          <option value="REFUNDED">Qaytarilgan</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="ghost-border rounded-xl overflow-hidden bg-surface-container-low">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-surface-container border-b border-border-subtle">
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">TR ID</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">FOYDALANUVCHI</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">SUMMA</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">USUL</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">STATUS</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">SANA</th>
              </tr></thead>
              <tbody className="divide-y divide-border-subtle">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-3 text-on-surface font-label-caps text-[12px]">{p.transaction_id || '-'}</td>
                    <td className="px-4 py-3 text-text-primary font-body-md">{p.user_name || 'Noma\'lum'}</td>
                    <td className="px-4 py-3 text-primary-fixed-dim font-body-md">{Number(p.amount).toLocaleString()} so'm</td>
                    <td className="px-4 py-3 text-on-surface font-body-sm">{methodLabels[p.method] || p.method}</td>
                    <td className="px-4 py-3"><span className={`${statusClass[p.status] || ''} px-2 py-0.5 rounded text-[11px] font-label-caps`}>{statusLabels[p.status] || p.status}</span></td>
                    <td className="px-4 py-3 text-on-surface-variant text-[13px]">{new Date(p.created_at).toLocaleDateString('uz-UZ')}</td>
                  </tr>
                ))}
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
