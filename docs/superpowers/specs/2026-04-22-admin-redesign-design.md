# Admin Panel Redesign — Design Spec

**Date:** 2026-04-22  
**Scope:** Admin panel only (`/admin/*` routes)  
**Reference:** Unitpay dashboard screenshot

---

## Goal

Restyle the admin panel to match the Unitpay reference design: light sidebar, clean white cards, neutral typography — no dark backgrounds, no colored accents.

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `--admin-sidebar-bg` | `#ffffff` | Sidebar background |
| `--admin-sidebar-border` | `#e5e7eb` | Sidebar right border |
| `--admin-nav-active-bg` | `#f3f4f6` | Active nav item background |
| `--admin-nav-text` | `#6b7280` | Inactive nav item text |
| `--admin-nav-active-text` | `#111827` | Active nav item text |
| `--admin-content-bg` | `#f9fafb` | Main content area background |
| `--admin-card-bg` | `#ffffff` | Card/table background |
| `--admin-card-border` | `#e5e7eb` | Card border |
| `--admin-text-primary` | `#111827` | Page titles, main text |
| `--admin-text-secondary` | `#374151` | Table row text |
| `--admin-text-muted` | `#9ca3af` | Labels, email, dates |
| `--admin-btn-bg` | `#111827` | Primary button |

---

## Typography

- Font: **Onest** (already in project) — no change
- Page title: `22px / 700`
- Section title: `14–15px / 600`
- Stat value: `32px / 700`, color `#111827`
- Stat label: `12px`, color `#9ca3af`
- Table header: `11px / 600`, uppercase, `letter-spacing: .5px`, color `#9ca3af`
- Table cell: `13px`, color `#374151`

---

## Sidebar

- Background: `#ffffff`, right border `1px solid #e5e7eb`
- Width: `220px` (unchanged)
- Logo: text only "UnitSchool", `17px / 700`, color `#111827` (no icon box)
- Nav items: `padding: 8px 10px`, `border-radius: 6px`
  - Inactive: color `#6b7280`, icon color `#9ca3af`
  - Active: background `#f3f4f6`, text `#111827 / 600`, icon `#374151`
  - Hover: background `#f9fafb`
- Bottom section: user name `#111827`, email `#9ca3af`, logout `#9ca3af`
- Separator: `1px solid #f3f4f6`

---

## Content Area

- Background: `#f9fafb`
- Padding: `28px 32px`

### Stat Cards (Dashboard)
- Background `#fff`, border `1px solid #e5e7eb`, border-radius `10px`
- Shadow: `0 1px 3px rgba(0,0,0,.05)`
- Value: `32px / 700 / #111827`
- Label: `12px / #9ca3af`
- Layout: `display: flex; gap: 14px`

### Tables
- Background `#fff`, border `1px solid #e5e7eb`, border-radius `10px`
- Header row: background `#fafafa`, text uppercase gray
- Row separator: `1px solid #f3f4f6`
- Avatar placeholder: `36px` circle, background `#f3f4f6`, initials `#374151`

### Buttons
- Primary: background `#111827`, color `#fff`, border-radius `8px`, `13px / 600`

### Progress bars
- Track: `#e5e7eb`, fill: `#374151`, height `5px`, border-radius `100px`

---

## Files to Change

| File | Change |
|---|---|
| `src/styles/global.css` | Add admin CSS variables (scoped to `.admin-layout`) |
| `src/components/AdminSidebar/AdminSidebar.tsx` | Use new CSS module |
| `src/components/AdminSidebar/AdminSidebar.module.css` | Full rewrite — light theme |
| `src/components/AdminAppLayout/AdminAppLayout.tsx` | Add `admin-layout` class, use new layout styles |
| `src/pages/Admin/AdminDashboardPage.module.css` | Rewrite with new tokens |
| `src/pages/Admin/UsersListPage.module.css` | Rewrite with new tokens |
| `src/pages/Admin/UserDetailPage.module.css` | Rewrite with new tokens |
| `src/pages/Admin/AdminProgressPage.module.css` | Rewrite with new tokens |
| `src/pages/Admin/CoursesListPage.module.css` | Rewrite with new tokens |
| `src/pages/Admin/CourseDetailPage.module.css` | Rewrite with new tokens |
| `src/pages/Admin/NewUserPage.module.css` | Rewrite with new tokens |

---

## Out of Scope

- User-facing pages (Dashboard, Lesson, Login) — untouched
- No new components, no routing changes
- No chart additions
