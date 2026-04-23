# Dashboard Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the home page (DashboardPage) to show a hero "continue" block, growth path, achievements, and an engaging empty state with the Unit cat mascot.

**Architecture:** Pure computation utils (level, streak, achievements) feed the dashboard component tree. Two render paths: empty state (no progress) and in-progress state. All utils are pure functions tested with Vitest; components use CSS Modules matching the existing pattern.

**Tech Stack:** React 18, TypeScript, Vite, Vitest + React Testing Library, CSS Modules, react-router-dom

**Spec:** `docs/superpowers/specs/2026-04-23-dashboard-redesign-design.md`

---

## Chunk 1: Types, utils, and data

### Task 1: Extend types

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Add `Level` type alias and new `User` fields**

Open `src/types/index.ts` and make these changes:

After the existing imports/types, add:

```ts
export type Level = 'novice' | 'junior' | 'middle' | 'senior'
```

Update the `User` interface — add three fields:

```ts
export interface User {
  // ...existing fields...
  level?: Level        // admin override; absent = computed
  streak: number       // active days in a row; 0 = never or reset
  lastStreakDate?: string  // YYYY-MM-DD local date of last streak activity
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: Errors about `streak` missing from mock users (in `users.ts`). That is expected — fix in Task 5.

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat(types): add Level type and streak/level fields to User"
```

---

### Task 2: Create level utility (TDD)

**Files:**
- Create: `src/utils/level.ts`
- Create: `src/test/level.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/test/level.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/test/level.test.ts
```

Expected: Error — `Cannot find module '../utils/level'`

- [ ] **Step 3: Implement `src/utils/level.ts`**

```ts
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
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/test/level.test.ts
```

Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/utils/level.ts src/test/level.test.ts
git commit -m "feat(utils): add level computation utility"
```

---

### Task 3: Create streak utility (TDD)

**Files:**
- Create: `src/utils/streak.ts`
- Create: `src/test/streak.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/test/streak.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/test/streak.test.ts
```

Expected: Error — `Cannot find module '../utils/streak'`

- [ ] **Step 3: Implement `src/utils/streak.ts`**

```ts
import type { User } from '../types'

export function localToday(): string {
  return new Date().toLocaleDateString('sv')  // 'sv' locale = ISO YYYY-MM-DD in local tz
}

function localYesterday(): string {
  return new Date(Date.now() - 86400000).toLocaleDateString('sv')
}

