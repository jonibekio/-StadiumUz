import { useState } from 'react'
import AdminLayout from '../components/layout/AdminLayout'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/auth'

export default function AdminSettings() {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'project'>('profile')
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    username: user?.username || '',
    email: user?.email || '',
  })
  const [pwdForm, setPwdForm] = useState({ old_password: '', new_password: '', confirm_password: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(''); setErr(''); setLoading(true)
    try {
      const updated = await authService.updateProfile(form)
      updateUser(updated); setMsg('Profil yangilandi')
    } catch (e: any) { setErr(e.response?.data?.error || 'Xatolik') } finally { setLoading(false) }
  }

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(''); setErr('')
    if (pwdForm.new_password !== pwdForm.confirm_password) { setErr('Parollar mos kelmaydi'); return }
    if (pwdForm.new_password.length < 6) { setErr('Kamida 6 ta belgi'); return }
    setLoading(true)
    try {
      await authService.changePassword(pwdForm.old_password, pwdForm.new_password)
      setMsg('Parol o\'zgartirildi'); setPwdForm({ old_password: '', new_password: '', confirm_password: '' })
    } catch (e: any) { setErr(e.response?.data?.error || 'Xatolik') } finally { setLoading(false) }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-text-primary">Sozlamalar</h2>
        <p className="text-on-surface-variant font-body-md">Profil va tizim sozlamalari</p>
      </div>

      <div className="flex gap-2 ghost-border rounded-xl p-1 bg-surface-container-low mb-6 max-w-md">
        {([['profile', 'person', 'Profil'], ['password', 'lock', 'Parol'], ['project', 'tune', 'Loyiha']] as const).map(([key, icon, label]) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-button-text text-sm transition-all ${activeTab === key ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-variant/10'}`}>
            <span className="material-symbols-outlined text-[18px]">{icon}</span> {label}
          </button>
        ))}
      </div>

      {msg && <div className="mb-4 p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">{msg}</div>}
      {err && <div className="mb-4 p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">{err}</div>}

      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} className="ghost-border rounded-xl bg-surface-container-low p-8 space-y-6 max-w-2xl">
          <h3 className="font-headline-md text-headline-md text-text-primary">Profil ma'lumotlari</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Ism', key: 'first_name', type: 'text' },
              { label: 'Familiya', key: 'last_name', type: 'text' },
              { label: 'Login', key: 'username', type: 'text' },
              { label: 'Email', key: 'email', type: 'email' },
            ].map(f => (
              <div key={f.key} className="space-y-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[11px]">{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]} onChange={(e) => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full bg-surface border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none" />
              </div>
            ))}
          </div>
          <button type="submit" disabled={loading} className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-button-text hover:brightness-110 disabled:opacity-50 transition-all">
            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
          </button>
        </form>
      )}

      {activeTab === 'password' && (
        <form onSubmit={handlePasswordSave} className="ghost-border rounded-xl bg-surface-container-low p-8 space-y-4 max-w-md">
          <h3 className="font-headline-md text-headline-md text-text-primary">Parolni o'zgartirish</h3>
          {[
            { label: 'Joriy parol', key: 'old_password' },
            { label: 'Yangi parol', key: 'new_password' },
            { label: 'Tasdiqlash', key: 'confirm_password' },
          ].map(f => (
            <div key={f.key} className="space-y-1">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[11px]">{f.label}</label>
              <input type="password" value={(pwdForm as any)[f.key]} onChange={(e) => setPwdForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-surface border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none" />
            </div>
          ))}
          <button type="submit" disabled={loading} className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-button-text hover:brightness-110 disabled:opacity-50 transition-all">
            {loading ? 'Saqlanmoqda...' : "Parolni o'zgartirish"}
          </button>
        </form>
      )}

      {activeTab === 'project' && (
        <div className="ghost-border rounded-xl bg-surface-container-low p-8 space-y-6 max-w-2xl">
          <h3 className="font-headline-md text-headline-md text-text-primary">Loyiha sozlamalari</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Komissiya foizi (%)', value: '10', disabled: true },
              { label: 'Bekor qilish limiti (soat)', value: '24', disabled: true },
              { label: 'Default narx (so\'m)', value: '150000', disabled: true },
            ].map((f, i) => (
              <div key={i} className="space-y-1">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase text-[11px]">{f.label}</label>
                <input type="text" defaultValue={f.value} disabled={f.disabled}
                  className="w-full bg-surface-container-highest border border-border-subtle text-on-surface-variant rounded-lg px-4 py-2 cursor-not-allowed" />
              </div>
            ))}
          </div>
          <p className="text-on-surface-variant text-body-sm">Loyiha sozlamalari hozircha tahrirlanmaydi. Tez orada qo'shiladi.</p>
        </div>
      )}
    </AdminLayout>
  )
}
