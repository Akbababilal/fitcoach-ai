'use client'

import { useState } from 'react'
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toaster'
import { deleteMeal, deleteMealItem } from '@/actions/nutrition'
import type { MealWithItems } from '@/domain/types'

interface MealCardProps {
  meal: MealWithItems
}

const mealTypeConfig = {
  breakfast: { label: 'Kahvaltı', emoji: '🌅', color: 'bg-orange-100 text-orange-700' },
  lunch: { label: 'Öğle', emoji: '☀️', color: 'bg-yellow-100 text-yellow-700' },
  dinner: { label: 'Akşam', emoji: '🌙', color: 'bg-blue-100 text-blue-700' },
  snack: { label: 'Ara Öğün', emoji: '🍎', color: 'bg-green-100 text-green-700' },
}

export function MealCard({ meal }: MealCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const config = mealTypeConfig[meal.meal_type]
  const totalCalories = meal.meal_items?.reduce((s, i) => s + i.calories, 0) ?? 0
  const totalProtein = meal.meal_items?.reduce((s, i) => s + i.protein_g, 0) ?? 0
  const totalCarbs = meal.meal_items?.reduce((s, i) => s + i.carbs_g, 0) ?? 0
  const totalFat = meal.meal_items?.reduce((s, i) => s + i.fat_g, 0) ?? 0

  async function handleDeleteMeal() {
    setIsDeleting(true)
    const result = await deleteMeal(meal.id)
    if (result.error) {
      toast({ title: 'Hata', description: result.error, variant: 'destructive' })
    } else {
      toast({ title: 'Silindi', description: 'Öğün silindi.', variant: 'success' })
    }
    setIsDeleting(false)
  }

  async function handleDeleteItem(itemId: string) {
    const result = await deleteMealItem(itemId)
    if (result.error) {
      toast({ title: 'Hata', description: result.error, variant: 'destructive' })
    }
  }

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>
              {config.emoji} {config.label}
            </span>
            <span className="font-semibold text-sm">{meal.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-bold">
              {Math.round(totalCalories)} kcal
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={handleDeleteMeal}
              disabled={isDeleting}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Macro badges */}
        <div className="flex gap-2 mt-2 flex-wrap">
          <span className="text-xs text-blue-600 font-medium">P: {Math.round(totalProtein)}g</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-orange-600 font-medium">K: {Math.round(totalCarbs)}g</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-yellow-600 font-medium">Y: {Math.round(totalFat)}g</span>
        </div>
      </CardHeader>

      {meal.meal_items && meal.meal_items.length > 0 && (
        <CardContent className="p-4 pt-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {meal.meal_items.length} yiyecek
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-2">
              {meal.meal_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{item.food_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity}{item.unit} • P:{Math.round(item.protein_g)}g K:{Math.round(item.carbs_g)}g Y:{Math.round(item.fat_g)}g
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-green-600">
                      {Math.round(item.calories)} kcal
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
