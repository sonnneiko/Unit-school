# Dashboard (Главная) Redesign — Design Spec

**Date:** 2026-04-23  
**Status:** Approved

## Goal

Replace the current flat lesson grid with a rich home page that answers three questions for the user:
- What should I do right now?
- Where is my progress?
- What will open next?

## Visual Style

- Brand color: `#597ef7` (blue, same as admin panel)
- Card background: `#ffffff`, page background: `#f9fafb`
- Border: `#e5e7eb`, radius: `10px`
- Accent left border on hero block: `4px solid #597ef7`
- Font: Manrope (existing)

---

## State 1: New User (no progress)

Shown when `user.progress` is empty (no keys at all).

### Hero Banner

White card with blue left border, flex row:

**Left side:**
- Heading: "Привет! Я Юнит — твой гид в мире UnitPay 🐾"
- Subtext (muted gray `#9ca3af`): "Начни своё обучение в UnitSchool"
- Button "Начать обучение →" — navigates to `/lesson/<first-published-lesson-id>`
  (find first lesson where `lesson.published === true`, use `navigate(\`/lesson/${lesson.id}\`)`)

**Right side:**
- Image: `src/assets/unit-cat/Unitpay Cat 1.png`
- `mix-blend-mode: multiply` (removes white background without extra processing)
- `position: absolute; bottom: -18px` so legs align with banner bottom edge, drop-shadow clips cleanly
- Container background: `#fff` (matches card)

### Below hero: Course list card

Label "С чего начать", lists all lessons:
- Published: name + blue "Начать" badge (links to `/lesson/${lesson.id}`)
- Unpublished: name + gray "Скоро" badge + `opacity: 0.4`

---

## State 2: User In Progress

Shown when `Object.keys(user.progress).length > 0`.

### Block 1 — Hero "Continue" (full width)

White card with blue left border (`border-left: 4px solid #597ef7`):
- Row 1: Level badge (e.g. `🌱 Новичок`) + muted hint "→ до Junior AM: 2 курса"
- Row 2: Heading "Продолжи с места, где остановился"
- Row 3: Lesson title | progress bar | "Слайд X из Y · Z%" | Button "Продолжить →" → `navigate(\`/lesson/${lesson.id}\`)`

**Hero lesson selection logic:**
1. Find lessons where `progress[id] > 0` and not yet complete (see completion definition below)
2. If multiple, pick the one with the highest `progress[id]` (furthest along)
3. If all started lessons are complete and there are unpublished lessons → show first unpublished with "Скоро" badge and disabled button
4. If all lessons complete and none unpublished → show congratulations state: "Ты прошёл все доступные курсы! 🎉" + "Новые курсы скоро появятся" (no button)

**Completion definition (canonical, used by all utils):**
A course is complete when `progress[lesson.id] >= lesson.slides.length - 1`.
This means the user has reached the last slide index (0-based). Used identically in `level.ts` and `achievements.ts`.

### Block 2 — Growth Path (full width card)

Label "Твой путь развития", horizontal step chain:

```
✓ Новичок  →  ● Junior AM (сейчас)  →  ○ Middle AM (нужно 3 курса)  →  ○ Senior AM (нужно 6 курсов)
```

Step styles:
- Done: `background: #eef1fe`, `color: #3d5bd9`
- Current: `background: #597ef7`, `color: #fff`
- Next: `background: #f3f4f6`, `color: #9ca3af` + subtitle "нужно N курсов"

**Level display label map** (defined in `src/utils/level.ts`, exported alongside `computeLevel`):
```ts
export const LEVEL_LABELS: Record<Level, string> = {
  novice:  'Новичок',
  junior:  'Junior AM',
  middle:  'Middle AM',
  senior:  'Senior AM',
}

export const LEVEL_EMOJI: Record<Level, string> = {
  novice: '🌱',
  junior: '📗',
  middle: '📘',
  senior: '🏆',
}
```

### Block 3 — Two columns

**Left: Courses**
- Each published lesson: name, progress bar, status badge
  - Not started: blue "Начать" badge
  - In progress: blue-light "В процессе" badge
  - Completed: green-light "Завершён" badge
- Each unpublished: name, 0.4 opacity, gray "Скоро" badge

**Right: Achievements**
- Only unlocked achievements shown (no locked previews)
- Each: icon on `#eef1fe` background + name + date unlocked
- If no achievements yet: muted text "Пока нет достижений — начни обучение!"

---

## Data Model Changes

### User type additions (`src/types/index.ts`)

