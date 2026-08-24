import { motion } from 'framer-motion'
import Moon from '../components/Moon'

export default function WelcomePage({ onStart, onReadAnthraStory, onDashboard, streak, storyCount }) {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 text-center relative z-10 py-8">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mb-4 sm:mb-8"
      >
        <Moon size={80} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-4xl sm:text-5xl md:text-7xl text-gold mb-2"
      >
        CHERRI TALES
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-purple-glow/70 text-base sm:text-lg mb-1 font-display"
      >
        Where Daydreams Work!
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="text-moon/60 text-xs sm:text-sm mb-6 sm:mb-8 max-w-md"
      >
        Tell us your dream story and we'll make it come alive.
        A bedtime story made from your imagination.
      </motion.p>

      {storyCount > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={onDashboard}
          className="mb-6 bg-night-lighter/50 border border-purple/20 rounded-2xl px-5 py-3 cursor-pointer hover:border-purple/40 transition-colors"
        >
          <div className="flex items-center gap-4">
            {streak.currentStreak > 0 && (
              <div className="text-center">
                <p className="text-gold font-display text-lg leading-none">{streak.currentStreak}</p>
                <p className="text-purple-glow/40 text-[10px]">streak</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-purple-glow/80 font-display text-lg leading-none">{storyCount}</p>
              <p className="text-purple-glow/40 text-[10px]">{storyCount === 1 ? 'story' : 'stories'}</p>
            </div>
            <span className="text-purple-glow/30 text-xs">View journey →</span>
          </div>
        </motion.button>
      )}

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,215,0,0.4)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="bg-gradient-to-r from-purple to-purple-light text-white font-display text-lg sm:text-xl px-8 sm:px-10 py-3 sm:py-4 rounded-full cursor-pointer shadow-lg"
      >
        {storyCount > 0 ? "Tonight's Story" : 'Start a Story'}
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onReadAnthraStory}
        className="mt-3 sm:mt-4 text-gold/50 hover:text-gold/80 text-xs sm:text-sm cursor-pointer transition-colors font-display"
      >
        ✨ Read Anthra's First Story
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.8 }}
        className="text-moon/40 text-[10px] sm:text-xs mt-4 sm:mt-6"
      >
        With a parent or guardian
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2 }}
        className="absolute bottom-4 left-0 right-0 text-center"
      >
        <p className="text-moon/30 text-[10px]">
          A CHERRI GROUP product · Built with love in Bengaluru
        </p>
      </motion.div>
    </div>
  )
}
