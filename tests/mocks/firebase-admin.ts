export const apps: any[] = []
export const initializeApp = () => {}
export const credential = {
  cert: () => ({})
}

export const mockAuth = {
  verifyIdToken: async (token: string, _checkRevoked?: boolean) => {
    if (token === 'invalid-token') {
      throw new Error('Invalid token')
    }
    return { uid: 'mock-user-uid' }
  },
  getUser: async (_uid: string) => {
    return {
      uid: 'mock-user-uid',
      email: 'mock@example.com',
    }
  }
}

export const auth = () => mockAuth

export const mockFirestore = {
  collection: function() { return this },
  doc: function() { return this },
  set: async () => {},
  get: async () => ({ exists: true, data: () => ({}) }),
}

export const firestore = () => mockFirestore

export const adminAuth = mockAuth
export const adminDb = mockFirestore

const admin = {
  apps,
  initializeApp,
  credential,
  auth,
  firestore,
  adminAuth,
  adminDb
}

export default admin
