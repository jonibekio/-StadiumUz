export default function Footer() {
  return (
    <footer className="w-full py-12 px-margin-mobile md:px-margin-desktop mt-auto bg-surface-container-low border-t border-border-subtle">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-12">
        <div className="md:max-w-xs">
          <span className="font-display-lg text-headline-md text-white block mb-4">StadiumUz</span>
          <p className="text-on-surface-variant text-body-sm mb-6">
            Professional o'yinchilar va jamoalar uchun zamonaviy stadion bron qilish platformasi.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-surface-variant/20 flex items-center justify-center hover:bg-primary transition-all group">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-black">language</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-surface-variant/20 flex items-center justify-center hover:bg-primary transition-all group">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-black">smart_display</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-surface-variant/20 flex items-center justify-center hover:bg-primary transition-all group">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-black">share</span>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <p className="font-label-caps text-label-caps text-white mb-6 uppercase tracking-widest">Platforma</p>
            <ul className="space-y-4">
              <li><a href="#" className="text-on-surface-variant hover:text-primary transition-colors text-body-sm">Biz haqimizda</a></li>
              <li><a href="#" className="text-on-surface-variant hover:text-primary transition-colors text-body-sm">Xizmat ko'rsatish shartlari</a></li>
              <li><a href="#" className="text-on-surface-variant hover:text-primary transition-colors text-body-sm">Maxfiylik siyosati</a></li>
            </ul>
          </div>
          <div>
            <p className="font-label-caps text-label-caps text-white mb-6 uppercase tracking-widest">Yordam</p>
            <ul className="space-y-4">
              <li><a href="#" className="text-on-surface-variant hover:text-primary transition-colors text-body-sm">Bog'lanish</a></li>
              <li><a href="#" className="text-on-surface-variant hover:text-primary transition-colors text-body-sm">Karyera</a></li>
              <li><a href="#" className="text-on-surface-variant hover:text-primary transition-colors text-body-sm">Ko'p beriladigan savollar</a></li>
            </ul>
          </div>
          <div className="hidden sm:block">
            <p className="font-label-caps text-label-caps text-white mb-6 uppercase tracking-widest">Kontakt</p>
            <p className="text-on-surface-variant text-body-sm mb-2">support@stadiumuz.com</p>
            <p className="text-on-surface-variant text-body-sm">+998 (71) 000-00-00</p>
          </div>
        </div>
      </div>
      <div className="max-w-container-max mx-auto mt-16 pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-on-surface-variant text-body-sm">&copy; 2024 StadiumUz. Barcha huquqlar himoyalangan.</p>
        <div className="flex gap-6">
          <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
          <span className="material-symbols-outlined text-on-surface-variant">account_balance_wallet</span>
          <span className="material-symbols-outlined text-on-surface-variant">contactless</span>
        </div>
      </div>
    </footer>
  )
}
