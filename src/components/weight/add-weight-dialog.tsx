'use client'

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/toaster'
import { addWeightLog } from '@/actions/weight'
import { getTodayDate } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'

export function AddWeightDialog() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [weight, setWeight] = useState('')
  const [note, setNote] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await addWeightLog({
        date: getTodayDate(),
        weight_kg: Number(weight),
        note: note || undefined,
      })

      if (result.error) {
        toast({ title: 'Hata', description: result.error, variant: 'destructive' })
      } else {
        toast({ title: 'Başarılı', description: t.weight.saved, variant: 'success' })
        setOpen(false)
        setWeight('')
        setNote('')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          {t.weight.addWeight}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t.weight.addWeight}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">{t.weight.weightKg}</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              min={20}
              max={500}
              placeholder="75.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">{t.weight.note}</Label>
            <Textarea
              id="note"
              placeholder="İsteğe bağlı not..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isLoading}
              className="resize-none h-20"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={isLoading || !weight}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.common.loading}
                </>
              ) : (
                t.common.save
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
