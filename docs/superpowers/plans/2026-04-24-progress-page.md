# Progress Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/progress` page with a donut chart, streak heatmap, activity bar chart, growth path, all achievements, and peer comparison.

**Architecture:** Single page component `ProgressPage` with all logic inline — no new sub-components needed since existing `computeAchievements`, `computeLevel`, `LEVEL_ORDER/LABELS/THRESHOLDS` cover data needs. Charts are pure SVG/CSS (no new Recharts usage — too heavy for simple bar/donut). Peer data computed from `mockUsers` imported directly.

**Tech Stack:** React, TypeScript, CSS Modules, Vitest + Testing Library

---

## Chunk 1: Page skeleton + route

### Task 1: Create ProgressPage files and wire route

**Files:**
- Create: `src/pages/Progress/ProgressPage.tsx`
- Create: `src/pages/Progress/ProgressPage.module.css`
- Modify: `src/App.tsx:43`

- [ ] **Step 1: Create empty ProgressPage**

```tsx
// src/pages/Progress/ProgressPage.tsx
import { useAuth } from '../../context/AuthContext'
import { useLessons } from '../../context/LessonsContext'
import styles from './ProgressPage.module.css'

export function ProgressPage() {
  const { user } = useAuth()
  const { lessons } = useLessons()
  if (!user) return null

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Прогресс</h1>
    </div>
  )
}
```

- [ ] **Step 2: Create empty CSS module**

```css
/* src/pages/Progress/ProgressPage.module.css */
.page {
  max-width: 720px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: var(--usr-text-primary);
  margin: 0 0 4px;
}
```

- [ ] **Step 3: Wire route in App.tsx**

In `src/App.tsx`, add import:
```tsx
import { ProgressPage } from './pages/Progress/ProgressPage'
```

Replace line 43:
```tsx
// before:
<Route path="/progress" element={<PlaceholderPage title="Прогресс" />} />
// after:
<Route path="/progress" element={<ProgressPage />} />
```

- [ ] **Step 4: Run dev server and verify `/progress` renders without errors**

```bash
npm run dev
```
Navigate to `http://localhost:5173/progress` — should show "Прогресс" heading.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Progress/ProgressPage.tsx src/pages/Progress/ProgressPage.module.css src/App.tsx
git commit -m "feat(progress): scaffold ProgressPage and wire route"
```

---

## Chunk 2: Top row — Donut chart + Streak heatmap

### Task 2: Donut chart (courses completed)

**Files:**
- Modify: `src/pages/Progress/ProgressPage.tsx`
- Modify: `src/pages/Progress/ProgressPage.module.css`

The donut uses SVG `stroke-dasharray`. Circle radius 54, circumference = 2π×54 ≈ 339.3. Fill = (completed/total) × 339.3.

- [ ] **Step 1: Add data computation to ProgressPage**

Add after `if (!user) return null`:
```tsx
import { computeLevel, isComplete, LEVEL_LABELS, LEVEL_ORDER, LEVEL_THRESHOLDS } from '../../utils/level'
import { computeAchievements } from '../../utils/achievements'
import { mockUsers } from '../../data/users'

// inside component:
const publishedLessons = lessons.filter(l => l.published)
const completedCount = publishedLessons.filter(l => isComplete(l, user)).length
const totalCount = publishedLessons.length
const completedPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
const CIRC = 339.3
const dashFill = (completedCount / Math.max(totalCount, 1)) * CIRC
const dashGap = CIRC - dashFill
```

- [ ] **Step 2: Add donut JSX**

```tsx
<div className={styles.topRow}>
  <div className={styles.card}>
    <div className={styles.cardLabel}>Прогресс курсов</div>
    <div className={styles.donutWrap}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="54" fill="none" stroke="#f3f4f6" strokeWidth="16" />
        <circle
          cx="70" cy="70" r="54" fill="none"
          stroke="#597ef7" strokeWidth="16"
          strokeDasharray={`${dashFill} ${dashGap}`}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
        />
      </svg>
      <div className={styles.donutCenter}>
        <span className={styles.donutBig}>{completedCount}/{totalCount}</span>
        <span className={styles.donutSub}>курсов</span>
      </div>
    </div>
    <div className={styles.donutMeta}>{completedPct}% завершено</div>
  </div>

  {/* streak card goes here in Task 3 */}
