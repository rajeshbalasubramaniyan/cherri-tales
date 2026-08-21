import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const messages = [
  'Gathering stardust...',
  'Waking up the characters...',
  'Painting the world...',
  'Sprinkling some magic...',
  'Adding a pinch of funny...',
  'Almost there...',
]

export default function GeneratingPage({ childName }) {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % messages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 relative z-10">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="text-5xl sm:text-7xl mb-6 sm:mb-8"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨
        </motion.div>

        <h2 className="font-display text-2xl sm:text-3xl text-gold mb-4">
          Crafting {childName}'s story...
        </h2>

        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-purple-glow/60 text-xs sm:text-sm h-5"
        >
          {messages[msgIndex]}
        </motion.p>

        <motion.div
          className="mt-10 sm:mt-12 flex gap-2 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-purple-glow"
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
