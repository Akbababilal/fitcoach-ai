'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { WeightLog, WeightLogFormData } from '@/domain/types'

export async function getWeightLogs(limit = 30): Promise<WeightLog[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(limit)

  return (data ?? []) as WeightLog[]
}

export async function addWeightLog(formData: WeightLogFormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Yetkisiz' }

  const { error } = await supabase
    .from('weight_logs')
    .upsert(
      { ...formData, user_id: user.id } as Record<string, unknown>,
      { onConflict: 'user_id,date' }
    )

  if (error) return { error: error.message }

  revalidatePath('/weight')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteWeightLog(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('weight_logs').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/weight')
  return { success: true }
}

export async function getLatestWeight(): Promise<WeightLog | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('weight_logs')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data as WeightLog | null
}
