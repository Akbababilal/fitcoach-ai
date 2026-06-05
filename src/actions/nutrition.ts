'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getTodayDate } from '@/lib/utils'
import type { Meal, MealItem, MealWithItems, MealFormData, MealItemFormData } from '@/domain/types'

export async function getMealsForDate(date: string): Promise<MealWithItems[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('meals')
    .select(`*, meal_items(*)`)
    .eq('user_id', user.id)
    .eq('date', date)
    .order('created_at', { ascending: true })

  return (data ?? []) as MealWithItems[]
}

export async function addMeal(formData: MealFormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Yetkisiz' }

  const { data, error } = await supabase
    .from('meals')
    .insert({ ...formData, user_id: user.id } as Record<string, unknown>)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/nutrition')
  return { success: true, data: data as Meal }
}

export async function addMealItem(mealId: string, formData: MealItemFormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('meal_items')
    .insert({ ...formData, meal_id: mealId } as Record<string, unknown>)

  if (error) return { error: error.message }

  revalidatePath('/nutrition')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteMeal(mealId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('meals').delete().eq('id', mealId)

  if (error) return { error: error.message }

  revalidatePath('/nutrition')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteMealItem(itemId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('meal_items').delete().eq('id', itemId)

  if (error) return { error: error.message }

  revalidatePath('/nutrition')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function getDailyNutrition(date?: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const targetDate = date ?? getTodayDate()

  const { data: meals } = await supabase
    .from('meals')
    .select(`*, meal_items(*)`)
    .eq('user_id', user.id)
    .eq('date', targetDate)

  if (!meals) return null

  const typedMeals = meals as MealWithItems[]

  const totalCalories = typedMeals.reduce(
    (sum, meal) =>
      sum + (meal.meal_items?.reduce((s, i) => s + i.calories, 0) ?? 0),
    0
  )
  const totalProtein = typedMeals.reduce(
    (sum, meal) =>
      sum + (meal.meal_items?.reduce((s, i) => s + i.protein_g, 0) ?? 0),
    0
  )
  const totalCarbs = typedMeals.reduce(
    (sum, meal) =>
      sum + (meal.meal_items?.reduce((s, i) => s + i.carbs_g, 0) ?? 0),
    0
  )
  const totalFat = typedMeals.reduce(
    (sum, meal) =>
      sum + (meal.meal_items?.reduce((s, i) => s + i.fat_g, 0) ?? 0),
    0
  )

  return { totalCalories, totalProtein, totalCarbs, totalFat, meals: typedMeals }
}
