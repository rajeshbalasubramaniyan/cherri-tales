import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import StarField from './components/StarField'
import ParentSettings from './components/ParentSettings'
import FamilyProfile from './components/FamilyProfile'
import WelcomePage from './pages/WelcomePage'
import NamePage from './pages/NamePage'
import StoryBuilderPage from './pages/StoryBuilderPage'
import GeneratingPage from './pages/GeneratingPage'
import StoryPage from './pages/StoryPage'
import { generateStory, getAnthraStory } from './services/storyGenerator'

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [childName, setChildName] = useState('')
  const [story, setStory] = useState('')
  const [isAnthraStory, setIsAnthraStory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [familyProfile, setFamilyProfile] = useState(null)
  const [storiesRead, setStoriesRead] = useState(0)
  const [error, setError] = useState('')

  const handleStart = () => setScreen('name')

  const handleName = (name) => {
    setChildName(name)
    setScreen('builder')
  }

  const handleGenerate = useCallback(async (selections) => {
    setScreen('generating')
    setError('')
    try {
      const generatedStory = await generateStory(childName, selections)
      setStory(generatedStory)
      setIsAnthraStory(generatedStory === getAnthraStory())
      setScreen('story')
      const newCount = storiesRead + 1
      setStoriesRead(newCount)
      if (newCount === 1 && !familyProfile) {
        setTimeout(() => setShowProfile(true), 3000)
      }
    } catch (err) {
      setError('Could not create the story. Showing our favorite story instead!')
      setStory(getAnthraStory())
      setIsAnthraStory(true)
      setScreen('story')
    }
  }, [childName, storiesRead, familyProfile])

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

  const handleSaveProfile = (data) => {
    setFamilyProfile(data)
    if (data.child.name) setChildName(data.child.name)
  }

  return (
    <div className="relative min-h-screen">
      <StarField />

      <div className="fixed top-4 right-4 z-40 flex gap-2">
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

      {screen === 'welcome' && (
        <WelcomePage onStart={handleStart} onReadAnthraStory={handleReadAnthraStory} />
      )}
      {screen === 'name' && <NamePage onNext={handleName} />}
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

      <AnimatePresence>
        {showSettings && (
          <ParentSettings
            onClose={() => setShowSettings(false)}
            onOpenProfile={() => {
              setShowSettings(false)
              setShowProfile(true)
            }}
            hasProfile={!!familyProfile}
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
