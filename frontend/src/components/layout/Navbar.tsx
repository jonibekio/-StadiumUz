import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { notificationService } from '../../services/notification'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (isAuthenticated) {
      notificationService.getUnreadCount()
        .then(setUnreadCount)
        .catch(() => {})
      // Poll for new notifications every 30 seconds
      const interval = setInterval(() => {
        notificationService.getUnreadCount()
          .then(setUnreadCount)
          .catch(() => {})
      }, 30000)
      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center h-search-bar-height px-margin-mobile md:px-margin-desktop bg-surface-container-lowest/90 backdrop-blur-md border-b border-border-subtle">
      <div className="flex items-center gap-8">
        <Link to="/" className="font-display-lg text-headline-md-mobile md:text-headline-md text-primary dark:text-primary-fixed-dim tracking-tight">
          StadiumUz
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/stadionlar" className="text-on-surface-variant font-body-md hover:bg-surface-variant/20 transition-colors px-2 py-1 rounded">
            Stadionlar
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated && user ? (
          <>
            {/* Notification Bell */}
            <Link to="/bildirishnomalar" className="relative p-2 rounded-lg hover:bg-surface-variant/20 transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-container text-on-primary-container text-[10px] flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-variant/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="text-on-primary-container font-bold text-sm">
                    {user.first_name?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="hidden md:block text-on-surface font-body-sm">{user.first_name}</span>
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">expand_more</span>
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-56 bg-surface-container border border-border-subtle rounded-xl shadow-xl z-50 py-2">
                    <div className="px-4 py-3 border-b border-border-subtle">
                      <p className="text-text-primary font-body-md font-semibold">{user.first_name} {user.last_name}</p>
                      <p className="text-on-surface-variant text-body-sm">{user.phone}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-label-caps bg-primary/10 text-primary">
                        {user.role === 'ADMIN' ? 'ADMIN' : 'FOYDALANUVCHI'}
                      </span>
                    </div>
                    <Link
                      to="/profil"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-on-surface hover:bg-surface-variant/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">person</span>
                      <span className="font-body-md">Shaxsiy kabinet</span>
                    </Link>
                    <Link
                      to="/bronlarim"
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-on-surface hover:bg-surface-variant/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                      <span className="font-body-md">Mening bronlarim</span>
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-on-surface hover:bg-surface-variant/10 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                        <span className="font-body-md">Admin panel</span>
                      </Link>
                    )}
                    <div className="border-t border-border-subtle mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setShowMenu(false) }}
                        className="flex items-center gap-3 px-4 py-2.5 text-error hover:bg-error/5 w-full transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span className="font-body-md">Chiqish</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors px-3 py-2"
            >
              Kirish
            </Link>
            <Link
              to="/register"
              className="bg-primary-container text-on-primary-container px-6 py-2 rounded-lg font-button-text hover:brightness-110 active:scale-95 transition-all"
            >
              Ro'yxatdan o'tish
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
