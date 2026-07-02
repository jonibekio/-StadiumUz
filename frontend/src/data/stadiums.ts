export interface Stadium {
  id: string
  name: string
  location: string
  district: string
  price: number
  rating: number
  reviews: number
  type: string
  surface: string
  available: boolean
  badge?: string
  image: string
  features: string[]
  description?: string
}

export const stadiums: Stadium[] = [
  {
    id: 'bunyodkor-elite',
    name: 'Bunyodkor Elite',
    location: 'Chilonzor tumani, Toshkent',
    district: 'Chilonzor',
    price: 450000,
    rating: 4.9,
    reviews: 124,
    type: '5x5',
    surface: 'Gibrid maysa',
    available: true,
    badge: 'PRO MAYDON',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxeiFPfvw_GdNTsisyNMLTaU6Lr5tXP8LvuIaC7NLyqf6RML06y2c4eRbffbCFgohmYggNRdwiMpTE-SKO3yvIQc92sqYqPTWUgh0R_xwdEt-sCgmGrpqrPiQ13EyOT2hdsgSkHjYvCE7HjK_8CH4SWYldzVsn17fhq-xt2ReadCjyOmX-iMWaCErub5rRnCzttf9L0jVA81HPPwPtdKv4Fl4tDHskZlkThkAYVkUsitGJEk9D1RMSDrldhofeBFUT7_EJGeTDd7az',
    features: ['Dush', 'Avtoturargoh'],
    description: 'Havaskorlar va yarim professionallar uchun yuqori standartdagi futbol maydoni.',
  },
  {
    id: 'poytaxt-arena',
    name: 'Poytaxt Arena',
    location: 'Mirobod tumani, Toshkent',
    district: 'Mirobod',
    price: 520000,
    rating: 4.8,
    reviews: 98,
    type: '7x7',
    surface: "Sun'iy 4G",
    available: false,
    badge: 'YOPYQ',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6EgYIZP646m4trY9MS0fmhk8TPRtsCON1iQZ4fHh7h-jRlR97bXs2RbCsZ7wcGYrKJI0HgAhx0MfDEyhXaBPAbgTe7BE2oxpnkNf3UHhp23B143ypJ49B7n83ZwjAQCCQh1l_L45LUKsGpxSdKEtQAxWewuI58diTkc7vqVPXvua44-bJMB_Q270rdYD4nrO3xDgkX0Rv7n_ThXF7G7H0d_IjLIB3zdeTvqLPKyPwYtSj45K3HpSNy2UbSmjj9TJBko2qgC8rOdJ7',
    features: ['Konditsioner', 'Wi-Fi'],
  },
  {
    id: 'olympic-reserve',
    name: 'Olympic Reserve',
    location: 'Yunusobod tumani, Toshkent',
    district: 'Yunusobod',
    price: 380000,
    rating: 4.7,
    reviews: 76,
    type: '5x5',
    surface: 'Tabiiy maysa',
    available: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3LTxVGpQAK-QvOUTFFitC5aUDEMTgU0kxumZsnvUzCjj65-IwtLB5TvHBXWGarab5bAh4oGjyvcD0jExPsufLtS_21zHS1dLFdzsO_4oJVnmrdTrG_zfEo-2lp0XCGgJlAJspfMnyYeWp6nf_KAnDUZFsK4VvU6g_rAjOpXnM6A0tbBR1-pC_IXL3DYyyF0PUp-aUUFm-qBX39qe7g-PmSFo1KE_81PKKgqLHZJa-4b1e3kqZXInw2oQeQIecPc9umVhkDDfXKtnI',
    features: ['Stadion'],
  },
  {
    id: 'skyline-turf',
    name: 'Skyline Turf',
    location: 'Markaz, Toshkent',
    district: 'Markaz',
    price: 650000,
    rating: 5.0,
    reviews: 52,
    type: '11x11',
    surface: 'Premium Sintetika',
    available: true,
    badge: 'TOMDA',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAedBaq9T8fCXQgD-qmaqTWlxGpgkBsAhBkaSUYJIxowFhLP-PEQcZcDHCsZegN5j0g3EBsE9ao-dx8dLG28XUpN8lb6HweZrZvGUx6-5kV8TN5zMUHOX1mwM4Y4meirZe-aGxUEsiPGmmuku5FZvj1Q5E68EU2z_q87ykNLM3OaCkGRCepAz84MC7LpdRW1CVcZdueRwYx0-T1KHjktGFK-n0iGD8CUvhQG8DuAjOwjP7TTLCiPHPmsP1QG-CIhsEIPjSDMsfM8BQZ',
    features: ['Rooftop', 'VIP'],
  },
  {
    id: 'community-hub',
    name: 'Community Hub',
    location: 'Sergeli tumani, Toshkent',
    district: 'Sergeli',
    price: 300000,
    rating: 4.6,
    reviews: 110,
    type: '7x7',
    surface: 'Standart maysa',
    available: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD7AKG1NF_KMfH0zPVBAph7RheYy3gVtbdfjmBbswaJ6q532jDeug8IHRI4Hp7aq6_PoFLSKWu7rr6Y52kykvIWfTjSEv4OtZzAP_qPOknms9O8emL0j4YzEyx9nAn9Zt7d7-XdEoPO59ylaI9xGLhbkjW9K9xRtHMcl4qqpNjJ9IYHiUTyLflPG0APIRRr9heimrW901XjSuBIMaFSX8s8t0m9YZVigsbRtnWEvKpHgYUWi-wdV27tyMiODRXWTzz6C0aNT9gdAnz',
    features: ['Kafe'],
  },
  {
    id: 'pro-academy',
    name: 'Pro Academy Field',
    location: 'Yakkasaroy tumani, Toshkent',
    district: 'Yakkasaroy',
    price: 580000,
    rating: 4.9,
    reviews: 67,
    type: '5x5',
    surface: 'Professional maysa',
    available: true,
    badge: 'ELITE HUB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuV2cqd-pyYp6uoTEy57Lzxb5rZgfOvNxRJLop6KDm-VN4xVek1B6KuLeQRGX_sY9BipsOS48mDBfPbzOFbPFMiaASogFz-wmKlBfTNAod11XJdyvsdh7Ksq_mj1cMFFbrGyyeWsubzOY9S6BoG5-GigaSi6A2Frx6FtBOTNN_s6x4fBIlGBBHJzbfb1NDLD0tSZ0uF1Crn0Njdq-lEdlBHAtMmxdtgGBwJUK0aSzJMzYHvygA7MQdYv2OihFp6WF-ZWKSY0t_TItT',
    features: ['Kiyinish xonasi', 'Pro'],
  },
]

