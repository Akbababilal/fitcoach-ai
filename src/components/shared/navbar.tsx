'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  LayoutDashboard,
  Utensils,
  Scale,
  Dumbbell,
  Bot,
  User,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n/context'
import { logout } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from './language-switcher'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { href: '/nutrition', icon: Utensils, key: 'nutrition' },
  { href: '/weight', icon: Scale, key: 'weight' },
  { href: '/workout', icon: Dumbbell, key: 'workout' },
  { href: '/coach', icon: Bot, key: 'coach' },
  { href: '/profile', icon: User, key: 'profile' },
] as const

export function Navbar() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentNav = navItems.find((item) =>
    item.href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(item.href)
  )

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/dashboard" className="font-bold text-base flex items-center gap-2">
          <div className="bg-primary rounded-md p-1">
            <Dumbbell className="h-4 w-4 text-white" />
          </div>
          FitCoach AI
        </Link>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-accent"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="border-t border-border bg-white px-4 py-3 space-y-1">
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
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            )
          })}
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
        </nav>
      )}

      {/* Bottom tab bar for mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border px-2 py-1 flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg min-w-0',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-[10px] font-medium truncate">{t.nav[item.key]}</span>
            </Link>
          )
        })}
      </div>
    </header>
  )
}
