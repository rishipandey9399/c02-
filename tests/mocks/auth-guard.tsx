import React from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  return React.createElement('div', { className: 'auth-guard-mock' }, children)
}
