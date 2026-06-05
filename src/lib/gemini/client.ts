const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta'
const MODEL = 'gemini-2.0-flash'

async function callGemini(prompt: string, jsonMode = false): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  const url = `${BASE_URL}/models/${MODEL}:generateContent?key=${apiKey}`

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    ...(jsonMode && {
      generationConfig: { responseMimeType: 'application/json' },
    }),
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(JSON.stringify(data.error))
  return data.candidates[0].content.parts[0].text as string
}

export async function generateText(prompt: string): Promise<string> {
  return callGemini(prompt, false)
}

export async function generateJSON<T>(prompt: string): Promise<T> {
  const text = await callGemini(prompt, true)
  return JSON.parse(text) as T
}
