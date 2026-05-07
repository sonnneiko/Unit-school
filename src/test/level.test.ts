import { describe, it, expect } from 'vitest'
import { computeLevel, isComplete, LEVEL_LABELS, LEVEL_EMOJI } from '../utils/level'
import type { Lesson, User } from '../types'

const slide = (id: string) => ({ id, type: 'info' as const, content: { heading: '', bullets: [] } })

function makeLesson(id: string, slideCount: number, published = true): Lesson {
  return { id, title: id, tag: id, published, slides: Array.from({ length: slideCount }, (_, i) => slide(`${id}-${i}`)) }
}

function makeUser(progress: Record<string, number> = {}, overrides: Partial<User> = {}): User {
  return { id: 'u1', name: 'Test', email: 't@t.com', role: 'user', progress, streak: 0, ...overrides }
}

const l1 = makeLesson('l1', 8)   // complete at index 7
const l2 = makeLesson('l2', 5)   // complete at index 4
const l3 = makeLesson('l3', 3)
const l4 = makeLesson('l4', 3)
const l5 = makeLesson('l5', 3)
const l6 = makeLesson('l6', 3)
const allLessons = [l1, l2, l3, l4, l5, l6]

describe('isComplete', () => {
  it('returns false when no progress', () => {
    expect(isComplete(l1, makeUser())).toBe(false)
  })
  it('returns false on partial progress', () => {
    expect(isComplete(l1, makeUser({ l1: 3 }))).toBe(false)
  })
  it('returns true at last slide index', () => {
    expect(isComplete(l1, makeUser({ l1: 7 }))).toBe(true)
  })
  it('returns true beyond last slide index', () => {
    expect(isComplete(l1, makeUser({ l1: 9 }))).toBe(true)
  })
})

describe('computeLevel', () => {
  it('returns novice with 0 completions', () => {
    expect(computeLevel(makeUser(), allLessons)).toBe('novice')
  })
  it('returns junior with 1 completion', () => {
    expect(computeLevel(makeUser({ l1: 7 }), allLessons)).toBe('junior')
  })
  it('returns middle with 3 completions', () => {
    const u = makeUser({ l1: 7, l2: 4, l3: 2 })
    expect(computeLevel(u, allLessons)).toBe('middle')
  })
  it('returns senior with 6 completions', () => {
    const u = makeUser({ l1: 7, l2: 4, l3: 2, l4: 2, l5: 2, l6: 2 })
    expect(computeLevel(u, allLessons)).toBe('senior')
  })
  it('respects admin override', () => {
    const u = makeUser({}, { level: 'senior' })
    expect(computeLevel(u, allLessons)).toBe('senior')
  })
  it('ignores unpublished lessons for level', () => {
    const unpublished = makeLesson('u1', 3, false)
    const u = makeUser({ u1: 2 })
    expect(computeLevel(u, [unpublished])).toBe('novice')
  })
})

describe('LEVEL_LABELS', () => {
  it('has entries for all levels', () => {
    expect(LEVEL_LABELS.novice).toBe('Новичок')
    expect(LEVEL_LABELS.junior).toBe('Junior AM')
    expect(LEVEL_LABELS.middle).toBe('Middle AM')
    expect(LEVEL_LABELS.senior).toBe('Senior AM')
  })
})

describe('LEVEL_EMOJI', () => {
  it('has entries for all levels', () => {
    const levels = ['novice', 'junior', 'middle', 'senior'] as const
    levels.forEach(l => expect(LEVEL_EMOJI[l]).toBeTruthy())
  })
})
