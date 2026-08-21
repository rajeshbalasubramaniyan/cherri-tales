import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { getAvailableVoices, synthesizeSpeech, isAPIAvailable } from '../services/ttsService'

const SYSTEM_VOICE_PREFS = [
  'Samantha (Enhanced)', 'Samantha', 'Karen', 'Moira',
  'Google UK English Female', 'Microsoft Aria Online',
  'Zoe (Enhanced)', 'Fiona',
]

export default function StoryReader({ story, onHighlight }) {
  const [mode, setMode] = useState(isAPIAvailable() ? 'api' : 'system')
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentParagraph, setCurrentParagraph] = useState(-1)
  const [progress, setProgress] = useState(0)
  const [selectedVoice, setSelectedVoice] = useState(
    isAPIAvailable() ? 'warm_female' : null
  )
  const [systemVoices, setSystemVoices] = useState([])
  const [selectedSystemVoice, setSelectedSystemVoice] = useState(null)
  const [rate, setRate] = useState(0.85)

  const audioRef = useRef(null)
  const playingRef = useRef(false)
  const indexRef = useRef(0)

  const paragraphs = story.split('\n\n').filter(Boolean)
  const apiVoices = getAvailableVoices()

  useEffect(() => {
    if (mode === 'system') {
      const loadVoices = () => {
        const available = speechSynthesis.getVoices()
        const english = available.filter(v => v.lang.startsWith('en'))
        setSystemVoices(english)
        if (!selectedSystemVoice && english.length > 0) {
          for (const pref of SYSTEM_VOICE_PREFS) {
            const match = english.find(v => v.name.includes(pref))
            if (match) { setSelectedSystemVoice(match); return }
          }
          setSelectedSystemVoice(english[0])
        }
      }
      loadVoices()
      speechSynthesis.onvoiceschanged = loadVoices
    }
    return () => {
      speechSynthesis.cancel()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      playingRef.current = false
    }
  }, [mode])

  useEffect(() => {
    onHighlight?.(currentParagraph)
  }, [currentParagraph, onHighlight])

  const stopAll = useCallback(() => {
    speechSynthesis.cancel()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    playingRef.current = false
    setPlaying(false)
    setPaused(false)
    setCurrentParagraph(-1)
    setProgress(0)
    setLoading(false)
    indexRef.current = 0
  }, [])

  const playWithAPI = useCallback(async () => {
    setLoading(true)
    setPlaying(true)
    playingRef.current = true

    try {
      const fullText = paragraphs.join('\n\n')
      const audioUrl = await synthesizeSpeech(fullText, selectedVoice)

      if (!playingRef.current) return

      const audio = new Audio(audioUrl)
      audioRef.current = audio

      audio.onended = () => {
        setPlaying(false)
        setCurrentParagraph(-1)
        setProgress(100)
        playingRef.current = false
      }

      audio.ontimeupdate = () => {
        if (audio.duration) {
          const pct = (audio.currentTime / audio.duration) * 100
          setProgress(pct)
          const pIdx = Math.floor((audio.currentTime / audio.duration) * paragraphs.length)
          setCurrentParagraph(Math.min(pIdx, paragraphs.length - 1))
        }
      }

      audio.onerror = () => {
        stopAll()
      }

      setLoading(false)
      await audio.play()
    } catch {
      setLoading(false)
      stopAll()
    }
  }, [paragraphs, selectedVoice, stopAll])

  const speakParagraphSystem = useCallback((index) => {
    if (index >= paragraphs.length || !playingRef.current) {
      setPlaying(false)
      setPaused(false)
      setCurrentParagraph(-1)
      setProgress(100)
      playingRef.current = false
      return
    }

    setCurrentParagraph(index)
    setProgress(Math.round((index / paragraphs.length) * 100))

    const utt = new SpeechSynthesisUtterance(paragraphs[index])
    if (selectedSystemVoice) utt.voice = selectedSystemVoice
    utt.rate = rate
    utt.pitch = 1.05

    utt.onend = () => {
      indexRef.current = index + 1
      setTimeout(() => {
        if (playingRef.current) speakParagraphSystem(index + 1)
      }, 600)
    }

    utt.onerror = () => {
      setPlaying(false)
      setPaused(false)
      setCurrentParagraph(-1)
      playingRef.current = false
    }

    speechSynthesis.speak(utt)
  }, [paragraphs, selectedSystemVoice, rate])

  const play = useCallback(() => {
    if (paused) {
      if (mode === 'api' && audioRef.current) {
        audioRef.current.play()
      } else {
        speechSynthesis.resume()
      }
      setPaused(false)
      return
    }

    if (mode === 'api') {
      playWithAPI()
    } else {
      speechSynthesis.cancel()
      playingRef.current = true
      setPlaying(true)
      setPaused(false)
      speakParagraphSystem(0)
    }
  }, [mode, paused, playWithAPI, speakParagraphSystem])

  const pause = useCallback(() => {
    if (mode === 'api' && audioRef.current) {
      audioRef.current.pause()
    } else {
      speechSynthesis.pause()
    }
    setPaused(true)
  }, [mode])

  const voiceOptions = mode === 'api' ? apiVoices : systemVoices

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
        {paused && (
          <span className="text-purple-glow/40 text-xs">Paused</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!playing ? (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={play}
            disabled={loading}
            className="w-11 h-11 rounded-full bg-purple flex items-center justify-center cursor-pointer hover:bg-purple-light transition-colors flex-shrink-0 disabled:opacity-50"
          >
            <svg width="16" height="18" viewBox="0 0 16 18" fill="white">
              <path d="M0 0L16 9L0 18V0Z"/>
            </svg>
          </motion.button>
        ) : (
          <div className="flex gap-2 flex-shrink-0">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={paused ? play : pause}
              className="w-11 h-11 rounded-full bg-purple flex items-center justify-center cursor-pointer hover:bg-purple-light transition-colors"
            >
              {paused ? (
                <svg width="14" height="16" viewBox="0 0 16 18" fill="white">
                  <path d="M0 0L16 9L0 18V0Z"/>
                </svg>
              ) : (
                <svg width="12" height="14" viewBox="0 0 12 14" fill="white">
                  <rect x="0" y="0" width="4" height="14"/>
                  <rect x="8" y="0" width="4" height="14"/>
                </svg>
              )}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={stopAll}
              className="w-11 h-11 rounded-full bg-night-lighter border border-purple/30 flex items-center justify-center cursor-pointer hover:border-purple-glow/50 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="text-purple-glow/70">
                <rect width="12" height="12" rx="1"/>
              </svg>
            </motion.button>
          </div>
        )}

        <div className="flex-1 flex flex-col gap-1">
          <div className="w-full h-1.5 bg-night rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-purple-glow rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {playing && currentParagraph >= 0 && (
            <span className="text-purple-glow/30 text-[10px]">
              Paragraph {currentParagraph + 1} of {paragraphs.length}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-3 text-xs text-purple-glow/40 flex-wrap">
        <select
          value={mode === 'api' ? selectedVoice : (selectedSystemVoice?.name || '')}
          onChange={(e) => {
            if (mode === 'api') {
              setSelectedVoice(e.target.value)
            } else {
              setSelectedSystemVoice(systemVoices.find(v => v.name === e.target.value))
            }
            if (playing) stopAll()
          }}
          className="bg-night-lighter border border-purple/20 rounded-lg px-2 py-1 text-purple-glow/60 text-xs cursor-pointer focus:outline-none max-w-[160px]"
        >
          {mode === 'api'
            ? apiVoices.map(v => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))
            : systemVoices.map(v => (
                <option key={v.name} value={v.name}>
                  {v.name.replace(/Microsoft |Google |Apple /, '')}
                </option>
              ))
          }
        </select>

        {mode === 'system' && (
          <div className="flex items-center gap-1.5">
            <span>Speed</span>
            <input
              type="range"
              min="0.6"
              max="1.1"
              step="0.05"
              value={rate}
              onChange={(e) => {
                setRate(parseFloat(e.target.value))
                if (playing) stopAll()
              }}
              className="w-16 accent-purple-glow"
            />
            <span>{rate}x</span>
          </div>
        )}

        {!isAPIAvailable() && (
          <span className="text-purple-glow/20 text-[10px]">
            Using device voice
          </span>
        )}
      </div>
    </motion.div>
  )
}