</div>
```

- [ ] **Step 3: Add donut CSS**

```css
.topRow {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 12px;
}

.card {
  background: #fff;
  border: 1px solid var(--usr-card-border, #e5e7eb);
  border-radius: var(--radius-lg, 16px);
  padding: 16px;
}

.cardLabel {
  font-size: 11px;
  font-weight: 700;
  color: var(--usr-text-muted, #9ca3af);
  text-transform: uppercase;
  letter-spacing: .6px;
  margin-bottom: 12px;
}

.donutWrap {
  position: relative;
  display: flex;
  justify-content: center;
}

.donutCenter {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.donutBig {
  font-size: 22px;
  font-weight: 800;
  color: var(--usr-text-primary, #111827);
  line-height: 1;
}

.donutSub {
  font-size: 10px;
  color: var(--usr-text-muted, #9ca3af);
  margin-top: 2px;
}

.donutMeta {
  font-size: 11px;
  color: var(--usr-text-muted, #9ca3af);
  text-align: center;
  margin-top: 8px;
}
```

### Task 3: Streak heatmap

- [ ] **Step 1: Compute heatmap data**

Add to component (after previous data):
```tsx
// Build last-21-days activity grid from streak info
function buildHeatmap(streak: number, lastStreakDate?: string): boolean[] {
  const days: boolean[] = new Array(21).fill(false)
  if (!lastStreakDate || streak === 0) return days
  const last = new Date(lastStreakDate)
  // mark the last `streak` consecutive days as active (capped at 21)
  const active = Math.min(streak, 21)
  for (let i = 0; i < active; i++) {
    const dayIdx = 20 - i // 20 = today, going backwards
    if (dayIdx >= 0) days[dayIdx] = true
  }
  return days
}
const heatmap = buildHeatmap(user.streak, user.lastStreakDate)
```

- [ ] **Step 2: Add streak card JSX** (inside `.topRow`, after donut card)

```tsx
<div className={`${styles.card} ${styles.streakCard}`}>
  <div className={styles.cardLabel}>Стрик</div>
  <div className={styles.streakTop}>
    <span className={styles.streakFlame}>🔥</span>
    <div>
      <span className={styles.streakNum}>{user.streak}</span>
      <div className={styles.streakLbl}>дней подряд</div>
    </div>
  </div>
  <div className={styles.heatmapLabel}>Последние 3 недели</div>
  <div className={styles.heatmap}>
    {heatmap.map((active, i) => (
      <div
        key={i}
        className={`${styles.heatCell} ${active ? styles.heatActive : ''}`}
      />
    ))}
  </div>
  <div className={styles.heatLegend}>
    <span className={styles.heatDotEmpty} /> нет
    <span className={styles.heatDotActive} /> был
  </div>
</div>
```

- [ ] **Step 3: Add streak + heatmap CSS**

```css
.streakCard {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.streakTop {
  display: flex;
  align-items: center;
  gap: 10px;
}

.streakFlame { font-size: 32px; line-height: 1; }

.streakNum {
  font-size: 36px;
  font-weight: 800;
  color: #d97706;
  line-height: 1;
}

.streakLbl {
  font-size: 11px;
  color: #92400e;
  margin-top: 2px;
}

.heatmapLabel {
  font-size: 11px;
  font-weight: 700;
  color: var(--usr-text-muted, #9ca3af);
  text-transform: uppercase;
  letter-spacing: .6px;
}

.heatmap {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.heatCell {
  aspect-ratio: 1;
  border-radius: 4px;
  background: #f3f4f6;
}

.heatActive { background: #22c55e; }

.heatLegend {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 9px;
  color: var(--usr-text-muted, #9ca3af);
}

.heatDotEmpty,
.heatDotActive {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.heatDotEmpty { background: #f3f4f6; }
.heatDotActive { background: #22c55e; margin-left: 6px; }
```

- [ ] **Step 4: Verify top row renders correctly in browser**

- [ ] **Step 5: Commit**

```bash
git add src/pages/Progress/
git commit -m "feat(progress): add donut chart and streak heatmap"
```

---

## Chunk 3: Activity bar chart

### Task 4: 7-day activity bar chart

No real per-day tracking exists — generate mock data from `user.streak` and `user.progress` slide counts.

**Files:**
- Modify: `src/pages/Progress/ProgressPage.tsx`
- Modify: `src/pages/Progress/ProgressPage.module.css`

- [ ] **Step 1: Add mock activity data helper**

```tsx
const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function buildActivityData(streak: number): number[] {
  // 7 values (0–100), last `streak` days active with varied heights
  const base = [20, 55, 80, 40, 100, 15, 60]
  if (streak === 0) return new Array(7).fill(0)
  const active = Math.min(streak, 7)
  return base.map((v, i) => (i >= 7 - active ? v : 0))
}
const activityData = buildActivityData(user.streak)
const maxActivity = Math.max(...activityData, 1)
```

- [ ] **Step 2: Add bar chart JSX**

```tsx
<div className={styles.card}>
  <div className={styles.cardLabel}>Активность за неделю</div>
  <div className={styles.barChart}>
    {activityData.map((val, i) => (
      <div key={i} className={styles.barCol}>
        <div className={styles.barTrack}>
          <div
            className={styles.barFill}
            style={{ height: `${(val / maxActivity) * 100}%` }}
          />
        </div>
        <span className={`${styles.barLabel} ${i === activityData.length - 1 ? styles.barLabelToday : ''}`}>
          {DAY_LABELS[i]}
        </span>
      </div>
    ))}
  </div>
</div>
```

- [ ] **Step 3: Add bar chart CSS**

```css
.barChart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 80px;
}

.barCol {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
}

.barTrack {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

.barFill {
  width: 100%;
  min-height: 3px;
  background: #c7d2fe;
  border-radius: 4px 4px 0 0;
  transition: height .3s ease;
}

.barLabel {
  font-size: 9px;
  color: var(--usr-text-muted, #9ca3af);
  white-space: nowrap;
}

.barLabelToday {
  color: #597ef7;
  font-weight: 700;
}
```

- [ ] **Step 4: Verify chart renders**

- [ ] **Step 5: Commit**

```bash
git add src/pages/Progress/
git commit -m "feat(progress): add weekly activity bar chart"
```

---

## Chunk 4: Growth path

### Task 5: Growth path section

Horizontal steps with connector lines. Levels: novice → junior → middle → senior.
Show % progress toward next threshold using completed course count.

**Files:**
- Modify: `src/pages/Progress/ProgressPage.tsx`
- Modify: `src/pages/Progress/ProgressPage.module.css`

- [ ] **Step 1: Add path data computation**

```tsx
import { computeLevel, isComplete, LEVEL_LABELS, LEVEL_ORDER, LEVEL_THRESHOLDS } from '../../utils/level'

// inside component (after existing data):
const level = computeLevel(user, lessons)
const levelIdx = LEVEL_ORDER.indexOf(level)
const completedCourses = publishedLessons.filter(l => isComplete(l, user)).length

function levelPct(lvl: typeof LEVEL_ORDER[number]): number {
  const idx = LEVEL_ORDER.indexOf(lvl)
  const next = LEVEL_ORDER[idx + 1]
  if (!next) return 100
  const from = LEVEL_THRESHOLDS[lvl]
  const to = LEVEL_THRESHOLDS[next]
  return Math.round(Math.min(((completedCourses - from) / (to - from)) * 100, 100))
}
```

- [ ] **Step 2: Add path JSX**

```tsx
<div className={styles.card}>
  <div className={styles.cardLabel}>Путь развития</div>
  <div className={styles.pathRow}>
    {LEVEL_ORDER.filter(l => l !== 'novice').map((lvl, i) => {
      const absIdx = LEVEL_ORDER.indexOf(lvl)
      const isDone = absIdx < levelIdx
      const isCurrent = absIdx === levelIdx
      const pct = isCurrent ? levelPct(lvl) : undefined
      return (
        <div key={lvl} className={styles.pathStep}>
          {i > 0 && (
            <div className={`${styles.pathLine} ${isDone ? styles.pathLineDone : ''}`} />
          )}
          <div className={`${styles.pathDot} ${isDone ? styles.pathDotDone : isCurrent ? styles.pathDotCurrent : styles.pathDotNext}`}>
            {isDone ? '✓' : isCurrent && pct !== undefined ? `${pct}%` : '·'}
          </div>
          <span className={`${styles.pathLabel} ${isDone ? styles.pathLabelDone : isCurrent ? styles.pathLabelCurrent : styles.pathLabelNext}`}>
            {LEVEL_LABELS[lvl]}
          </span>
        </div>
      )
    })}
  </div>
</div>
```

- [ ] **Step 3: Add path CSS**

```css
.pathRow {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
}

.pathStep {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex: 1;
  position: relative;
}

.pathLine {
  position: absolute;
  top: 14px;
  right: 50%;
  left: -50%;
  height: 2px;
  background: #e5e7eb;
  z-index: 0;
}

.pathLineDone { background: #22c55e; }

.pathDot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  z-index: 1;
  position: relative;
}

.pathDotDone { background: #22c55e; color: white; }
.pathDotCurrent { background: #597ef7; color: white; font-size: 8px; }
.pathDotNext { background: #f3f4f6; color: #9ca3af; }

.pathLabel {
  font-size: 9px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
}

.pathLabelDone { color: #22c55e; }
.pathLabelCurrent { color: #597ef7; }
.pathLabelNext { color: #9ca3af; }
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/Progress/
git commit -m "feat(progress): add growth path section"
```

---

## Chunk 5: Achievements

### Task 6: All achievements (unlocked + locked)

`computeAchievements` only returns unlocked ones. Define a full list of all possible achievements so locked ones show greyed out.

**Files:**
- Modify: `src/pages/Progress/ProgressPage.tsx`
- Modify: `src/pages/Progress/ProgressPage.module.css`

- [ ] **Step 1: Define ALL_ACHIEVEMENTS constant and compute unlocked set**

Add inside component:
```tsx
const ALL_ACHIEVEMENTS = [
  { key: 'first_slide',    name: 'Поставил лапку в UnitSchool', icon: '🐾' },
  { key: 'first_course',   name: 'Курс покорён',                icon: '📘' },
  { key: 'streak_ongoing', name: 'Лапка за лапкой',             icon: '📅' },
  { key: 'level_up',       name: 'Открыл новый уровень',        icon: '⬆️' },
  { key: 'middle_am',      name: 'Без паники, я аккаунт',       icon: '💼' },
  { key: 'all_courses',    name: 'Мастер обучения',             icon: '🏆' },
  { key: 'streak_7',       name: '7 дней подряд',               icon: '🔥' },
  { key: 'streak_30',      name: 'Месяц не сдаётся',            icon: '⚡' },
]

const unlockedKeys = new Set(computeAchievements(user, lessons).map(a => a.key))
```

- [ ] **Step 2: Add achievements JSX**

```tsx
<div className={styles.card}>
  <div className={styles.cardLabel}>Достижения</div>
  <div className={styles.achGrid}>
    {ALL_ACHIEVEMENTS.map(a => {
      const unlocked = unlockedKeys.has(a.key)
      return (
        <div key={a.key} className={`${styles.achItem} ${unlocked ? '' : styles.achLocked}`}>
          <div className={styles.achIcon}>{a.icon}</div>
          <span className={styles.achName}>{a.name}</span>
        </div>
      )
    })}
  </div>
</div>
```

- [ ] **Step 3: Add achievements CSS**

```css
.achGrid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.achItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 64px;
}

.achLocked { opacity: .3; }

.achIcon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}

.achName {
  font-size: 8px;
  color: var(--usr-text-muted, #9ca3af);
  text-align: center;
  line-height: 1.3;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/Progress/
git commit -m "feat(progress): add achievements section"
```

---

## Chunk 6: Peer comparison

### Task 7: Peer comparison section

Compute % course completion for all mockUsers, show bars for «Я», «Среднее», «Лучший», plus a callout with percentile.

**Files:**
- Modify: `src/pages/Progress/ProgressPage.tsx`
- Modify: `src/pages/Progress/ProgressPage.module.css`

- [ ] **Step 1: Add peer data computation**

```tsx
import { mockUsers } from '../../data/users'

// inside component:
const regularUsers = mockUsers.filter(u => u.role !== 'admin')
function userCompletionPct(u: typeof user): number {
  if (totalCount === 0) return 0
  const done = publishedLessons.filter(l => isComplete(l, u)).length
  return Math.round((done / totalCount) * 100)
}

const peerPcts = regularUsers.map(userCompletionPct)
const myPct = completedPct
const avgPct = peerPcts.length > 0 ? Math.round(peerPcts.reduce((a, b) => a + b, 0) / peerPcts.length) : 0
const bestPct = Math.max(...peerPcts, 0)
const percentile = peerPcts.length > 0
  ? Math.round((peerPcts.filter(p => p <= myPct).length / peerPcts.length) * 100)
  : 100
```

- [ ] **Step 2: Add peer comparison JSX**

```tsx
<div className={styles.card}>
  <div className={styles.cardLabel}>Сравнение с командой</div>
  <div className={styles.peersGrid}>
    <div className={styles.peerBars}>
      {[
        { label: `Я (${myPct}%)`,          pct: myPct,  color: '#597ef7' },
        { label: `Среднее (${avgPct}%)`,    pct: avgPct, color: '#d1d5db' },
        { label: `Лучший (${bestPct}%)`,    pct: bestPct,color: '#86efac' },
      ].map(({ label, pct, color }) => (
        <div key={label} className={styles.peerRow}>
          <div className={styles.peerLabel}>{label}</div>
          <div className={styles.peerTrack}>
            <div className={styles.peerFill} style={{ width: `${pct}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
    <div className={styles.peerCallout}>
      <div className={styles.peerCalloutBig}>Топ {100 - percentile + 1}%</div>
      <div className={styles.peerCalloutLbl}>среди коллег</div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Add peer CSS**

```css
.peersGrid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: center;
}

.peerBars { display: flex; flex-direction: column; gap: 8px; }

.peerRow { display: flex; flex-direction: column; gap: 3px; }

.peerLabel {
  font-size: 10px;
  color: var(--usr-text-secondary, #374151);
}

.peerTrack {
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
}

.peerFill { height: 100%; border-radius: 4px; }

.peerCallout {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 14px 16px;
  text-align: center;
  white-space: nowrap;
}

.peerCalloutBig {
  font-size: 20px;
  font-weight: 800;
  color: #16a34a;
}

.peerCalloutLbl {
  font-size: 10px;
  color: #4b5563;
  margin-top: 2px;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/Progress/
git commit -m "feat(progress): add peer comparison section"
```

---

## Chunk 7: Test + final polish

### Task 8: Write smoke test for ProgressPage

**Files:**
- Create: `src/test/ProgressPage.test.tsx`

- [ ] **Step 1: Write test**

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { LessonsProvider } from '../context/LessonsContext'
import { AuthProvider } from '../context/AuthContext'
import { ProgressPage } from '../pages/Progress/ProgressPage'

beforeEach(() => localStorage.clear())

function renderProgress(user = {
  id: 'user-1', name: 'Соня', email: 'user@unitpay.ru', role: 'user',
  progress: {}, streak: 0
}) {
  localStorage.setItem('unit_school_user', JSON.stringify(user))
  return render(
    <UsersProvider><LessonsProvider><AuthProvider>
      <MemoryRouter><ProgressPage /></MemoryRouter>
    </AuthProvider></LessonsProvider></UsersProvider>
  )
}

describe('ProgressPage', () => {
  it('renders heading', () => {
    renderProgress()
    expect(screen.getByText('Прогресс')).toBeInTheDocument()
  })

  it('shows streak of 0 for new user', () => {
    renderProgress()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('shows streak days for active user', () => {
    renderProgress({ id: 'user-1', name: 'Соня', email: 'user@unitpay.ru', role: 'user',
      progress: { 'day-1': 7 }, streak: 15, lastStreakDate: '2026-04-24' })
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('shows Достижения section', () => {
    renderProgress()
    expect(screen.getByText('Достижения')).toBeInTheDocument()
  })

  it('shows peer comparison section', () => {
    renderProgress()
    expect(screen.getByText(/Сравнение с командой/)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests**

```bash
npm test -- src/test/ProgressPage.test.tsx
```
Expected: all 5 pass.

- [ ] **Step 3: Run full test suite to check no regressions**

```bash
npm test
```
Expected: all tests pass.

- [ ] **Step 4: Final visual check in browser**

Open `http://localhost:5173/progress` — verify all sections render, no overflow, no empty space.

- [ ] **Step 5: Commit**

```bash
git add src/test/ProgressPage.test.tsx
git commit -m "test(progress): add smoke tests for ProgressPage"
```
