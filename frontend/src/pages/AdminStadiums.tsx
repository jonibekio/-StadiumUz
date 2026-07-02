import { useState, useEffect } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import { adminService, AdminStadium } from '../services/admin'

const regions = [
  { value: '', label: 'Barcha' },
  { value: 'TOSHKENT_SHAHAR', label: 'Toshkent shahri' },
  { value: 'TOSHKENT_VILOYATI', label: 'Toshkent vil.' },
  { value: 'SAMARQAND', label: 'Samarqand' },
  { value: 'BUXORO', label: 'Buxoro' },
  { value: 'ANDIJON', label: 'Andijon' },
  { value: 'FARGONA', label: "Farg'ona" },
  { value: 'NAMANGAN', label: 'Namangan' },
  { value: 'QASHQADARYO', label: 'Qashqadaryo' },
  { value: 'SURXONDARYO', label: 'Surxondaryo' },
  { value: 'JIZZAX', label: 'Jizzax' },
  { value: 'SIRDARYO', label: 'Sirdaryo' },
  { value: 'NAVOIY', label: 'Navoiy' },
  { value: 'XORAZM', label: 'Xorazm' },
  { value: 'QORAQALPOGISTON', label: 'Qoraqalpog\'iston' },
]

const emptyForm = {
  name: '', description: '', region: 'TOSHKENT_SHAHAR', address: '', district: '',
  phone: '', field_type: '5x5', surface_type: 'ARTIFICIAL', price_per_hour: 100000,
  is_active: true, is_premium: false, badge: '', image_url: '',
  working_hours_start: '08:00', working_hours_end: '23:00',
}

