import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { getAvailableVoices, synthesizeSpeech, isAPIAvailable } from '../services/ttsService'

export default function StoryReader({ story, onHighlight }) {
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentParagraph, setCurrentParagraph] = useState(-1)
  const [selectedVoice, setSelectedVoice] = useState('ava')

  const audioRef = useRef(null)
  const cacheRef = useRef({})
  const voices = getAvailableVoices()
  const paragraphs = story.split('\n\n').filter(Boolean)

  useEffect(() => {
    onHighlight?.(currentParagraph)
  }, [currentParagraph, onHighlight])

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      Object.values(cacheRef.current).forEach(url => URL.revokeObjectURL(url))
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setPlaying(false)
    setPaused(false)
    setProgress(0)
    setCurrentParagraph(-1)
  }, [])

  const play = useCallback(async () => {
    if (paused && audioRef.current) {
      audioRef.current.play()
      setPaused(false)
      return
    }

    setError(false)
    setLoading(true)
    setPlaying(true)

    try {
      const cacheKey = selectedVoice
      let audioUrl = cacheRef.current[cacheKey]

      if (!audioUrl) {
        audioUrl = await synthesizeSpeech(story, selectedVoice)
        if (!audioUrl) throw new Error('No audio')
        cacheRef.current[cacheKey] = audioUrl
      }

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        setPlaying(false)
        setPaused(false)
        setProgress(100)
        setCurrentParagraph(-1)
      }
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100)
          const idx = Math.floor((audio.currentTime / audio.duration) * paragraphs.length)
          setCurrentParagraph(Math.min(idx, paragraphs.length - 1))
        }
      }
      audio.onerror = () => {
        setError(true)
        setLoading(false)
        setPlaying(false)
      }

      setLoading(false)
      await audio.play()
    } catch {
      setError(true)
      setLoading(false)
      setPlaying(false)
    }
  }, [paused, story, selectedVoice, paragraphs.length])

  const pause = useCallback(() => {
    if (audioRef.current) audioRef.current.pause()
    setPaused(true)
  }, [])

  if (!isAPIAvailable()) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-night-lighter/60 border border-purple/20 rounded-2xl p-4 mb-8"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-sm text-purple-glow/50 font-display">Read to me</span>
        <div className="flex-1" />
        {loading && (
          <span className="text-purple-glow/40 text-xs animate-pulse">Preparing voice...</span>
        )}
        {playing && !paused && !loading && (
          <div className="flex gap-1 items-end h-4">
            {[0, 1, 2, 3].map(i => (
              <motion.div
                key={i}
                className="w-1 bg-purple-glow rounded-full"
                animate={{ height: [4, 14, 4] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                style={{ height: 4 }}
              />
            ))}
          </div>
        )}
        {paused && <span className="text-purple-glow/40 text-xs">Paused</span>}
        {error && <span className="text-cherry/60 text-xs">Voice unavailable, please read below</span>}
      </div>

      <div className="flex items-center gap-3">
        {!playing ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={play}
            disabled={loading}
            className="w-11 h-11 rounded-full bg-purple flex items-center justify-center cursor-pointer hover:bg-purple-light transition-colors flex-shrink-0 disabled:opacity-50"
            aria-label="Play"
          >
            <svg width="16" height="18" viewBox="0 0 16 18" fill="white">
              <path d="M0 0L16 9L0 18V0Z" />
            </svg>
          </motion.button>
        ) : (
          <div className="flex gap-2 flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={paused ? play : pause}
              className="w-11 h-11 rounded-full bg-purple flex items-center justify-center cursor-pointer hover:bg-purple-light transition-colors"
              aria-label={paused ? 'Resume' : 'Pause'}
            >
              {paused ? (
                <svg width="14" height="16" viewBox="0 0 16 18" fill="white">
                  <path d="M0 0L16 9L0 18V0Z" />
                </svg>
              ) : (
                <svg width="12" height="14" viewBox="0 0 12 14" fill="white">
                  <rect x="0" y="0" width="4" height="14" />
                  <rect x="8" y="0" width="4" height="14" />
                </svg>
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={stop}
              className="w-11 h-11 rounded-full bg-night-lighter border border-purple/30 flex items-center justify-center cursor-pointer hover:border-purple-glow/50 transition-colors"
              aria-label="Stop"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="text-purple-glow/70">
                <rect width="12" height="12" rx="1" />
              </svg>
            </motion.button>
          </div>
        )}

        <div className="flex-1 flex flex-col gap-1">
          <div className="w-full h-1.5 bg-night rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-glow rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 text-xs text-purple-glow/40">
        <select
          value={selectedVoice}
          onChange={(e) => {
            setSelectedVoice(e.target.value)
            if (playing) stop()
          }}
          className="bg-night-lighter border border-purple/20 rounded-lg px-2 py-1 text-purple-glow/60 text-xs cursor-pointer focus:outline-none"
        >
          {voices.map(v => (
            <option key={v.id} value={v.id}>{v.label}</option>
          ))}
        </select>
        <span className="text-purple-glow/20 text-[10px]">Expressive AI voice</span>
      </div>
    </motion.div>
  )
}
