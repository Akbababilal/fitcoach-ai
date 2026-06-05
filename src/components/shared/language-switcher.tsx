'use client'

import { useLanguage } from '@/lib/i18n/context'
import { Button } from '@/components/ui/button'
import type { Language } from '@/lib/i18n/translations'

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  const toggle = () => {
    const next: Language = lang === 'tr' ? 'en' : 'tr'
    setLang(next)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="h-8 px-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
    >
      {lang === 'tr' ? '🇬🇧 EN' : '🇹🇷 TR'}
    </Button>
  )
}
