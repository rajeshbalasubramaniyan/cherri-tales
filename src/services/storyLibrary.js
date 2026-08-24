const STORAGE_KEY = 'cherri-tales-library'
const STREAK_KEY = 'cherri-tales-streak'

function getLibrary() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

function saveLibrary(lib) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lib))
}

export function saveStory(childName, story, selections) {
  const lib = getLibrary()
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    childName,
    story,
    selections,
    createdAt: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
  }
  lib.unshift(entry)
  if (lib.length > 100) lib.pop()
  saveLibrary(lib)
  updateStreak()
  return entry
}

export function getStories() {
  return getLibrary()
}

export function getStoryCount() {
  return getLibrary().length
}

export function getCreativePatterns() {
  const lib = getLibrary()
  if (lib.length === 0) return null

  const counts = { mood: {}, characters: {}, world: {}, magic: {} }

  lib.forEach(entry => {
    if (!entry.selections) return
    Object.keys(counts).forEach(key => {
      const vals = entry.selections[key]
      if (Array.isArray(vals)) {
        vals.forEach(v => { counts[key][v] = (counts[key][v] || 0) + 1 })
      }
    })
  })

  const topPick = (obj) => {
    const entries = Object.entries(obj)
    if (entries.length === 0) return null
    entries.sort((a, b) => b[1] - a[1])
    return entries[0][0]
  }

  return {
    totalStories: lib.length,
    favoriteMood: topPick(counts.mood),
    favoriteCharacter: topPick(counts.characters),
    favoriteWorld: topPick(counts.world),
    favoriteMagic: topPick(counts.magic),
    allMoods: counts.mood,
    allCharacters: counts.characters,
    allWorlds: counts.world,
    allMagic: counts.magic,
    uniqueDays: [...new Set(lib.map(e => e.date))].length,
  }
}

function getStreakData() {
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY) || '{}')
  } catch { return {} }
}

function updateStreak() {
  const today = new Date().toISOString().split('T')[0]
  const data = getStreakData()

  if (!data.days) data.days = []
  if (!data.days.includes(today)) {
    data.days.push(today)
  }

  data.days.sort()
  if (data.days.length > 60) data.days = data.days.slice(-60)

  let streak = 0
  const d = new Date()
  for (let i = 0; i < 60; i++) {
    const dateStr = d.toISOString().split('T')[0]
    if (data.days.includes(dateStr)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else if (i === 0) {
      d.setDate(d.getDate() - 1)
      continue
    } else {
      break
    }
  }

  data.currentStreak = streak
  data.lastActive = today

  localStorage.setItem(STREAK_KEY, JSON.stringify(data))
  return data
}

export function getStreak() {
  const data = getStreakData()
  return {
    currentStreak: data.currentStreak || 0,
    days: data.days || [],
    lastActive: data.lastActive || null,
  }
}

export function getWeekActivity() {
  const data = getStreakData()
  const days = data.days || []
  const today = new Date()
  const week = []

  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7))

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const dateStr = d.toISOString().split('T')[0]
    week.push({
      day: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
      date: dateStr,
      active: days.includes(dateStr),
      isToday: dateStr === today.toISOString().split('T')[0],
    })
  }

  return week
}
