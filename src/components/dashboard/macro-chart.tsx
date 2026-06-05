'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { MACRO_COLORS } from '@/domain/constants'
import { useLanguage } from '@/lib/i18n/context'

interface MacroChartProps {
  protein: number
  carbs: number
  fat: number
}

export function MacroChart({ protein, carbs, fat }: MacroChartProps) {
  const { t } = useLanguage()

  const proteinCal = protein * 4
  const carbsCal = carbs * 4
  const fatCal = fat * 9
  const total = proteinCal + carbsCal + fatCal

  const data = [
    { name: t.dashboard.protein, value: proteinCal, color: MACRO_COLORS.protein },
    { name: t.dashboard.carbs, value: carbsCal, color: MACRO_COLORS.carbs },
    { name: t.dashboard.fat, value: fatCal, color: MACRO_COLORS.fat },
  ].filter((d) => d.value > 0)

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        Henüz veri yok
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [
            `${Math.round(value)} kcal`,
            name,
          ]}
        />
        <Legend
          formatter={(value, entry) => (
            <span className="text-xs text-muted-foreground">
              {value}: {Math.round((entry.payload as { value: number }).value)} kcal
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
