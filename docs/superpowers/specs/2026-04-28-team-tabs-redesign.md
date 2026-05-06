# Spec: Team Tabs Slide Redesign

**Date:** 2026-04-28  
**Branch:** feature/unit-school-platform

---

## Overview

Redesign the `TabsSlide` component for the team lesson to match the Figma design: full-screen layout, department tabs with Lucide icons, vertical team member cards with real photos, paginated 2-per-page with a per-department green info card, and an initial unselected state showing the cat image.

Vendor-type tabs are not affected.

---

## Data Model Changes

### `src/types/index.ts`

Extract the inline tab object type to a named `TabItem` interface. Update `TabsContent` and `TeamMember`:

```ts
export interface TabItem {
  label: string
  icon?: string          // Lucide icon name, e.g. "Compass"
  tagline?: string       // bold heading in green info card
  taglineBody?: string   // body text in green info card
  itemType: 'team' | 'vendor'
  items: TeamMember[] | VendorItem[]
}

export interface TabsContent {
  title?: string
  subtitle?: string
  introImage?: string    // path shown when no tab selected, e.g. "/Знакомство (1).jpg"
  tabs: TabItem[]
}

export interface TeamMember {
  name: string
  role: string
  description: string
  photo?: string         // e.g. "/team/Dmitry.jpg" — optional, falls back to initials
  photoPlaceholder: string  // required CSS color string, used for initials fallback
}
```

`photoPlaceholder` stays required — all existing data already has it and the fallback path still uses it.

### `src/data/lessons.ts`

Update slide `s2` of `unitpay-basics-team`:

**Slide-level additions:**
```ts
title: 'Как устроена команда Unitpay',
subtitle: 'Начнём с твоих коллег и наших отделов. Я расскажу, кто у нас за что отвечает, чем занимается каждый отдел и к кому лучше обращаться с разными вопросами.',
introImage: '/Знакомство (1).jpg',
```

**Tab icons (Lucide):**
| Dept | `icon` value |
|---|---|
| Управление | `Compass` |
| Разработка | `Code` |
| Менеджмент | `Eye` |
| Аккаунтинг | `Smile` |
| Служба безопасности | `Shield` |

**Per-department taglines:**
| Dept | `tagline` | `taglineBody` |
|---|---|---|
| Управление | "Держат всё под контролем!" | "У них много разных задач. Они следят за всей работой UnitPay." |
| Разработка | "Улучшают продукт изнутри!" | "Много важной работы остаётся «за кулисами», но благодаря им UnitPay становится удобнее, стабильнее и лучше каждый день." |
| Менеджмент | "Двигают карточки" | "Они формируют цели, расставляют приоритеты, координируют команды и следят чтобы продукт развивался в нужном направлении." |
| Аккаунтинг | "Помогают и объясняют!" | "Отдел аккаунтинга сопровождает мерчантов на всех этапах работы с UnitPay. Отвечают на вопросы, помогают с подключением и настройкой проектов, контролируют приём платежей." |
| Служба безопасности | "Следят и контролируют!" | "Контролируют всё, что связано с безопасностью: модерируют проекты, проверяют контрагентов, мониторят транзакции на фрод, взаимодействуют с поставщиками и обрабатывают чарджбэки." |

**Photo file mapping:**
| Member | `photo` value |
|---|---|
| Дмитрий Козлов | `/team/Dmitry.jpg` |
| Полина Есина | `/team/Polina.jpg` |
| Роман Комиссаренко | `/team/Roma.jpg` |
| Вадим Нижневский | `/team/Vadim.png` |
| Василий Волгин | `/team/василий тестировщик.jpg` |
| Максим Шетхман | `/team/максим разраб.jpg` |
| Артем Драгунов | `/team/artem.jpg` |
| Анастасия Деева | `/team/NastyaPM.jpg` |
| Анастасия Калашникова | `/team/настя рук акк.jpg` |
| Оксана Долженкова | `/team/оксана старший спец.jpg` |
| Елена | `/team/elena.jpg` |
| София | `/team/Sofia.jpg` |
| Ани Тоноян | `/team/Ani.jpg` |
| Светлана Григорьева | `/team/светикс сб.jpg` |

