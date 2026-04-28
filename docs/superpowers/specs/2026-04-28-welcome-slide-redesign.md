# Welcome Slide Redesign

**Date:** 2026-04-28  
**Status:** Approved

## Problem

The current `WelcomeSlide` renders as a small centered dark card (`max-width: 560px`) that doesn't fill the screen. The bottom `SlideNav` (1/2 counter + arrows) is visible even though the slide has its own "Начать →" button. The design in Figma shows a full-screen two-column white layout with the real cat mascot image.

## Goals

1. `WelcomeSlide` fills the full lesson area — no small centered card
2. Two-column layout: text + bullets left, cat image right
3. `SlideNav` hidden when the current slide has internal navigation
4. Bullet points are data-driven (configurable per lesson)

## Data Changes

### `src/types/index.ts`
Add `bullets?: string[]` to `WelcomeContent`:
```ts
export type WelcomeContent = {
  title: string
  subtitle: string
  ctaLabel: string
  bullets?: string[]
}
```

Add `hasInternalNav?: boolean` to `SlideData` (or whichever slide union type is used):
```ts
// on the slide object level, not content level
hasInternalNav?: boolean
```

### `src/data/lessons.ts`
On slide `s1` of lesson `unitpay-basics-team`:
- Add `hasInternalNav: true`
- Add `bullets` to content:
  ```ts
  bullets: [
    'Покажу, как у нас всё устроено',
    'Расскажу, чем мы занимаемся',
    'Познакомлю с коллегами',
    'Поделюсь полезными штуками для старта работы',
  ]
  ```

## Component Changes

### `src/components/slides/WelcomeSlide.tsx`
New layout:
- Root: `width: 100%; height: 100%; display: grid; grid-template-columns: 1fr 1fr; background: white`
- Left column: flex column, padding ~60-80px, justify-content: center
  - `<h1>` title — large, dark, font-weight 700
  - `<p>` subtitle — muted color
  - Bullet list — each item: green circle dot + text
  - CTA button "Начать →" — green, same style as before
- Right column: contains `<img src={unitCat} />` — `object-fit: contain`, `align-self: flex-end` (cat sits at bottom-right as in Figma)
- Cat image imported from `src/assets/unit-cat/Unitpay Cat 1.png`

### `src/components/slides/slides.module.css`
- Add new classes: `.welcomeFull`, `.welcomeLeft`, `.welcomeRight`, `.welcomeCat`, `.welcomeBullets`, `.welcomeBulletItem`, `.welcomeBulletDot`
- Keep old `.welcomeCard` etc. in place (no other slides use `welcome` type currently, but safer not to delete)

### `src/pages/Lesson/Lesson.tsx`
Conditionally render `<SlideNav>`:
```tsx
{!slide.hasInternalNav && (
  <SlideNav current={currentSlide} total={lesson.slides.length} onPrev={goPrev} onNext={goNext} />
)}
```

## Visual Spec

```
┌─────────────────────────────────────────────────────┐
│ topbar (← Назад | Команда | tag)                    │
├──────────────────────────┬──────────────────────────┤
│                          │                          │
│  Добро пожаловать        │                          │
│  в команду Unitpay!      │      [cat image]         │
│                          │                          │
│  Я котик Юнит 🐾...     │                          │
│                          │                          │
│  ● Покажу, как...        │                          │
│  ● Расскажу, чем...      │                          │
│  ● Познакомлю...         │                          │
│  ● Поделюсь...           │                          │
│                          │                          │
│  [Начать →]              │                          │
│                          │                          │
└──────────────────────────┴──────────────────────────┘
  (no SlideNav at bottom)
```

## Out of Scope

- Redesigning other slide types (InfoSlide, TabsSlide, etc.)
- Adding `hasInternalNav` to other existing slides
- Mobile/responsive breakpoints beyond basic usability
