export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Profile {
  id: string
  full_name: string | null
  age: number | null
  height_cm: number | null
  weight_kg: number | null
  gender: 'male' | 'female' | 'other' | null
  activity_level:
    | 'sedentary'
    | 'lightly_active'
    | 'moderately_active'
    | 'very_active'
    | 'extremely_active'
    | null
  goal: 'lose_weight' | 'maintain' | 'gain_muscle' | 'bulk' | null
  experience_level: 'beginner' | 'intermediate' | 'advanced' | null
  language: 'tr' | 'en' | null
  daily_calorie_target: number | null
  daily_protein_target: number | null
  daily_carb_target: number | null
  daily_fat_target: number | null
  is_profile_complete: boolean | null
  created_at: string
  updated_at: string
}

export type ProfileInsert = Partial<Omit<Profile, 'created_at' | 'updated_at'>> & {
  id: string
}
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>

export interface Meal {
  id: string
  user_id: string
  date: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  name: string
  created_at: string
}

export type MealInsert = Omit<Meal, 'id' | 'created_at'>
export type MealUpdate = Partial<Omit<Meal, 'id' | 'user_id' | 'created_at'>>

export interface MealItem {
  id: string
  meal_id: string
  food_name: string
  quantity: number
  unit: 'g' | 'ml' | 'piece' | 'serving'
  calories: number
  protein_g: number
  carbs_g: number
  fat_g: number
  created_at: string
}

export type MealItemInsert = Omit<MealItem, 'id' | 'created_at'>
export type MealItemUpdate = Partial<Omit<MealItem, 'id' | 'meal_id' | 'created_at'>>

export interface WeightLog {
  id: string
  user_id: string
  date: string
  weight_kg: number
  note: string | null
  created_at: string
}

export type WeightLogInsert = Omit<WeightLog, 'id' | 'created_at'>
export type WeightLogUpdate = Partial<Omit<WeightLog, 'id' | 'user_id' | 'created_at'>>

export interface WorkoutPlan {
  id: string
  user_id: string
  title: string
  description: string | null
  goal: string | null
  duration_weeks: number | null
  is_active: boolean | null
  plan_data: WorkoutPlanData
  created_at: string
}

export interface WorkoutPlanData {
  weeks: WorkoutWeek[]
  summary?: string
  notes?: string
}

export interface WorkoutWeek {
  week: number
  days: WorkoutDay[]
}

export interface WorkoutDay {
  day: string
  focus: string
  exercises: Exercise[]
}

export interface Exercise {
  name: string
  sets: number
  reps: string
  rest: string
  technique: string
}

export type WorkoutPlanInsert = Omit<WorkoutPlan, 'id' | 'created_at'>
export type WorkoutPlanUpdate = Partial<
  Omit<WorkoutPlan, 'id' | 'user_id' | 'created_at'>
>

export interface AiChatHistory {
  id: string
  user_id: string
  module: 'nutrition' | 'workout'
  messages: ChatMessage[]
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export type AiChatHistoryInsert = Omit<
  AiChatHistory,
  'id' | 'created_at' | 'updated_at'
>
export type AiChatHistoryUpdate = Partial<
  Omit<AiChatHistory, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>

export interface MealWithItems extends Meal {
  meal_items: MealItem[]
}

export interface DailyNutrition {
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  meals: MealWithItems[]
}

// Supabase Database type - must match expected structure exactly
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: ProfileInsert
        Update: ProfileUpdate
        Relationships: []
      }
      meals: {
        Row: Meal
        Insert: MealInsert
        Update: MealUpdate
        Relationships: []
      }
      meal_items: {
        Row: MealItem
        Insert: MealItemInsert
        Update: MealItemUpdate
        Relationships: []
      }
      weight_logs: {
        Row: WeightLog
        Insert: WeightLogInsert
        Update: WeightLogUpdate
        Relationships: []
      }
      workout_plans: {
        Row: WorkoutPlan
        Insert: WorkoutPlanInsert
        Update: WorkoutPlanUpdate
        Relationships: []
      }
      ai_chat_history: {
        Row: AiChatHistory
        Insert: AiChatHistoryInsert
        Update: AiChatHistoryUpdate
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
