import type { Level, Lesson, User } from '../types'

export function isComplete(lesson: Lesson, user: User): boolean {
  const idx = user.progress[lesson.id]
  return idx !== undefined && idx >= lesson.slides.length - 1
}

const BASICS_LESSON_IDS = [
  'unitpay-basics-team', 'unitpay-basics-about', 'unitpay-basics-methods',
  'unitpay-basics-path', 'unitpay-basics-merchant', 'unitpay-basics-payment-page',
  'unitpay-basics-banks', 'unitpay-basics-kassa', 'unitpay-basics-acquiring',
  'unitpay-basics-entities', 'unitpay-basics-vendors',
  'accounting-intro', 'accounting-tools', 'accounting-chats',
]

export function computeLevel(user: User, lessons: Lesson[]): Level {
  const lessonMap = new Map(lessons.map(l => [l.id, l]))
  const done = (id: string) => { const l = lessonMap.get(id); return l ? isComplete(l, user) : false }
  if (BASICS_LESSON_IDS.every(id => done(id))) return 'junior'
  return user.level ?? 'novice'
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
  junior: 14,
  middle: 25,
  senior: 999,
}

export const LESSON_BLOCK_TITLE: Record<string, string> = {
  'unitpay-basics-team':         'Основы UnitPay',
  'unitpay-basics-about':        'Основы UnitPay',
  'unitpay-basics-methods':      'Основы UnitPay',
  'unitpay-basics-path':         'Основы UnitPay',
  'unitpay-basics-merchant':     'Основы UnitPay',
  'unitpay-basics-payment-page': 'Основы UnitPay',
  'unitpay-basics-banks':        'Основы UnitPay',
  'unitpay-basics-kassa':        'Основы UnitPay',
  'unitpay-basics-acquiring':    'Основы UnitPay',
  'unitpay-basics-entities':     'Основы UnitPay',
  'unitpay-basics-vendors':      'Основы UnitPay',
  'accounting-intro':            'Аккаунтинг',
  'accounting-tools':            'Аккаунтинг',
  'accounting-chats':            'Аккаунтинг',
}

// Hint shown in GrowthPath for what's needed to reach the next level
export const LEVEL_NEXT_HINT: Partial<Record<Level, string>> = {
  novice: 'Пройди Аккаунтинг',
  junior: 'Пройди все блоки Middle AM',
}
