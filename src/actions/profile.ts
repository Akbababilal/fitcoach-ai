'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  calculateBMR,
  calculateTDEE,
  calculateDailyTargets,
} from '@/lib/utils'
import type { Profile, ProfileFormData } from '@/domain/types'

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return null
  return data as Profile
}

export async function updateProfile(formData: ProfileFormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Yetkisiz' }

  const bmr = calculateBMR(
    formData.weight_kg,
    formData.height_cm,
    formData.age,
    formData.gender
  )
  const tdee = calculateTDEE(bmr, formData.activity_level)
  const targets = calculateDailyTargets(tdee, formData.goal)

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: formData.full_name,
      age: formData.age,
      height_cm: formData.height_cm,
      weight_kg: formData.weight_kg,
      gender: formData.gender,
      activity_level: formData.activity_level,
      goal: formData.goal,
      experience_level: formData.experience_level,
      language: formData.language,
      daily_calorie_target: targets.calories,
      daily_protein_target: targets.protein,
      daily_carb_target: targets.carbs,
      daily_fat_target: targets.fat,
      is_profile_complete: true,
      updated_at: new Date().toISOString(),
    } as Record<string, unknown>)
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { success: true, targets }
}
