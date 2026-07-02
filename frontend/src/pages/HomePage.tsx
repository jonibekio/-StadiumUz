import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { stadiumService, Stadium } from '../services/stadium'

export default function HomePage() {
  const [featured, setFeatured] = useState<Stadium[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    stadiumService.getFeatured()
      .then(setFeatured)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])
  return (
    <main className="pt-search-bar-height">
      {/* Hero Section */}
      <section className="relative min-h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background"></div>
          <div
            className="w-full h-full bg-cover bg-center opacity-40"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxbrQyxlLrTpEw5YKOkIFYqklsGN0-nQD2c2mWH5_MqHxlrxlaz6Xa7z0HHOL8lFEcuvAx9LbuavZyjzvANgickHStQ0q4goVySdxRC9Kab1zzWv3UVdmZAxptOGalUQOH5Sgpld_7tk6jyCGb1M9wbUYiGpZl3nAro-2oV1af4WWNQYatKSU1Bni0Vi4vRvOOJEElsfcd4efmYYc_OIqoJ5xQGZb06fIhuwdfW_XX914gwmeDyhlWrk_OypWOWyxdW2XCeB50B6ca')" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-white mb-8 tracking-tighter">
            Futbol maydonini toping va <br className="hidden md:block" /> bir necha daqiqada bron qiling
          </h1>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-surface-elevated ghost-border rounded-full p-2 flex flex-col md:flex-row items-center pitch-glow mb-12">
            <div className="flex-1 w-full px-6 py-3 text-left border-b md:border-b-0 md:border-r border-border-subtle group hover:bg-surface-variant/10 cursor-pointer transition-all rounded-t-full md:rounded-l-full md:rounded-tr-none">
              <p className="font-label-caps text-[10px] text-primary tracking-widest uppercase">Manzil</p>
              <input
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-body-md text-white placeholder-on-surface-variant"
                placeholder="Qayerda o'ynaysiz?"
                type="text"
              />
            </div>
            <div className="flex-1 w-full px-6 py-3 text-left border-b md:border-b-0 md:border-r border-border-subtle group hover:bg-surface-variant/10 cursor-pointer transition-all">
              <p className="font-label-caps text-[10px] text-primary tracking-widest uppercase">Sana</p>
              <input
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-body-md text-white placeholder-on-surface-variant"
                placeholder="Sanani tanlang"
                type="text"
              />
            </div>
            <div className="flex-1 w-full px-6 py-3 text-left group hover:bg-surface-variant/10 cursor-pointer transition-all">
              <p className="font-label-caps text-[10px] text-primary tracking-widest uppercase">Maydon turi</p>
              <select className="w-full bg-transparent border-none p-0 focus:ring-0 text-body-md text-white appearance-none cursor-pointer">
                <option>5x5 maydon</option>
                <option>7x7 maydon</option>
                <option>11x11 maydon</option>
              </select>
            </div>
            <Link
              to="/stadionlar"
              className="w-full md:w-auto bg-primary-container text-on-primary-container px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:brightness-110 transition-all"
            >
              <span className="material-symbols-outlined">search</span>
              <span className="font-button-text">Stadion topish</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto border-t border-border-subtle/30 pt-12">
            <div>
              <p className="font-display-lg text-primary text-headline-lg">100+</p>
              <p className="text-on-surface-variant text-body-sm uppercase tracking-widest">Stadionlar</p>
            </div>
            <div>
              <p className="font-display-lg text-primary text-headline-lg">5000+</p>
              <p className="text-on-surface-variant text-body-sm uppercase tracking-widest">Bronlar</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="font-display-lg text-primary text-headline-lg">10000+</p>
              <p className="text-on-surface-variant text-body-sm uppercase tracking-widest">Foydalanuvchilar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-24 bg-surface-container-low border-y border-border-subtle">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <span className="font-label-caps text-label-caps text-error tracking-[0.2em] uppercase">Mavjud Muammolar</span>
                <h2 className="font-headline-lg text-headline-lg text-white mt-2">Nega stadion topish qiyin?</h2>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4 p-6 rounded-xl bg-surface-container-lowest border border-border-subtle/50">
                  <span className="material-symbols-outlined text-error text-3xl">phone_disabled</span>
                  <div>
                    <h4 className="text-white font-bold font-body-lg">Telefon orqali bron qilish</h4>
                    <p className="text-on-surface-variant text-body-md">Doimiy band liniyalar va administrator bilan bog'lanishdagi qiyinchiliklar.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 rounded-xl bg-surface-container-lowest border border-border-subtle/50">
                  <span className="material-symbols-outlined text-error text-3xl">schedule</span>
                  <div>
                    <h4 className="text-white font-bold font-body-lg">Bo'sh vaqtni aniqlash qiyinligi</h4>
                    <p className="text-on-surface-variant text-body-md">Qaysi soatlar bo'sh ekanligini bilish uchun barcha stadionlarga birma-bir qo'ng'iroq qilish kerak.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
              <div className="relative bg-surface-container p-8 md:p-12 rounded-3xl border border-primary/20 pitch-glow">
                <span className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase">Bizning Yechim</span>
                <h3 className="font-display-lg text-headline-lg text-white mt-4 mb-6">StadiumUz barcha stadionlarni bitta platformaga birlashtiradi</h3>
                <p className="text-on-surface-variant text-body-lg mb-8">
                  Biz futbol ishqibozlari uchun eng qulay va zamonaviy bron qilish tizimini yaratdik. Endi barcha ma'lumotlar kaftingizda.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-white">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span>Real vaqt rejimida bo'sh vaqtlar</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span>Onlayn to'lov va kafolatlangan joy</span>
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span>Stadionlar reytingi va sharhlar</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase">Jarayon</span>
            <h2 className="font-headline-lg text-headline-lg text-white mt-2">Qanday ishlaydi?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: 'search', title: 'Qidiring', desc: "O'zingizga yaqin va qulay stadionlarni filtrlar orqali toping." },
              { icon: 'touch_app', title: 'Tanlang', desc: "Sizga ma'qul kelgan bo'sh vaqt va maydon turini tanlang." },
              { icon: 'credit_card', title: 'Bron qiling', desc: "Onlayn to'lovni amalga oshiring va joyingizni band qiling." },
              { icon: 'sports_soccer', title: "O'ynang", desc: "Belgilangan vaqtda stadionga boring va o'yindan zavqlaning." },
            ].map((step) => (
              <div key={step.icon} className="p-8 rounded-2xl bg-surface-container ghost-border group hover:bg-surface-variant/10 transition-all flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:pitch-glow transition-all">
                  <span className="material-symbols-outlined text-primary text-3xl">{step.icon}</span>
                </div>
                <h3 className="font-headline-md text-white mb-3">{step.title}</h3>
                <p className="text-on-surface-variant font-body-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stadiums */}
      <section className="py-24 bg-surface-container-lowest">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="font-label-caps text-label-caps text-primary tracking-[0.2em] uppercase">Mashhur Maskanlar</span>
              <h2 className="font-headline-lg text-headline-lg text-white mt-2">Ommabop Stadionlar</h2>
            </div>
            <Link to="/stadionlar" className="hidden md:flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body-md">
              Barchasini ko'rish
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-surface-container ghost-border rounded-xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-surface-variant/20"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-surface-variant/20 rounded w-3/4"></div>
                    <div className="h-3 bg-surface-variant/20 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              featured.map((stadium) => (
                <Link
                  key={stadium.id}
                  to={`/stadion/${stadium.id}`}
                  className="group bg-surface-container ghost-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute top-3 right-3 z-10 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                      <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-bold text-white">{stadium.rating}</span>
                    </div>
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${stadium.image_url}')` }}
                    ></div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-headline-md text-body-lg font-bold text-white">{stadium.name}</h3>
                      <span className="text-primary font-label-caps text-label-caps">{stadium.price_per_hour.toLocaleString('uz-UZ')} so'm/soat</span>
                    </div>
                    <p className="text-on-surface-variant text-body-sm mb-4">{stadium.address}</p>
                    <div className="flex gap-2">
                      {stadium.features.map((f) => (
                        <span key={f.id} className="px-2 py-1 rounded bg-surface-variant/30 text-[10px] font-label-caps text-on-surface uppercase">{f.name}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="relative rounded-3xl overflow-hidden bg-primary-container p-12 md:p-24 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent opacity-50"></div>
            <h2 className="relative z-10 font-display-lg text-headline-lg-mobile md:text-display-lg text-on-primary-container mb-6 tracking-tighter">
              Maydonni zabt etishga tayyormisiz?
            </h2>
            <p className="relative z-10 text-on-primary-container/80 text-body-lg mb-10 max-w-2xl mx-auto">
              Har hafta StadiumUz orqali 50,000 dan ortiq o'yinchi o'z o'yinini tashkil qilmoqda. Bugun qo'shiling.
            </p>
            <div className="relative z-10 flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/stadionlar" className="bg-on-primary-container text-primary-container px-10 py-4 rounded-xl font-button-text hover:bg-on-primary-container/90 transition-all">
                Stadion topish
              </Link>
              <button className="ghost-border border-on-primary-container/20 text-on-primary-container px-10 py-4 rounded-xl font-button-text hover:bg-on-primary-container/10 transition-all">
                Biznes hamkor bo'lish
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
