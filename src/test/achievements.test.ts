import { describe, it, expect } from 'vitest'
import { computeAchievements } from '../utils/achievements'
import type { Lesson, User } from '../types'

const slide = (id: string) => ({ id, type: 'info' as const, content: { heading: '', bullets: [] } })
function makeLesson(id: string, n: number): Lesson {
  return { id, title: id, tag: id, published: true, slides: Array.from({ length: n }, (_, i) => slide(`${id}-${i}`)) }
}
function makeUser(o: Partial<User> = {}): User {
  return { id: 'u1', name: 'T', email: 't@t.com', role: 'user', progress: {}, streak: 0, ...o }
}
const lessons = [makeLesson('l1', 8), makeLesson('l2', 5)]

describe('computeAchievements', () => {
  it('returns empty list for brand new user', () => {
    expect(computeAchievements(makeUser(), lessons)).toHaveLength(0)
  })

  it('unlocks first_slide after any progress', () => {
    const u = makeUser({ progress: { l1: 1 } })
    const keys = computeAchievements(u, lessons).map(a => a.key)
    expect(keys).toContain('first_slide')
  })

  it('does not unlock first_course until lesson complete', () => {
    const u = makeUser({ progress: { l1: 3 } })
    const keys = computeAchievements(u, lessons).map(a => a.key)
    expect(keys).not.toContain('first_course')
  })

  it('unlocks first_course when lesson complete', () => {
    const u = makeUser({ progress: { l1: 7 } })
    const keys = computeAchievements(u, lessons).map(a => a.key)
    expect(keys).toContain('first_course')
  })

  it('unlocks streak_ongoing when streak >= 1', () => {
    const u = makeUser({ streak: 3, lastStreakDate: '2026-04-23' })
    const achievements = computeAchievements(u, lessons)
    const a = achievements.find(x => x.key === 'streak_ongoing')
    expect(a).toBeTruthy()
    expect(a?.name).toContain('3')
  })

  it('does not unlock streak_ongoing when streak is 0', () => {
    const keys = computeAchievements(makeUser({ streak: 0 }), lessons).map(a => a.key)
    expect(keys).not.toContain('streak_ongoing')
  })

  it('unlocks level_up for junior level', () => {
    const u = makeUser({ progress: { l1: 7 } })
    const keys = computeAchievements(u, lessons).map(a => a.key)
    expect(keys).toContain('level_up')
  })

  it('does not unlock middle_am at junior level', () => {
    const u = makeUser({ progress: { l1: 7 } })
    const keys = computeAchievements(u, lessons).map(a => a.key)
    expect(keys).not.toContain('middle_am')
  })
})
