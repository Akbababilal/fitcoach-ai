import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { LanguageProvider } from '@/lib/i18n/context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FitCoach AI - Akıllı Fitness Koçunuz',
  description:
    'AI destekli kişiselleştirilmiş fitness ve beslenme platformu. Antrenman planları, beslenme takibi ve AI koçluk.',
  keywords: ['fitness', 'beslenme', 'antrenman', 'AI koç', 'kilo verme', 'kas kazanma'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
}
