import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  type User,
} from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth, googleProvider } from '@/lib/firebase/client'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  const loginWithGoogle = async () => {
    setLoading(true)
    setError(null)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, pass)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signupWithEmail = async (email: string, pass: string, name?: string) => {
    setLoading(true)
    setError(null)
    try {
      const credObj = await createUserWithEmailAndPassword(auth, email, pass)
      if (name && credObj.user) {
        await updateProfile(credObj.user, { displayName: name })
      }
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    setError(null)
    try {
      await signOut(auth)
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getToken = async (): Promise<string | null> => {
    if (!auth.currentUser) return null
    try {
      return await auth.currentUser.getIdToken()
    } catch (err) {
      console.error('Failed to get auth token:', err)
      return null
    }
  }

  return {
    user,
    loading,
    error,
    loginWithGoogle,
    loginWithEmail,
    signupWithEmail,
    logout,
    getToken,
  }
}

