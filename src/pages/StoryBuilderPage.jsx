import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import OptionChip from '../components/OptionChip'
import { moods, characters, worlds, magicElements, lengths } from '../components/StoryOptions'

const steps = [
  { key: 'mood', title: 'What kind of story?', subtitle: 'Pick as many as you like!', options: moods, multi: true },
  { key: 'characters', title: 'Who should be in it?', subtitle: 'Choose your characters!', options: characters, multi: true },
  { key: 'world', title: 'Where does it happen?', subtitle: 'Pick a world!', options: worlds, multi: true },
  { key: 'magic', title: 'Any magic?', subtitle: 'Add some sparkle!', options: magicElements, multi: true },
  { key: 'length', title: 'How long?', subtitle: 'Pick a story length', options: lengths, multi: false },
]

export default function StoryBuilderPage({ childName, onGenerate }) {
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState({
    mood: [],
    characters: [],
    world: [],
    magic: [],
    length: 'medium',
  })
  const [extraIdea, setExtraIdea] = useState('')

  const current = steps[step]
  const isLastStep = step === steps.length - 1

  const toggleSelection = (key, id, multi) => {
    setSelections(prev => {
      if (!multi) return { ...prev, [key]: id }
      const arr = prev[key]
      return {
        ...prev,
        [key]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id],
      }
    })
  }

  const canProceed = () => {
    const val = selections[current.key]
    return Array.isArray(val) ? val.length > 0 : !!val
  }

  const handleNext = () => {
    if (isLastStep) {
      onGenerate({ ...selections, extraIdea: extraIdea.trim() })
    } else {
      setStep(s => s + 1)
    }
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12 relative z-10">
      <div className="w-full max-w-lg">
        <div className="flex gap-1.5 mb-6 sm:mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-purple-glow' : 'bg-night-lighter'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-purple-glow/50 text-xs sm:text-sm mb-1">
              {childName}'s story
            </p>
            <h2 className="font-display text-2xl sm:text-3xl text-gold mb-1">
              {current.title}
            </h2>
            <p className="text-purple-glow/60 text-xs sm:text-sm mb-4 sm:mb-6">
              {current.subtitle}
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
              {current.options.map(opt => (
                <OptionChip
                  key={opt.id}
                  emoji={opt.emoji}
                  label={opt.label}
                  selected={
                    current.multi
                      ? selections[current.key].includes(opt.id)
                      : selections[current.key] === opt.id
                  }
                  onClick={() => toggleSelection(current.key, opt.id, current.multi)}
                />
              ))}
            </div>

            {isLastStep && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6"
              >
                <p className="text-purple-glow/50 text-xs sm:text-sm mb-2">
                  Anything else you'd like in the story?
                </p>
                <textarea
                  value={extraIdea}
                  onChange={(e) => setExtraIdea(e.target.value)}
                  placeholder="Maybe a dancing penguin or a castle made of candy..."
                  maxLength={200}
                  rows={3}
                  className="w-full bg-night-lighter/60 border-2 border-purple/30 rounded-xl px-4 py-3 text-xs sm:text-sm text-moon placeholder-purple-glow/30 focus:outline-none focus:border-purple-glow/60 transition-colors resize-none"
                />
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-4">
          {step > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(s => s - 1)}
              className="px-5 sm:px-6 py-3 rounded-full border-2 border-purple/30 text-purple-glow/70 text-sm font-medium cursor-pointer hover:border-purple-glow/50 transition-colors"
            >
              Back
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-gradient-to-r from-purple to-purple-light text-white font-display text-base sm:text-lg py-3 rounded-full cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
          >
            {isLastStep ? '✨ Create My Story!' : 'Next'}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
