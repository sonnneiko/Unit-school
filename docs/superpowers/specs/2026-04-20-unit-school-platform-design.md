# Unit School — Platform Design Spec
Date: 2026-04-20

## Overview

Employee onboarding and learning platform for UnitPay. Branded with the "Unit" cat mascot. Built with React + Vite. Backend/DB will be connected later — initial version uses mock data.

## Goals

- Let employees log in and go through onboarding modules at their own pace
- Track individual progress per module
- Admin panel to manage users and modules
- First module: Day 1 content (from existing Figma/PDF slides)

## Tech Stack

- **Frontend:** React + Vite
- **Routing:** React Router v6
- **Styles:** CSS Modules with CSS custom properties for theming (`--color-sidebar-bg`, etc.)
- **Data:** Mock JSON files (replaced by API calls when backend is ready)
- **Auth:** Context-based mock auth (replaced by real auth when backend connects)

## Project Structure

```
src/
  components/       # Shared UI components (Sidebar, SlideNav, TabGroup, TeamCard...)
  pages/            # Route-level components (Login, Dashboard, Lesson, Admin)
  context/          # AuthContext
  data/             # Mock JSON data (lessons, users)
  styles/           # Global CSS variables and reset
  App.tsx           # Router setup
  main.tsx
```

## Pages & Routes

| Route | Page | Auth required | Admin only |
|---|---|---|---|
| `/login` | Login | No (redirect to `/` if already logged in) | No |
| `/` | Dashboard | Yes → redirect to `/login` | No |
| `/lesson/:id` | Lesson | Yes → redirect to `/login` | No |
| `/admin` | Admin Panel | Yes → redirect to `/login` | Yes → redirect to `/` |
| `*` | 404 | No | No |

**Route guard logic:**
- `<PrivateRoute>` wrapper: if no authenticated user, redirect to `/login`
- `<AdminRoute>` wraps **inside** `<PrivateRoute>`: if user role is not `'admin'`, redirect to `/`. Unauthenticated users hit `<PrivateRoute>` first and go to `/login`.
- `/login`: if user is already logged in, redirect to `/`

## Auth Context

```ts
interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<void>  // throws on bad credentials
  logout: () => void
}
```

**Mock credentials:**
- Regular user: `user@unitpay.ru` / `password123`
- Admin: `admin@unitpay.ru` / `admin123`

**Session persistence:** Auth session is stored in `localStorage` so it survives page refresh. On app load, `AuthContext` reads from `localStorage` to restore the session.

## Layout

**Login page:** No sidebar. Centered card with UnitPay branding + Unit cat.

**After login — persistent layout:**
- Dark sidebar on the left
- Main content area fills the rest
- Sidebar is rendered by the layout wrapper, not individual pages

**Sidebar nav items (4):** Home, Courses, Progress, Profile
- "Admin" link renders conditionally for `role: 'admin'` users
- Active route is highlighted
- User name + logout button at bottom

## Components

### Sidebar
- Logo + cat mascot at top
- 4 nav links: Home, Courses, Progress, Profile (+ Admin if admin)
- Active route highlight
- User name + logout at bottom

### LessonCard (Dashboard)
- Module title and tag (e.g. "День 1")
- Progress bar showing `Math.round((currentSlideIndex / (slides.length - 1)) * 100)`%
- Click navigates to `/lesson/:id`
- Locked state (greyed out) for future modules

### Slide
Full-area content renderer. Dispatches to a sub-component based on `slide.type`:

| `type` | Sub-component | Description |
|---|---|---|
| `welcome` | `WelcomeSlide` | Cat illustration, title, subtitle, CTA button (navigates to next slide) |
| `tabs` | `TabsSlide` | Pill tabs + content area. Tab content can include `TeamCard` sub-components |
| `info` | `InfoSlide` | Heading, bullet list, optional illustration |
| `diagram` | `DiagramSlide` | Text-based flow diagram |
| `cheatsheet` | `CheatsheetSlide` | Table layout |
| `finish` | `FinishSlide` | Completion screen + link to next module. If `nextLessonId` is `null`, shows "Coming soon" instead of a link. |

