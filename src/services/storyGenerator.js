import { moods, characters, worlds, magicElements, lengths } from '../components/StoryOptions'

const API_URL = import.meta.env.VITE_API_BASE || ''

const ANTHRA_STORY = `Once upon a Tuesday, in a forest that liked to rearrange itself when nobody was looking, there lived a young lad named Pippin. Pippin was well-meaning and utterly clueless. He once tried to milk a mailbox because someone told him it had deliveries.

Now, in the same forest, lived Professor Thistlewhip, who claimed he knew everything, and he mostly did. Except, he had never successfully made toast. He said bread feared him.

One day, a royal notice fluttered down from a very confused-looking pigeon. It read, "The king's laugh has gone missing. Reward: one lifetime supply of biscuits."

Pippin gasped, mostly because he loved biscuits, and partly because he gasped at everything. "We must find the laugh!" cried Pippin.

Professor Thistlewhip adjusted his spectacles, saying, "Easy. We must simply follow the migratory giggle patterns."

"The what now?" said Pippin.

"Never mind."

And so they set off. Within five minutes, Pippin had fallen into a bush, apologized to it, and offered it a sandwich. Thistlewhip took notes.

Suddenly, a fairy appeared, tiny and glowing and very annoyed. "You stepped on my mushroom!" she shouted.

Pippin panicked. "I can unstep it!"

The fairy blinked. "That's not how stepping works."

Thistlewhip cleared his throat. "Esteemed Fairy, we seek the king's laugh."

The fairy's eyes sparkled. "Ah, stolen by the Grumblegloom. Lives in a cave, hates joy, allergic to knock-knock jokes."

"We'll get it back!" declared Pippin confidently.

"How?" asked Thistlewhip.

Pippin thought hard. "With enthusiasm?"

The fairy sighed so hard a leaf fell off a tree.

"Fine," she said. "Take this. It's a tickle feather, very powerful, don't use it on goats."

They promised, especially the goat part, and marched on.

At the cave, the Grumblegloom loomed. All frowns and drama. "No laughing," it boomed.

Pippin stepped forward. "Hello!"

The Grumblegloom blinked. "Hello. That wasn't laughter."

Thistlewhip whispered quick, "The feather!"

Pippin pulled it out, but sneezed instead. The feather flew, tickled the Grumblegloom right under its gloomy armpit.

There was a beat. And another. Then, a snort. Then an undignified giggle. Then, a laugh so big it shook dust off the ceiling.

The King's laugh popped free like a bubble.

The Grumblegloom wiped a tear, still chuckling. "Oh no. That actually felt nice."

Pippin grinned. "See? Laughing's not so bad."

Thistlewhip added smugly, "Scientifically proven."

They returned the laugh to the king. The king laughed, the court laughed, the guards laughed, someone dropped a trumpet and it made a rude noise, which caused even more laughter.

Pippin and Thistlewhip were awarded biscuits. Pippin shared his with everyone, including the pigeon.

Thistlewhip finally figured out toast.

And the Grumblegloom? It started a weekly comedy night. No goats allowed.

And that's the story of how a clueless lad and a clever expert saved a kingdom with a laugh.`

export function buildPrompt(childName, selections) {
  const moodLabels = selections.mood.map(id => moods.find(m => m.id === id)?.label).filter(Boolean)
  const charLabels = selections.characters.map(id => characters.find(c => c.id === id)?.label).filter(Boolean)
  const worldLabels = selections.world.map(id => worlds.find(w => w.id === id)?.label).filter(Boolean)
  const magicLabels = selections.magic.map(id => magicElements.find(m => m.id === id)?.label).filter(Boolean)
  const length = lengths.find(l => l.id === selections.length)

  return `Write a bedtime story for a child named ${childName}.

Story requirements:
- Mood: ${moodLabels.join(', ')}
- Characters should include: ${charLabels.join(', ')}
- Setting: ${worldLabels.join(', ')}
- Include these magical elements: ${magicLabels.join(', ')}
- Length: approximately ${length?.minutes || 10} minutes of reading (about ${(length?.minutes || 10) * 150} words)
${selections.extraIdea ? `- Special request from the child: "${selections.extraIdea}"` : ''}

Important guidelines:
- This is for a child, so keep it age-appropriate, wholesome, and safe
- Make it engaging with vivid descriptions and fun dialogue
- Include humor that both children and parents would enjoy
- End on a warm, positive note
- Use simple language a child can understand
- Make the story feel personal to ${childName}
- Break into paragraphs for easy reading
- Do NOT include any scary, violent, or inappropriate content
- Write ONLY the story text, no titles or labels`
}

export async function generateStory(childName, selections) {
  if (!API_URL) {
    return ANTHRA_STORY
  }

  const prompt = buildPrompt(childName, selections)

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ childName, prompt }),
    })

    if (!response.ok) throw new Error('API error')

    const data = await response.json()
    return data.story || ANTHRA_STORY
  } catch {
    return ANTHRA_STORY
  }
}

export function getAnthraStory() {
  return ANTHRA_STORY
}
