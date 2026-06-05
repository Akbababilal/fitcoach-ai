'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/toaster'
import { useLanguage } from '@/lib/i18n/context'

export function WorkoutGenerator() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [request, setRequest] = useState('')

  async function handleGenerate() {
    if (!request.trim()) {
      toast({ title: 'Hata', description: 'Lütfen hedefinizi belirtin.', variant: 'destructive' })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/ai/workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request }),
      })

      if (!res.ok) throw new Error('API error')

      toast({
        title: 'Başarılı',
        description: 'Antrenman planı oluşturuldu!',
        variant: 'success',
      })
      setRequest('')
      window.location.reload()
    } catch {
      toast({ title: 'Hata', description: t.common.error, variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          {t.workout.generatePlan}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <Label>{t.workout.myRequest}</Label>
          <Textarea
            placeholder={t.workout.requestPlaceholder}
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            disabled={isLoading}
            className="resize-none h-28"
          />
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isLoading || !request.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t.workout.generating}
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              {t.workout.generate}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
