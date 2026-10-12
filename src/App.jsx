import { useState, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import StarField from './components/StarField'
import ParentSettings from './components/ParentSettings'
import FamilyProfile from './components/FamilyProfile'
import { SiteNav, SiteFooter } from './components/SiteChrome'
import WelcomePage from './pages/WelcomePage'
import NamePage from './pages/NamePage'
import StoryBuilderPage from './pages/StoryBuilderPage'
import GeneratingPage from './pages/GeneratingPage'
import StoryPage from './pages/StoryPage'
import DashboardPage from './pages/DashboardPage'
import { generateStory, getAnthraStory } from './services/storyGenerator'
import { saveStory, getStoryCount, getStreak } from './services/storyLibrary'

// Kept only on this device (localStorage) — nothing is sent anywhere.
const CHILD_KEY = 'cherri-tales-child'
const FAMILY_KEY = 'cherri-tales-family'
function load(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
}

export default function App() {
  const savedChild = load(CHILD_KEY)
  const [screen, setScreen] = useState('welcome')
  const [childName, setChildName] = useState(savedChild?.name || '')
  const [childAge, setChildAge] = useState(savedChild?.age || null)
  const [story, setStory] = useState('')
  const [isAnthraStory, setIsAnthraStory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [familyProfile, setFamilyProfile] = useState(() => load(FAMILY_KEY))
  const [error, setError] = useState('')
  const lastSelections = useRef(null)

  const handleStart = () => setScreen('name')

  const handleName = (name, age) => {
    setChildName(name)
    setChildAge(age)
    save(CHILD_KEY, { name, age })
    setScreen('builder')
  }

  const handleGenerate = useCallback(async (selections) => {
    setScreen('generating')
    setError('')
    lastSelections.current = selections
    try {
      const generatedStory = await generateStory(childName, selections, childAge)
      const isDefault = generatedStory === getAnthraStory()
      setStory(generatedStory)
      setIsAnthraStory(isDefault)
      setScreen('story')

      if (!isDefault) {
        saveStory(childName, generatedStory, selections)
      }

      const storyCount = getStoryCount()
      if (storyCount === 1 && !familyProfile) {
        setTimeout(() => setShowProfile(true), 3000)
      }
    } catch (err) {
      setStory(getAnthraStory())
      setIsAnthraStory(true)
      setScreen('story')
    }
  }, [childName, childAge, familyProfile])

  const handleNewStory = () => setScreen('builder')
  const handleHome = () => {
    setScreen('welcome')
    setError('')
  }

  const handleReadAnthraStory = () => {
    if (!childName) setChildName('Little One')
    setStory(getAnthraStory())
    setIsAnthraStory(true)
    setScreen('story')
  }

  const handleDashboard = () => {
    if (!childName) setChildName('Little One')
    setScreen('dashboard')
  }

  const handleViewStory = (entry) => {
    setStory(entry.story)
    setChildName(entry.childName)
    setIsAnthraStory(false)
    setScreen('story')
  }

  const handleSaveProfile = (data) => {
    setFamilyProfile(data)
    save(FAMILY_KEY, data)
    const name = data.child.name || childName
    const age = data.child.age ? Number(data.child.age) : childAge
    setChildName(name)
    setChildAge(age)
    save(CHILD_KEY, { name, age })
  }

  const streak = getStreak()
  const showChrome = screen === 'welcome' || screen === 'dashboard'

  return (
    <div className="relative min-h-screen">
      <StarField />

      <div className={`fixed right-4 z-[60] flex gap-2 ${showChrome ? 'top-28' : 'top-4'}`}>
        {familyProfile && (
          <div className="w-9 h-9 rounded-full bg-purple/30 border border-purple-glow/30 flex items-center justify-center text-xs text-purple-glow" title="Profile saved">
            ✓
          </div>
        )}
        <button
          onClick={() => setShowSettings(true)}
          className="w-9 h-9 rounded-full bg-night-lighter/60 border border-purple/20 flex items-center justify-center cursor-pointer hover:border-purple-glow/40 transition-colors text-purple-glow/40 hover:text-purple-glow/70"
          title="Settings"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 10a2 2 0 100-4 2 2 0 000 4z"/>
            <path fillRule="evenodd" d="M6.5.8a1.5 1.5 0 013 0v.7a5.5 5.5 0 011.3.5l.5-.5a1.5 1.5 0 012.1 2.1l-.5.5a5.5 5.5 0 01.5 1.3h.7a1.5 1.5 0 010 3h-.7a5.5 5.5 0 01-.5 1.3l.5.5a1.5 1.5 0 01-2.1 2.1l-.5-.5a5.5 5.5 0 01-1.3.5v.7a1.5 1.5 0 01-3 0v-.7a5.5 5.5 0 01-1.3-.5l-.5.5a1.5 1.5 0 01-2.1-2.1l.5-.5a5.5 5.5 0 01-.5-1.3H1.8a1.5 1.5 0 010-3h.7a5.5 5.5 0 01.5-1.3l-.5-.5A1.5 1.5 0 014.6 1.5l.5.5A5.5 5.5 0 016.4 1.5V.8zM8 12a4 4 0 100-8 4 4 0 000 8z" clipRule="evenodd"/>
          </svg>
        </button>
      </div>

      {showChrome && <SiteNav dark />}
      {screen === 'welcome' && (
        <WelcomePage
          onStart={handleStart}
          onReadAnthraStory={handleReadAnthraStory}
          onDashboard={handleDashboard}
          streak={streak}
          storyCount={getStoryCount()}
        />
      )}
      {screen === 'name' && <NamePage onNext={handleName} initialName={childName === 'Little One' ? '' : childName} initialAge={childAge} />}
      {screen === 'builder' && (
        <StoryBuilderPage childName={childName} onGenerate={handleGenerate} />
      )}
      {screen === 'generating' && <GeneratingPage childName={childName} />}
      {screen === 'story' && (
        <StoryPage
          childName={childName}
          story={story}
          isAnthraStory={isAnthraStory}
          onNewStory={handleNewStory}
          onHome={handleHome}
        />
      )}
      {screen === 'dashboard' && (
        <DashboardPage
          childName={childName}
          onHome={handleHome}
          onViewStory={handleViewStory}
        />
      )}

      {showChrome && <SiteFooter />}

      <AnimatePresence>
        {showSettings && (
          <ParentSettings
            onClose={() => setShowSettings(false)}
            onOpenProfile={() => {
              setShowSettings(false)
              setShowProfile(true)
            }}
            hasProfile={!!familyProfile}
            onClearDevice={() => {
              try {
                Object.keys(localStorage).filter(k => k.startsWith('cherri-tales')).forEach(k => localStorage.removeItem(k))
              } catch { /* storage unavailable */ }
              setFamilyProfile(null); setChildName(''); setChildAge(null); setScreen('welcome')
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfile && (
          <FamilyProfile
            initialData={familyProfile}
            onSave={handleSaveProfile}
            onClose={() => setShowProfile(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
