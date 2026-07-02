import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!phone || !password) {
      setError('Barcha maydonlarni to\'ldiring')
      return
    }
    setLoading(true)
    try {
      await login(phone, password)
      navigate('/profil')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Kirishda xatolik yuz berdi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-margin-mobile">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display-lg text-headline-lg text-primary-fixed-dim tracking-tight">
            StadiumUz
          </Link>
          <h1 className="font-headline-lg text-headline-lg text-white mt-4">Tizimga kirish</h1>
          <p className="text-on-surface-variant text-body-md mt-2">Hisobingizga kiring</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Telefon raqami</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parolni kiriting"
              className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-button-text hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-on-surface-variant text-body-sm">
            Hisobingiz yo'qmi?{' '}
            <Link to="/register" className="text-primary hover:underline">Ro'yxatdan o'ting</Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-border-subtle">
          <Link to="/" className="text-on-surface-variant hover:text-primary text-body-sm flex items-center justify-center gap-2 transition-colors">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    </main>
  )
}
