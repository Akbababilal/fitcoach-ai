'use client'

import { useState } from 'react'
import { Loader2, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/toaster'
import { updateProfile } from '@/actions/profile'
import { useLanguage } from '@/lib/i18n/context'
import type { Profile } from '@/domain/types'

interface ProfileFormProps {
  initialData: Profile | null
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [targets, setTargets] = useState<{
    calories: number
    protein: number
    carbs: number
    fat: number
  } | null>(null)

  const [formData, setFormData] = useState({
    full_name: initialData?.full_name ?? '',
    age: initialData?.age?.toString() ?? '',
    height_cm: initialData?.height_cm?.toString() ?? '',
    weight_kg: initialData?.weight_kg?.toString() ?? '',
    gender: initialData?.gender ?? 'male',
    activity_level: initialData?.activity_level ?? 'moderately_active',
    goal: initialData?.goal ?? 'maintain',
    experience_level: initialData?.experience_level ?? 'beginner',
    language: initialData?.language ?? 'tr',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await updateProfile({
        full_name: formData.full_name,
        age: Number(formData.age),
        height_cm: Number(formData.height_cm),
        weight_kg: Number(formData.weight_kg),
        gender: formData.gender as 'male' | 'female' | 'other',
        activity_level: formData.activity_level as
          | 'sedentary'
          | 'lightly_active'
          | 'moderately_active'
          | 'very_active'
          | 'extremely_active',
        goal: formData.goal as 'lose_weight' | 'maintain' | 'gain_muscle' | 'bulk',
        experience_level: formData.experience_level as
          | 'beginner'
          | 'intermediate'
          | 'advanced',
        language: formData.language as 'tr' | 'en',
      })

      if (result?.error) {
        toast({ title: 'Hata', description: result.error, variant: 'destructive' })
      } else {
        toast({ title: 'Başarılı', description: t.profile.saved, variant: 'success' })
        if (result.targets) setTargets(result.targets)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const update = (field: string, value: string) =>
    setFormData((p) => ({ ...p, [field]: value }))

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.profile.personalInfo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">{t.profile.age === 'Yaş' ? 'Ad Soyad' : 'Full Name'}</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => update('full_name', e.target.value)}
                placeholder="Ad Soyad"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">{t.profile.age}</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => update('age', e.target.value)}
                placeholder="25"
                min={10}
                max={120}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height_cm">{t.profile.height}</Label>
              <Input
                id="height_cm"
                type="number"
                value={formData.height_cm}
                onChange={(e) => update('height_cm', e.target.value)}
                placeholder="175"
                min={50}
                max={300}
                step={0.1}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight_kg">{t.profile.weight}</Label>
              <Input
                id="weight_kg"
                type="number"
                value={formData.weight_kg}
                onChange={(e) => update('weight_kg', e.target.value)}
                placeholder="75"
                min={20}
                max={500}
                step={0.1}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.profile.gender}</Label>
            <Select value={formData.gender} onValueChange={(v) => update('gender', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t.profile.male}</SelectItem>
                <SelectItem value="female">{t.profile.female}</SelectItem>
                <SelectItem value="other">{t.profile.other}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Fitness Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t.profile.fitnessInfo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t.profile.activityLevel}</Label>
            <Select
              value={formData.activity_level}
              onValueChange={(v) => update('activity_level', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">{t.profile.sedentary}</SelectItem>
                <SelectItem value="lightly_active">{t.profile.lightlyActive}</SelectItem>
                <SelectItem value="moderately_active">{t.profile.moderatelyActive}</SelectItem>
                <SelectItem value="very_active">{t.profile.veryActive}</SelectItem>
                <SelectItem value="extremely_active">{t.profile.extremelyActive}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.profile.goal}</Label>
            <Select value={formData.goal} onValueChange={(v) => update('goal', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose_weight">{t.profile.loseWeight}</SelectItem>
                <SelectItem value="maintain">{t.profile.maintain}</SelectItem>
                <SelectItem value="gain_muscle">{t.profile.gainMuscle}</SelectItem>
                <SelectItem value="bulk">{t.profile.bulk}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.profile.experienceLevel}</Label>
            <Select
              value={formData.experience_level}
              onValueChange={(v) => update('experience_level', v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">{t.profile.beginner}</SelectItem>
                <SelectItem value="intermediate">{t.profile.intermediate}</SelectItem>
                <SelectItem value="advanced">{t.profile.advanced}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t.profile.language}</Label>
            <Select value={formData.language} onValueChange={(v) => update('language', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
                <SelectItem value="en">🇬🇧 English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Calculated Targets */}
      {(targets || initialData?.daily_calorie_target) && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              {t.profile.dailyTargets}
            </CardTitle>
            <p className="text-xs text-muted-foreground">{t.profile.calculatedFor}</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: 'Kalori',
                  value: targets?.calories ?? initialData?.daily_calorie_target,
                  unit: 'kcal',
                  color: 'text-green-600',
                },
                {
                  label: 'Protein',
                  value: targets?.protein ?? initialData?.daily_protein_target,
                  unit: 'g',
                  color: 'text-blue-600',
                },
                {
                  label: 'Karbonhidrat',
                  value: targets?.carbs ?? initialData?.daily_carb_target,
                  unit: 'g',
                  color: 'text-orange-600',
                },
                {
                  label: 'Yağ',
                  value: targets?.fat ?? initialData?.daily_fat_target,
                  unit: 'g',
                  color: 'text-yellow-600',
                },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className={`text-xl font-bold ${item.color}`}>
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.unit} {item.label}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.common.loading}
          </>
        ) : (
          t.profile.save
        )}
      </Button>
    </form>
  )
}
