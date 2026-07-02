import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/auth'
import UserLayout from '../components/layout/UserLayout'

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    username: user?.username || '',
  })
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      const updated = await authService.updateProfile({
        first_name: form.first_name,
        last_name: form.last_name,
        username: form.username,
      })
      updateUser(updated)
      setEditing(false)
      setMessage('Profil yangilandi')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError('Parollar mos kelmaydi')
      return
    }
    if (passwordForm.new_password.length < 6) {
      setError('Yangi parol kamida 6 ta belgi bo\'lishi kerak')
      return
    }
    setLoading(true)
    try {
      await authService.changePassword(passwordForm.old_password, passwordForm.new_password)
      setMessage('Parol o\'zgartirildi')
      setShowPasswordForm(false)
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' })
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.old_password?.[0] || 'Xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (!user) return null

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary mb-2">Shaxsiy kabinet</h1>
          <p className="font-body-md text-on-surface-variant">Ma'lumotlaringizni boshqaring</p>
        </div>

        {message && (
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">{message}</div>
        )}
        {error && (
          <div className="p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">{error}</div>
        )}

        {/* Profile Card */}
        <div className="ghost-border rounded-xl bg-surface-container-low p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center">
              <span className="font-display-lg text-headline-lg text-on-primary-container">
                {user.first_name?.charAt(0) || user.username?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-text-primary">{user.first_name} {user.last_name}</h2>
              <p className="text-on-surface-variant text-body-sm">{user.phone}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-label-caps bg-primary/10 text-primary">
                {user.role === 'ADMIN' ? 'ADMIN' : 'FOYDALANUVCHI'}
              </span>
            </div>
          </div>

          {!editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Ism</p>
                  <p className="text-text-primary font-body-md">{user.first_name}</p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Familiya</p>
                  <p className="text-text-primary font-body-md">{user.last_name}</p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Login</p>
                  <p className="text-text-primary font-body-md">{user.username}</p>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Telefon</p>
                  <p className="text-text-primary font-body-md">{user.phone}</p>
                </div>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="mt-4 px-6 py-2 rounded-lg ghost-border text-primary hover:bg-primary/10 font-button-text transition-all"
              >
                Tahrirlash
              </button>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Ism</label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))}
                    className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Familiya</label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm(f => ({ ...f, last_name: e.target.value }))}
                    className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Login</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
                  className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-lg bg-primary-container text-on-primary-container font-button-text hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditing(false); setForm({ first_name: user.first_name, last_name: user.last_name, username: user.username }) }}
                  className="px-6 py-2 rounded-lg ghost-border text-on-surface-variant hover:bg-surface-variant/10 font-button-text transition-all"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Password Change */}
        <div className="ghost-border rounded-xl bg-surface-container-low p-8">
          <h3 className="font-headline-md text-headline-md text-text-primary mb-4">Parolni o'zgartirish</h3>
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="px-6 py-2 rounded-lg ghost-border text-primary hover:bg-primary/10 font-button-text transition-all"
            >
              Parolni o'zgartirish
            </button>
          ) : (
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Joriy parol</label>
                <input
                  type="password"
                  value={passwordForm.old_password}
                  onChange={(e) => setPasswordForm(f => ({ ...f, old_password: e.target.value }))}
                  className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Yangi parol</label>
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm(f => ({ ...f, new_password: e.target.value }))}
                  className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Parolni tasdiqlang</label>
                <input
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm(f => ({ ...f, confirm_password: e.target.value }))}
                  className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-lg bg-primary-container text-on-primary-container font-button-text hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowPasswordForm(false); setPasswordForm({ old_password: '', new_password: '', confirm_password: '' }) }}
                  className="px-6 py-2 rounded-lg ghost-border text-on-surface-variant hover:bg-surface-variant/10 font-button-text transition-all"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full p-4 rounded-xl ghost-border bg-surface-container-low text-error hover:bg-error/5 font-button-text flex items-center justify-center gap-2 transition-all"
        >
          <span className="material-symbols-outlined">logout</span>
          Tizimdan chiqish
        </button>
      </div>
    </UserLayout>
  )
}
