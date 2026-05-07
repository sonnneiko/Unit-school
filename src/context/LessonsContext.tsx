import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Lesson } from '../types'
import { mockLessons } from '../data/lessons'

interface LessonsContextValue {
  lessons: Lesson[]
  togglePublished: (id: string) => void
}

const LessonsContext = createContext<LessonsContextValue | null>(null)

export function LessonsProvider({ children }: { children: ReactNode }) {
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons)

  function togglePublished(id: string) {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, published: !l.published } : l))
  }

  return (
    <LessonsContext.Provider value={{ lessons, togglePublished }}>
      {children}
    </LessonsContext.Provider>
  )
}

export function useLessons(): LessonsContextValue {
  const ctx = useContext(LessonsContext)
  if (!ctx) throw new Error('useLessons must be used within LessonsProvider')
  return ctx
}
