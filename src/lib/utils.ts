import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: string
): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5
  }
  return 10 * weight + 6.25 * height - 5 * age - 161
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9,
  }
  return Math.round(bmr * (multipliers[activityLevel] ?? 1.55))
}

export function calculateDailyTargets(tdee: number, goal: string) {
  const calorieAdjustments: Record<string, number> = {
    lose_weight: -500,
    maintain: 0,
    gain_muscle: 300,
    bulk: 500,
  }

  const calories = tdee + (calorieAdjustments[goal] ?? 0)

  const proteinRatio = goal === 'gain_muscle' || goal === 'bulk' ? 0.32 : 0.28
  const fatRatio = 0.28
  const carbRatio = 1 - proteinRatio - fatRatio

  return {
    calories: Math.round(calories),
    protein: Math.round((calories * proteinRatio) / 4),
    carbs: Math.round((calories * carbRatio) / 4),
    fat: Math.round((calories * fatRatio) / 9),
  }
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

export function getTodayDate(): string {
  return formatDate(new Date())
}

export function formatNumber(num: number, decimals = 0): string {
  return num.toFixed(decimals)
}

export function calculateMacroPercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}
