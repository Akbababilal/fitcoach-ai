import { getMealsForDate, getDailyNutrition } from '@/actions/nutrition'
import { getProfile } from '@/actions/profile'
import { getTodayDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { MealCard } from '@/components/nutrition/meal-card'
import { AddMealDialog } from '@/components/nutrition/add-meal-dialog'
import type { MealWithItems } from '@/domain/types'

export default async function NutritionPage() {
  const today = getTodayDate()
  const [meals, nutrition, profile] = await Promise.all([
    getMealsForDate(today),
    getDailyNutrition(),
    getProfile(),
  ])

  const calGoal = profile?.daily_calorie_target ?? 2000
  const proteinGoal = profile?.daily_protein_target ?? 150
  const carbGoal = profile?.daily_carb_target ?? 250
  const fatGoal = profile?.daily_fat_target ?? 65

  const calories = nutrition?.totalCalories ?? 0
  const protein = nutrition?.totalProtein ?? 0
  const carbs = nutrition?.totalCarbs ?? 0
  const fat = nutrition?.totalFat ?? 0

  const mealsByType = {
    breakfast: (meals as MealWithItems[]).filter((m) => m.meal_type === 'breakfast'),
    lunch: (meals as MealWithItems[]).filter((m) => m.meal_type === 'lunch'),
    dinner: (meals as MealWithItems[]).filter((m) => m.meal_type === 'dinner'),
    snack: (meals as MealWithItems[]).filter((m) => m.meal_type === 'snack'),
  }

  const macros = [
    {
      label: 'Kalori',
      value: calories,
      goal: calGoal,
      unit: 'kcal',
      color: 'text-green-600',
      indicatorClass: 'bg-green-500',
    },
    {
      label: 'Protein',
      value: protein,
      goal: proteinGoal,
      unit: 'g',
      color: 'text-blue-600',
      indicatorClass: 'bg-blue-500',
    },
    {
      label: 'Karbonhidrat',
      value: carbs,
      goal: carbGoal,
      unit: 'g',
      color: 'text-orange-600',
      indicatorClass: 'bg-orange-500',
    },
    {
      label: 'Yağ',
      value: fat,
      goal: fatGoal,
      unit: 'g',
      color: 'text-yellow-600',
      indicatorClass: 'bg-yellow-500',
    },
  ]

  const mealSections = [
    { key: 'breakfast', label: '🌅 Kahvaltı', meals: mealsByType.breakfast },
    { key: 'lunch', label: '☀️ Öğle Yemeği', meals: mealsByType.lunch },
    { key: 'dinner', label: '🌙 Akşam Yemeği', meals: mealsByType.dinner },
    { key: 'snack', label: '🍎 Ara Öğün', meals: mealsByType.snack },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Beslenme</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
        </div>
        <AddMealDialog />
      </div>

      {/* Daily Summary Card */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {macros.map((macro) => (
            <div key={macro.label}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${macro.color}`}>{macro.label}</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(macro.value)} / {macro.goal} {macro.unit}
                </span>
              </div>
              <Progress
                value={Math.min((macro.value / macro.goal) * 100, 100)}
                className="h-2"
                indicatorClassName={macro.indicatorClass}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Meal sections */}
      {mealSections.map((section) => (
        <div key={section.key}>
          <h2 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
            {section.label}
            {section.meals.length > 0 && (
              <span className="font-normal text-xs">
                ({Math.round(
                  section.meals.reduce(
                    (sum, m) =>
                      sum + (m.meal_items?.reduce((s, i) => s + i.calories, 0) ?? 0),
                    0
                  )
                )} kcal)
              </span>
            )}
          </h2>
          {section.meals.length > 0 ? (
            <div className="space-y-2">
              {section.meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-4 text-center text-muted-foreground text-sm">
                Henüz öğün eklenmedi
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  )
}