export default function AdminStadiums() {
  const [stadiums, setStadiums] = useState<AdminStadium[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchStadiums = () => {
    setLoading(true)
    adminService.getStadiums({ search, region: regionFilter, page })
      .then((res) => { setStadiums(res.results); setCount(res.count) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchStadiums() }, [page, search, regionFilter])

  const openCreate = () => { setEditId(null); setForm(emptyForm); setShowModal(true); setError('') }
  const openEdit = (s: AdminStadium) => {
    setEditId(s.id)
    setForm({
      name: s.name, description: s.description, region: s.region, address: s.address,
      district: s.district, phone: s.phone, field_type: s.field_type, surface_type: s.surface_type,
      price_per_hour: Number(s.price_per_hour), is_active: s.is_active, is_premium: s.is_premium,
      badge: s.badge, image_url: s.image_url, working_hours_start: s.working_hours_start,
      working_hours_end: s.working_hours_end,
    })
    setShowModal(true); setError('')
  }

  const handleSave = async () => {
    if (!form.name || !form.address) { setError('Nomi va manzil shart'); return }
    setSaving(true); setError('')
    try {
      if (editId) {
        await adminService.updateStadium(editId, form)
      } else {
        await adminService.createStadium(form)
      }
      setShowModal(false); fetchStadiums()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Xatolik yuz berdi')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Stadionni o\'chirishni xohlaysizmi?')) return
    try { await adminService.deleteStadium(id); fetchStadiums() } catch {}
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-text-primary">Stadionlar</h2>
          <p className="text-on-surface-variant font-body-md">{count} ta stadion</p>
        </div>
        <button onClick={openCreate} className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-button-text hover:brightness-110 flex items-center gap-2 transition-all">
          <span className="material-symbols-outlined">add</span> Yangi stadion
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text" placeholder="Qidirish..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          className="flex-1 bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none"
        />
        <select value={regionFilter} onChange={(e) => { setRegionFilter(e.target.value); setPage(1) }}
          className="bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none">
          {regions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="ghost-border rounded-xl overflow-hidden bg-surface-container-low">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-surface-container border-b border-border-subtle">
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">NOMI</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">VILOYAT</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">TURI</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">NARX</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant">HOLAT</th>
                <th className="px-4 py-3 font-label-caps text-label-caps text-on-surface-variant"></th>
              </tr></thead>
              <tbody className="divide-y divide-border-subtle">
                {stadiums.map((s) => (
                  <tr key={s.id} className="hover:bg-primary/5 transition-colors">
                    <td className="px-4 py-3"><p className="text-text-primary font-body-md">{s.name}</p><p className="text-[11px] text-on-surface-variant">{s.address}</p></td>
                    <td className="px-4 py-3 text-on-surface text-body-sm">{s.region_display || s.region}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-surface-variant/30 text-[11px] font-label-caps">{s.field_type}</span></td>
                    <td className="px-4 py-3 text-primary-fixed-dim font-body-md">{Number(s.price_per_hour).toLocaleString()} so'm</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-label-caps ${s.is_active ? 'bg-primary/10 text-primary-fixed-dim' : 'bg-error/10 text-error'}`}>
                        {s.is_active ? 'Faol' : 'Nofaol'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(s)} className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                        <button onClick={() => handleDelete(s.id)} className="text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {count > 20 && (
            <div className="flex justify-center items-center gap-4 py-4 border-t border-border-subtle">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded ghost-border text-on-surface disabled:opacity-30">Oldingi</button>
              <span className="text-on-surface-variant text-sm">Sahifa {page} / {Math.ceil(count / 20)}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(count / 20)} className="px-4 py-2 rounded ghost-border text-on-surface disabled:opacity-30">Keyingi</button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-surface-container border border-border-subtle rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-headline-md text-headline-md text-text-primary mb-6">{editId ? 'Stadionni tahrirlash' : 'Yangi stadion'}</h3>
            {error && <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Nomi', key: 'name', type: 'text', required: true },
                { label: 'Viloyat', key: 'region', type: 'select', options: regions.slice(1) },
                { label: 'Tuman', key: 'district', type: 'text' },
                { label: 'Manzil', key: 'address', type: 'text', required: true },
                { label: 'Telefon', key: 'phone', type: 'tel' },
                { label: 'Narx (so\'m/soat)', key: 'price_per_hour', type: 'number' },
                { label: 'Maydon turi', key: 'field_type', type: 'select', options: [{ value: '5x5', label: '5x5' }, { value: '7x7', label: '7x7' }, { value: '11x11', label: '11x11' }] },
                { label: 'Qoplama', key: 'surface_type', type: 'select', options: [{ value: 'ARTIFICIAL', label: "Sun'iy" }, { value: 'NATURAL', label: 'Tabiiy' }, { value: 'HYBRID', label: 'Gibrid' }, { value: 'PREMIUM_ARTIFICIAL', label: "Premium sun'iy" }] },
                { label: 'Ish boshlanish', key: 'working_hours_start', type: 'time' },
                { label: 'Ish tugash', key: 'working_hours_end', type: 'time' },
                { label: 'Rasm URL', key: 'image_url', type: 'url' },
                { label: 'Badge', key: 'badge', type: 'text' },
              ].map((field) => (
                <div key={field.key} className="space-y-1">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[11px]">{field.label}</label>
                  {field.type === 'select' ? (
                    <select value={(form as any)[field.key]} onChange={(e) => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full bg-surface border border-border-subtle text-on-surface rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none">
                      {field.options!.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <input type={field.type} value={(form as any)[field.key]} required={field.required}
                      onChange={(e) => setForm(f => ({ ...f, [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value }))}
                      className="w-full bg-surface border border-border-subtle text-on-surface rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none" />
                  )}
                </div>
              ))}
              <div className="space-y-1 md:col-span-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[11px]">Tavsif</label>
                <textarea value={form.description} rows={3} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-surface border border-border-subtle text-on-surface rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-container outline-none"></textarea>
              </div>
              <div className="flex gap-6 md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm(f => ({ ...f, is_active: e.target.checked }))} className="accent-primary-container" />
                  <span className="text-on-surface text-sm">Faol</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_premium} onChange={(e) => setForm(f => ({ ...f, is_premium: e.target.checked }))} className="accent-primary-container" />
                  <span className="text-on-surface text-sm">Premium</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 rounded-lg ghost-border text-on-surface-variant hover:bg-surface-variant/10 font-button-text transition-all">Bekor</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-lg bg-primary-container text-on-primary-container font-button-text hover:brightness-110 disabled:opacity-50 transition-all">
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
