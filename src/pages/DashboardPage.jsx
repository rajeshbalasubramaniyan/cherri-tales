import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { getStories, getCreativePatterns, getStreak, getWeekActivity } from '../services/storyLibrary'
import { moods, characters, worlds, magicElements } from '../components/StoryOptions'

const lookupLabel = (id, list) => list.find(x => x.id === id)?.label || id
const lookupEmoji = (id, list) => list.find(x => x.id === id)?.emoji || ''

function StatCard({ value, label, emoji }) {
  return (
    <div className="bg-night-lighter/50 border border-purple/20 rounded-xl p-4 text-center">
      {emoji && <span className="text-2xl">{emoji}</span>}
      <p className="text-2xl sm:text-3xl font-display text-gold mt-1">{value}</p>
      <p className="text-purple-glow/50 text-xs mt-1">{label}</p>
    </div>
  )
}

function WeekStrip({ week }) {
  return (
    <div className="flex gap-2 justify-center">
      {week.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          <span className="text-purple-glow/40 text-[10px]">{d.day}</span>
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
            d.active
              ? 'bg-purple text-white'
              : d.isToday
                ? 'border-2 border-purple-glow/40 text-purple-glow/60'
                : 'bg-night-lighter/30 text-purple-glow/20'
          }`}>
            {d.active ? '✓' : d.isToday ? '·' : ''}
          </div>
        </div>
      ))}
    </div>
  )
}

function PatternBar({ label, emoji, count, max }) {
  const pct = max > 0 ? (count / max) * 100 : 0
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg w-7 text-center">{emoji}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-moon/70 text-xs">{label}</span>
          <span className="text-purple-glow/40 text-[10px]">{count}x</span>
        </div>
        <div className="w-full h-1.5 bg-night rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-purple-glow rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage({ childName, onHome, onViewStory }) {
  const [tab, setTab] = useState('overview')
  const stories = useMemo(() => getStories(), [])
  const patterns = useMemo(() => getCreativePatterns(), [])
  const streak = useMemo(() => getStreak(), [])
  const week = useMemo(() => getWeekActivity(), [])

  const activeDaysThisWeek = week.filter(d => d.active).length

  if (!patterns || patterns.totalStories === 0) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center px-6 relative z-10 text-center">
        <span className="text-5xl mb-4">📊</span>
        <h2 className="font-display text-2xl text-gold mb-2">No stories yet!</h2>
        <p className="text-purple-glow/50 text-sm mb-6">
          Create your first story and come back to see {childName}'s creative patterns
        </p>
        <button
          onClick={onHome}
          className="bg-gradient-to-r from-purple to-purple-light text-white font-display px-8 py-3 rounded-full cursor-pointer"
        >
          Start a Story
        </button>
      </div>
    )
  }

  const allCounts = { ...patterns.allMoods, ...patterns.allCharacters, ...patterns.allWorlds, ...patterns.allMagic }
  const maxCount = Math.max(...Object.values(allCounts), 1)

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-purple/20">
        <button
          onClick={onHome}
          className="text-purple-glow/60 hover:text-purple-glow transition-colors cursor-pointer text-xs sm:text-sm"
        >
          ← Home
        </button>
        <h3 className="font-display text-gold text-sm sm:text-lg">
          {childName}'s Journey
        </h3>
        <div className="w-12" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 max-w-lg mx-auto w-full">
        <div className="flex gap-1 mb-6 bg-night-lighter/30 rounded-full p-1">
          {['overview', 'patterns', 'stories'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-full text-xs font-medium cursor-pointer transition-colors capitalize ${
                tab === t
                  ? 'bg-purple text-white'
                  : 'text-purple-glow/50 hover:text-purple-glow/80'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center mb-2">
              <p className="font-display text-gold text-lg mb-1">
                {streak.currentStreak > 0 ? `${streak.currentStreak} night streak!` : 'Start your streak tonight!'}
              </p>
              <p className="text-purple-glow/40 text-xs">
                {streak.currentStreak >= 7 ? 'Amazing consistency!' :
                 streak.currentStreak >= 3 ? 'Building a great habit!' :
                 'A story a night keeps the imagination bright'}
              </p>
            </div>

            <div className="bg-night-lighter/30 border border-purple/15 rounded-2xl p-5">
              <p className="text-purple-glow/50 text-xs mb-3 text-center">This Week</p>
              <WeekStrip week={week} />
              <p className="text-center text-purple-glow/30 text-[10px] mt-3">
                {activeDaysThisWeek}/7 story nights
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard value={patterns.totalStories} label="Stories Created" emoji="📖" />
              <StatCard value={patterns.uniqueDays} label="Active Nights" emoji="🌙" />
              <StatCard
                value={lookupEmoji(patterns.favoriteMood, moods) + ' ' + lookupLabel(patterns.favoriteMood, moods)}
                label="Favorite Mood"
              />
              <StatCard
                value={lookupEmoji(patterns.favoriteWorld, worlds) + ' ' + lookupLabel(patterns.favoriteWorld, worlds)}
                label="Favorite World"
              />
            </div>

            <div className="bg-night-lighter/30 border border-purple/15 rounded-2xl p-5">
              <p className="text-purple-glow/50 text-xs mb-1">This week's insight</p>
              <p className="text-moon/80 text-sm">
                {childName} loves {lookupLabel(patterns.favoriteMood, moods).toLowerCase()} stories
                with {lookupLabel(patterns.favoriteCharacter, characters).toLowerCase()} in
                {' '}{lookupLabel(patterns.favoriteWorld, worlds).toLowerCase()}.
                {patterns.favoriteMagic && ` ${lookupLabel(patterns.favoriteMagic, magicElements)} make every story magical!`}
              </p>
            </div>
          </motion.div>
        )}

        {tab === 'patterns' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <p className="text-purple-glow/50 text-xs mb-3 uppercase tracking-wider">Mood Preferences</p>
              <div className="space-y-3">
                {Object.entries(patterns.allMoods)
                  .sort((a, b) => b[1] - a[1])
                  .map(([id, count]) => (
                    <PatternBar key={id} label={lookupLabel(id, moods)} emoji={lookupEmoji(id, moods)} count={count} max={maxCount} />
                  ))}
              </div>
            </div>

            <div>
              <p className="text-purple-glow/50 text-xs mb-3 uppercase tracking-wider">Favorite Characters</p>
              <div className="space-y-3">
                {Object.entries(patterns.allCharacters)
                  .sort((a, b) => b[1] - a[1])
                  .map(([id, count]) => (
                    <PatternBar key={id} label={lookupLabel(id, characters)} emoji={lookupEmoji(id, characters)} count={count} max={maxCount} />
                  ))}
              </div>
            </div>

            <div>
              <p className="text-purple-glow/50 text-xs mb-3 uppercase tracking-wider">Worlds They Love</p>
              <div className="space-y-3">
                {Object.entries(patterns.allWorlds)
                  .sort((a, b) => b[1] - a[1])
                  .map(([id, count]) => (
                    <PatternBar key={id} label={lookupLabel(id, worlds)} emoji={lookupEmoji(id, worlds)} count={count} max={maxCount} />
                  ))}
              </div>
            </div>

            <div>
              <p className="text-purple-glow/50 text-xs mb-3 uppercase tracking-wider">Magic Elements</p>
              <div className="space-y-3">
                {Object.entries(patterns.allMagic)
                  .sort((a, b) => b[1] - a[1])
                  .map(([id, count]) => (
                    <PatternBar key={id} label={lookupLabel(id, magicElements)} emoji={lookupEmoji(id, magicElements)} count={count} max={maxCount} />
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'stories' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {stories.map((entry, i) => (
              <motion.button
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => onViewStory(entry)}
                className="w-full bg-night-lighter/40 border border-purple/15 rounded-xl p-4 text-left cursor-pointer hover:border-purple/30 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-moon/80 text-sm line-clamp-2 leading-snug">
                      {entry.story.slice(0, 120)}...
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-purple-glow/30 text-[10px]">
                        {new Date(entry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                      {entry.selections && (
                        <span className="text-purple-glow/20 text-[10px]">
                          {entry.selections.mood?.map(id => lookupEmoji(id, moods)).join('')}
                          {entry.selections.world?.map(id => lookupEmoji(id, worlds)).join('')}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-purple-glow/20 group-hover:text-purple-glow/50 transition-colors text-sm mt-1">→</span>
                </div>
              </motion.button>
            ))}

            {stories.length === 0 && (
              <div className="text-center py-8">
                <p className="text-purple-glow/40 text-sm">No stories saved yet</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
