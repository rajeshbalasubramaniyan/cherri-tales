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

const VOICE_MAP = {
  ava: 'en-US-AvaMultilingualNeural',
  emma: 'en-US-EmmaMultilingualNeural',
  andrew: 'en-US-AndrewMultilingualNeural',
  brian: 'en-US-BrianMultilingualNeural',
  sonia: 'en-GB-SoniaNeural',
  ana: 'en-US-AnaNeural',
  // legacy ids kept so older cached clients still resolve
  warm_female: 'en-US-AvaMultilingualNeural',
  gentle_female: 'en-US-EmmaMultilingualNeural',
  storyteller: 'en-US-AvaMultilingualNeural',
  british_female: 'en-GB-SoniaNeural',
  friendly_male: 'en-US-AndrewMultilingualNeural',
}

export const textToSpeech = onRequest(
  { region: 'asia-south1', cors: true, memory: '512MiB', timeoutSeconds: 300 },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed')
      return
    }

    try {
      const { text, voice = 'warm_female' } = req.body

      if (!text) {
        res.status(400).json({ error: 'Missing text' })
        return
      }

      const voiceName = VOICE_MAP[voice] || VOICE_MAP.warm_female

      const { MsEdgeTTS, OUTPUT_FORMAT } = await import('msedge-tts')
      const tts = new MsEdgeTTS()
      await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3)

      const { audioStream } = await tts.toStream(text)
      const chunks = []
      await new Promise((resolve, reject) => {
        audioStream.on('data', (chunk) => chunks.push(chunk))
        audioStream.on('end', resolve)
        audioStream.on('close', resolve)
        audioStream.on('error', reject)
      })

      const audioBuffer = Buffer.concat(chunks)

      res.set('Content-Type', 'audio/mpeg')
      res.set('Cache-Control', 'public, max-age=86400')
      res.send(audioBuffer)
    } catch (error) {
      console.error('TTS error:', error)
      res.status(500).json({ error: 'Failed to generate speech' })
    }
  }
)
