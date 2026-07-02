import { useState, useEffect } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import { adminService, AnalyticsData } from '../services/admin'

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getAnalytics()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const maxIncome = data ? Math.max(...data.monthly_data.map(d => d.income), 1) : 1

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-text-primary">Analitika</h2>
        <p className="text-on-surface-variant font-body-md">Batafsil statistika va tahlillar</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div></div>
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-gutter">
            <div className="glass-panel p-6 rounded-xl">
              <p className="text-on-surface-variant font-label-caps text-label-caps mb-2">Jami tushum</p>
              <h3 className="text-headline-md font-headline-md text-primary-fixed-dim">{data.total_revenue.toLocaleString()} so'm</h3>
            </div>
            <div className="glass-panel p-6 rounded-xl">
              <p className="text-on-surface-variant font-label-caps text-label-caps mb-2">O'rtacha bron narxi</p>
              <h3 className="text-headline-md font-headline-md text-primary-fixed-dim">{Math.round(data.avg_booking_price).toLocaleString()} so'm</h3>
            </div>
            <div className="glass-panel p-6 rounded-xl">
              <p className="text-on-surface-variant font-label-caps text-label-caps mb-2">Bekor qilish foizi</p>
              <h3 className="text-headline-md font-headline-md text-primary-fixed-dim">{data.cancel_rate}%</h3>
            </div>
            <div className="glass-panel p-6 rounded-xl">
              <p className="text-on-surface-variant font-label-caps text-label-caps mb-2">Bekor qilingan bronlar</p>
              <h3 className="text-headline-md font-headline-md text-error">{data.cancelled_count}</h3>
            </div>
          </div>

          {/* Monthly Chart */}
          <div className="glass-panel p-6 rounded-xl mb-gutter">
            <h4 className="text-headline-md font-headline-md text-text-primary mb-6">Oylik tushum (so'nggi 12 oy)</h4>
            <div className="h-[300px] flex items-end justify-between gap-1">
              {data.monthly_data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-primary-fixed-dim/30 rounded-t hover:bg-primary-fixed-dim/50 transition-colors relative group"
                    style={{ height: `${Math.max((d.income / maxIncome) * 100, 3)}%` }}>
                    <div className="hidden group-hover:block absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-overlay border border-border-subtle p-2 rounded text-[10px] font-label-caps z-10 whitespace-nowrap">
                      {d.income.toLocaleString()} so'm
                    </div>
                  </div>
                  <span className="text-[9px] font-label-caps text-on-surface-variant mt-2">{d.month.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Table */}
          <div className="ghost-border rounded-xl overflow-hidden bg-surface-container-low">
            <table className="w-full text-left">
              <thead><tr className="bg-surface-container border-b border-border-subtle">
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">OY</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">BRONLAR</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">TUSHUM</th>
              </tr></thead>
              <tbody className="divide-y divide-border-subtle">
                {data.monthly_data.slice().reverse().map((d, i) => (
                  <tr key={i} className="hover:bg-primary/5">
                    <td className="px-4 py-3 text-text-primary font-body-md">{d.month}</td>
                    <td className="px-4 py-3 text-on-surface font-body-md">{d.bookings}</td>
                    <td className="px-4 py-3 text-primary-fixed-dim font-body-md">{d.income.toLocaleString()} so'm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center py-16 text-on-surface-variant">Ma'lumotlar yuklanmadi</div>
      )}
    </AdminLayout>
  )
}
