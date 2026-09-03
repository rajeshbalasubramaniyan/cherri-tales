const TTS_URL = import.meta.env.VITE_TTS_BASE || ''

const VOICES = [
  { id: 'ava', label: 'Ava (Warm)', description: 'Warm, natural storyteller' },
  { id: 'emma', label: 'Emma (Bright)', description: 'Bright and friendly' },
  { id: 'andrew', label: 'Andrew (Dada)', description: 'Calm, warm male' },
  { id: 'brian', label: 'Brian (Friendly)', description: 'Easygoing male' },
  { id: 'sonia', label: 'Sonia (British)', description: 'Classic storybook' },
  { id: 'ana', label: 'Ana (Playful)', description: 'Sweet young voice' },
]

export function getAvailableVoices() {
  return VOICES
}

export async function synthesizeSpeech(text, voiceId = 'ava') {
  if (!TTS_URL) {
    return null
  }

  const response = await fetch(TTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice: voiceId }),
  })

  if (!response.ok) {
    throw new Error('TTS failed')
  }

  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

export function isAPIAvailable() {
  return !!TTS_URL
}
