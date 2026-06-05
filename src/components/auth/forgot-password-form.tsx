'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/toaster'
import { forgotPassword } from '@/actions/auth'
import { useLanguage } from '@/lib/i18n/context'

export function ForgotPasswordForm() {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await forgotPassword(email)
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
            <h2 className="text-xl font-bold">E-posta Gönderildi!</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {email} adresine şifre sıfırlama bağlantısı gönderildi.
            </p>
          </div>
          <Link href="/login">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" />
              {t.auth.backToLogin}
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-0">
      <CardHeader className="space-y-1 pb-2">
        <CardTitle className="text-2xl font-bold">{t.auth.forgotPassword}</CardTitle>
        <CardDescription>E-posta adresinize sıfırlama bağlantısı göndereceğiz.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t.auth.email}</Label>
            <Input
              id="email"
              type="email"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              t.auth.sendResetLink
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <Link href="/login" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" />
          {t.auth.backToLogin}
        </Link>
      </CardFooter>
    </Card>
  )
}
