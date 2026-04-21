import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import { mockUsers, mockPasswords } from '../data/users'

interface UsersContextValue {
  users: User[]
  passwords: Record<string, string>
  addUser: (user: User, password: string) => void
  updateUser: (id: string, patch: Partial<User>) => void
  updatePassword: (id: string, newPassword: string) => void
}

const UsersContext = createContext<UsersContextValue | null>(null)

function buildInitialPasswords(): Record<string, string> {
  const map: Record<string, string> = {}
  for (const user of mockUsers) {
    const pwd = mockPasswords[user.email]
    if (pwd) map[user.id] = pwd
  }
  return map
}

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [passwords, setPasswords] = useState<Record<string, string>>(buildInitialPasswords)

  function addUser(user: User, password: string) {
    setUsers(prev => [...prev, user])
    setPasswords(prev => ({ ...prev, [user.id]: password }))
  }

  function updateUser(id: string, patch: Partial<User>) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u))
  }

  function updatePassword(id: string, newPassword: string) {
    setPasswords(prev => ({ ...prev, [id]: newPassword }))
  }

  return (
    <UsersContext.Provider value={{ users, passwords, addUser, updateUser, updatePassword }}>
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers(): UsersContextValue {
  const ctx = useContext(UsersContext)
  if (!ctx) throw new Error('useUsers must be used within UsersProvider')
  return ctx
}
