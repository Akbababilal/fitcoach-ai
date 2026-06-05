'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Utensils,
  Scale,
  Dumbbell,
  Bot,
  User,
  Dumbbell as Logo,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'
import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { href: '/nutrition', icon: Utensils, key: 'nutrition' },
  { href: '/weight', icon: Scale, key: 'weight' },
  { href: '/workout', icon: Dumbbell, key: 'workout' },
  { href: '/coach', icon: Bot, key: 'coach' },
  { href: '/profile', icon: User, key: 'profile' },
] as const

export function Sidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-border">
      <div className="p-6 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1.5">
            <Logo className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg">FitCoach AI</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const label = t.nav[item.key]
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <form action={logout}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            {t.auth.logout}
          </Button>
        </form>
      </div>
    </aside>
  )
}
