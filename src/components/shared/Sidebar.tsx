'use client'

import {
  LayoutDashboard,
  History,
  Target,
  MessageSquare,
  Settings,
  LogOut,
  Leaf,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { useAuth } from '@/hooks/useAuth'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/history', label: 'Emissions History', icon: History },
    { href: '/goals', label: 'Reduction Goals', icon: Target },
    { href: '/chat', label: 'AI Carbon Advisor', icon: MessageSquare },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const initials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? 'US')

  return (
    <aside className="w-64 h-screen border-r border-border/40 bg-card/65 backdrop-blur-xl flex flex-col justify-between fixed left-0 top-0 z-30 transition-all duration-300">
      {/* Brand */}
      <div className="p-6 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 bg-primary/15 rounded-lg text-primary transition-all group-hover:scale-110">
            <Leaf className="w-5 h-5 fill-primary/10" />
          </div>
          <span className="font-display font-extrabold text-lg text-foreground">
            Carbon<span className="text-primary">Track</span>
          </span>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10 font-bold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="p-4 border-t border-border/40 bg-card/20 space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-2 py-1">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName ?? 'User avatar'}
                className="w-10 h-10 rounded-full border border-border"
              />
            ) : (
              <span className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm border border-primary/30 shrink-0">
                {initials}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">
                {user.displayName ?? 'Welcome'}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/10 rounded-xl transition-all text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
