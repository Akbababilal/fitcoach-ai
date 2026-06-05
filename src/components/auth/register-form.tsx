'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/toaster'
import { register } from '@/actions/auth'
import { useLanguage } from '@/lib/i18n/context'

export function RegisterForm() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (formData.password !== formData.confirm_password) {
      toast({ title: 'Hata', description: 'Şifreler eşleşmiyor.', variant: 'destructive' })
      return
    }

    if (formData.password.length < 6) {
      toast({ title: 'Hata', description: 'Şifre en az 6 karakter olmalı.', variant: 'destructive' })
      return
    }

    setIsLoading(true)

    try {
      const result = await register(formData)
      if (result?.error) {
        toast({ title: 'Hata', description: result.error, variant: 'destructive' })
      } else {
        setSuccess(true)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardContent className="pt-10 pb-10 flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{t.auth.verifyEmail}</h2>
            <p className="text-muted-foreground mt-2 text-sm">{t.auth.verifyEmailDesc}</p>
          </div>
          <Link href="/login">
            <Button variant="outline">{t.auth.backToLogin}</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-0">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-2xl font-bold">{t.auth.register}</CardTitle>
        <CardDescription>Ücretsiz hesap oluşturun</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">{t.auth.fullName}</Label>
            <Input
              id="full_name"
              placeholder="Ad Soyad"
              value={formData.full_name}
              onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t.auth.email}</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t.auth.password}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 karakter"
                value={formData.password}
                onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
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
            <Label htmlFor="confirm_password">{t.auth.confirmPassword}</Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="Şifreyi tekrar girin"
              value={formData.confirm_password}
              onChange={(e) => setFormData((p) => ({ ...p, confirm_password: e.target.value }))}
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
              t.auth.register
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          {t.auth.hasAccount}{' '}
          <Link href="/login" className="text-primary font-medium hover:underline">
            {t.auth.login}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
