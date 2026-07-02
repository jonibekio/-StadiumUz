import { useState, useEffect } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import { adminService, DashboardStats, DashboardCharts, AdminBooking } from '../services/admin'

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [charts, setCharts] = useState<DashboardCharts | null>(null)
  const [bookings, setBookings] = useState<AdminBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'year'>('week')

  useEffect(() => {
    Promise.all([
      adminService.getStats().catch(() => null),
      adminService.getCharts(chartPeriod).catch(() => null),
      adminService.getBookings({ page: 1 }).catch(() => ({ results: [], count: 0 })),
    ])
      .then(([s, c, b]) => {
        setStats(s)
        setCharts(c)
        setBookings(b?.results || [])
      })
      .finally(() => setLoading(false))
  }, [chartPeriod])

  const statusLabel: Record<string, string> = {
    PENDING: 'Kutilmoqda',
    CONFIRMED: "To'langan",
    CANCELLED: 'Bekor qilingan',
    COMPLETED: 'Yakunlangan',
  }

  const statusClass: Record<string, string> = {
    PENDING: 'status-badge-pending',
    CONFIRMED: 'status-badge-paid',
    CANCELLED: 'status-badge-cancelled',
    COMPLETED: 'status-badge-paid',
  }

  const maxIncome = charts ? Math.max(...charts.income, 1) : 1
  const chartBarHeights = charts ? charts.income.map(v => Math.round((v / maxIncome) * 100)) : []
  const maxBookings = stats ? Math.max(stats.booked_today + stats.available_today, 1) : 1
  const occupancy = stats ? Math.round((stats.booked_today / maxBookings) * 100) : 0

  return (
    <AdminLayout>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-text-primary">Tizim sharhi</h2>
          <p className="text-on-surface-variant font-body-md">Real vaqtdagi samaradorlik va tranzaksiyalar monitoringi.</p>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-gutter">
            {[
              { icon: 'calendar_month', label: 'Bugungi bronlar', value: String(stats?.today_bookings ?? 0), color: 'text-primary-fixed-dim' },
              { icon: 'payments', label: 'Oylik tushum', value: `${(stats?.monthly_income ?? 0).toLocaleString()} so'm`, color: 'text-primary-fixed-dim' },
              { icon: 'event_available', label: "Bo'sh slotlar", value: String(stats?.available_today ?? 0), color: 'text-primary-fixed-dim' },
              { icon: 'event_busy', label: 'Band slotlar', value: String(stats?.booked_today ?? 0), color: 'text-primary-fixed-dim' },
            ].map((kpi) => (
              <div key={kpi.icon} className="glass-panel p-6 rounded-xl flex flex-col justify-between group hover:border-primary-fixed-dim/40 transition-colors">
                <div className="flex justify-between items-start">
                  <span className="material-symbols-outlined text-primary-fixed-dim p-2 bg-primary/5 rounded-lg">{kpi.icon}</span>
                </div>
                <div className="mt-4">
                  <p className="text-on-surface-variant font-label-caps text-label-caps">{kpi.label}</p>
                  <h3 className={`text-headline-md font-headline-md mt-1 ${kpi.color}`}>{kpi.value}</h3>
                </div>
              </div>
            ))}
          </section>

          {/* Stats Row */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-gutter">
            <div className="glass-panel p-6 rounded-xl text-center">
              <p className="text-on-surface-variant font-label-caps text-label-caps mb-2">Jami foydalanuvchilar</p>
              <h3 className="text-headline-lg font-headline-lg text-primary-fixed-dim">{stats?.total_users ?? 0}</h3>
            </div>
            <div className="glass-panel p-6 rounded-xl text-center">
              <p className="text-on-surface-variant font-label-caps text-label-caps mb-2">Faol stadionlar</p>
              <h3 className="text-headline-lg font-headline-lg text-primary-fixed-dim">{stats?.total_stadiums ?? 0}</h3>
            </div>
            <div className="glass-panel p-6 rounded-xl text-center">
              <p className="text-on-surface-variant font-label-caps text-label-caps mb-2">Jami bronlar</p>
              <h3 className="text-headline-lg font-headline-lg text-primary-fixed-dim">{stats?.total_bookings ?? 0}</h3>
            </div>
          </section>

          {/* Charts & Bookings */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
            {/* Revenue Chart */}
            <div className="xl:col-span-2 glass-panel p-6 rounded-xl flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="text-headline-md font-headline-md text-text-primary">Daromad statistikasi</h4>
                  <p className="text-on-surface-variant text-body-sm">
                    {chartPeriod === 'week' ? 'Oxirgi 7 kun' : chartPeriod === 'month' ? 'Oxirgi 30 kun' : 'Oxirgi 12 oy'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {(['week', 'month', 'year'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setChartPeriod(p)}
                      className={`px-3 py-1 text-label-caps font-label-caps rounded border transition-colors ${
                        chartPeriod === p
                          ? 'bg-primary/10 text-primary-fixed-dim border-primary/20'
                          : 'bg-surface-variant/20 border-border-subtle hover:bg-surface-variant/40'
                      }`}
                    >
                      {p === 'week' ? 'Hafta' : p === 'month' ? 'Oy' : 'Yil'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 relative mt-auto">
                <div className="absolute inset-0 flex items-end justify-between px-2">
                  {chartBarHeights.length > 0 ? chartBarHeights.map((h, i) => (
                    <div
                      key={i}
                      className="w-[4%] min-w-[8px] rounded-t transition-all hover:brightness-125 bg-surface-variant/20 hover:bg-primary-fixed-dim/40"
                      style={{ height: `${Math.max(h, 5)}%` }}
                    ></div>
                  )) : (
                    Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="w-[12%] rounded-t bg-surface-variant/10" style={{ height: '10%' }}></div>
                    ))
                  )}
                </div>
                <div className="absolute bottom-[-24px] w-full flex justify-between text-[10px] font-label-caps text-on-surface-variant overflow-hidden">
                  {charts?.labels?.map((l, i) => (
                    <span key={i}>{l}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="glass-panel p-6 rounded-xl flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-headline-md font-headline-md text-text-primary">So'nggi bronlar</h4>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto">
                {bookings.length === 0 ? (
                  <p className="text-on-surface-variant text-center py-8 text-sm">Bronlar topilmadi</p>
                ) : (
                  bookings.slice(0, 6).map((b) => (
                    <div key={b.id} className="flex items-center justify-between py-3 border-b border-border-subtle/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center">
                          <span className="material-symbols-outlined text-on-surface-variant">sports_soccer</span>
                        </div>
                        <div>
                          <p className="text-body-sm font-medium text-text-primary">{b.customer_name || 'Noma\'lum'}</p>
                          <p className="text-[10px] font-label-caps text-on-surface-variant uppercase">
                            {b.slot?.date} {b.slot?.start_time?.slice(0, 5)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`${statusClass[b.status] || 'status-badge-pending'} px-2 py-0.5 rounded text-[10px] font-label-caps`}>
                          {statusLabel[b.status] || b.status}
                        </span>
                        <p className="text-[10px] font-label-caps text-on-surface-variant mt-1">
                          {Number(b.total_price).toLocaleString()} so'm
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <section className="mt-gutter grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="glass-panel p-6 rounded-xl flex flex-col justify-center items-center text-center">
              <div className="w-24 h-24 rounded-full border-4 border-primary-fixed-dim/20 flex items-center justify-center mb-4 relative">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle className="text-primary-fixed-dim" cx="48" cy="48" fill="transparent" r="44" stroke="currentColor" strokeDasharray="276" strokeDashoffset={276 - (276 * occupancy / 100)} strokeWidth="4"></circle>
                </svg>
                <span className="font-headline-md text-primary-fixed-dim">{occupancy}%</span>
              </div>
              <h4 className="text-headline-md font-headline-md text-text-primary">Bandlik darajasi</h4>
              <p className="text-on-surface-variant text-body-sm max-w-[240px] mt-2">Barcha slotlar bo'yicha joriy foydalanish.</p>
            </div>
            <div className="glass-panel p-6 rounded-xl flex flex-col justify-center items-center text-center">
              <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center mb-4">
                <span className="font-headline-lg text-primary">{stats?.today_bookings ?? 0}</span>
              </div>
              <h4 className="text-headline-md font-headline-md text-text-primary">Bugungi bronlar</h4>
              <p className="text-on-surface-variant text-body-sm max-w-[240px] mt-2">Bugun tasdiqlangan bronlar soni.</p>
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  )
}
