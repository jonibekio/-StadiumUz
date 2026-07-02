export default function MobileNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container-lowest/95 backdrop-blur-md flex justify-around py-4 border-t border-border-subtle z-50">
      <button className="flex flex-col items-center gap-1 text-primary">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
        <span className="text-[10px] font-label-caps">PROFIL</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-on-surface-variant">
        <span className="material-symbols-outlined">explore</span>
        <span className="text-[10px] font-label-caps">MAYDONLAR</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-on-surface-variant">
        <span className="material-symbols-outlined">favorite</span>
        <span className="text-[10px] font-label-caps">SARALANGAN</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-on-surface-variant">
        <span className="material-symbols-outlined">settings</span>
        <span className="text-[10px] font-label-caps">SOZLAMALAR</span>
      </button>
    </div>
  )
}
