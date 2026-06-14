'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Leaf, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'

export default function LoginPage() {
  const router = useRouter()
  const { loginWithEmail } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await loginWithEmail(email, password)
      router.push('/dashboard')
    } catch (err: any) {
      console.error(err)
      setError(err?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 glassmorphism border border-border p-8 rounded-3xl shadow-2xl relative z-10 bg-card/60 backdrop-blur-lg">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mx-auto">
            <div className="p-2 bg-primary/15 rounded-xl text-primary transition-all group-hover:scale-110">
              <Leaf className="w-6 h-6 fill-primary/10" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-foreground">
              Carbon<span className="text-primary">Track</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold font-display text-foreground pt-4">Welcome Back</h2>
          <p className="text-xs text-muted-foreground">Sign in to track your carbon reduction progress.</p>
        </div>

        {error && (
          <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:bg-primary/95 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/10 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-border/40"></div>
          <span className="flex-shrink mx-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Or</span>
          <div className="flex-grow border-t border-border/40"></div>
        </div>

        <GoogleSignInButton />

        <p className="text-xs text-center text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
