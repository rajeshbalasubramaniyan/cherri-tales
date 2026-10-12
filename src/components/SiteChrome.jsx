import { useState } from 'react'

// The standard CHERRI GROUP header and footer, matching cherri.group itself.
// Keep this file identical across cherri-pick, cherri-stories, cherri-shapes and cherri-words.
const HOME = 'https://cherri.group'
const NAV_ITEMS = [
  { label: 'Our Story', href: `${HOME}/#story` },
  { label: 'Our Apps', href: `${HOME}/#apps` },
  { label: 'The Science', href: `${HOME}/research` },
  { label: 'Ideas Lab', href: `${HOME}/#ideas` },
]
const APPS = [
  { id: 'pick', name: 'CHERRI PICK', emoji: '🍒', url: 'https://pick.cherri.group' },
  { id: 'tales', name: 'CHERRI TALES', emoji: '🌙', url: 'https://tales.cherri.group' },
  { id: 'shapes', name: 'CHERRI SHAPES', emoji: '🔷', url: 'https://shapes.cherri.group' },
  { id: 'words', name: 'CHERRI WORDS', emoji: '🔤', url: 'https://words.cherri.group' },
]
const asset = name => `${import.meta.env.BASE_URL}${name}`

// dark: for apps with a night background (white logo, light links).
export function SiteNav({ dark = false, className = '' }) {
  const [open, setOpen] = useState(false)
  const link = dark ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-[#FF0000]'
  const bar = dark ? 'bg-white' : 'bg-gray-800'
  return (
    <nav className={`relative z-50 flex items-center justify-between px-6 md:px-12 py-6 max-w-7xl mx-auto w-full ${className}`}>
      <a href={HOME} aria-label="CHERRI GROUP home">
        <img src={asset(dark ? 'cherri-logo-white.png' : 'cherri-full-logo.png')} alt="Cherri" className="h-14 md:h-16 object-contain" />
      </a>

      <div className="hidden md:flex gap-6 text-sm font-semibold font-body">
        {NAV_ITEMS.map(item => (
          <a key={item.href} href={item.href} className={`transition-colors ${link}`}>{item.label}</a>
        ))}
      </div>

      <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer" aria-label="Toggle menu" aria-expanded={open}>
        <span className={`block w-6 h-0.5 origin-center transition-transform ${bar} ${open ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-6 h-0.5 transition-opacity ${bar} ${open ? 'opacity-0' : ''}`} />
        <span className={`block w-6 h-0.5 origin-center transition-transform ${bar} ${open ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 md:hidden">
          <div className="flex flex-col py-4">
            {NAV_ITEMS.map(item => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}
                className="px-8 py-3 text-gray-700 hover:text-[#FF0000] hover:bg-[#FFF5F5] transition-colors font-body font-semibold text-sm text-left">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export function SiteFooter() {
  return (
    <footer className="relative z-10 bg-[#FF0000] text-white py-16 px-6 text-left">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <a href={HOME}><img src={asset('cherri-logo-white.png')} alt="Cherri" className="h-16 object-contain mb-4" /></a>
            <p className="text-white text-sm leading-relaxed font-body">
              Where daydreams work! An innovation hub born from the imagination of a curious 9-year-old. Where challenges become apps and wild ideas become reality.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg text-white mb-4">Explore</h4>
            <ul className="space-y-2 text-sm font-body list-none p-0">
              <li><a href={`${HOME}/#story`} className="text-white hover:underline">Our Story</a></li>
              <li><a href={`${HOME}/research`} className="text-white hover:underline">The Research</a></li>
              <li><a href={`${HOME}/#apps`} className="text-white hover:underline">Daydreams Built</a></li>
              <li><a href={`${HOME}/#ideas`} className="text-white hover:underline">Ideas Lab</a></li>
            </ul>
            <h4 className="font-display font-bold text-lg text-white mb-4 mt-6">Our Apps</h4>
            <ul className="space-y-2 text-sm font-body list-none p-0">
              {APPS.map(app => (
                <li key={app.id}><a href={app.url} className="text-white hover:underline">{app.emoji} {app.name}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm font-body mb-6 list-none p-0">
              <li><a href={`${HOME}/privacy`} className="text-white hover:underline">Privacy Policy</a></li>
              <li><a href={`${HOME}/terms`} className="text-white hover:underline">Terms and Conditions</a></li>
            </ul>
            <h4 className="font-display font-bold text-lg text-white mb-4">Say Hello</h4>
            <ul className="space-y-2 text-sm text-white font-body list-none p-0">
              <li><a href="mailto:daydream@cherri.group" className="text-white hover:underline">daydream@cherri.group</a></li>
              <li>Bengaluru, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 space-y-3">
          <p className="text-white text-xs text-center font-body">
            She spoke. He listened. He started building. A <strong>CHERRI GROUP</strong> initiative by <strong>Anthra Rajesh</strong>, built by her Dada, <strong>Rajesh Balasubramaniyan</strong>
          </p>
          <p className="text-white text-xs text-center font-body">
            Built with 🍒 in Bengaluru &middot; &copy; {new Date().getFullYear()} CHERRI GROUP. Where Daydreams Work!
          </p>
        </div>
      </div>
    </footer>
  )
}
