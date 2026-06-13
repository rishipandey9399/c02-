export interface UserProfile {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: string
  updatedAt: string
}

export interface UserGoal {
  id: string
  uid: string
  title: string
  category: 'transport' | 'diet' | 'energy' | 'flights' | 'goods'
  difficulty: 'Easy' | 'Medium' | 'Committed'
  saving: number // annual saving in t CO2e
  targetDate: string
  completed: boolean
  completedAt?: string
  createdAt: string
}