`TeamCard` is a **sub-component** used inside `TabsSlide` tab content — not a top-level slide type.

### SlideNav
- Progress dots at top (filled = completed, active = current, empty = upcoming)
- ← → arrow buttons at bottom
- Keyboard arrow key support (left/right only; does not conflict with TabGroup which uses click)

### AdminPanel
- User table: name, email, role, last active
- Lesson list: title, slide count, published toggle (updates `lesson.published` in mock data)

## Data Model

```ts
interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  progress: Record<string, number>  // lessonId → currentSlideIndex (0-based)
}

interface Lesson {
  id: string
  title: string
  tag: string             // e.g. "День 1"
  published: boolean
  slides: Slide[]
}

interface Slide {
  id: string              // unique within the lesson (e.g. "slide-1"), not globally unique
  type: 'welcome' | 'tabs' | 'info' | 'diagram' | 'cheatsheet' | 'finish'
  content: WelcomeContent | TabsContent | InfoContent | DiagramContent | CheatsheetContent | FinishContent
}

// Per-type content shapes:
interface WelcomeContent { title: string; subtitle: string; ctaLabel: string }
interface TabsContent { tabs: Array<{ label: string; items: TeamMember[] | VendorItem[] }> }
interface VendorItem { name: string; scheme: string; methods: string[]; payout: string; forWhom: string }
interface TeamMember { name: string; role: string; description: string; photoPlaceholder: string }
interface InfoItem { heading?: string; body: string }
interface InfoContent { heading: string; bullets: string[]; illustration?: string }
interface DiagramContent { nodes: Array<{ label: string; children?: string[] }> }
interface CheatsheetContent { sections: Array<{ title: string; headers: string[]; rows: string[][] }> }
interface FinishContent { title: string; message: string; nextLessonId: string | null }
```

**Progress semantics:** `progress[lessonId]` stores the `currentSlideIndex` (integer, 0-based). The displayed percentage is derived: `Math.round((currentSlideIndex / (slides.length - 1)) * 100)`.

## Day 1 Content (8 slides)

1. **welcome** — "Добро пожаловать в команду Unitpay!" + Unit cat
2. **tabs** — Team structure: tabs Управление / Разработка / Менеджмент / Аккаунтинг / Служба безопасности; each tab has `TeamMember[]`. Actual names/roles from PDF; photos are placeholder colors initially.
3. **info** — What is UnitPay: payment aggregator + 3 key features
4. **info** — Payment methods: МИР, СБП, SberPay, T-Pay, international cards, USDT
5. **diagram** — Payment flow: buyer → merchant store → UnitPay page → acquiring bank → issuing bank
6. **tabs** — Acquiring vs Netting: tabs for each scheme + vendors
7. **cheatsheet** — Quick reference (who is who, vendor comparison table)
8. **finish** — "День 1 завершён" → `nextLessonId: null` (Day 2 not yet published)

## Mock Data Notes

- `lessons` array includes **two entries**: Day 1 (published: true) and Day 2 stub (title: "Аккаунтинг", published: false, slides: []).
- Day 2 stub ensures the Finish slide's "next lesson" link renders as a locked card, not a broken link.
- Team member photos: use colored placeholder divs with initials (no external image dependency).

## Scope (This Version)

**In scope:**
- Login page (mock auth)
- Dashboard with lesson cards + locked state for Day 2
- Lesson viewer with all 8 Day 1 slides and all interactive elements (tabs, diagrams)
- Persistent sidebar layout
- Admin panel (read-only user table + published toggle for lessons)
- Progress tracking in local state (React state / localStorage)

**Out of scope (later):**
- Real backend/DB integration
- Password reset, registration
- Notifications
- Mobile-specific design
- Animated slide transitions
