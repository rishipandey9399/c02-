import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'

import { mockCookieStore } from '../../mocks/next-headers'
import { mockNavigation } from '../../mocks/next-navigation'
import { adminAuth } from '@/lib/firebase/admin'

import DashboardLayout from '@/app/(dashboard)/layout'

describe('DashboardLayout Server Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('redirects to /login if no session token is present', async () => {
    vi.spyOn(mockCookieStore, 'get').mockReturnValue(undefined)
    const redirectSpy = vi.spyOn(mockNavigation, 'redirect')

    await expect(
      DashboardLayout({ children: React.createElement('div', null, 'Dashboard Content') })
    ).rejects.toThrow('Redirected to /login')

    expect(redirectSpy).toHaveBeenCalledWith('/login')
  })

  it('redirects to /login if session token verification fails', async () => {
    vi.spyOn(mockCookieStore, 'get').mockReturnValue({ value: 'invalid-token', name: 'session' })
    vi.spyOn(adminAuth, 'verifyIdToken').mockRejectedValue(new Error('Invalid token'))
    const redirectSpy = vi.spyOn(mockNavigation, 'redirect')

    await expect(
      DashboardLayout({ children: React.createElement('div', null, 'Dashboard Content') })
    ).rejects.toThrow('Redirected to /login')

    expect(redirectSpy).toHaveBeenCalledWith('/login')
  })

  it('renders children wrapped in AuthGuard and AppShell on valid token', async () => {
    vi.spyOn(mockCookieStore, 'get').mockReturnValue({ value: 'valid-token', name: 'session' })
    const verifySpy = vi.spyOn(adminAuth, 'verifyIdToken').mockResolvedValue({ uid: 'user-123' } as any)
    const redirectSpy = vi.spyOn(mockNavigation, 'redirect')

    const result = await DashboardLayout({ children: React.createElement('span', { className: 'test-child' }, 'Hello') })
    const html = renderToString(result)

    expect(verifySpy).toHaveBeenCalledWith('valid-token', true)
    expect(redirectSpy).not.toHaveBeenCalled()
    expect(html).toContain('auth-guard-mock')
    expect(html).toContain('app-shell-mock')
    expect(html).toContain('test-child')
    expect(html).toContain('Hello')
  })
})
