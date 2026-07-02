import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/auth'
import UserLayout from '../components/layout/UserLayout'

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications'>('profile')

  // Profile form
  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    username: user?.username || '',
    email: user?.email || '',
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')
  const [profileErr, setProfileErr] = useState('')

  // Password form
  const [pwdForm, setPwdForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdMsg, setPwdMsg] = useState('')
  const [pwdErr, setPwdErr] = useState('')

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileMsg('')
    setProfileErr('')
    setProfileLoading(true)
    try {
      const updated = await authService.updateProfile({
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        username: profileForm.username,
        email: profileForm.email,
      })
      updateUser(updated)
      setProfileMsg('Profil yangilandi')
    } catch (err: any) {
      const data = err.response?.data
      setProfileErr(data?.error || data?.username?.[0] || 'Xatolik yuz berdi')
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdMsg('')
    setPwdErr('')
    if (pwdForm.new_password !== pwdForm.confirm_password) {
      setPwdErr('Parollar mos kelmaydi')
      return
    }
    if (pwdForm.new_password.length < 6) {
      setPwdErr('Yangi parol kamida 6 ta belgi')
      return
    }
    setPwdLoading(true)
    try {
      await authService.changePassword(pwdForm.old_password, pwdForm.new_password)
      setPwdMsg('Parol o\'zgartirildi')
      setPwdForm({ old_password: '', new_password: '', confirm_password: '' })
    } catch (err: any) {
      setPwdErr(err.response?.data?.error || err.response?.data?.old_password?.[0] || 'Xatolik')
    } finally {
      setPwdLoading(false)
    }
  }

  const tabs = [
    { key: 'profile' as const, icon: 'person', label: 'Profil' },
    { key: 'password' as const, icon: 'lock', label: 'Parol' },
    { key: 'notifications' as const, icon: 'notifications', label: 'Bildirishnomalar' },
  ]

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary mb-2">Sozlamalar</h1>
          <p className="font-body-md text-on-surface-variant">Hisobingizni boshqaring</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 ghost-border rounded-xl p-1 bg-surface-container-low">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-button-text text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-variant/10'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSave} className="ghost-border rounded-xl bg-surface-container-low p-8 space-y-6">
            <h2 className="font-headline-md text-headline-md text-text-primary">Profil ma'lumotlari</h2>

            {profileMsg && <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">{profileMsg}</div>}
            {profileErr && <div className="p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">{profileErr}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Ism</label>
                <input
                  type="text"
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm(f => ({ ...f, first_name: e.target.value }))}
                  className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Familiya</label>
                <input
                  type="text"
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm(f => ({ ...f, last_name: e.target.value }))}
                  className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Login</label>
                <input
                  type="text"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm(f => ({ ...f, username: e.target.value }))}
                  className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="email@example.com"
                  className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Telefon</label>
              <input
                type="text"
                value={user?.phone || ''}
                disabled
                className="w-full bg-surface-container-highest border border-border-subtle text-on-surface-variant rounded-lg px-4 py-3 font-body-md cursor-not-allowed"
              />
              <p className="text-[12px] text-on-surface-variant">Telefon raqamini o'zgartirish mumkin emas</p>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="bg-primary-container text-on-primary-container px-8 py-3 rounded-lg font-button-text hover:brightness-110 disabled:opacity-50 transition-all"
            >
              {profileLoading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange} className="ghost-border rounded-xl bg-surface-container-low p-8 space-y-6">
            <h2 className="font-headline-md text-headline-md text-text-primary">Parolni o'zgartirish</h2>

            {pwdMsg && <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">{pwdMsg}</div>}
            {pwdErr && <div className="p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">{pwdErr}</div>}

            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Joriy parol</label>
                <input
                  type="password"
                  value={pwdForm.old_password}
                  onChange={(e) => setPwdForm(f => ({ ...f, old_password: e.target.value }))}
                  className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Yangi parol</label>
                <input
                  type="password"
                  value={pwdForm.new_password}
                  onChange={(e) => setPwdForm(f => ({ ...f, new_password: e.target.value }))}
                  placeholder="Kamida 6 ta belgi"
                  className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Parolni tasdiqlang</label>
                <input
                  type="password"
                  value={pwdForm.confirm_password}
                  onChange={(e) => setPwdForm(f => ({ ...f, confirm_password: e.target.value }))}
                  className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={pwdLoading}
              className="bg-primary-container text-on-primary-container px-8 py-3 rounded-lg font-button-text hover:brightness-110 disabled:opacity-50 transition-all"
            >
              {pwdLoading ? 'Saqlanmoqda...' : 'Parolni o\'zgartirish'}
            </button>
          </form>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="ghost-border rounded-xl bg-surface-container-low p-8 space-y-6">
            <h2 className="font-headline-md text-headline-md text-text-primary">Bildirishnomalar</h2>
            <div className="space-y-4">
              {[
                { label: 'Bron tasdiqlanganda', desc: 'Broningiz tasdiqlanganda xabar olish', defaultOn: true },
                { label: 'Bron bekor qilinganda', desc: 'Broningiz bekor qilinganda xabar olish', defaultOn: true },
                { label: 'Yangi aksiyalar', desc: 'Maxsus takliflar va aksiyalar haqida', defaultOn: false },
                { label: 'Yangiliklar', desc: 'Platforma yangiliklari haqida', defaultOn: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 rounded-lg border border-border-subtle">
                  <div>
                    <p className="text-text-primary font-body-md">{item.label}</p>
                    <p className="text-on-surface-variant text-body-sm">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.defaultOn} className="sr-only peer" />
                    <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:bg-primary-container peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  )
}
