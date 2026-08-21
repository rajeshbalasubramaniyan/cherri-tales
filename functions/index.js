import { onRequest } from 'firebase-functions/v2/https'
import { defineString } from 'firebase-functions/params'

const GROQ_API_KEY = defineString('GROQ_API_KEY')

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const SYSTEM_PROMPT = `You are a warm, creative storyteller who writes wonderful bedtime stories for children. Your stories are imaginative, funny, age-appropriate, and always end on a positive note. You write with charm and wit that both children and parents enjoy. Never include scary, violent, or inappropriate content.`

export const generateStory = onRequest(
  { region: 'asia-south1', cors: true },
  async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.set(CORS_HEADERS).status(204).send('')
      return
    }

    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed')
      return
    }

    try {
      const { childName, prompt } = req.body

      if (!childName || !prompt) {
        res.status(400).json({ error: 'Missing childName or prompt' })
        return
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY.value()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt },
          ],
          temperature: 0.85,
          max_tokens: 4000,
        }),
      })

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`)
      }

      const data = await response.json()
      const story = data.choices[0]?.message?.content

      res.set(CORS_HEADERS).json({ story })
    } catch (error) {
      console.error('Story generation error:', error)
      res.status(500).json({ error: 'Failed to generate story' })
    }
  }
)

const EDGE_TTS_VOICES = {
  warm_female: 'en-US-AriaNeural',
  gentle_female: 'en-US-JennyNeural',
  friendly_male: 'en-US-GuyNeural',
  british_female: 'en-GB-SoniaNeural',
  storyteller: 'en-US-SaraNeural',
}

export const textToSpeech = onRequest(
  { region: 'asia-south1', cors: true, memory: '512MiB' },
  async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.set(CORS_HEADERS).status(204).send('')
      return
    }

    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed')
      return
    }

    try {
      const { text, voice = 'warm_female', rate = '-5%' } = req.body

      if (!text) {
        res.status(400).json({ error: 'Missing text' })
        return
      }

      const selectedVoice = EDGE_TTS_VOICES[voice] || EDGE_TTS_VOICES.warm_female

      const { EdgeTTS } = await import('edge-tts')
      const tts = new EdgeTTS()
      await tts.synthesize(text, selectedVoice, { rate })

      const audioBuffer = tts.toBuffer()

      res.set({
        ...CORS_HEADERS,
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      })
      res.send(audioBuffer)
    } catch (error) {
      console.error('TTS error:', error)
      res.status(500).json({ error: 'Failed to generate speech' })
    }
  }
)
