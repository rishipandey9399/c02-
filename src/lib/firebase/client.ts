import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  const missingKeys = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ].filter((key) => !process.env[key])

  if (missingKeys.length > 0) {
    throw new Error(`Missing required production environment variables: ${missingKeys.join(', ')}`)
  }
}

const firebaseConfig = (process.env.NODE_ENV === 'production' && typeof window !== 'undefined')
  ? {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
      ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
        ? { measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID }
        : {}),
    }
  : {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyDummyKeyForDevelopment123456789',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'carbontrack-dummy.firebaseapp.com',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'carbontrack-dummy',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'carbontrack-dummy.appspot.com',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '123456789012',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:123456789012:web:1234567890abcdef123456',
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-DUMMY12345',
    }

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]!

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')
googleProvider.addScope('profile')