**Updated descriptions (from Figma):**
- Дмитрий Козлов: "Он управляет нашим продуктом и задаёт общее направление: куда мы идём, что развиваем и как делаем UnitPay лучше."
- Полина Есина: "Отвечает за операционную деятельность — процессы, задачи и важные рабочие вопросы."
- Артем Драгунов: "Отвечает за создание и развитие продукта, формирует его стратегию и приоритеты. Может разобраться во всём на свете."
- Анастасия Деева: "Управляет задачами и коммуникацией внутри команды. Отвечает за прозрачность процессов, приоритизацию и соблюдение сроков. Ценит ясность и четкие договоренности."
- Ани Тоноян: "Следит за безопасностью и внимательно выискивает любые недочёты в проектах. Возвращается с перепроверками. А ещё ходит по офису в крутых тапках."
- Светлана Григорьева: "Контролирует безопасность UnitPay и внимательно следит за всем, что может повлиять на риски в работе. Работает на удалёнке, но каждое утро начинает с крутой картинки в чате."

**New team members to add (Аккаунтинг):**
- Елена — Аккаунт-менеджер, photo: `/team/elena.jpg`, description: "Помогает нашим мерчантам. Любит бочку в офисной сауне."
- София — Технический специалист, photo: `/team/Sofia.jpg`, description: "Занимается техническими вопросами наших мерчантов и внутренним развитием продукта — например, платформой по обучению, на которой ты сейчас находишься."

---

## Component Architecture

### `TabsSlide.tsx` — full-screen smart container

**Layout:**
```
[title]
[subtitle]
[tab row]
──────────────────────────────────────
[content area]
  no tab selected → introImage (centered, max-height: 60%, max-width: 600px)
  tab selected    → 3-col grid: [TeamCard] [TeamCard] [InfoCard]
                    pagination row below grid (if totalPages > 1)
```

**State:**
```ts
const [activeTab, setActiveTab] = useState<number | null>(null)
const [page, setPage] = useState(0)
const MEMBERS_PER_PAGE = 2
```

On tab click: set `activeTab`, reset `page` to `0`.

Null-guard before rendering content:
```ts
const tab = activeTab !== null ? content.tabs[activeTab] : null
const members = tab && tab.itemType === 'team' ? tab.items as TeamMember[] : []
const totalPages = Math.ceil(members.length / MEMBERS_PER_PAGE)
const pageMembers = members.slice(page * MEMBERS_PER_PAGE, (page + 1) * MEMBERS_PER_PAGE)
```

**Tab row styling:**
- Default: white bg, `var(--color-text)` text, `var(--color-brand)` icon, `1px solid var(--color-border)` border
- Active: `var(--color-brand)` bg, `#fff` text, `#fff` icon
- Hover (non-active): `var(--color-brand-light)` bg

**Lucide icon loading — use a static lookup map:**
```ts
import { Compass, Code, Eye, Smile, Shield, type LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = { Compass, Code, Eye, Smile, Shield }
```

Render: `const Icon = ICON_MAP[tab.icon ?? ''] ?? null` — if no match, render nothing.

**3-column content grid:**
- `grid-template-columns: 1fr 1fr 1fr`
- Column 1 & 2: `TeamCard` (or empty placeholder `<div>` to preserve layout)
- Column 3: `InfoCard` (always shown when a tab is selected and has `tagline`)
- If `tagline` is absent on a tab: render only 2 columns (`grid-template-columns: 1fr 1fr`)

**Odd-member pagination (e.g. 3 members, page 2 has 1 member):**
- Render an invisible placeholder `<div className={styles.teamCardPlaceholder}>` in the empty second column slot to keep the InfoCard in column 3.

**Pagination row (shown only if `totalPages > 1`):**
- `ChevronLeft` button (disabled on page 0) — `aria-label="Предыдущие"`
- `ChevronRight` button (disabled on last page) — `aria-label="Следующие"`
- Positioned below the grid, aligned right or center

