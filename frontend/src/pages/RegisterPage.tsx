import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    phone: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.phone || !form.username || !form.first_name || !form.last_name || !form.password) {
      setError('Barcha maydonlarni to\'ldiring')
      return
    }
    if (form.password.length < 6) {
      setError('Parol kamida 6 ta belgi bo\'lishi kerak')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Parollar mos kelmaydi')
      return
    }

    setLoading(true)
    try {
      await register({
        phone: form.phone,
        username: form.username,
        first_name: form.first_name,
        last_name: form.last_name,
        password: form.password,
      })
      navigate('/profil')
    } catch (err: any) {
      const data = err.response?.data
      if (data) {
        const firstError = Object.values(data).flat()[0]
        setError(typeof firstError === 'string' ? firstError : 'Ro\'yxatdan o\'tishda xatolik')
      } else {
        setError('Ro\'yxatdan o\'tishda xatolik yuz berdi')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-margin-mobile py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display-lg text-headline-lg text-primary-fixed-dim tracking-tight">
            StadiumUz
          </Link>
          <h1 className="font-headline-lg text-headline-lg text-white mt-4">Ro'yxatdan o'tish</h1>
          <p className="text-on-surface-variant text-body-md mt-2">Yangi hisob yarating</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Telefon raqami</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+998 90 123 45 67"
              className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Login</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="username"
              className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Ism</label>
              <input
                type="text"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="Ism"
                className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
              />
            </div>
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Familiya</label>
              <input
                type="text"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Familiya"
                className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Parol</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Kamida 6 ta belgi"
              className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
            />
          </div>

          <div className="space-y-2">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Parolni tasdiqlang</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Parolni qaytadan kiriting"
              className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-button-text hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-on-surface-variant text-body-sm">
            Hisobingiz bormi?{' '}
            <Link to="/login" className="text-primary hover:underline">Kirish</Link>
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
