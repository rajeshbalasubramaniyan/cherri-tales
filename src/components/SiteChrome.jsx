// Shared CHERRI GROUP header and footer, so every app links back to cherri.group and to its sister apps.
// Keep this file identical across cherri-stories, cherri-shapes and cherri-words.
const HOME = 'https://cherri.group'
const APPS = [
  { id: 'pick', name: 'CHERRI PICK', short: 'PICK', what: 'Multiplication', emoji: '🍒', url: 'https://pick.cherri.group' },
  { id: 'tales', name: 'CHERRI TALES', short: 'TALES', what: 'Bedtime stories', emoji: '🌙', url: 'https://tales.cherri.group' },
  { id: 'shapes', name: 'CHERRI SHAPES', short: 'SHAPES', what: 'Geometry', emoji: '🔷', url: 'https://shapes.cherri.group' },
  { id: 'words', name: 'CHERRI WORDS', short: 'WORDS', what: 'English', emoji: '🔤', url: 'https://words.cherri.group' },
]
const asset = name => `${import.meta.env.BASE_URL}${name}`

export function SiteNav({ current, dark = false, className = '' }) {
  const text = dark ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-[#FF0000]'
  return (
    <nav className={`relative z-30 flex items-center justify-between gap-4 px-4 md:px-8 py-2 border-b backdrop-blur-sm ${dark ? 'bg-[#0F0A2A]/70 border-white/10' : 'bg-white/85 border-black/5'} ${className}`}>
      <a href={HOME} className="flex-shrink-0" aria-label="CHERRI GROUP home">
        <img src={asset(dark ? 'cherri-logo-white.png' : 'cherri-full-logo.png')} alt="CHERRI GROUP" className="h-10 md:h-11 object-contain" />
      </a>
      <div className="flex items-center gap-4 md:gap-5 text-sm font-semibold">
        <a href={HOME} className={`transition-colors ${text}`}>Home</a>
        {APPS.map(app => app.id === current ? (
          <span key={app.id} className={`hidden md:inline ${dark ? 'text-white' : 'text-[#FF0000]'}`}>{app.emoji} {app.short}</span>
        ) : (
          <a key={app.id} href={app.url} className={`hidden md:inline transition-colors ${text}`}>{app.emoji} {app.short}</a>
        ))}
        <a href={`${HOME}/#apps`} className={`md:hidden transition-colors ${text}`}>All apps</a>
      </div>
    </nav>
  )
}

export function SiteFooter({ current }) {
  return (
    <footer className="relative z-10 bg-[#FF0000] text-white py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-8 mb-8 text-sm">
          <div>
            <a href={HOME}><img src={asset('cherri-logo-white.png')} alt="CHERRI GROUP" className="h-14 object-contain mb-3" /></a>
            <p className="leading-relaxed">Where Daydreams Work! Apps born from a curious child's questions.</p>
          </div>
          <div>
            <h4 className="font-bold text-base mb-3">Our Apps</h4>
            <ul className="space-y-2">
              {APPS.map(app => (
                <li key={app.id}>
                  {app.id === current
                    ? <span className="font-bold">{app.emoji} {app.name} · you are here</span>
                    : <a href={app.url} className="hover:underline">{app.emoji} {app.name} · {app.what}</a>}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-base mb-3">CHERRI GROUP</h4>
            <ul className="space-y-2">
              <li><a href={HOME} className="hover:underline">cherri.group</a></li>
              <li><a href={`${HOME}/#story`} className="hover:underline">Our Story</a></li>
              <li><a href={`${HOME}/privacy`} className="hover:underline">Privacy Policy</a></li>
              <li><a href={`${HOME}/terms`} className="hover:underline">Terms and Conditions</a></li>
              <li><a href="mailto:daydream@cherri.group" className="hover:underline">daydream@cherri.group</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-6 text-center">
          <p className="text-xs">Built with 🍒 in Bengaluru &middot; &copy; {new Date().getFullYear()} CHERRI GROUP. Where Daydreams Work!</p>
        </div>
      </div>
    </footer>
  )
}