export function updateStreak(user: User): Partial<User> {
  const today = localToday()
  if (user.lastStreakDate === today) return {}
  if (user.lastStreakDate === localYesterday()) {
    return { streak: user.streak + 1, lastStreakDate: today }
  }
  return { streak: 1, lastStreakDate: today }
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/test/streak.test.ts
```

Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/utils/streak.ts src/test/streak.test.ts
git commit -m "feat(utils): add streak tracking utility"
```

---

### Task 4: Create achievements utility (TDD)

**Files:**
- Create: `src/utils/achievements.ts`
- Create: `src/test/achievements.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/test/achievements.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/test/achievements.test.ts
```

Expected: Error — `Cannot find module '../utils/achievements'`

- [ ] **Step 3: Implement `src/utils/achievements.ts`**

```ts
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
  const anyComplete = lessons.some(l => isComplete(l, user))
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
    result.push({ key: 'level_up', name: 'Открыл новый уровень', icon: '⬆️' })
  }
  if (level === 'middle' || level === 'senior') {
    result.push({ key: 'middle_am', name: 'Без паники, я аккаунт', icon: '💼' })
  }
  return result
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/test/achievements.test.ts
```

Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/utils/achievements.ts src/test/achievements.test.ts
git commit -m "feat(utils): add achievements computation utility"
```

---

### Task 5: Update mock data and fix types

**Files:**
- Modify: `src/data/users.ts`

- [ ] **Step 1: Add `streak: 0` to all mock users**

In `src/data/users.ts`, add `streak: 0` to every user object in the `mockUsers` array. Example for first user:

```ts
{
  id: 'user-1',
  name: 'Соня Алхазова',
  email: 'user@unitpay.ru',
  role: 'user',
  progress: {},
  streak: 0,
  lastActive: '2026-04-20',
},
```

Add `streak: 0` to all 8 mock users. Do not change any other fields.

- [ ] **Step 2: Verify TypeScript compiles clean**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/data/users.ts
git commit -m "feat(data): add streak field to mock users"
```

---

### Task 6: Update AuthContext — streak integration + migration

**Files:**
- Modify: `src/context/AuthContext.tsx`

- [ ] **Step 1: Add migration guard in `loadUserFromStorage`**

Find `loadUserFromStorage` function. After `JSON.parse`, add streak migration before returning:

```ts
function loadUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as User
    if (parsed.streak === undefined) parsed.streak = 0  // migration for old sessions
    return parsed
  } catch {
    return null
  }
}
```

- [ ] **Step 2: Import `updateStreak` and call it in `updateProgress`**

Add import at top of file:

```ts
import { updateStreak } from '../utils/streak'
```

Update `updateProgress` function to apply streak changes:

```ts
function updateProgress(lessonId: string, slideIndex: number) {
  setUser(prev => {
    if (!prev) return prev
    const streakChanges = updateStreak(prev)
    const updated = {
      ...prev,
      ...streakChanges,
      progress: { ...prev.progress, [lessonId]: slideIndex },
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  })
}
```

- [ ] **Step 3: Verify TypeScript compiles clean**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 4: Run all existing tests**

```bash
npx vitest run
```

Expected: All existing tests pass (AuthContext tests, etc.)

- [ ] **Step 5: Commit**

```bash
git add src/context/AuthContext.tsx
git commit -m "feat(auth): integrate streak tracking into updateProgress"
```

---

## Chunk 2: Components

### Task 7: GrowthPath component

**Files:**
- Create: `src/components/GrowthPath/GrowthPath.tsx`
- Create: `src/components/GrowthPath/GrowthPath.module.css`

- [ ] **Step 1: Create CSS module**

Create `src/components/GrowthPath/GrowthPath.module.css`:

```css
.card {
  background: var(--usr-card-bg);
  border: 1px solid var(--usr-card-border);
  border-radius: var(--radius-md);
  padding: 16px 20px;
}

.label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--usr-text-muted);
  margin-bottom: 12px;
}

.path {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  flex-wrap: wrap;
}

.arrow {
  color: var(--usr-card-border);
  font-size: 14px;
  margin-top: 4px;
  flex-shrink: 0;
}

.stepWrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.step {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  white-space: nowrap;
}

.stepDone {
  background: #eef1fe;
  color: #3d5bd9;
}

.stepCurrent {
  background: #597ef7;
  color: #ffffff;
}

.stepNext {
  background: var(--usr-badge-bg);
  color: var(--usr-text-muted);
}

.stepSub {
  font-size: 9px;
  text-align: center;
}

.stepSubDone  { color: #3d5bd9; }
.stepSubCurrent { color: #597ef7; }
.stepSubNext  { color: var(--usr-text-muted); }
```

- [ ] **Step 2: Create component**

Create `src/components/GrowthPath/GrowthPath.tsx`:

```tsx
import React from 'react'
import type { Lesson, User } from '../../types'
import { computeLevel, LEVEL_LABELS, LEVEL_ORDER, LEVEL_THRESHOLDS } from '../../utils/level'
import styles from './GrowthPath.module.css'

interface Props {
  user: User
  lessons: Lesson[]
}

export function GrowthPath({ user, lessons }: Props) {
  const current = computeLevel(user, lessons)
  const currentIdx = LEVEL_ORDER.indexOf(current)

  return (
    <div className={styles.card}>
      <div className={styles.label}>Твой путь развития</div>
      <div className={styles.path}>
        {LEVEL_ORDER.map((level, i) => {
          const isDone = i < currentIdx
          const isCurrent = i === currentIdx
          const threshold = LEVEL_THRESHOLDS[level]

          return (
            <React.Fragment key={level}>
              {i > 0 && <span className={styles.arrow}>→</span>}
              <div className={styles.stepWrap}>
                <span className={`${styles.step} ${isDone ? styles.stepDone : isCurrent ? styles.stepCurrent : styles.stepNext}`}>
                  {isDone ? '✓ ' : isCurrent ? '● ' : '○ '}{LEVEL_LABELS[level]}
                </span>
                <span className={`${styles.stepSub} ${isDone ? styles.stepSubDone : isCurrent ? styles.stepSubCurrent : styles.stepSubNext}`}>
                  {isDone && 'пройдено'}
                  {isCurrent && 'сейчас'}
                  {!isDone && !isCurrent && `нужно ${threshold} курса`}
                </span>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/GrowthPath/
git commit -m "feat(components): add GrowthPath component"
```

---

### Task 8: AchievementBadge component

**Files:**
- Create: `src/components/AchievementBadge/AchievementBadge.tsx`
- Create: `src/components/AchievementBadge/AchievementBadge.module.css`

- [ ] **Step 1: Create CSS module**

Create `src/components/AchievementBadge/AchievementBadge.module.css`:

```css
.row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid var(--usr-badge-bg);
}

.row:last-child {
  border-bottom: none;
}

.icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #eef1fe;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.text {
  flex: 1;
}

.name {
  font-size: 12px;
  font-weight: 600;
  color: var(--usr-text-primary);
}

.date {
  font-size: 10px;
  color: var(--usr-text-muted);
  margin-top: 1px;
}
```

- [ ] **Step 2: Create component**

Create `src/components/AchievementBadge/AchievementBadge.tsx`:

```tsx
import type { Achievement } from '../../utils/achievements'
import styles from './AchievementBadge.module.css'

interface Props {
  achievement: Achievement
}

export function AchievementBadge({ achievement }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.icon}>{achievement.icon}</div>
      <div className={styles.text}>
        <div className={styles.name}>{achievement.name}</div>
        {achievement.unlockedAt && (
          <div className={styles.date}>{achievement.unlockedAt}</div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 4: Commit**

```bash
git add src/components/AchievementBadge/
git commit -m "feat(components): add AchievementBadge component"
```

---

## Chunk 3: Dashboard page rewrite

### Task 9: Dashboard CSS

**Files:**
- Modify: `src/pages/Dashboard/Dashboard.module.css`

- [ ] **Step 1: Replace CSS file entirely**

Replace contents of `src/pages/Dashboard/Dashboard.module.css`:

```css
.page {
  padding: 32px 40px;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Hero banner (shared between empty + in-progress) ── */
.hero {
  background: var(--usr-card-bg);
  border: 1px solid var(--usr-card-border);
  border-left: 4px solid #597ef7;
  border-radius: var(--radius-md);
  display: flex;
  align-items: stretch;
  min-height: 148px;
  position: relative;
  overflow: hidden;
}

.heroContent {
  padding: 22px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
}

.heroTitle {
  font-size: 15px;
  font-weight: 700;
  color: var(--usr-text-primary);
  line-height: 1.3;
}

.heroSub {
  font-size: 12px;
  color: var(--usr-text-muted);
  line-height: 1.5;
}

.heroCat {
  width: 150px;
  flex-shrink: 0;
  position: relative;
}

.heroCat img {
  position: absolute;
  bottom: -18px;
  right: 4px;
  height: 185px;
  width: auto;
  mix-blend-mode: multiply;
}

/* ── Level badge + hint row ── */
.levelRow {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.levelBadge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #eef1fe;
  border: 1px solid #c7d2fe;
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 11px;
  color: #3d5bd9;
  font-weight: 600;
}

.levelHint {
  font-size: 11px;
  color: var(--usr-text-muted);
}

/* ── Continue row (lesson + button) ── */
.continueRow {
  display: flex;
  align-items: center;
  gap: 16px;
}

.continueInfo {
  flex: 1;
}

.continueTitle {
  font-size: 12px;
  font-weight: 600;
  color: var(--usr-text-secondary);
  margin-bottom: 5px;
}

.progressMeta {
  font-size: 10px;
  color: var(--usr-text-muted);
  margin-top: 3px;
}

/* ── Congrats state ── */
.congrats {
  font-size: 15px;
  font-weight: 700;
  color: var(--usr-text-primary);
}

.congratsSub {
  font-size: 12px;
  color: var(--usr-text-muted);
}

/* ── Two-column grid ── */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* ── Generic card ── */
.card {
  background: var(--usr-card-bg);
  border: 1px solid var(--usr-card-border);
  border-radius: var(--radius-md);
  padding: 16px 20px;
}

.cardLabel {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--usr-text-muted);
  margin-bottom: 10px;
}

/* ── Course rows ── */
.courseRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 0;
  border-bottom: 1px solid var(--usr-badge-bg);
  gap: 8px;
}

