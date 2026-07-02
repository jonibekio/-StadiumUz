import { Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { stadiumService, Stadium, StadiumFilters } from '../services/stadium'
import { useAuth } from '../hooks/useAuth'

export default function StadiumSearchPage() {
  const { isAuthenticated } = useAuth()
  const [stadiums, setStadiums] = useState<Stadium[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<StadiumFilters>({
    search: '',
    region: '',
    district: '',
    field_type: '',
    max_price: 1000000,
    min_rating: 0,
  })

  const types = ['5x5', '7x7', '11x11']

  const regions = [
    { value: '', label: 'Barcha hududlar' },
    { value: 'TOSHKENT_SHAHAR', label: 'Toshkent shahri' },
    { value: 'TOSHKENT_VILOYATI', label: 'Toshkent viloyati' },
    { value: 'SAMARQAND', label: 'Samarqand viloyati' },
    { value: 'BUXORO', label: 'Buxoro viloyati' },
    { value: 'ANDIJON', label: 'Andijon viloyati' },
    { value: 'FARGONA', label: "Farg'ona viloyati" },
    { value: 'NAMANGAN', label: 'Namangan viloyati' },
    { value: 'QASHQADARYO', label: 'Qashqadaryo viloyati' },
    { value: 'SURXONDARYO', label: 'Surxondaryo viloyati' },
    { value: 'JIZZAX', label: 'Jizzax viloyati' },
    { value: 'SIRDARYO', label: 'Sirdaryo viloyati' },
    { value: 'NAVOIY', label: 'Navoiy viloyati' },
    { value: 'XORAZM', label: 'Xorazm viloyati' },
    { value: 'QORAQALPOGISTON', label: "Qoraqalpog'iston" },
  ]

  const fetchStadiums = useCallback(async () => {
    setLoading(true)
    try {
      const params: StadiumFilters = { page }
      if (filters.search) params.search = filters.search
      if (filters.region) params.region = filters.region
      if (filters.district) params.district = filters.district
      if (filters.field_type) params.field_type = filters.field_type
      if (filters.max_price && filters.max_price < 1000000) params.max_price = filters.max_price
      if (filters.min_rating && filters.min_rating > 0) params.min_rating = filters.min_rating
      const res = await stadiumService.list(params)
      setStadiums(res.results)
      setCount(res.count)
    } catch {
      setStadiums([])
    } finally {
      setLoading(false)
    }
  }, [filters, page])

  useEffect(() => { fetchStadiums() }, [fetchStadiums])

  const resetFilters = () => {
    setFilters({ search: '', region: '', district: '', field_type: '', max_price: 1000000, min_rating: 0 })
    setPage(1)
  }

  const formatPrice = (price: number) => price.toLocaleString('uz-UZ')

  const handleFavorite = async (e: React.MouseEvent, stadiumId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      window.location.href = '/login'
      return
    }
    try {
      const res = await stadiumService.toggleFavorite(stadiumId)
      setStadiums(prev => prev.map(s =>
        s.id === stadiumId ? { ...s, is_favorited: res.is_favorited } : s
      ))
    } catch {}
  }

  const featureIcon = (name: string) => {
    if (name.includes('Dush')) return 'shower'
    if (name.includes('Avtoturargoh') || name.includes('Turargoh')) return 'local_parking'
    if (name.includes('Konditsioner')) return 'ac_unit'
    if (name.includes('Wi-Fi') || name.includes('wifi')) return 'wifi'
    if (name.includes('VIP')) return 'star'
    if (name.includes('Kafe')) return 'coffee'
    return 'stadium'
  }

  return (
    <main className="pt-[64px] flex min-h-screen">
      {/* Sidebar Filter */}
      <aside className="hidden lg:flex flex-col w-[320px] fixed h-[calc(100vh-64px)] bg-surface-container-lowest border-r border-border-subtle p-margin-desktop overflow-y-auto custom-scrollbar">
        <div className="space-y-10">
          {/* Search */}
          <div className="space-y-4">
            <label className="font-label-caps text-label-caps text-on-surface-variant block uppercase tracking-widest">Qidirish</label>
            <input
              className="w-full bg-surface-container border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md"
              placeholder="Stadion nomi..."
              value={filters.search}
              onChange={(e) => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1) }}
            />
          </div>

          {/* Hudud */}
          <div className="space-y-4">
            <label className="font-label-caps text-label-caps text-on-surface-variant block uppercase tracking-widest">Hudud</label>
            <div className="relative">
              <select
                className="w-full bg-surface-container border-border-subtle text-on-surface rounded-lg px-4 py-3 appearance-none focus:ring-1 focus:ring-primary-container outline-none font-body-md"
                value={filters.region}
                onChange={(e) => { setFilters(f => ({ ...f, region: e.target.value })); setPage(1) }}
              >
                {regions.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-3.5 text-on-surface-variant pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Narx oralig'i */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Maks narx</label>
              <span className="font-label-caps text-label-caps text-primary">
                {(filters.max_price || 1000000) >= 1000000 ? 'Barchasi' : `${formatPrice(filters.max_price || 0)} so'm`}
              </span>
            </div>
            <input
              className="w-full accent-primary-container h-1 bg-surface-container rounded-lg appearance-none cursor-pointer"
              max="1000000"
              min="50000"
              step="10000"
              type="range"
              value={filters.max_price || 1000000}
              onChange={(e) => { setFilters(f => ({ ...f, max_price: parseInt(e.target.value) })); setPage(1) }}
            />
          </div>

          {/* Reyting */}
          <div className="space-y-4">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Reyting</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => { setFilters(f => ({ ...f, min_rating: f.min_rating === star ? 0 : star })); setPage(1) }}
                  className={`w-10 h-10 flex items-center justify-center rounded ghost-border transition-all ${
                    star <= (filters.min_rating || 0)
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={star <= (filters.min_rating || 0) ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    star
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Maydon turi */}
          <div className="space-y-4">
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest">Maydon turi</label>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => { setFilters(f => ({ ...f, field_type: f.field_type === type ? '' : type })); setPage(1) }}
                  className={`px-4 py-2 rounded-full ghost-border font-label-caps text-label-caps transition-colors ${
                    filters.field_type === type
                      ? 'bg-primary-container text-on-primary-container'
                      : 'hover:bg-surface-container'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={resetFilters}
            className="w-full mt-8 bg-surface-container-highest text-on-surface py-4 rounded-lg font-button-text text-button-text hover:bg-surface-variant transition-all"
          >
            Filtrlarni tozalash
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1 lg:ml-[320px] p-margin-mobile md:p-margin-desktop bg-background">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-text-primary mb-2">Mavjud stadionlar</h2>
              <p className="font-body-md text-text-secondary">
                {loading ? 'Yuklanmoqda...' : `Toshkent viloyatida ${count} ta premium maydon topildi`}
              </p>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Empty state */}
          {!loading && stadiums.length === 0 && (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">search_off</span>
              <h3 className="font-headline-md text-headline-md text-text-primary mb-2">Stadion topilmadi</h3>
              <p className="text-on-surface-variant">Filtrlarni o'zgartirib ko'ring</p>
            </div>
          )}

          {/* Stadium Grid */}
          {!loading && stadiums.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
              {stadiums.map((stadium) => (
                <Link
                  key={stadium.id}
                  to={`/stadion/${stadium.id}`}
                  className="pitch-card group bg-surface-container-low rounded-xl overflow-hidden ghost-border hover:border-primary/40 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                      style={{ backgroundImage: `url('${stadium.image_url}')` }}
                    ></div>
                    {stadium.badge && (
                      <div className="absolute top-4 left-4 bg-primary-container text-on-primary-container px-3 py-1 rounded font-label-caps text-label-caps shadow-lg">
                        {stadium.badge}
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <button
                        onClick={(e) => handleFavorite(e, stadium.id)}
                        className="bg-surface-container-lowest/80 backdrop-blur px-2 py-1 rounded-full hover:bg-error/20 transition-colors"
                      >
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={stadium.is_favorited ? { fontVariationSettings: "'FILL' 1", color: '#ff4444' } : { color: '#94A3B8' }}
                        >
                          favorite
                        </span>
                      </button>
                      <div className="bg-surface-container-lowest/80 backdrop-blur px-2 py-1 rounded flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary-container text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-label-caps text-label-caps text-on-surface">{stadium.rating}</span>
                      </div>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-center">
                      <div className="flex gap-2">
                        {stadium.features.slice(0, 2).map((f) => (
                          <span key={f.id} className="material-symbols-outlined text-white text-[20px] bg-white/10 p-1.5 rounded-full backdrop-blur-sm">
                            {featureIcon(f.name)}
                          </span>
                        ))}
                      </div>
                      <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-[10px] font-label-caps border border-green-500/30 backdrop-blur-sm">
                        BO'SH
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline-md text-headline-md text-text-primary">{stadium.name}</h3>
                      <span className="font-headline-md text-headline-md text-primary-fixed-dim">
                        {formatPrice(stadium.price_per_hour)}
                        <span className="text-body-sm font-body-sm text-on-surface-variant"> so'm/soat</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant font-body-sm mb-6">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      <span>{stadium.address}</span>
                    </div>
                    {stadium.region_display && (
                      <div className="flex items-center gap-1 text-on-surface-variant text-body-sm mb-4">
                        <span className="material-symbols-outlined text-[16px]">map</span>
                        <span>{stadium.region_display}</span>
                      </div>
                    )}
                    <div className="mt-auto flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Turi</span>
                        <span className="font-body-md text-on-surface">{stadium.surface_type}</span>
                      </div>
                      <button className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-button-text text-button-text stadium-glow hover:scale-[1.05] active:scale-95 transition-all">
                        Bron qilish
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && count > 20 && (
            <div className="mt-20 flex justify-center items-center gap-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-12 h-12 flex items-center justify-center rounded-lg ghost-border text-on-surface hover:bg-surface-container transition-all disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span className="text-on-surface-variant font-body-sm">Sahifa {page} / {Math.ceil(count / 20)}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(count / 20)}
                className="w-12 h-12 flex items-center justify-center rounded-lg ghost-border text-on-surface hover:bg-surface-container transition-all disabled:opacity-30"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
