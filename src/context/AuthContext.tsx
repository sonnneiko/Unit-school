import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import { useUsers } from './UsersContext'

const STORAGE_KEY = 'unit_school_user'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProgress: (lessonId: string, slideIndex: number) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { users, passwords } = useUsers()
  const [user, setUser] = useState<User | null>(loadUserFromStorage)

  async function login(email: string, password: string) {
    const found = users.find(u => u.email === email)
    if (!found) throw new Error('Пользователь не найден')
    const expectedPassword = passwords[found.id]
    if (!expectedPassword || expectedPassword !== password) {
      throw new Error('Неверный email или пароль')
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found))
    setUser(found)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  function updateProgress(lessonId: string, slideIndex: number) {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, progress: { ...prev.progress, [lessonId]: slideIndex } }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProgress }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
