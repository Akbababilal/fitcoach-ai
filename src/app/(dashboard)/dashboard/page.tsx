import Link from 'next/link'
import { AlertCircle, ArrowRight, Scale, Utensils, Dumbbell, Bot } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/actions/profile'
import { getDailyNutrition } from '@/actions/nutrition'
import { getLatestWeight } from '@/actions/weight'
import { getTodayDate } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatsCard } from '@/components/dashboard/stats-card'
import { MacroChart } from '@/components/dashboard/macro-chart'

export default async function DashboardPage() {
  const [profile, nutrition, latestWeight] = await Promise.all([
    getProfile(),
    getDailyNutrition(),
    getLatestWeight(),
  ])

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isProfileComplete = profile?.is_profile_complete
  const displayName = profile?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0]

  const calories = nutrition?.totalCalories ?? 0
  const protein = nutrition?.totalProtein ?? 0
  const carbs = nutrition?.totalCarbs ?? 0
  const fat = nutrition?.totalFat ?? 0

  const calGoal = profile?.daily_calorie_target ?? 2000
  const proteinGoal = profile?.daily_protein_target ?? 150
  const carbGoal = profile?.daily_carb_target ?? 250
  const fatGoal = profile?.daily_fat_target ?? 65

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Merhaba, {displayName}! 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        {latestWeight && (
          <Badge variant="outline" className="text-sm font-semibold hidden sm:flex">
            <Scale className="h-3.5 w-3.5 mr-1" />
            {latestWeight.weight_kg} kg
          </Badge>
        )}
      </div>

      {/* Profile incomplete warning */}
      {!isProfileComplete && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-orange-800 text-sm">Profilinizi Tamamlayın</p>
                <p className="text-orange-700 text-xs mt-0.5">
                  Kişiselleştirilmiş hedefler ve AI önerileri için profili doldurun.
                </p>
              </div>
            </div>
            <Link href="/profile">
              <Button size="sm" className="shrink-0 bg-orange-500 hover:bg-orange-600">
                Tamamla
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Macro Stats Grid */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Günlük Özet
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatsCard
            label="Kalori"
            value={calories}
            goal={calGoal}
            unit="kcal"
            color="text-green-600"
            indicatorColor="bg-green-500"
          />
          <StatsCard
            label="Protein"
            value={protein}
            goal={proteinGoal}
            unit="g"
            color="text-blue-600"
            indicatorColor="bg-blue-500"
          />
          <StatsCard
            label="Karbonhidrat"
            value={carbs}
            goal={carbGoal}
            unit="g"
            color="text-orange-600"
            indicatorColor="bg-orange-500"
          />
          <StatsCard
            label="Yağ"
            value={fat}
            goal={fatGoal}
            unit="g"
            color="text-yellow-600"
            indicatorColor="bg-yellow-500"
          />
        </div>
      </div>

      {/* Macro Chart */}
      {(calories > 0) && (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base">Makro Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <MacroChart protein={protein} carbs={carbs} fat={fat} />
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Hızlı Erişim
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/nutrition">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-green-100 rounded-lg p-2 group-hover:bg-green-200 transition-colors">
                  <Utensils className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Beslenme</p>
                  <p className="text-xs text-muted-foreground">Öğün ekle</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/workout">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-blue-100 rounded-lg p-2 group-hover:bg-blue-200 transition-colors">
                  <Dumbbell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Antrenman</p>
                  <p className="text-xs text-muted-foreground">Plan oluştur</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>
          <Link href="/coach">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-purple-100 rounded-lg p-2 group-hover:bg-purple-200 transition-colors">
                  <Bot className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">AI Koç</p>
                  <p className="text-xs text-muted-foreground">Soru sor</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Today's Meals Preview */}
      {nutrition && nutrition.meals.length > 0 && (
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base">Bugünkü Öğünler</CardTitle>
            <Link href="/nutrition">
              <Button variant="ghost" size="sm" className="text-xs">
                Tümünü Gör <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {nutrition.meals.slice(0, 3).map((meal) => {
              const mealCalories = meal.meal_items?.reduce(
                (sum: number, item: { calories: number }) => sum + item.calories,
                0
              ) ?? 0
              const mealTypeLabel: Record<string, string> = {
                breakfast: '🌅 Kahvaltı',
                lunch: '☀️ Öğle',
                dinner: '🌙 Akşam',
                snack: '🍎 Ara Öğün',
              }
              return (
                <div
                  key={meal.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{meal.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {mealTypeLabel[meal.meal_type]}
                      {meal.meal_items?.length > 0 && ` • ${meal.meal_items.length} yiyecek`}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(mealCalories)} kcal
                  </Badge>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
