import { describe, it, expect } from 'vitest'
import { calcProgress } from '../components/slides/slideUtils'

describe('calcProgress', () => {
  it('returns 0 for 0 slides', () => expect(calcProgress(0, 0)).toBe(0))
  it('returns 0 for 1 slide', () => expect(calcProgress(0, 1)).toBe(0))
  it('returns 0 at index 0 of 8', () => expect(calcProgress(0, 8)).toBe(0))
  it('returns 100 at index 7 of 8', () => expect(calcProgress(7, 8)).toBe(100))
  it('returns 43 at index 3 of 8', () => expect(calcProgress(3, 8)).toBe(43))
})
