'use client'

import { LogOut, LayoutDashboard, Settings } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  if (!user) return null

  const initials = user.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : (user.email?.slice(0, 2).toUpperCase() ?? 'US')

  const handleSignOut = async () => {
    try {
      await logout()
      router.push('/')
    } catch (err) {
      console.error('Failed to log out:', err)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 focus:outline-none cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="user-dropdown-menu"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName ?? 'User profile'}
            className="w-9 h-9 rounded-full object-cover border border-border"
          />
        ) : (
          <span className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm border border-primary/30">
            {initials}
          </span>
        )}
      </button>

      {open && (
        <div
          id="user-dropdown-menu"
          role="menu"
          aria-label="User account menu"
          className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 py-1.5 focus:outline-none glassmorphism animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="px-4 py-2 border-b border-border/60">
            <p className="text-sm font-bold text-foreground truncate">
              {user.displayName ?? 'Welcome'}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <div className="p-1">
            <Link
              href="/dashboard"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
              Dashboard
            </Link>
            <Link
              href="/settings"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              Settings
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                void handleSignOut()
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
