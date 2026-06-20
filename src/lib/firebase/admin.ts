import 'server-only'
import * as admin from 'firebase-admin'

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'

if (!isBuildPhase && !admin.apps.length) {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (projectId && clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  } else {
    // Fallback to application default credentials (useful for some dev/testing environments)
    if (process.env.NODE_ENV === 'test') {
      admin.initializeApp({
        projectId: 'carbontrack-dummy',
      })
    } else {
      admin.initializeApp()
    }
  }
}

export const adminAuth = isBuildPhase
  ? {
      verifyIdToken: async () => {
        throw new Error('Firebase Admin disabled during build phase')
      },
    } as any
  : admin.auth()

export const adminDb = isBuildPhase ? null as any : admin.firestore()
export default admin
