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
- **Styles:** CSS Modules
- **Data:** Mock JSON files (replaced by API calls when backend is ready)
- **Auth:** Context-based (mock login for now; real auth when backend connects)

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/login` | Login | Email + password form. Redirects to `/` on success. |
| `/` | Dashboard | Sidebar + module cards with progress bars. |
| `/lesson/:id` | Lesson | Sidebar + fullscreen slide + slide navigation. |
| `/admin` | Admin Panel | User list, module list. Admin-only route. |

## Layout

**After login — persistent layout:**
- Dark sidebar on the left (navigation: Home, Courses, Progress, Profile)
- Unit cat logo at top of sidebar
- Main content area fills the rest

**Login page:** No sidebar. Centered card with UnitPay branding.

## Components

### Sidebar
- Logo + cat mascot at top
- Navigation links (Home, Courses, Profile)
- Highlights active route
- User name + logout at bottom

### LessonCard (Dashboard)
- Module title and tag (e.g. "День 1")
- Progress bar showing % completed
- Click navigates to `/lesson/:id`

### Slide
- Full-area content display
- Supports content types:
  - **Welcome** — cat illustration, title, subtitle, CTA button
  - **TabGroup** — pill tabs (e.g. Управление / Разработка / Менеджмент) that swap displayed content
  - **TeamCard** — photo, name, role, description
  - **InfoBlock** — heading, bullet list, optional illustration
  - **Diagram** — text-based flow diagram
  - **Cheatsheet** — table layout
  - **Finish** — completion screen with next module link

### SlideNav
- Progress dots/bar at top (e.g. slide 3 of 8)
- ← → arrow buttons at bottom
- Keyboard arrow key support

### AdminPanel
- User table: name, email, role, last active
- Module list: title, number of slides, published toggle

## Data Model (Mock)

```ts
// User
{ id, name, email, role: 'user' | 'admin', progress: { [lessonId]: number } }

// Lesson
{ id, title, tag, slides: Slide[] }

// Slide
{ id, type: 'welcome' | 'tabs' | 'info' | 'diagram' | 'cheatsheet' | 'finish', content: object }
```

## Day 1 Content (8 slides)

1. **Welcome** — "Добро пожаловать в команду Unitpay!" + cat
2. **Tabs: Team structure** — tabs for Управление / Разработка / Менеджмент / Аккаунтинг / Служба безопасности, each showing team members
3. **Info: What is UnitPay** — payment aggregator description + key features
4. **Info: Payment methods** — МИР, СБП, SberPay, T-Pay, international cards, USDT
5. **Diagram: Payment flow** — buyer → merchant → UnitPay → acquiring bank → issuing bank
6. **Tabs: Acquiring vs Netting** — explanation of each scheme + vendors
7. **Cheatsheet** — quick reference table (who is who, which vendor for what)
8. **Finish** — "День 1 завершён" + link to Day 2 (Accounting)

## Scope (This Version)

**In scope:**
- Login page (mock auth)
- Dashboard with module cards
- Lesson viewer with all 8 Day 1 slides
- All interactive elements (tabs, transitions)
- Admin panel (read-only UI for now)
- Progress tracking in local state

**Out of scope (later):**
- Real backend/DB integration
- Password reset, registration
- Notifications
- Mobile-specific design
