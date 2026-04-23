import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { updateStreak, localToday } from '../utils/streak'
import type { User } from '../types'

function makeUser(overrides: Partial<User> = {}): User {
  return { id: 'u1', name: 'T', email: 't@t.com', role: 'user', progress: {}, streak: 0, ...overrides }
}

function fakeDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  vi.setSystemTime(d)
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('localToday', () => {
  it('returns YYYY-MM-DD string', () => {
    fakeDate('2026-04-23')
    expect(localToday()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('updateStreak', () => {
  it('starts streak at 1 for new user', () => {
    fakeDate('2026-04-23')
    const result = updateStreak(makeUser())
    expect(result).toEqual({ streak: 1, lastStreakDate: '2026-04-23' })
  })

  it('does not change streak if already active today', () => {
    fakeDate('2026-04-23')
    const user = makeUser({ streak: 5, lastStreakDate: '2026-04-23' })
    expect(updateStreak(user)).toEqual({})
  })

  it('increments streak for consecutive day', () => {
    fakeDate('2026-04-23')
    const user = makeUser({ streak: 3, lastStreakDate: '2026-04-22' })
    expect(updateStreak(user)).toEqual({ streak: 4, lastStreakDate: '2026-04-23' })
  })

  it('resets streak after gap', () => {
    fakeDate('2026-04-23')
    const user = makeUser({ streak: 10, lastStreakDate: '2026-04-20' })
    expect(updateStreak(user)).toEqual({ streak: 1, lastStreakDate: '2026-04-23' })
  })
})
