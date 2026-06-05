'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Bot, User, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/toaster'
import { useLanguage } from '@/lib/i18n/context'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function ChatInterface({
  module,
  placeholder,
}: {
  module: 'nutrition' | 'workout'
  placeholder: string
}) {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch(`/api/ai/${module}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages.slice(-10),
        }),
      })

      if (!res.ok) throw new Error('API error')

      const data = await res.json()

      if (data.error) {
        toast({ title: 'Hata', description: data.error, variant: 'destructive' })
        setMessages((prev) => prev.slice(0, -1))
        return
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      toast({ title: 'Hata', description: t.common.error, variant: 'destructive' })
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
            <div className="bg-primary/10 rounded-full p-4">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold">AI Koçun Hazır</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t.coach.contextNote}
              </p>
            </div>
            <div className="grid gap-2 mt-2 w-full max-w-xs">
              {module === 'nutrition' ? (
                <>
                  {['Bugün ne yemeliyim?', 'Bulk için kalori hedefim ne olmalı?', 'Protein alımımı nasıl artırabilirim?'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="text-sm text-left px-3 py-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {['Göğüs için en iyi egzersizler neler?', 'Karın kasları için program öner', 'Dinlenme günleri nasıl olmalı?'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="text-sm text-left px-3 py-2 rounded-lg bg-muted hover:bg-accent transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-muted border border-border'
                }`}
              >
                {msg.role === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4 text-primary" />
                )}
              </div>
              <div
                className={`flex-1 max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-sm'
                    : 'bg-muted rounded-tl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3">
            <div className="shrink-0 h-8 w-8 rounded-full bg-muted border border-border flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-muted text-sm flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-muted-foreground">{t.coach.thinking}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-border pt-4">
        {messages.length > 0 && (
          <div className="flex justify-end mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => setMessages([])}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              {t.coach.clearHistory}
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <Textarea
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="resize-none min-h-[44px] max-h-32 flex-1"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0 h-11 w-11"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">
          Enter ile gönder • Shift+Enter yeni satır
        </p>
      </div>
    </div>
  )
}

export default function CoachPage() {
  const { t } = useLanguage()

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 rounded-xl p-2">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t.coach.title}</h1>
          <p className="text-muted-foreground text-sm">Verilerinizi analiz ederek kişisel öneriler sunar</p>
        </div>
        <Badge variant="secondary" className="ml-auto text-xs">
          Llama AI
        </Badge>
      </div>

      <Tabs defaultValue="nutrition">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nutrition">🥗 {t.coach.nutritionCoach}</TabsTrigger>
          <TabsTrigger value="workout">💪 {t.coach.workoutCoach}</TabsTrigger>
        </TabsList>

        <TabsContent value="nutrition" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <ChatInterface module="nutrition" placeholder={t.coach.nutritionPlaceholder} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workout" className="mt-4">
          <Card>
            <CardContent className="p-4">
              <ChatInterface module="workout" placeholder={t.coach.workoutPlaceholder} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