export interface FeaturedStadium {
  id: string
  name: string
  location: string
  price: string
  rating: number
  surface: string
  image: string
  features: string[]
}

export const featuredStadiums: FeaturedStadium[] = [
  {
    id: 'wembley-hub',
    name: 'Wembley Hub',
    location: 'Markaz',
    price: '250,000 s/s',
    rating: 4.9,
    surface: "Sun'iy qoplama",
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUs6J1VBp_3Wp7Mr7h_j0xDvR8o9gsjhZcobKCMhCC14T5TJ4p5o5Tjlq247_XcR8253V16BSYXqg-dU1k7BWptaCCBBlr82O8PnW0urJE9CjdndMcLAS6zRnJ3-zBSCZAYtg12IWeCzndLD-q6Rpa6KRRLUGlkGooh6denOasx63v4DjrBgNOC9lC-u9gH_CBEdR5uQv4xXyNa6DLmiibppFIy9lTaAJ736Vg4e6c1DlVElFN14Tc_yvmZFCMKhcTJcmi4MXTM6iD',
    features: ['Dush', 'Turargoh'],
  },
  {
    id: 'sky-arena',
    name: 'Sky Arena',
    location: 'Chilonzor',
    price: '300,000 s/s',
    rating: 4.7,
    surface: 'Gibrid maysa',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaEHcCIBSo8PXlrTeUdNZw4RFxIX7UV5i11fE1r-U9p1D08i8xB2qvIkOp35J-X6dMOg14WMFzS-p1_rhdihGksUsxqNvTgrRrVECKVRb791d7pMmak4hCiAK6eFgA03HWK2jPFXlYmc0kBz1afEOgEHKf_DYXypZQryPfOJ02E6yrUZhYMGdS9uZ4sOnsEAhGdB0btGQ0el_AVUk_uY_RE25l2vVLckF4gKPkgpmAdti7U8RlG_cJIDBrEARCY5IbUr4ZsWOQ-g14',
    features: ['Rooftop', 'VIP'],
  },
  {
    id: 'the-cage',
    name: 'The Cage',
    location: 'Yunusobod',
    price: '180,000 s/s',
    rating: 4.8,
    surface: '5x5 maydon',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6COUiyapIvQ7-IrFKBnoLV5j6ZvfUn-045G15ST87kQbmrdmIr40qc8lnPOmToC3tlNf0B_oKJcJL_369e0_ku3ereULzt06FmW6eKuPFJV3R_jDeJFm_xsjZMfIo8eapFprjlS8-07r85_GWFRDGiJ6rg1iFG7TIqxogY-e-V3fq_3H7M31DpzOsVr4J6HHSL00zZS7TDelSi2v3v-yEghYVBOO6rZ6YHD3EkSglBWYXfJEMoJcduBeQ6dLoSnAgNK9gpyKVjBGT',
    features: ['Yopiq', 'Kafe'],
  },
  {
    id: 'grand-oval',
    name: 'Grand Oval',
    location: 'Sergeli',
    price: '600,000 s/s',
    rating: 5.0,
    surface: 'Tabiiy maysa',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs1S1G7_aUcVlubzh_j5b8nqRbKbGt6b5cHyg5oMKgCp-OrXz4tvDiFblpb7KFFEXJJl--EUEi1xa-Y3jM3rsk0jTycGnx6jyo4QfHH1yxPAuIekgF5-HirTL6-Ibjjedk61lwNA-acRTA8jFOkhycpJgCbSix4kJtfJ20nVbjiIO3AHYdIfqG8Cr-1QQnoDR-RznydVMJoQBE8ySHyRmpaTt5mm6LwUaTo-6wSJqfRbW-sQj-BRKJ9TU0tGqq3LpKhtFHzVnSXfGX',
    features: ['Pro', 'Kiyinish xonasi'],
  },
]

