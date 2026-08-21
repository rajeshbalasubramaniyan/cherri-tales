import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import StoryReader from '../components/StoryReader'

export default function StoryPage({ childName, story, isAnthraStory, onNewStory, onHome }) {
  const [fontSize, setFontSize] = useState(16)
  const [highlightedParagraph, setHighlightedParagraph] = useState(-1)
  const contentRef = useRef(null)
  const paragraphRefs = useRef([])

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0)
  }, [story])

  useEffect(() => {
    if (highlightedParagraph >= 0 && paragraphRefs.current[highlightedParagraph]) {
      paragraphRefs.current[highlightedParagraph].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [highlightedParagraph])

  const handleHighlight = useCallback((index) => {
    setHighlightedParagraph(index)
  }, [])

  const paragraphs = story.split('\n\n').filter(Boolean)

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-purple/20">
        <button
          onClick={onHome}
          className="text-purple-glow/60 hover:text-purple-glow transition-colors cursor-pointer text-xs sm:text-sm"
        >
          ← Home
        </button>
        <h3 className="font-display text-gold text-sm sm:text-lg truncate mx-2">
          {isAnthraStory ? "Anthra's First Story" : `${childName}'s Story`}
        </h3>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => setFontSize(s => Math.max(14, s - 2))}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-night-lighter text-purple-glow/70 flex items-center justify-center cursor-pointer hover:bg-night-lighter/80 text-[10px] sm:text-xs font-bold"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize(s => Math.min(28, s + 2))}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-night-lighter text-purple-glow/70 flex items-center justify-center cursor-pointer hover:bg-night-lighter/80 text-[10px] sm:text-xs font-bold"
          >
            A+
          </button>
        </div>
      </div>

      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 max-w-2xl mx-auto w-full"
      >
        {isAnthraStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gold/5 border border-gold/20 rounded-xl p-4 mb-8 text-center"
          >
            <p className="text-gold/70 text-sm font-display">
              The story that started it all
            </p>
            <p className="text-purple-glow/40 text-xs mt-1">
              Born from Anthra's imagination, one bedtime at a time
            </p>
          </motion.div>
        )}

        <StoryReader story={story} onHighlight={handleHighlight} />

        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            ref={el => paragraphRefs.current[i] = el}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={`mb-6 leading-relaxed rounded-lg transition-all duration-500 ${
              highlightedParagraph === i
                ? 'text-moon bg-purple/10 px-3 py-2 -mx-3 shadow-[0_0_20px_rgba(167,139,250,0.1)]'
                : highlightedParagraph >= 0
                  ? 'text-moon/40'
                  : 'text-moon/90'
            }`}
            style={{ fontSize }}
          >
            {p}
          </motion.p>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: Math.min(paragraphs.length * 0.08, 2) + 0.5 }}
          className="text-center mt-12 mb-8"
        >
          <p className="text-gold/60 font-display text-2xl mb-2">The End</p>
          <p className="text-purple-glow/40 text-sm mb-8">
            Sweet dreams, {childName} 🌙
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNewStory}
            className="bg-gradient-to-r from-purple to-purple-light text-white font-display text-lg px-8 py-3 rounded-full cursor-pointer shadow-lg"
          >
            Tell Another Story
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
