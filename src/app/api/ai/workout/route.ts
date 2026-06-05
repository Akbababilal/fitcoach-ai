import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateJSON } from '@/lib/gemini/client'
import type { WorkoutPlanData } from '@/domain/types'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }

    const { request: userRequest } = await request.json()

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const profileContext = profile
      ? `Kullanıcı Profili:
- Yaş: ${profile.age ?? '?'}
- Cinsiyet: ${profile.gender ?? '?'}
- Boy: ${profile.height_cm ?? '?'} cm
- Kilo: ${profile.weight_kg ?? '?'} kg
- Aktivite seviyesi: ${profile.activity_level ?? '?'}
- Hedef: ${profile.goal ?? '?'}
- Tecrübe: ${profile.experience_level ?? '?'}`
      : 'Kullanıcı profili yok.'

    const prompt = `Sen bir profesyonel fitness koçusun. Aşağıdaki kullanıcı için kişiselleştirilmiş bir haftalık antrenman planı oluştur.

${profileContext}

Kullanıcının isteği: "${userRequest}"

SADECE aşağıdaki JSON formatında yanıt ver, başka hiçbir şey yazma:
{
  "title": "Planın kısa başlığı",
  "description": "Planın kısa açıklaması (1-2 cümle)",
  "goal": "Hedef",
  "duration_weeks": 4,
  "weeks": [
    {
      "week": 1,
      "days": [
        {
          "day": "Pazartesi",
          "focus": "Göğüs & Triceps",
          "exercises": [
            {
              "name": "Bench Press",
              "sets": 4,
              "reps": "8-12",
              "rest": "90 saniye",
              "technique": "Teknik açıklama buraya"
            }
          ]
        }
      ]
    }
  ],
  "notes": "Genel notlar ve uyarılar"
}`

    const planData = await generateJSON<WorkoutPlanData & {
      title: string
      description: string
      goal: string
      duration_weeks: number
    }>(prompt)

    const { weeks, title, description, goal, duration_weeks, notes } = planData

    const { error } = await supabase.from('workout_plans').insert({
      user_id: user.id,
      title: title || 'Kişisel Antrenman Planı',
      description: description || userRequest,
      goal: goal || profile?.goal || '',
      duration_weeks: duration_weeks || 4,
      is_active: true,
      plan_data: { weeks: weeks || [], notes: notes || '' },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Deactivate other plans
    await supabase
      .from('workout_plans')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .neq('id', user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Workout API error:', error)
    return NextResponse.json(
      { error: 'Plan oluşturulurken hata oluştu.' },
      { status: 500 }
    )
  }
}
