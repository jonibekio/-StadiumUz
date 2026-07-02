import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { stadiumService, Stadium, Comment } from '../services/stadium'
import { bookingService, BookingSlot } from '../services/booking'
import { useAuth } from '../hooks/useAuth'

const featureIcon = (name: string) => {
  if (name.includes('Dush')) return 'shower'
  if (name.includes('Avtoturargoh') || name.includes('Turargoh')) return 'local_parking'
  if (name.includes('Konditsioner')) return 'ac_unit'
  if (name.includes('Wi-Fi') || name.includes('wifi')) return 'wifi'
  if (name.includes('VIP')) return 'star'
  if (name.includes('Kafe')) return 'coffee'
  if (name.includes('Kiyinish')) return 'checkroom'
  if (name.includes('Pro')) return 'sports_soccer'
  if (name.includes('Rooftop')) return 'roofing'
  return 'stadium'
}

export default function StadiumDetailPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [stadium, setStadium] = useState<Stadium | null>(null)
  const [slots, setSlots] = useState<BookingSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState('')

  // Comment form
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [commentRating, setCommentRating] = useState(5)
  const [commentLoading, setCommentLoading] = useState(false)

  // Login prompt
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [loginPromptAction, setLoginPromptAction] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    // Load stadium detail (public)
    stadiumService.getDetail(id)
      .then(setStadium)
      .catch(() => {})
      .finally(() => setLoading(false))

    // Load slots for this specific stadium
    bookingService.getStadiumSlots(id)
      .then(setSlots)
      .catch(() => setSlots([]))
  }, [id])

  const requireAuth = (action: string) => {
    if (!isAuthenticated) {
      setLoginPromptAction(action)
      setShowLoginPrompt(true)
      return false
    }
    return true
  }

  const handleBooking = async () => {
    if (!selectedSlot) return
    if (!requireAuth('bron qilish')) return

    setBookingLoading(true)
    setBookingError('')
    try {
      await bookingService.createBooking(selectedSlot)
      setBookingSuccess(true)
      setSlots(prev => prev.filter(s => s.id !== selectedSlot))
      setSelectedSlot(null)
    } catch (err: any) {
      setBookingError(err.response?.data?.error || 'Bron qilishda xatolik')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleComment = async () => {
    if (!id || !commentText.trim()) return
    if (!requireAuth('sharh yozish')) return

    setCommentLoading(true)
    try {
      await stadiumService.createComment({
        stadium: id,
        rating: commentRating,
        text: commentText,
      })
      const updated = await stadiumService.getDetail(id)
      setStadium(updated)
      setCommentText('')
      setCommentRating(5)
      setShowCommentForm(false)
    } catch {
    } finally {
      setCommentLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="pt-search-bar-height min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
      </main>
    )
  }

  if (!stadium) {
    return (
      <main className="pt-search-bar-height min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">error</span>
          <h2 className="font-headline-lg text-headline-lg text-white mb-2">Stadion topilmadi</h2>
          <Link to="/stadionlar" className="text-primary hover:underline">Orqaga qaytish</Link>
        </div>
      </main>
    )
  }

  const formatPrice = (p: number) => p.toLocaleString('uz-UZ')

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true)
      setLoginPromptAction('sevimlilarga qo\'shish')
      return
    }
    try {
      const res = await stadiumService.toggleFavorite(id!)
      setStadium(prev => prev ? { ...prev, is_favorited: res.is_favorited } : null)
    } catch {}
  }

  return (
    <main className="pt-search-bar-height">
      {/* Hero Gallery */}
      <section className="w-full px-margin-mobile md:px-margin-desktop py-gutter">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[400px] md:h-[600px]">
          <div className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group">
            {stadium.image_url ? (
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={stadium.image_url} alt={stadium.name} />
            ) : (
              <div className="w-full h-full bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant">stadium</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
            <button
              onClick={handleFavorite}
              className="absolute top-4 right-4 z-10 bg-surface-container-lowest/80 backdrop-blur px-3 py-2 rounded-full hover:bg-error/20 transition-colors"
            >
              <span
                className="material-symbols-outlined text-2xl"
                style={stadium.is_favorited ? { fontVariationSettings: "'FILL' 1", color: '#ff4444' } : { color: '#94A3B8' }}
              >
                favorite
              </span>
            </button>
            <div className="absolute bottom-6 left-6">
              {stadium.is_premium && (
                <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-caps text-label-caps mb-2 inline-block">PREMIUM MAYDON</span>
              )}
              <h1 className="font-display-lg text-headline-md md:text-display-lg text-white">{stadium.name}</h1>
            </div>
          </div>
          {stadium.photos.slice(0, 3).map((photo) => (
            <div key={photo.id} className="hidden md:block relative rounded-xl overflow-hidden group">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={photo.url} alt={photo.caption} />
            </div>
          ))}
          {stadium.photos.length === 0 && (
            <>
              <div className="hidden md:block relative rounded-xl overflow-hidden bg-surface-container"></div>
              <div className="hidden md:block relative rounded-xl overflow-hidden bg-surface-container"></div>
              <div className="hidden md:block relative rounded-xl overflow-hidden bg-surface-container"></div>
            </>
          )}
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter py-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-12">
          {/* Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-on-surface-variant">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-label-caps text-label-caps text-primary">{stadium.rating} ({stadium.reviews_count} Sharhlar)</span>
              </div>
              <span>&bull;</span>
              <span className="font-label-caps text-label-caps">{stadium.address}</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-white">Stadion haqida</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {stadium.description || "Havaskorlar va yarim professionallar uchun yuqori standartdagi futbol maydoni."}
            </p>
          </div>

          {/* Facilities */}
          <div className="space-y-6">
            <h3 className="font-headline-md text-headline-md text-white">Qulayliklar</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {stadium.features.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-4 rounded-xl border border-border-subtle bg-surface-container-low hover:border-primary/30 transition-colors">
                  <span className="material-symbols-outlined text-primary text-2xl">{featureIcon(f.name)}</span>
                  <span className="font-body-md text-body-md">{f.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-8">
            <div className="flex justify-between items-end">
              <h3 className="font-headline-md text-headline-md text-white">O'yinchilar fikrlari</h3>
              <button
                onClick={() => {
                  if (requireAuth('sharh qoldirish')) {
                    setShowCommentForm(!showCommentForm)
                  }
                }}
                className="text-primary font-label-caps text-label-caps hover:underline"
              >
                {showCommentForm ? 'Bekor qilish' : 'Sharh qoldirish'}
              </button>
            </div>

            {/* Comment Form */}
            {showCommentForm && (
              <div className="p-6 rounded-2xl bg-surface-container-low border border-border-subtle space-y-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setCommentRating(s)}>
                      <span
                        className="material-symbols-outlined text-2xl cursor-pointer"
                        style={s <= commentRating ? { fontVariationSettings: "'FILL' 1", color: '#2ae500' } : { color: '#333539' }}
                      >
                        star
                      </span>
                    </button>
                  ))}
                </div>
                <textarea
                  className="w-full bg-surface-container border border-border-subtle text-on-surface rounded-lg px-4 py-3 focus:ring-1 focus:ring-primary-container outline-none font-body-md min-h-[100px]"
                  placeholder="Sharhingizni yozing..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  onClick={handleComment}
                  disabled={commentLoading || !commentText.trim()}
                  className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-button-text hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  {commentLoading ? 'Yuborilmoqda...' : 'Sharh qoldirish'}
                </button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {stadium.comments && stadium.comments.length > 0 ? (
                stadium.comments.map((review: Comment) => (
                  <div key={review.id} className="p-6 rounded-2xl bg-surface-container-low border border-border-subtle">
                    <div className="flex justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center font-bold text-primary">
                          {review.user_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-body-md text-body-md text-white">{review.user_name}</p>
                          <p className="font-label-caps text-[10px] text-on-surface-variant uppercase">
                            {new Date(review.created_at).toLocaleDateString('uz-UZ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className="material-symbols-outlined text-primary-fixed-dim text-sm"
                            style={i < review.rating ? { fontVariationSettings: "'FILL' 1" } : undefined}
                          >
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-on-surface-variant italic">{review.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-on-surface-variant text-center py-8">Hali sharhlar yo'q. Birinchi bo'ling!</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <aside className="lg:col-span-4">
          <div className="sticky top-[100px] glass-panel p-6 rounded-2xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="font-display-lg text-headline-md text-white">{formatPrice(stadium.price_per_hour)}</span>
                <span className="font-body-md text-on-surface-variant"> so'm / soat</span>
              </div>
              {stadium.badge && (
                <span className="bg-primary/10 text-primary-fixed-dim px-3 py-1 rounded-full text-xs font-label-caps">{stadium.badge}</span>
              )}
            </div>

            {/* Working Hours */}
            <div className="mb-6 flex items-center gap-2 text-on-surface-variant text-sm">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              {stadium.working_hours_start} - {stadium.working_hours_end}
            </div>

            {/* Time Slots */}
            <div className="mb-8 space-y-4">
              <div className="flex justify-between items-center">
                <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Vaqt jadvali</label>
                <span className="text-[10px] text-primary-fixed-dim">{slots.filter(s => s.status === 'AVAILABLE').length} ta bo'sh</span>
              </div>
              {slots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                  {slots.map((slot) => {
                    const isAvailable = slot.status === 'AVAILABLE'
                    const isBooked = slot.status === 'BOOKED'
                    const isBlocked = slot.status === 'BLOCKED'
                    const isSelected = selectedSlot === slot.id

                    let slotClass = ''
                    if (isSelected) {
                      slotClass = 'bg-primary-container border-primary-container text-on-primary-container font-bold'
                    } else if (isAvailable) {
                      slotClass = 'bg-surface-container-highest border-primary/30 text-white hover:border-primary-container time-slot-available cursor-pointer'
                    } else if (isBooked) {
                      slotClass = 'bg-error/10 border-error/30 text-error/60 cursor-not-allowed line-through'
                    } else {
                      slotClass = 'bg-surface-variant/30 border-border-subtle text-on-surface-variant/40 cursor-not-allowed'
                    }

                    return (
                      <button
                        key={slot.id}
                        disabled={!isAvailable}
                        onClick={() => isAvailable && setSelectedSlot(isSelected ? null : slot.id)}
                        className={`py-2 rounded-lg border text-sm transition-all ${slotClass}`}
                        title={isBooked ? 'Band' : isBlocked ? 'Bloklangan' : "Bo'sh - bosing"}
                      >
                        {slot.start_time.slice(0, 5)}
                        {isBooked && <span className="text-[9px] block">Band</span>}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="text-on-surface-variant text-center py-4 text-sm">Bugun bo'sh slotlar yo'q</p>
              )}
              {/* Legend */}
              <div className="flex gap-4 text-[10px] text-on-surface-variant">
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary/30 border border-primary/50"></span> Bo'sh</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-error/20 border border-error/30"></span> Band</div>
              </div>
            </div>

            {/* Price Breakdown */}
            {selectedSlot && (
              <div className="mb-8 space-y-2 border-t border-border-subtle pt-6">
                <div className="flex justify-between font-body-sm text-on-surface-variant">
                  <span>Maydon ijara haqi (1 soat)</span>
                  <span>{formatPrice(stadium.price_per_hour)} so'm</span>
                </div>
                <div className="flex justify-between font-body-md text-white pt-2 font-bold">
                  <span>Jami</span>
                  <span className="text-primary">{formatPrice(stadium.price_per_hour)} so'm</span>
                </div>
              </div>
            )}

            {/* Success Message */}
            {bookingSuccess && (
              <div className="mb-4 p-4 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm">
                Bron muvaffaqiyatli yaratildi!
              </div>
            )}

            {/* Error Message */}
            {bookingError && (
              <div className="mb-4 p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
                {bookingError}
              </div>
            )}

            {/* Action Button */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="w-full bg-primary-container text-on-primary-container py-4 rounded-xl font-button-text text-button-text flex items-center justify-center gap-2 hover:brightness-110 transition-all"
              >
                <span className="material-symbols-outlined">login</span>
                Kirish kerak
              </Link>
            ) : (
              <button
                onClick={handleBooking}
                disabled={!selectedSlot || bookingLoading}
                className="w-full bg-primary-container text-on-primary-container py-4 rounded-xl font-button-text text-button-text flex items-center justify-center gap-2 group active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(42,229,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingLoading ? 'Bron qilinmoqda...' : 'Bronni tasdiqlash'}
                {!bookingLoading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
              </button>
            )}
            <p className="text-center text-[11px] text-on-surface-variant mt-4 font-body-sm">
              O'yin boshlanishidan 24 soat oldin bepul bekor qilish mumkin.
            </p>
          </div>
        </aside>
      </section>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginPrompt(false)}>
          <div className="bg-surface-container border border-border-subtle rounded-2xl p-8 w-full max-w-md text-center" onClick={e => e.stopPropagation()}>
            <span className="material-symbols-outlined text-primary text-5xl mb-4">lock</span>
            <h3 className="font-headline-md text-headline-md text-text-primary mb-2">Kirish kerak</h3>
            <p className="text-on-surface-variant text-body-md mb-6">
              Ushbu funksiyadan foydalanish uchun tizimga kiring yoki ro'yxatdan o'ting.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setShowLoginPrompt(false)}
                className="w-full bg-primary-container text-on-primary-container py-3 rounded-lg font-button-text hover:brightness-110 transition-all"
              >
                Kirish
              </Link>
              <Link
                to="/register"
                onClick={() => setShowLoginPrompt(false)}
                className="w-full ghost-border text-on-surface py-3 rounded-lg font-button-text hover:bg-surface-variant/10 transition-all"
              >
                Ro'yxatdan o'tish
              </Link>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="text-on-surface-variant text-body-sm hover:text-primary transition-colors"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
