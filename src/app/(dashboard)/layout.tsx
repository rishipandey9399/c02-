import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppShell } from '@/components/shared/AppShell'
import { adminAuth } from '@/lib/firebase/admin'

export const metadata = {
  title: 'Dashboard | CarbonTrack',
  description: 'Manage your carbon footprint, set reduction goals, and trace progress over time.',
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  const token = cookieStore.get('session')?.value

  if (!token) {
    redirect('/login')
  }

  try {
    await adminAuth.verifyIdToken(token, true)
  } catch (error) {
    redirect('/login')
  }

  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  )
}

