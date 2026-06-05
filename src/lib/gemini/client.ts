import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export function getGeminiModel(modelName = 'gemini-2.0-flash') {
  return genAI.getGenerativeModel({ model: modelName })
}

export async function generateText(prompt: string): Promise<string> {
  const model = getGeminiModel()
  const result = await model.generateContent(prompt)
  return result.response.text()
}

export async function generateJSON<T>(prompt: string): Promise<T> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  })
  const result = await model.generateContent(prompt)
  const text = result.response.text()
  return JSON.parse(text) as T
}
