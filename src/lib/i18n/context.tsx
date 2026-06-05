'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, type Language, type Translations } from './translations'

interface LanguageContextType {
  lang: Language
  t: Translations
  setLang: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'tr',
  t: translations['tr'],
  setLang: () => {},
})

export function LanguageProvider({
  children,
  defaultLang = 'tr',
}: {
  children: React.ReactNode
  defaultLang?: Language
}) {
  const [lang, setLangState] = useState<Language>(defaultLang)

  useEffect(() => {
    const saved = localStorage.getItem('fitcoach-lang') as Language | null
    if (saved && (saved === 'tr' || saved === 'en')) {
      setLangState(saved)
    }
  }, [])

  const setLang = (newLang: Language) => {
    setLangState(newLang)
    localStorage.setItem('fitcoach-lang', newLang)
  }

  return (
    <LanguageContext.Provider
      value={{ lang, t: translations[lang], setLang }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
