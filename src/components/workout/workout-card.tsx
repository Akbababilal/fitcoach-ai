'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Dumbbell, Trash2, Star } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/toaster'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { WorkoutPlan } from '@/domain/types'
import { useLanguage } from '@/lib/i18n/context'

interface WorkoutCardProps {
  plan: WorkoutPlan
}

export function WorkoutCard({ plan }: WorkoutCardProps) {
  const { t } = useLanguage()
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(plan.is_active ?? false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('workout_plans').delete().eq('id', plan.id)
    if (error) {
      toast({ title: 'Hata', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Silindi', variant: 'success' })
      router.refresh()
    }
    setIsDeleting(false)
  }

  async function handleActivate() {
    const supabase = createClient()
    await supabase
      .from('workout_plans')
      .update({ is_active: false })
      .eq('user_id', plan.user_id)
    await supabase
      .from('workout_plans')
      .update({ is_active: true })
      .eq('id', plan.id)
    router.refresh()
  }

  return (
    <Card className={plan.is_active ? 'border-primary/40 shadow-sm' : ''}>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-sm truncate">{plan.title}</h3>
              {plan.is_active && (
                <Badge variant="default" className="text-xs shrink-0">
                  <Star className="h-3 w-3 mr-1" />
                  {t.workout.active}
                </Badge>
              )}
            </div>
            {plan.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {plan.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(plan.created_at).toLocaleDateString('tr-TR')}
              {plan.duration_weeks && ` • ${plan.duration_weeks} hafta`}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {!plan.is_active && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={handleActivate}
              >
                {t.workout.activate}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && plan.plan_data?.weeks && (
        <CardContent className="p-4 pt-3 space-y-4">
          {plan.plan_data.weeks.map((week) => (
            <div key={week.week}>
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                {t.workout.week} {week.week}
              </h4>
              <div className="space-y-3">
                {week.days.map((day, dayIdx) => (
                  <div key={dayIdx} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Dumbbell className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-sm">{day.day}</span>
                      {day.focus && (
                        <Badge variant="secondary" className="text-xs ml-auto">
                          {day.focus}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      {day.exercises.map((ex, exIdx) => (
                        <div key={exIdx} className="bg-muted/50 rounded-md p-2.5">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium">{ex.name}</p>
                            <div className="flex gap-2 text-xs text-muted-foreground">
                              <span>{ex.sets} set × {ex.reps}</span>
                              <span>• {ex.rest}</span>
                            </div>
                          </div>
                          {ex.technique && (
                            <p className="text-xs text-muted-foreground italic">{ex.technique}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {plan.plan_data.notes && (
            <div className="bg-blue-50 rounded-lg p-3 mt-2">
              <p className="text-xs text-blue-700">{plan.plan_data.notes}</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
