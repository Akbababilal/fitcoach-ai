const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

async function callGroq(prompt: string, jsonMode = false): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      ...(jsonMode && { response_format: { type: 'json_object' } }),
    }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data.error))
  return data.choices[0].message.content as string
}

export async function generateText(prompt: string): Promise<string> {
  return callGroq(prompt, false)
}

export async function generateJSON<T>(prompt: string): Promise<T> {
  const text = await callGroq(prompt, true)
  return JSON.parse(text) as T
}
