'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/toaster'
import { resetPassword } from '@/actions/auth'
import { useLanguage } from '@/lib/i18n/context'

export default function ResetPasswordPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirm) {
      toast({ title: 'Hata', description: 'Şifreler eşleşmiyor.', variant: 'destructive' })
      return
    }

    setIsLoading(true)
    try {
      const result = await resetPassword(password)
      if (result?.error) {
        toast({ title: 'Hata', description: result.error, variant: 'destructive' })
      } else {
        toast({ title: 'Başarılı', description: t.auth.passwordUpdated, variant: 'success' })
        router.push('/dashboard')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-0">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-2xl font-bold">{t.auth.resetPassword}</CardTitle>
        <CardDescription>Yeni şifrenizi belirleyin.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{t.auth.newPassword}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm">{t.auth.confirmPassword}</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="Şifreyi tekrar girin"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t.common.loading}
              </>
            ) : (
              t.auth.resetPassword
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
