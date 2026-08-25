import { onRequest } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'

const GROQ_API_KEY = defineSecret('GROQ_API_KEY')

const SYSTEM_PROMPT = `You are a warm, creative storyteller who writes wonderful bedtime stories for children. Your stories are imaginative, funny, age-appropriate, and always end on a positive note. You write with charm and wit that both children and parents enjoy. Never include scary, violent, or inappropriate content.`

export const generateStory = onRequest(
  { region: 'asia-south1', cors: true, secrets: [GROQ_API_KEY] },
  async (req, res) => {
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

      const models = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b']
      let data = null

      for (const model of models) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY.value()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: prompt },
            ],
            temperature: 0.85,
            max_tokens: 4000,
          }),
        })

        if (response.ok) {
          data = await response.json()
          console.log(`Story generated with model: ${model}`)
          break
        }
        const errText = await response.text()
        console.warn(`Model ${model} failed: ${response.status} - ${errText}`)
      }

      if (!data) throw new Error('All models failed')

      const story = data.choices[0]?.message?.content

      res.json({ story })
    } catch (error) {
      console.error('Story generation error:', error)
      res.status(500).json({ error: 'Failed to generate story' })
    }
  }
)

export const textToSpeech = onRequest(
  { region: 'asia-south1', cors: true, secrets: [GROQ_API_KEY], memory: '512MiB', timeoutSeconds: 120 },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed')
      return
    }

    try {
      const { text, voice = 'Charon' } = req.body

      if (!text) {
        res.status(400).json({ error: 'Missing text' })
        return
      }

      const response = await fetch('https://api.groq.com/openai/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY.value()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'playai/PlayDialog',
          input: text,
          voice: voice,
          response_format: 'mp3',
        }),
      })

      if (!response.ok) {
        const errText = await response.text()
        console.error('Groq TTS error:', errText)

        const { MsEdgeTTS } = await import('msedge-tts')
        const tts = new MsEdgeTTS()
        const VOICE_MAP = {
          Charon: 'en-US-AriaNeural',
          Kore: 'en-US-JennyNeural',
          Fenrir: 'en-US-GuyNeural',
          Aoede: 'en-GB-SoniaNeural',
        }
        await tts.setMetadata(VOICE_MAP[voice] || 'en-US-AriaNeural', 'audio-24khz-96kbitrate-mono-mp3')
        const readable = tts.toStream(text)
        const chunks = []
        for await (const chunk of readable) { chunks.push(chunk) }
        const audioBuffer = Buffer.concat(chunks)

        res.set('Content-Type', 'audio/mpeg')
        res.set('Cache-Control', 'public, max-age=86400')
        res.send(audioBuffer)
        return
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer())

      res.set('Content-Type', 'audio/mpeg')
      res.set('Cache-Control', 'public, max-age=86400')
      res.send(audioBuffer)
    } catch (error) {
      console.error('TTS error:', error)
      res.status(500).json({ error: 'Failed to generate speech' })
    }
  }
)
