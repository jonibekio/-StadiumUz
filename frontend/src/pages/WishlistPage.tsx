import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UserLayout from '../components/layout/UserLayout'
import { stadiumService, Stadium } from '../services/stadium'

export default function WishlistPage() {
  const [favorites, setFavorites] = useState<Stadium[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    stadiumService.getFavorites()
      .then(setFavorites)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (stadiumId: string) => {
    try {
      await stadiumService.toggleFavorite(stadiumId)
      setFavorites(prev => prev.filter(s => s.id !== stadiumId))
    } catch {}
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-text-primary mb-2">Sevimli stadionlar</h1>
          <p className="font-body-md text-on-surface-variant">Saqlangan stadionlaringiz ro'yxati</p>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && favorites.length === 0 && (
          <div className="text-center py-16 ghost-border rounded-xl bg-surface-container-low">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">favorite_border</span>
            <h3 className="font-headline-md text-headline-md text-text-primary mb-2">Sevimlilar yo'q</h3>
            <p className="text-on-surface-variant mb-6">Hali bironta stadionni saqlamagansiz</p>
            <Link to="/stadionlar" className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-button-text inline-block hover:brightness-110 transition-all">
              Stadion topish
            </Link>
          </div>
        )}

        {!loading && favorites.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((stadium) => (
              <div key={stadium.id} className="ghost-border rounded-xl bg-surface-container-low overflow-hidden flex flex-col">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={stadium.image_url}
                    alt={stadium.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemove(stadium.id)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-error/80 flex items-center justify-center hover:bg-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-white">delete</span>
                  </button>
                  {stadium.badge && (
                    <div className="absolute top-3 left-3 bg-primary-container text-on-primary-container px-2 py-1 rounded text-[10px] font-label-caps">
                      {stadium.badge}
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline-md text-headline-md text-text-primary">{stadium.name}</h3>
                    <span className="text-primary font-label-caps">{stadium.price_per_hour.toLocaleString()} so'm</span>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant text-sm mb-2">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span>{stadium.address}</span>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant text-sm mb-4">
                    <span className="material-symbols-outlined text-[16px]">star</span>
                    <span>{stadium.rating} ({stadium.reviews_count})</span>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <Link
                      to={`/stadion/${stadium.id}`}
                      className="flex-1 bg-primary-container text-on-primary-container py-2 rounded-lg font-button-text text-center text-sm hover:brightness-110 transition-all"
                    >
                      Batafsil
                    </Link>
                    <Link
                      to={`/stadion/${stadium.id}`}
                      className="flex-1 ghost-border text-on-surface py-2 rounded-lg font-button-text text-center text-sm hover:bg-surface-variant/10 transition-all"
                    >
                      Bron qilish
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  )
}
