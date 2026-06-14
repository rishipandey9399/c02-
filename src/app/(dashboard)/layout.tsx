import { AuthGuard } from '@/components/auth/AuthGuard'
import { AppShell } from '@/components/shared/AppShell'

export const metadata = {
  title: 'Dashboard | CarbonTrack',
  description: 'Manage your carbon footprint, set reduction goals, and trace progress over time.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  )
}
