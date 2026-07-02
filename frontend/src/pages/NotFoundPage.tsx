import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-margin-mobile">
      <div className="text-center">
        <h1 className="font-display-lg text-[120px] md:text-[180px] text-primary-container/20 leading-none">404</h1>
        <h2 className="font-headline-lg text-headline-lg text-white -mt-8 mb-4">Sahifa topilmadi</h2>
        <p className="text-on-surface-variant text-body-md mb-8 max-w-md mx-auto">
          Siz qidirgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-8 py-3 rounded-lg font-button-text hover:brightness-110 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">home</span>
          Bosh sahifaga qaytish
        </Link>
      </div>
    </main>
  )
}
