'use client'

import { Loader2, Download, Save, Shield, Bell } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useFootprintHistory } from '@/hooks/useFootprint'

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const { data: history = [] } = useFootprintHistory()

  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [savingProgress, setSavingProgress] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProgress(true)
    setSuccessMsg(null)
    try {
      // API call to update profile
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName,
        }),
      })
      if (!response.ok) throw new Error('Failed to update profile')
      setSuccessMsg('Profile updated successfully.')
    } catch (err) {
      console.error(err)
      setSuccessMsg('Error updating profile.')
    } finally {
      setSavingProgress(false)
    }
  }

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `carbontrack-data-export-${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-black font-display text-foreground tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account preferences, notification parameters, and download your local logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-4xl">
        {/* Left column: Profile & Notifications */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile Form */}
          <div className="bg-card border border-border/60 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Shield className="w-4.5 h-4.5 text-primary" />
              Profile Settings
            </h3>

            {successMsg && (
              <p className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 p-2.5 rounded-lg text-center">
                {successMsg}
              </p>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="displayName" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-secondary/50 border border-border/40 text-muted-foreground rounded-xl px-3.5 py-2.5 text-xs cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={savingProgress}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-md hover:bg-primary/95 transition-all cursor-pointer disabled:opacity-50"
              >
                {savingProgress ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save Changes
              </button>
            </form>
          </div>

          {/* Email Notifications */}
          <div className="bg-card border border-border/60 p-6 rounded-3xl space-y-4 shadow-sm">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-primary" />
              Notifications
            </h3>

            <div className="flex items-center justify-between py-2 border-b border-border/20">
              <div className="space-y-0.5 pr-4">
                <span className="text-xs font-bold text-foreground block">Monthly Carbon Digests</span>
                <span className="text-[11px] text-muted-foreground">Receive a summary of your carbon footprint reduction curve.</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="w-4 h-4 text-primary accent-primary cursor-pointer shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Right column: Data Export */}
        <div className="lg:col-span-4">
          <div className="bg-card border border-border/60 p-6 rounded-3xl space-y-4 shadow-sm h-full flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Download className="w-4.5 h-4.5 text-primary" />
                Data Portability
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Export your raw footprint calculations, goals, and history in structured JSON format for your own compliance or backups.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportData}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary hover:bg-border text-foreground border border-border text-xs font-bold rounded-xl transition-all cursor-pointer mt-6"
            >
              <Download className="w-3.5 h-3.5" />
              Export My Data
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
