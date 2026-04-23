import type { Level, Lesson, User } from '../types'

export function isComplete(lesson: Lesson, user: User): boolean {
  const idx = user.progress[lesson.id]
  return idx !== undefined && idx >= lesson.slides.length - 1
}

export function computeLevel(user: User, lessons: Lesson[]): Level {
  if (user.level) return user.level
  const completed = lessons.filter(l => l.published && isComplete(l, user)).length
  if (completed >= 6) return 'senior'
  if (completed >= 3) return 'middle'
  if (completed >= 1) return 'junior'
  return 'novice'
}

export const LEVEL_LABELS: Record<Level, string> = {
  novice: 'Новичок',
  junior: 'Junior AM',
  middle: 'Middle AM',
  senior: 'Senior AM',
}

export const LEVEL_EMOJI: Record<Level, string> = {
  novice: '🌱',
  junior: '📗',
  middle: '📘',
  senior: '🏆',
}

export const LEVEL_ORDER: Level[] = ['novice', 'junior', 'middle', 'senior']

export const LEVEL_THRESHOLDS: Record<Level, number> = {
  novice: 0,
  junior: 1,
  middle: 3,
  senior: 6,
}
