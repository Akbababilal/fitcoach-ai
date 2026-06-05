import { createClient } from '@/lib/supabase/server'
import { WorkoutGenerator } from '@/components/workout/workout-generator'
import { WorkoutCard } from '@/components/workout/workout-card'
import { Card, CardContent } from '@/components/ui/card'
import type { WorkoutPlan } from '@/domain/types'

export default async function WorkoutPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: plans } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('user_id', user!.id)
    .order('is_active', { ascending: false })
    .order('created_at', { ascending: false })

  const workoutPlans = (plans ?? []) as WorkoutPlan[]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Antrenman</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          AI ile kişiselleştirilmiş antrenman planı oluşturun.
        </p>
      </div>

      <WorkoutGenerator />

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Planlarım ({workoutPlans.length})
        </h2>
        {workoutPlans.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-muted-foreground text-sm">
              Henüz antrenman planı yok. Yukarıdan plan oluşturun.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {workoutPlans.map((plan) => (
              <WorkoutCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
