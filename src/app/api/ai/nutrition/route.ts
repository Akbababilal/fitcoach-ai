import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateText } from '@/lib/gemini/client'
import { getTodayDate } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
    }

    const { message, history } = await request.json()

    const [{ data: profile }, { data: meals }, { data: weightLogs }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('meals')
        .select('*, meal_items(*)')
        .eq('user_id', user.id)
        .eq('date', getTodayDate()),
      supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(7),
    ])

    const profileContext = profile
      ? `Kullanıcı Profili:
- Yaş: ${profile.age}, Cinsiyet: ${profile.gender}
- Boy: ${profile.height_cm}cm, Kilo: ${profile.weight_kg}kg
- Hedef: ${profile.goal}, Aktivite: ${profile.activity_level}
- Günlük hedefler: ${profile.daily_calorie_target}kcal, P:${profile.daily_protein_target}g K:${profile.daily_carb_target}g Y:${profile.daily_fat_target}g`
      : 'Profil tamamlanmamış.'

    const todayMeals = meals
      ? meals
          .map(
            (m) =>
              `${m.meal_type}: ${m.name} (${m.meal_items
                ?.map((i: { food_name: string; calories: number; protein_g: number }) =>
                  `${i.food_name} ${i.calories}kcal P:${i.protein_g}g`
                )
                .join(', ')})`
          )
          .join('\n')
      : 'Bugün öğün kaydı yok.'

    const weightContext = weightLogs
      ? weightLogs.map((w) => `${w.date}: ${w.weight_kg}kg`).join(', ')
      : 'Kilo kaydı yok.'

    const historyContext =
      history && history.length > 0
        ? '\nSohbet geçmişi:\n' +
          history
            .slice(-6)
            .map((m: { role: string; content: string }) =>
              `${m.role === 'user' ? 'Kullanıcı' : 'Koç'}: ${m.content}`
            )
            .join('\n')
        : ''

    const systemPrompt = `Sen uzman bir beslenme ve fitness koçusun. Türkçe, kısa, öz ve bilimsel yanıtlar ver. Emoji kullanabilirsin.

${profileContext}

Bugünün öğünleri:
${todayMeals}

Son kilo kayıtları: ${weightContext}
${historyContext}

Kullanıcının sorusu: "${message}"

Yanıtını 3-4 cümleyle sınırla. Kişinin verilerini analiz ederek kişiselleştirilmiş öneride bulun.`

    const response = await generateText(systemPrompt)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Nutrition AI error:', error)
    return NextResponse.json(
      { error: 'Yanıt oluşturulurken hata oluştu.' },
      { status: 500 }
    )
  }
}
