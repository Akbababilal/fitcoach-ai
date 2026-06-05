import { z } from 'zod'

export const profileSchema = z.object({
  full_name: z.string().min(2, 'En az 2 karakter').max(100),
  age: z.coerce.number().int().min(10).max(120),
  height_cm: z.coerce.number().min(50).max(300),
  weight_kg: z.coerce.number().min(20).max(500),
  gender: z.enum(['male', 'female', 'other']),
  activity_level: z.enum([
    'sedentary',
    'lightly_active',
    'moderately_active',
    'very_active',
    'extremely_active',
  ]),
  goal: z.enum(['lose_weight', 'maintain', 'gain_muscle', 'bulk']),
  experience_level: z.enum(['beginner', 'intermediate', 'advanced']),
  language: z.enum(['tr', 'en']),
})

export const loginSchema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
})

export const registerSchema = z
  .object({
    full_name: z.string().min(2, 'En az 2 karakter'),
    email: z.string().email('Geçerli bir e-posta girin'),
    password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirm_password'],
  })

export const forgotPasswordSchema = z.object({
  email: z.string().email('Geçerli bir e-posta girin'),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Şifre en az 6 karakter olmalı'),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Şifreler eşleşmiyor',
    path: ['confirm_password'],
  })

export const mealSchema = z.object({
  date: z.string(),
  meal_type: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  name: z.string().min(1, 'Öğün adı gerekli'),
})

export const mealItemSchema = z.object({
  food_name: z.string().min(1, 'Yiyecek adı gerekli'),
  quantity: z.coerce.number().min(0.1, 'Miktar 0 dan büyük olmalı'),
  unit: z.enum(['g', 'ml', 'piece', 'serving']).default('g'),
  calories: z.coerce.number().min(0),
  protein_g: z.coerce.number().min(0),
  carbs_g: z.coerce.number().min(0),
  fat_g: z.coerce.number().min(0),
})

export const weightLogSchema = z.object({
  date: z.string(),
  weight_kg: z.coerce.number().min(20).max(500),
  note: z.string().optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type MealFormData = z.infer<typeof mealSchema>
export type MealItemFormData = z.infer<typeof mealItemSchema>
export type WeightLogFormData = z.infer<typeof weightLogSchema>
