import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface StatsCardProps {
  label: string
  value: number
  goal: number
  unit: string
  color?: string
  indicatorColor?: string
}

export function StatsCard({
  label,
  value,
  goal,
  unit,
  color = 'text-foreground',
  indicatorColor,
}: StatsCardProps) {
  const percentage = Math.min(Math.round((value / goal) * 100), 100)
  const remaining = Math.max(goal - value, 0)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <span className={cn('text-xs font-semibold', color)}>
            {percentage}%
          </span>
        </div>
        <div className="flex items-end gap-1 mb-2">
          <span className={cn('text-2xl font-bold', color)}>{Math.round(value)}</span>
          <span className="text-sm text-muted-foreground mb-0.5">/ {goal} {unit}</span>
        </div>
        <Progress
          value={percentage}
          className="h-2"
          indicatorClassName={indicatorColor}
        />
        <p className="text-xs text-muted-foreground mt-1.5">
          {Math.round(remaining)} {unit} kalan
        </p>
      </CardContent>
    </Card>
  )
}
