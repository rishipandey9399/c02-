'use client'

import { useState } from 'react'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { useUIStore } from '@/stores/uiStore'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useUIStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Menu container */}
          <div className="relative w-64 max-w-xs h-full bg-background flex-col flex animate-in slide-in-from-left duration-200">
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 hover:bg-secondary rounded-lg"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 w-full glassmorphism border-b border-border/40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 hover:bg-secondary rounded-xl text-foreground"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-secondary rounded-xl text-muted-foreground hover:text-foreground transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full focus:outline-none" id="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
