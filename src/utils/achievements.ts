import type { User, Lesson } from '../types'
import { computeLevel, isComplete } from './level'

export interface Achievement {
  key: string
  name: string
  icon: string
  unlockedAt?: string
}

export function computeAchievements(user: User, lessons: Lesson[]): Achievement[] {
  const result: Achievement[] = []
  const hasAnyProgress = Object.values(user.progress).some(v => v >= 1)
  const anyComplete = lessons.some(l => l.published && isComplete(l, user))
  const level = computeLevel(user, lessons)

  if (hasAnyProgress) {
    result.push({ key: 'first_slide', name: 'Поставил лапку в UnitSchool', icon: '🐾', unlockedAt: user.lastStreakDate })
  }
  if (anyComplete) {
    result.push({ key: 'first_course', name: 'Курс покорён', icon: '📘', unlockedAt: user.lastStreakDate })
  }
  if (user.streak >= 1) {
    result.push({ key: 'streak_ongoing', name: `Лапка за лапкой · день ${user.streak}`, icon: '📅', unlockedAt: user.lastStreakDate })
  }
  if (level !== 'novice') {
    result.push({ key: 'level_up', name: 'Открыл новый уровень', icon: '⬆️', unlockedAt: user.lastStreakDate })
  }
  if (level === 'middle' || level === 'senior') {
    result.push({ key: 'middle_am', name: 'Без паники, я аккаунт', icon: '💼' })
  }
  return result
}
