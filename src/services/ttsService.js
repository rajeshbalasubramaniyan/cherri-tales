const API_BASE = import.meta.env.VITE_API_BASE || ''

const VOICES = [
  { id: 'warm_female', label: 'Aria (Warm)', description: 'Warm and gentle' },
  { id: 'gentle_female', label: 'Jenny (Gentle)', description: 'Soft and calming' },
  { id: 'storyteller', label: 'Sara (Storyteller)', description: 'Expressive narrator' },
  { id: 'british_female', label: 'Sonia (British)', description: 'Classic storybook' },
  { id: 'friendly_male', label: 'Guy (Friendly)', description: 'Warm and fun' },
]

export function getAvailableVoices() {
  return VOICES
}

export async function synthesizeSpeech(text, voiceId = 'warm_female', rate = '-5%') {
  if (!API_BASE) {
    return null
  }

  const response = await fetch(`${API_BASE}/textToSpeech`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice: voiceId, rate }),
  })

  if (!response.ok) {
    throw new Error('TTS failed')
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

export function isAPIAvailable() {
  return !!API_BASE
}