export const bookings = [
  {
    id: '1',
    stadium: 'Elite Arena',
    type: '5x5 Mini',
    status: 'paid' as const,
    time: '2 daqiqa avval',
    date: '15.10.2024',
    price: '250,000 UZS',
    surface: 'Ochiq maydon',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW_ZFvFtgfX6Xl3dhOD7ZwT55i2Kwd1OfWHI5e-lEU66sXZtcilu92rodeL0zBCZDVmf4yFz8RnaTbtYGVUnL5WhxzRMszt9y1Q2mfBG7m80LIHyYklQNuPkgt_iJ91BEmieR6tv_mMVDfrRGnprVXGCTIfLAMVbVenHruaGP5TbHP0q8aspjXcEpPZkl3dLYQTTvfVanxEqLwWSgKVnuaMIbNjWCpgRCscOCUgai6apakI_D-J6yHjBF4AlcXOFltai36tly6yqpO',
  },
  {
    id: '2',
    stadium: 'Skyline Turf',
    type: '11x11 Katta',
    status: 'pending' as const,
    time: '15 daqiqa avval',
    date: '08.10.2024',
    price: '180,000 UZS',
    surface: 'Yopiq zal',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9sf32ZJdJ-c-PNz7Ya70phPydUN467x5ZCBqXGxBt2Qxa4XhEIAaw4lTkuOC_Z-42oHFFkpyQSotwWl2uq-DdfKl-qHViSePoCG1CWv0B3fuUz-hKPXc61kN08nheV2Y2BzBxfrr9_iLIAU-wGc_RpYzz_MpOuZBovy9ttfeuntNUV0bjI5Hh-P4bBImjTe7BMLDvLoAFqGbg2NEO64eixGfsPq8_nJpHmOcHxIi7CHQRJaGcHgRxIBvcbm0GsWajp2y7LaN73o2u',
  },
  {
    id: '3',
    stadium: 'Victory Park',
    type: "7x7 O'rta",
    status: 'paid' as const,
    time: '1 soat avval',
    date: '02.10.2024',
    price: '220,000 UZS',
    surface: 'Sintetik',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe2MrYgclUpYIAoFDV_Z0FI9iKpX6ldq_DAMUX6s-b-uT4z5xzbjwmUrqeMTLoCBqJ0CwDpB--t1JJ3mFSkIe4qGi_6U_3C2p2zc3CeTlLQDwL_L2u9HxY820SKm_6nkBTxn2GAD41fL_hqKrn0pZ3fY1j181cZ6T-yV4rD3rPXk_4k_gAU2IhTfvXZImw2eOyq5Cscp0pNe9JPCCTsduRbRyMs-HMwujp_4osQKBch3xPzjLEEHuALPy5AuE8L7TtUGzRML3aIM1d',
  },
  {
    id: '4',
    stadium: 'Markaziy Stadion',
    type: "To'liq maydon",
    status: 'cancelled' as const,
    time: '3 soat avval',
    date: '25.09.2024',
    price: '300,000 UZS',
    surface: 'Tabiiy',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzV0M6tgTvWn61cE3rn946pkOQ9B4b1An-32bmGG3dOERCm73nEXD7QWMNf1al3M7hIV8OtFJKW1Yv6S0f4eG84kbvcbEyhWAaR0Tgl3csq6X-VMP-UOyGEaBYG4iIu-l5ZfIc3lb3BEIosM5XvmDYLSEpW8MtRAscWFdKKFnXE1RkFTM0FA-KdLiytAjGuSS-dcIWVU9P9gEUO3KzQUXbd15LRO-tdNuELcCcyrcvJK1nY0YdA1rxOZRxicPZ08WmQ4TLqLVUz1sK',
  },
]
