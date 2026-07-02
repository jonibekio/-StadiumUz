import { Link, useLocation } from 'react-router-dom'
import Footer from './Footer'

interface UserLayoutProps {
  children: React.ReactNode
}

const menuItems = [
  { path: '/profil', icon: 'person', label: 'Profil' },
  { path: '/bronlarim', icon: 'calendar_month', label: 'Mening bronlarim' },
  { path: '/sevimlilar', icon: 'favorite', label: 'Sevimlilar' },
  { path: '/tolovlar', icon: 'payments', label: "To'lovlar" },
  { path: '/bildirishnomalar', icon: 'notifications', label: 'Bildirishnomalar' },
  { path: '/chat', icon: 'chat', label: 'Suhbatlar' },
  { path: '/sozlamalar', icon: 'settings', label: 'Sozlamalar' },
]

export default function UserLayout({ children }: UserLayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      {/* Spacer for fixed Navbar */}
      <div className="h-search-bar-height shrink-0"></div>

      <div className="flex flex-1">
        {/* Sidebar - fixed on desktop */}
        <aside className="hidden lg:flex flex-col w-[280px] shrink-0 fixed left-0 top-[64px] bottom-0 py-base bg-surface-container border-r border-border-subtle overflow-y-auto z-30">
          <div className="px-6 py-8 flex flex-col gap-1">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-4">Asosiy Menu</p>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all ${
                    isActive ? 'sidebar-active' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/10'
                  }`}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-body-md">{item.label}</span>
                </Link>
              )
            })}
          </div>
          <div className="mt-auto px-6 py-8 border-t border-border-subtle">
            <Link to="/" className="flex items-center gap-3 py-3 px-4 w-full text-on-surface-variant font-body-md hover:bg-surface-variant/10 rounded-lg transition-all">
              <span className="material-symbols-outlined">logout</span>
              Bosh sahifa
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-[280px] flex flex-col min-h-[calc(100vh-64px)]">
          <main className="flex-1 p-margin-mobile md:p-margin-desktop">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
