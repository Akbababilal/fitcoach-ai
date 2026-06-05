import { getProfile } from '@/actions/profile'
import { ProfileForm } from '@/components/shared/profile-form'

export default async function ProfilePage() {
  const profile = await getProfile()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Profil</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Kişisel bilgilerinizi ve hedeflerinizi güncelleyin.
        </p>
      </div>
      <ProfileForm initialData={profile} />
    </div>
  )
}
