import { Trash2 } from 'lucide-react'
import { getWeightLogs } from '@/actions/weight'
import { getProfile } from '@/actions/profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WeightChart } from '@/components/weight/weight-chart'
import { AddWeightDialog } from '@/components/weight/add-weight-dialog'
import { DeleteWeightButton } from '@/components/weight/delete-weight-button'

export default async function WeightPage() {
  const [logs, profile] = await Promise.all([getWeightLogs(30), getProfile()])

  const sortedDesc = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const latestWeight = sortedDesc[0]?.weight_kg
  const firstWeight = sortedDesc[sortedDesc.length - 1]?.weight_kg
  const change =
    latestWeight && firstWeight ? latestWeight - firstWeight : null
  const startingWeight = profile?.weight_kg

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kilo Takibi</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Son 30 günlük kilo değişiminiz
          </p>
        </div>
        <AddWeightDialog />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">
              {latestWeight ? `${latestWeight}` : '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Mevcut (kg)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">
              {startingWeight ? `${startingWeight}` : '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Başlangıç (kg)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p
              className={`text-2xl font-bold ${
                change === null
                  ? 'text-muted-foreground'
                  : change < 0
                  ? 'text-green-600'
                  : change > 0
                  ? 'text-red-500'
                  : 'text-foreground'
              }`}
            >
              {change !== null
                ? `${change > 0 ? '+' : ''}${change.toFixed(1)}`
                : '—'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">Değişim (kg)</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Grafik</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <WeightChart logs={logs} />
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Geçmiş</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sortedDesc.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-8">
              Henüz kilo kaydı yok.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {sortedDesc.map((log) => (
                <div key={log.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">{log.weight_kg} kg</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.date).toLocaleDateString('tr-TR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </p>
                    {log.note && (
                      <p className="text-xs text-muted-foreground italic mt-0.5">{log.note}</p>
                    )}
                  </div>
                  <DeleteWeightButton id={log.id} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
