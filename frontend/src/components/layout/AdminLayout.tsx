import { Link, useLocation } from 'react-router-dom'
import Footer from './Footer'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { path: '/admin', icon: 'dashboard', label: 'Bosh sahifa', exact: true },
  { path: '/admin/stadionlar', icon: 'stadium', label: 'Stadionlar' },
  { path: '/admin/slotlar', icon: 'schedule', label: 'Slotlar' },
  { path: '/admin/bronlar', icon: 'calendar_month', label: 'Bronlar' },
  { path: '/admin/foydalanuvchilar', icon: 'group', label: 'Foydalanuvchilar' },
  { path: '/admin/tolovlar', icon: 'payments', label: "To'lovlar" },
  { path: '/admin/analitika', icon: 'monitoring', label: 'Analitika' },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-[280px] shrink-0 fixed left-0 top-0 bottom-0 py-base bg-surface-container border-r border-border-subtle z-30">
          <div className="px-6 py-8">
            <Link to="/" className="font-display-lg text-headline-md text-primary tracking-tight">StadiumUz</Link>
            <p className="text-on-surface-variant text-body-sm mt-1">Admin Paneli</p>
          </div>

          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path)
              return (
                <Link key={item.path} to={item.path}
                  className={`flex items-center gap-3 py-3 px-4 transition-all border-l-4 ${
                    isActive
                      ? 'text-primary font-bold border-primary bg-primary/5'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/10 border-transparent'
                  }`}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-label-caps text-label-caps">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="px-4 mb-6">
            <Link to="/admin/stadionlar" className="w-full bg-primary-container text-on-primary font-button-text text-button-text py-3 rounded-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(42,229,0,0.15)]">
              <span className="material-symbols-outlined">add</span>
              Yangi stadion qo'shish
            </Link>
          </div>

          <div className="px-2 border-t border-border-subtle pt-4 pb-4">
            <Link to="/admin/sozlamalar" className={`flex items-center gap-3 py-2 px-4 transition-all ${location.pathname === '/admin/sozlamalar' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label-caps text-label-caps">Sozlamalar</span>
            </Link>
            <Link to="/" className="flex items-center gap-3 py-2 px-4 text-on-surface-variant hover:text-on-surface transition-all">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-caps text-label-caps">Chiqish</span>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen">
          <main className="flex-1 p-margin-mobile md:p-margin-desktop">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
