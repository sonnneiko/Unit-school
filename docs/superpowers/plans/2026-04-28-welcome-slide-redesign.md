# Welcome Slide Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the WelcomeSlide to fill the full lesson area with a two-column white layout (text + bullets left, cat image right) and hide the bottom SlideNav on slides that have internal navigation.

**Architecture:** Add `bullets` and `hasInternalNav` fields to types, update lesson data, rewrite WelcomeSlide CSS and JSX, and conditionally render SlideNav in LessonPage based on `slide.hasInternalNav`.

**Tech Stack:** React, TypeScript, CSS Modules, Vite

---

## Chunk 1: Types and Data

### Task 1: Extend types

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Add `bullets` to `WelcomeContent` and `hasInternalNav` to `Slide`**

In `src/types/index.ts`, change:
```ts
export interface WelcomeContent {
  title: string
  subtitle: string
  ctaLabel: string
}
```
to:
```ts
export interface WelcomeContent {
  title: string
  subtitle: string
  ctaLabel: string
  bullets?: string[]
}
```

And change:
```ts
export interface Slide {
  id: string
  type: SlideType
  content: WelcomeContent | TabsContent | InfoContent | DiagramContent | CheatsheetContent | FinishContent
}
```
to:
```ts
export interface Slide {
  id: string
  type: SlideType
  hasInternalNav?: boolean
  content: WelcomeContent | TabsContent | InfoContent | DiagramContent | CheatsheetContent | FinishContent
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build 2>&1 | head -20`
Expected: no type errors related to these types

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat(types): add bullets to WelcomeContent, hasInternalNav to Slide"
```

---

### Task 2: Update lesson data

**Files:**
- Modify: `src/data/lessons.ts`

- [ ] **Step 1: Add `hasInternalNav` and `bullets` to the welcome slide**

In `src/data/lessons.ts`, find the slide with `id: 's1'` in lesson `unitpay-basics-team` and update it:
```ts
{
  id: 's1',
  type: 'welcome',
  hasInternalNav: true,
  content: {
    title: 'Добро пожаловать в команду Unitpay!',
    subtitle: 'Я котик Юнит 🐾 рад знакомству! В первые дни я буду рядом и помогу быстро освоиться.',
    ctaLabel: 'Начать',
    bullets: [
      'Покажу, как у нас всё устроено',
      'Расскажу, чем мы занимаемся',
      'Познакомлю с коллегами',
      'Поделюсь полезными штуками для старта работы',
    ],
  },
},
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build 2>&1 | head -20`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/data/lessons.ts
git commit -m "feat(data): add bullets and hasInternalNav to team welcome slide"
```

---

## Chunk 2: Component Redesign

### Task 3: Add CSS classes for full-screen welcome layout

**Files:**
- Modify: `src/components/slides/slides.module.css`

- [ ] **Step 1: Add new classes at the end of the file**

Append to `src/components/slides/slides.module.css`:
```css
/* WelcomeSlide full-screen (two-column) */
.welcomeFull {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #fff;
}

.welcomeLeft {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 64px 72px;
  gap: 24px;
}

.welcomeFullTitle {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text);
  margin: 0;
}

.welcomeFullSubtitle {
  font-size: 16px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.welcomeBullets {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin: 0;
  padding: 0;
}

.welcomeBulletItem {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
}

.welcomeBulletDot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-brand);
  flex-shrink: 0;
}

.welcomeRight {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
}

.welcomeCat {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  display: block;
}
```

Note: The existing `.welcomeCard`, `.welcomeTitle`, `.welcomeSubtitle` classes are intentionally kept — do NOT delete them.

- [ ] **Step 2: Verify build passes**

Run: `npm run build 2>&1 | head -20`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/slides/slides.module.css
git commit -m "feat(styles): add full-screen welcome slide layout classes"
```

---

### Task 4: Rewrite WelcomeSlide component

**Files:**
- Modify: `src/components/slides/WelcomeSlide.tsx`

- [ ] **Step 1: Rewrite the component**

Replace the entire contents of `src/components/slides/WelcomeSlide.tsx` with:
```tsx
import unitCat from '../../assets/unit-cat/Unitpay Cat 1.png'
import type { WelcomeContent } from '../../types'
import styles from './slides.module.css'

interface Props {
  content: WelcomeContent
  onNext: () => void
}

export function WelcomeSlide({ content, onNext }: Props) {
  return (
    <div className={styles.welcomeFull}>
      <div className={styles.welcomeLeft}>
        <h1 className={styles.welcomeFullTitle}>{content.title}</h1>
        <p className={styles.welcomeFullSubtitle}>{content.subtitle}</p>
        {content.bullets && content.bullets.length > 0 && (
          <ul className={styles.welcomeBullets}>
            {content.bullets.map((bullet, i) => (
              <li key={i} className={styles.welcomeBulletItem}>
                <span className={styles.welcomeBulletDot} />
                {bullet}
              </li>
            ))}
          </ul>
        )}
        <button className={styles.ctaButton} onClick={onNext}>
          {content.ctaLabel} →
        </button>
      </div>
      <div className={styles.welcomeRight}>
        <img src={unitCat} alt="Котик Юнит" className={styles.welcomeCat} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build 2>&1 | head -30`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/slides/WelcomeSlide.tsx
git commit -m "feat(WelcomeSlide): full-screen two-column layout with cat image and bullets"
```

---

### Task 5: Hide SlideNav when slide has internal navigation

**Files:**
- Modify: `src/pages/Lesson/Lesson.tsx`

- [ ] **Step 1: Conditionally render SlideNav**

In `src/pages/Lesson/Lesson.tsx`, find:
```tsx
      <SlideNav
        current={currentSlide}
        total={lesson.slides.length}
        onPrev={goPrev}
        onNext={goNext}
      />
```
Replace with:
```tsx
      {!slide.hasInternalNav && (
        <SlideNav
          current={currentSlide}
          total={lesson.slides.length}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npm run build 2>&1 | head -20`
Expected: no errors

- [ ] **Step 3: Start dev server and verify visually**

Run: `npm run dev`

Open the lesson "Команда" (lesson id: `unitpay-basics-team`). Check:
- Welcome slide fills the full screen (no small dark card)
- Left column shows title, subtitle, 4 green bullet points, "Начать →" button
- Right column shows the cat mascot image
- No SlideNav (arrows/counter) visible at the bottom
- Clicking "Начать →" advances to slide 2
- On slide 2 (tabs), SlideNav IS visible at the bottom

- [ ] **Step 4: Commit**

```bash
git add src/pages/Lesson/Lesson.tsx
git commit -m "feat(LessonPage): hide SlideNav when slide has internal navigation"
```
