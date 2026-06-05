'use client'

import { useState } from 'react'
import { Plus, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/toaster'
import { addMeal, addMealItem } from '@/actions/nutrition'
import { useLanguage } from '@/lib/i18n/context'
import { getTodayDate } from '@/lib/utils'

interface MealItemInput {
  food_name: string
  quantity: string
  unit: string
  calories: string
  protein_g: string
  carbs_g: string
  fat_g: string
}

const emptyItem = (): MealItemInput => ({
  food_name: '',
  quantity: '100',
  unit: 'g',
  calories: '',
  protein_g: '',
  carbs_g: '',
  fat_g: '',
})

export function AddMealDialog() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mealName, setMealName] = useState('')
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  const [items, setItems] = useState<MealItemInput[]>([emptyItem()])

  const updateItem = (idx: number, field: keyof MealItemInput, value: string) => {
    setItems((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      return next
    })
  }

  const addItem = () => setItems((prev) => [...prev, emptyItem()])
  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const validItems = items.filter((i) => i.food_name && i.calories)
    if (validItems.length === 0) {
      toast({
        title: 'Hata',
        description: 'En az bir yiyecek ekleyin.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    try {
      const mealResult = await addMeal({
        date: getTodayDate(),
        meal_type: mealType,
        name: mealName || t.nutrition[mealType],
      })

      if (mealResult.error || !mealResult.data) {
        toast({ title: 'Hata', description: mealResult.error, variant: 'destructive' })
        return
      }

      for (const item of validItems) {
        await addMealItem(mealResult.data.id, {
          food_name: item.food_name,
          quantity: Number(item.quantity),
          unit: item.unit as 'g' | 'ml' | 'piece' | 'serving',
          calories: Number(item.calories),
          protein_g: Number(item.protein_g) || 0,
          carbs_g: Number(item.carbs_g) || 0,
          fat_g: Number(item.fat_g) || 0,
        })
      }

      toast({ title: 'Başarılı', description: 'Öğün eklendi.', variant: 'success' })
      setOpen(false)
      setMealName('')
      setItems([emptyItem()])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          {t.nutrition.addMeal}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.nutrition.addMeal}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>{t.nutrition.mealName}</Label>
              <Input
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="Kahvaltım"
              />
            </div>
            <div className="space-y-2">
              <Label>Öğün Türü</Label>
              <Select
                value={mealType}
                onValueChange={(v) =>
                  setMealType(v as 'breakfast' | 'lunch' | 'dinner' | 'snack')
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">{t.nutrition.breakfast}</SelectItem>
                  <SelectItem value="lunch">{t.nutrition.lunch}</SelectItem>
                  <SelectItem value="dinner">{t.nutrition.dinner}</SelectItem>
                  <SelectItem value="snack">{t.nutrition.snack}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Yiyecekler</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-3.5 w-3.5" /> Ekle
              </Button>
            </div>

            {items.map((item, idx) => (
              <div key={idx} className="border rounded-lg p-3 space-y-2 bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Yiyecek Adı *</Label>
                    <Input
                      placeholder="Örn: Tavuk göğsü"
                      value={item.food_name}
                      onChange={(e) => updateItem(idx, 'food_name', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 mt-4 text-destructive hover:text-destructive"
                      onClick={() => removeItem(idx)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Miktar</Label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                      className="h-8 text-sm"
                      min={0}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Birim</Label>
                    <Select
                      value={item.unit}
                      onValueChange={(v) => updateItem(idx, 'unit', v)}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="g">Gram</SelectItem>
                        <SelectItem value="ml">mL</SelectItem>
                        <SelectItem value="piece">Adet</SelectItem>
                        <SelectItem value="serving">Porsiyon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Kalori (kcal) *</Label>
                    <Input
                      type="number"
                      value={item.calories}
                      onChange={(e) => updateItem(idx, 'calories', e.target.value)}
                      className="h-8 text-sm"
                      min={0}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs text-blue-600">Protein (g)</Label>
                    <Input
                      type="number"
                      value={item.protein_g}
                      onChange={(e) => updateItem(idx, 'protein_g', e.target.value)}
                      className="h-8 text-sm"
                      min={0}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-orange-600">Karb (g)</Label>
                    <Input
                      type="number"
                      value={item.carbs_g}
                      onChange={(e) => updateItem(idx, 'carbs_g', e.target.value)}
                      className="h-8 text-sm"
                      min={0}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-yellow-600">Yağ (g)</Label>
                    <Input
                      type="number"
                      value={item.fat_g}
                      onChange={(e) => updateItem(idx, 'fat_g', e.target.value)}
                      className="h-8 text-sm"
                      min={0}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            ))}
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
            <Button type="submit" disabled={isLoading}>
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