**No-selection state:**
- `<img src={content.introImage} className={styles.teamIntroImage} alt="" />`
- CSS: `max-height: 60vh; max-width: 600px; object-fit: contain;`

### `TeamCard.tsx` — vertical card

New vertical layout added alongside existing horizontal layout (old classes retained for backward compatibility with vendor tabs if ever needed):

```
┌─────────────────────┐
│  [photo 180px tall] │  object-fit: cover, border-radius top
├─────────────────────┤
│  Name (bold 15px)   │
│  Role (green 13px)  │
│  Desc (gray 13px)   │
└─────────────────────┘
```

- `photo` present → `<img src={photo} className={styles.teamCardPhoto} alt={name} />`
- `photo` absent → `<div className={styles.teamCardPhotoFallback} style={{ background: photoPlaceholder }}>{initials}</div>`
- Card: white bg, `var(--shadow-card)` shadow, `var(--radius-md)` border-radius

### InfoCard (inline in `TabsSlide.tsx`)

```
┌──────────────────────┐
│  Tagline (22px bold) │  white text
│                      │
│  Body (14px)         │  white text, lighter
└──────────────────────┘
```

- Background: `var(--color-brand)`
- `border-radius: var(--radius-md)`
- `align-self: stretch` so it fills the full row height
- Only rendered when `tab.tagline` is present

---

## Styling Changes (`slides.module.css`)

New classes (existing vendor/tab classes unchanged):
- `.teamTabsWrapper` — full-screen, `padding: 40px 48px`, `display: flex; flex-direction: column; gap: 20px`
- `.teamTabsTitle` — `font-size: 32px; font-weight: 700`
- `.teamTabsSubtitle` — `font-size: 16px; color: var(--color-text-secondary); line-height: 1.5`
- `.teamTabsTabRow` — `display: flex; flex-wrap: wrap; gap: 8px`
- `.teamTabsTab` — pill, default state (white bg, border, green icon)
- `.teamTabsTabActive` — green bg, white text+icon
- `.teamTabsContent` — `flex: 1; display: flex; flex-direction: column; gap: 16px`
- `.teamTabsGrid` — `display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; align-items: start`
- `.teamTabsGrid2col` — `grid-template-columns: 1fr 1fr` (used when no InfoCard)
- `.teamCardVertical` — vertical card, white bg, shadow, rounded
- `.teamCardPhoto` — `width: 100%; height: 180px; object-fit: cover; border-radius: var(--radius-md) var(--radius-md) 0 0`
- `.teamCardPhotoFallback` — `width: 100%; height: 180px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; color: #fff; border-radius top`
- `.teamCardBody` — `padding: 14px`
- `.teamCardPlaceholder` — invisible spacer div (no bg, no border)
- `.teamInfoCard` — green card, `padding: 24px; align-self: stretch`
- `.teamInfoCardTitle` — `font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 12px`
- `.teamInfoCardBody` — `font-size: 14px; color: rgba(255,255,255,0.9); line-height: 1.5`
- `.teamIntroImage` — `max-height: 60vh; max-width: 600px; object-fit: contain; margin: auto`
- `.teamPagination` — `display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px`

---

## Dependencies

```
npm install lucide-react
```

Icons used: `Compass`, `Code`, `Eye`, `Smile`, `Shield`, `ChevronLeft`, `ChevronRight`.
Loaded via static `ICON_MAP` record — no dynamic imports needed.

---

## File Changes Summary

| File | Change |
|---|---|
| `src/types/index.ts` | Extract `TabItem` interface; extend `TabsContent`, `TeamMember` |
| `src/data/lessons.ts` | Add title/subtitle/introImage/icons/taglines/photos; update descriptions; add Elena + Sofia |
| `src/components/slides/TabsSlide.tsx` | Full redesign with null-safe state, icon map, pagination, InfoCard |
| `src/components/slides/TeamCard.tsx` | Add vertical layout; keep old horizontal classes |
| `src/components/slides/slides.module.css` | New CSS classes; existing unchanged |
| `package.json` | Add `lucide-react` |

---

## Out of Scope

- Vendor tab redesign
- Admin editing of team data
- Animations/transitions between pages