```typescript
level?: 'novice' | 'junior' | 'middle' | 'senior'  // admin override; if absent, computed
streak: number           // current active days in a row; defaults to 0
lastStreakDate?: string  // ISO local date (YYYY-MM-DD) of last streak activity
```

`streak` is **non-optional** (`streak: number`, not `streak?: number`).

**localStorage migration:** `loadUserFromStorage` in `AuthContext.tsx` must handle old sessions that lack `streak`. Add after parsing:
```ts
if (parsed.streak === undefined) parsed.streak = 0
```

All mock users in `src/data/users.ts` get `streak: 0` added.

### Level type alias

Add to `src/types/index.ts`:
```ts
export type Level = 'novice' | 'junior' | 'middle' | 'senior'
```

### Level computation (`src/utils/level.ts`)

`computeLevel` is the **single source of truth** — always call this function, never check `user.level` directly at call sites:

```ts
export function computeLevel(user: User, lessons: Lesson[]): Level {
  if (user.level) return user.level  // admin override wins
  const completed = lessons.filter(l => l.published && isComplete(l, user)).length
  if (completed >= 6) return 'senior'
  if (completed >= 3) return 'middle'
  if (completed >= 1) return 'junior'
  return 'novice'
}
```

Thresholds (subject to change when more courses are added):
- `novice`: 0 completed published courses
- `junior`: 1+
- `middle`: 3+
- `senior`: 6+

### Streak logic (`src/utils/streak.ts`)

Uses **local date** to avoid UTC midnight mismatch:
```ts
function today(): string {
  return new Date().toLocaleDateString('sv')  // 'sv' locale = ISO format (YYYY-MM-DD) in local tz
}
```

On every `updateProgress` call in `AuthContext.tsx`, call `updateStreak(user)` before saving:

```ts
export function updateStreak(user: User): Partial<User> {
  const t = today()
  const last = user.lastStreakDate
  if (last === t) return {}  // already counted today
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('sv')
  if (last === yesterday) {
    return { streak: user.streak + 1, lastStreakDate: t }
  }
  return { streak: 1, lastStreakDate: t }
}
```

Returns only the changed fields; caller merges into user object.

---

## Achievements (`src/utils/achievements.ts`)

Hardcoded, computed from current user+lessons state. Not persisted — recomputed on render.

```ts
export interface Achievement {
  key: string
  name: string
  icon: string
  unlockedAt?: string  // display date string, e.g. user.lastStreakDate or lastActive
}
```

| Key | Name | Icon | Criteria |
|-----|------|------|----------|
| `first_slide` | Поставил лапку в UnitSchool | 🐾 | Any `progress[id] >= 1` |
| `first_course` | Курс покорён | 📘 | Any course fully completed |
| `streak_ongoing` | Лапка за лапкой · день N | 📅 | `user.streak >= 1` — N = `user.streak` |
| `level_up` | Открыл новый уровень | ⬆️ | computed level is junior, middle, or senior |
| `middle_am` | Без паники, я аккаунт | 💼 | computed level is middle or senior |

"Лапка за лапкой" is a single live achievement. Its name updates to show current streak count. When streak resets to 0, this achievement disappears from the list (no "broken streak" state shown).

---

## Routing

Lesson route pattern (from `src/App.tsx`): `/lesson/:id`

Navigation calls use `navigate(\`/lesson/${lesson.id}\`)` from `react-router-dom`.

---

## New Files

| File | Purpose |
|------|---------|
| `src/utils/level.ts` | `computeLevel`, `LEVEL_LABELS`, `LEVEL_EMOJI`, `isComplete` |
| `src/utils/achievements.ts` | `computeAchievements(user, lessons)` → `Achievement[]` |
| `src/utils/streak.ts` | `updateStreak(user)` → `Partial<User>` |
| `src/pages/Dashboard/Dashboard.tsx` | Full rewrite |
| `src/pages/Dashboard/Dashboard.module.css` | Full rewrite |
| `src/components/GrowthPath/GrowthPath.tsx` | Path step chain component |
| `src/components/GrowthPath/GrowthPath.module.css` | |
| `src/components/AchievementBadge/AchievementBadge.tsx` | Single achievement row |
| `src/components/AchievementBadge/AchievementBadge.module.css` | |

## Modified Files

| File | Change |
|------|--------|
| `src/types/index.ts` | Add `Level` type, add `level?`, `streak`, `lastStreakDate` to User |
| `src/context/AuthContext.tsx` | Call `updateStreak` inside `updateProgress`; add migration guard in `loadUserFromStorage` |
| `src/data/users.ts` | Add `streak: 0` to all mock users |
