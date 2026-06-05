'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { WeightLog } from '@/domain/types'

interface WeightChartProps {
  logs: WeightLog[]
}

export function WeightChart({ logs }: WeightChartProps) {
  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Henüz kilo kaydı yok
      </div>
    )
  }

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const data = sortedLogs.map((log) => ({
    date: new Date(log.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    weight: log.weight_kg,
  }))

  const minWeight = Math.min(...data.map((d) => d.weight))
  const maxWeight = Math.max(...data.map((d) => d.weight))
  const avg = data.reduce((s, d) => s + d.weight, 0) / data.length

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
            domain={[minWeight - 2, maxWeight + 2]}
            tickFormatter={(v) => `${v}kg`}
          />
          <Tooltip
            formatter={(value: number) => [`${value} kg`, 'Kilo']}
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <ReferenceLine
            y={avg}
            stroke="hsl(var(--primary))"
            strokeDasharray="4 4"
            opacity={0.5}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-center text-muted-foreground mt-1">
        Ort: {avg.toFixed(1)} kg
      </p>
    </div>
  )
}
