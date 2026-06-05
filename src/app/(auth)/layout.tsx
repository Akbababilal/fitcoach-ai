import { Dumbbell } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col">
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="bg-primary rounded-lg p-1.5">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-foreground">FitCoach AI</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>
      <footer className="p-6 text-center text-sm text-muted-foreground">
        © 2025 FitCoach AI. Tüm hakları saklıdır.
      </footer>
    </div>
  )
}
