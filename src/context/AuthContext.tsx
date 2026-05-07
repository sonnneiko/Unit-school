import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import { useUsers } from './UsersContext'
import { useLessons } from './LessonsContext'
import { updateStreak } from '../utils/streak'
import { computeAchievements } from '../utils/achievements'
import type { Achievement } from '../utils/achievements'

const STORAGE_KEY = 'unit_school_user'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<string>
  logout: () => void
  updateProgress: (lessonId: string, slideIndex: number) => void
  updateProfile: (patch: Partial<Pick<User, 'firstName' | 'lastName' | 'patronymic' | 'birthDate' | 'phone' | 'telegram'>>) => void
  toasts: Achievement[]
  dismissToast: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as User
    if (parsed.streak === undefined) parsed.streak = 0
    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { users, passwords, updateUser } = useUsers()
  const { lessons } = useLessons()
  const [user, setUser] = useState<User | null>(loadUserFromStorage)
  const [toasts, setToasts] = useState<Achievement[]>([])

  async function login(email: string, password: string): Promise<string> {
    const found = users.find(u => u.email === email)
    if (!found) throw new Error('Пользователь не найден')
    const expectedPassword = passwords[found.id]
    if (!expectedPassword || expectedPassword !== password) {
      throw new Error('Неверный email или пароль')
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found))
    setUser(found)
    return found.role
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  function updateProgress(lessonId: string, slideIndex: number) {
    setUser(prev => {
      if (!prev) return prev
      const before = computeAchievements(prev, lessons).map(a => a.key)
      const streakChanges = updateStreak(prev)
      const updated = {
        ...prev,
        ...streakChanges,
        progress: { ...prev.progress, [lessonId]: slideIndex },
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      const after = computeAchievements(updated, lessons)
      const newOnes = after.filter(a => !before.includes(a.key))
      if (newOnes.length > 0) {
        setToasts((q: Achievement[]) => [...q, ...newOnes])
      }
      return updated
    })
  }

  function dismissToast() {
    setToasts((q: Achievement[]) => q.slice(1))
  }

  function updateProfile(patch: Partial<Pick<User, 'firstName' | 'lastName' | 'patronymic' | 'birthDate' | 'phone' | 'telegram'>>) {
    setUser(prev => {
      if (!prev) return prev
      const name = [patch.firstName ?? prev.firstName, patch.lastName ?? prev.lastName]
        .filter(Boolean).join(' ') || prev.name
      const updated = { ...prev, ...patch, name }
      updateUser(prev.id, updated)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProgress, updateProfile, toasts, dismissToast }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