.courseRow:last-child {
  border-bottom: none;
}

.courseName {
  font-size: 12px;
  font-weight: 600;
  color: var(--usr-text-primary);
  margin-bottom: 3px;
}

.courseRowLocked {
  opacity: 0.45;
}

/* ── Badges ── */
.badgeBlue {
  background: #eef1fe;
  color: #3d5bd9;
  font-size: 9px;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.badgeGray {
  background: var(--usr-badge-bg);
  color: var(--usr-text-muted);
  font-size: 9px;
  padding: 2px 8px;
  border-radius: 8px;
  white-space: nowrap;
  flex-shrink: 0;
}

.badgeGreen {
  background: #dcfce7;
  color: #16a34a;
  font-size: 9px;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── CTA button ── */
.btn {
  background: #597ef7;
  color: #fff;
  border-radius: var(--radius-sm);
  padding: 9px 18px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  border: none;
  font-family: inherit;
}

.btn:disabled {
  opacity: 0.5;
  cursor: default;
}

/* ── Empty achievements ── */
.emptyAchievements {
  font-size: 12px;
  color: var(--usr-text-muted);
  text-align: center;
  padding: 16px 0;
}

/* ── Progress bar (inline, not using ProgressBar component) ── */
.bar {
  height: 4px;
  background: var(--usr-card-border);
  border-radius: 2px;
}

.barFill {
  height: 4px;
  background: #597ef7;
  border-radius: 2px;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/pages/Dashboard/Dashboard.module.css
git commit -m "feat(dashboard): add dashboard CSS module"
```

---

### Task 10: Dashboard page rewrite

**Files:**
- Modify: `src/pages/Dashboard/Dashboard.tsx`

- [ ] **Step 1: Rewrite `Dashboard.tsx`**

Replace contents of `src/pages/Dashboard/Dashboard.tsx`:

```tsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLessons } from '../../context/LessonsContext'
import { computeLevel, isComplete, LEVEL_LABELS, LEVEL_EMOJI, LEVEL_ORDER, LEVEL_THRESHOLDS } from '../../utils/level'
import { computeAchievements } from '../../utils/achievements'
import { calcProgress } from '../../components/slides/slideUtils'
import { GrowthPath } from '../../components/GrowthPath/GrowthPath'
import { AchievementBadge } from '../../components/AchievementBadge/AchievementBadge'
import catImg from '../../assets/unit-cat/Unitpay Cat 1.png'
import styles from './Dashboard.module.css'
import type { Lesson } from '../../types'

export function DashboardPage() {
  const { user } = useAuth()
  const { lessons } = useLessons()
  const navigate = useNavigate()

  if (!user) return null

  const hasProgress = Object.keys(user.progress).length > 0
  const achievements = computeAchievements(user, lessons)
  const level = computeLevel(user, lessons)
  const nextLevel = LEVEL_ORDER[LEVEL_ORDER.indexOf(level) + 1]

  const publishedLessons = lessons.filter(l => l.published)
  const firstPublished = publishedLessons[0]

  function getContinueLesson(): Lesson | null {
    const inProgress = publishedLessons.filter(l => {
      const idx = user!.progress[l.id]
      return idx !== undefined && idx > 0 && !isComplete(l, user!)
    })
    if (inProgress.length > 0) {
      return inProgress.reduce((a, b) =>
        (user!.progress[b.id] ?? 0) > (user!.progress[a.id] ?? 0) ? b : a
      )
    }
    return null
  }

  const continueLesson = getContinueLesson()
  const allComplete = publishedLessons.every(l => isComplete(l, user))
  const unpublishedLessons = lessons.filter(l => !l.published)

  function courseBadge(lesson: Lesson) {
    const idx = user!.progress[lesson.id]
    if (idx === undefined || idx === 0) return <span className={styles.badgeBlue}>Начать</span>
    if (isComplete(lesson, user!)) return <span className={styles.badgeGreen}>Завершён</span>
    return <span className={styles.badgeBlue}>В процессе</span>
  }

  // ── EMPTY STATE ──
  if (!hasProgress) {
    return (
      <div className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroTitle}>Привет! Я Юнит — твой гид в мире UnitPay 🐾</div>
            <div className={styles.heroSub}>Начни своё обучение в UnitSchool</div>
            <button
              className={styles.btn}
              style={{ marginTop: 6, alignSelf: 'flex-start' }}
              onClick={() => firstPublished && navigate(`/lesson/${firstPublished.id}`)}
            >
              Начать обучение →
            </button>
          </div>
          <div className={styles.heroCat}>
            <img src={catImg} alt="Юнит" />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>С чего начать</div>
          {publishedLessons.map(lesson => (
            <div key={lesson.id} className={styles.courseRow}>
              <span className={styles.courseName}>{lesson.title}</span>
              <span
                className={styles.badgeBlue}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
              >
                Начать
              </span>
            </div>
          ))}
          {unpublishedLessons.map(lesson => (
            <div key={lesson.id} className={`${styles.courseRow} ${styles.courseRowLocked}`}>
              <span className={styles.courseName}>{lesson.title}</span>
              <span className={styles.badgeGray}>Скоро</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── IN PROGRESS STATE ──
  const completedCount = publishedLessons.filter(l => isComplete(l, user)).length
  const coursesToNextLevel = nextLevel ? Math.max(0, LEVEL_THRESHOLDS[nextLevel] - completedCount) : 0

  return (
    <div className={styles.page}>

      {/* Hero block */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.levelRow}>
            <span className={styles.levelBadge}>
              {LEVEL_EMOJI[level]} {LEVEL_LABELS[level]}
            </span>
            {nextLevel && (
              <span className={styles.levelHint}>
                → до {LEVEL_LABELS[nextLevel]}: {coursesToNextLevel} {coursesToNextLevel === 1 ? 'курс' : 'курса'}
              </span>
            )}
          </div>

          {allComplete ? (
            <>
              <div className={styles.congrats}>Ты прошёл все доступные курсы! 🎉</div>
              <div className={styles.congratsSub}>Новые курсы скоро появятся</div>
            </>
          ) : continueLesson ? (
            <>
              <div className={styles.heroTitle}>Продолжи с места, где остановился</div>
              <div className={styles.continueRow}>
                <div className={styles.continueInfo}>
                  <div className={styles.continueTitle}>{continueLesson.title}</div>
                  <div className={styles.bar}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${calcProgress(user.progress[continueLesson.id] ?? 0, continueLesson.slides.length)}%` }}
                    />
                  </div>
                  <div className={styles.progressMeta}>
                    Слайд {(user.progress[continueLesson.id] ?? 0) + 1} из {continueLesson.slides.length}
                    {' · '}
                    {calcProgress(user.progress[continueLesson.id] ?? 0, continueLesson.slides.length)}%
                  </div>
                </div>
                <button className={styles.btn} onClick={() => navigate(`/lesson/${continueLesson.id}`)}>
                  Продолжить →
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.heroTitle}>Продолжи с места, где остановился</div>
              <div className={styles.continueRow}>
                <div className={styles.continueInfo}>
                  <div className={styles.continueTitle}>{unpublishedLessons[0]?.title ?? 'Следующий курс'}</div>
                  <div className={styles.progressMeta}>Скоро откроется</div>
                </div>
                <button className={styles.btn} disabled>Скоро →</button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Growth path */}
      <GrowthPath user={user} lessons={lessons} />

      {/* Courses + Achievements */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Курсы</div>
          {publishedLessons.map(lesson => (
            <div key={lesson.id} className={styles.courseRow}>
              <div style={{ flex: 1 }}>
                <div className={styles.courseName}>{lesson.title}</div>
                {user.progress[lesson.id] !== undefined && (
                  <div className={styles.bar} style={{ marginTop: 4 }}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${calcProgress(user.progress[lesson.id], lesson.slides.length)}%` }}
                    />
                  </div>
                )}
              </div>
              {courseBadge(lesson)}
            </div>
          ))}
          {unpublishedLessons.map(lesson => (
            <div key={lesson.id} className={`${styles.courseRow} ${styles.courseRowLocked}`}>
              <span className={styles.courseName}>{lesson.title}</span>
              <span className={styles.badgeGray}>Скоро</span>
            </div>
          ))}
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Последние достижения</div>
          {achievements.length === 0 ? (
            <div className={styles.emptyAchievements}>Пока нет достижений — начни обучение!</div>
          ) : (
            achievements.map(a => <AchievementBadge key={a.key} achievement={a} />)
          )}
        </div>
      </div>

    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors. If Vite can't find the PNG import, add `/// <reference types="vite/client" />` to `src/vite-env.d.ts` (should already exist).

- [ ] **Step 3: Start dev server and verify visually**

```bash
npm run dev
```

Open http://localhost:5173, log in as `user@unitpay.ru` / `password123`.

Check:
- Empty state: see cat banner, "Начать обучение" button, course list
- Click "Начать обучение" → navigates to lesson
- After starting lesson, go back to home → hero shows "Продолжи с места" with progress bar
- Growth path shows correct level
- Achievements appear after progress

- [ ] **Step 4: Commit**

```bash
git add src/pages/Dashboard/Dashboard.tsx
git commit -m "feat(dashboard): rewrite home page with hero, growth path, and achievements"
```

---

### Task 11: Update existing Dashboard tests

**Files:**
- Modify: `src/test/Dashboard.test.tsx`

- [ ] **Step 1: Update tests to match new UI**

Replace contents of `src/test/Dashboard.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { LessonsProvider } from '../context/LessonsContext'
import { AuthProvider } from '../context/AuthContext'
import { DashboardPage } from '../pages/Dashboard/Dashboard'
import type { User } from '../types'

beforeEach(() => localStorage.clear())

function renderDashboard(user: Partial<User> & Pick<User, 'id' | 'name' | 'email' | 'role' | 'progress'> = {
  id: 'user-1', name: 'Соня Алхазова', email: 'user@unitpay.ru', role: 'user', progress: {},
}) {
  const fullUser: User = { streak: 0, ...user }
  localStorage.setItem('unit_school_user', JSON.stringify(fullUser))
  return render(
    <UsersProvider>
      <LessonsProvider>
        <AuthProvider>
          <MemoryRouter>
            <DashboardPage />
          </MemoryRouter>
        </AuthProvider>
      </LessonsProvider>
    </UsersProvider>
  )
}

describe('DashboardPage — empty state', () => {
  it('shows cat welcome banner', () => {
    renderDashboard()
    expect(screen.getByText(/Привет! Я Юнит/)).toBeInTheDocument()
  })

  it('shows start button', () => {
    renderDashboard()
    expect(screen.getByText(/Начать обучение/)).toBeInTheDocument()
  })

  it('shows Day 2 as coming soon', () => {
    renderDashboard()
    expect(screen.getAllByText('Скоро').length).toBeGreaterThan(0)
  })
})

describe('DashboardPage — in progress state', () => {
  it('shows continue hero when lesson in progress', () => {
    renderDashboard({ id: 'user-1', name: 'Соня', email: 'user@unitpay.ru', role: 'user', progress: { 'day-1': 3 }, streak: 0 })
    expect(screen.getByText(/Продолжи с места/)).toBeInTheDocument()
  })

  it('shows growth path', () => {
    renderDashboard({ id: 'user-1', name: 'Соня', email: 'user@unitpay.ru', role: 'user', progress: { 'day-1': 3 }, streak: 0 })
    expect(screen.getByText(/Твой путь развития/)).toBeInTheDocument()
  })

  it('shows achievements section', () => {
    renderDashboard({ id: 'user-1', name: 'Соня', email: 'user@unitpay.ru', role: 'user', progress: { 'day-1': 3 }, streak: 0 })
    expect(screen.getByText(/достижени/i)).toBeInTheDocument()
  })

  it('unlocks first_slide achievement after progress', () => {
    renderDashboard({ id: 'user-1', name: 'Соня', email: 'user@unitpay.ru', role: 'user', progress: { 'day-1': 3 }, streak: 0 })
    expect(screen.getByText(/Поставил лапку/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run all tests**

```bash
npx vitest run
```

Expected: All tests pass

- [ ] **Step 3: Final build check**

```bash
npm run build
```

Expected: Build completes without errors

- [ ] **Step 4: Final commit**

```bash
git add src/test/Dashboard.test.tsx
git commit -m "test(dashboard): update dashboard tests for new UI"
```
