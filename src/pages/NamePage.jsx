import { useState } from 'react'
import { motion } from 'framer-motion'
import Moon from '../components/Moon'

export default function NamePage({ onNext }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim()) onNext(name.trim())
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 relative z-10 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="flex justify-center mb-4 sm:mb-6">
          <Moon size={70} />
        </div>

        <h2 className="font-display text-2xl sm:text-3xl text-gold mb-2 sm:mb-3">
          Who's the story for?
        </h2>
        <p className="text-purple-glow/60 text-xs sm:text-sm mb-6 sm:mb-8">
          We'll make the story extra special just for them
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name..."
            autoFocus
            maxLength={30}
            className="w-full bg-night-lighter/60 border-2 border-purple/30 rounded-2xl px-5 py-3 sm:px-6 sm:py-4 text-lg sm:text-xl text-center text-moon placeholder-purple-glow/30 font-display focus:outline-none focus:border-purple-glow/60 transition-colors"
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-purple to-purple-light text-white font-display text-base sm:text-lg py-3 sm:py-4 rounded-full cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-lg transition-opacity"
          >
            That's me!
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
