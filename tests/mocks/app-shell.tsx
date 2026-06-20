import React from 'react'

export function AppShell({ children }: { children: React.ReactNode }) {
  return React.createElement('div', { className: 'app-shell-mock' }, children)
}
