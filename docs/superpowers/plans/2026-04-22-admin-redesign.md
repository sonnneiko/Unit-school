# Admin Panel Redesign — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle all admin panel pages to match the Unitpay reference design — light white/gray sidebar, clean white cards, neutral dark typography, no colored accents.

**Architecture:** CSS-only change. Add scoped admin CSS variables to `global.css`, rewrite `AdminSidebar.module.css`, update `AdminAppLayout` wrapper class, then rewrite each admin page CSS module. No logic, no routing, no new components.

**Tech Stack:** React, CSS Modules, Onest font (already loaded)

**Spec:** `docs/superpowers/specs/2026-04-22-admin-redesign-design.md`

---

## Chunk 1: Foundation — variables + sidebar + layout

### Task 1: Add admin CSS variables to global.css

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add admin-scoped variables** at the end of `src/styles/global.css`:

```css
/* Admin panel theme — scoped to avoid affecting user-facing pages */
.adminLayout {
  --adm-sidebar-bg: #ffffff;
  --adm-sidebar-border: #e5e7eb;
  --adm-nav-active-bg: #f3f4f6;
  --adm-nav-text: #6b7280;
  --adm-nav-active-text: #111827;
  --adm-nav-icon: #9ca3af;
  --adm-nav-active-icon: #374151;
  --adm-content-bg: #f9fafb;
  --adm-card-bg: #ffffff;
  --adm-card-border: #e5e7eb;
  --adm-card-shadow: 0 1px 3px rgba(0,0,0,.05);
  --adm-text-primary: #111827;
  --adm-text-secondary: #374151;
  --adm-text-muted: #9ca3af;
  --adm-separator: #f3f4f6;
  --adm-btn-bg: #111827;
  --adm-btn-color: #ffffff;
  --adm-progress-track: #e5e7eb;
  --adm-progress-fill: #374151;
  --adm-badge-bg: #f3f4f6;
  --adm-badge-color: #6b7280;
  --adm-badge-border: #e5e7eb;
  --adm-table-header-bg: #fafafa;
  --adm-table-row-border: #f3f4f6;
}
```

- [ ] **Step 2: Verify no existing styles broken** — run dev server and open any user-facing page (`/`) to confirm it looks unchanged.

- [ ] **Step 3: Commit**
```bash
git add src/styles/global.css
git commit -m "feat(admin): add scoped admin CSS variables"
```

---

### Task 2: Update AdminAppLayout to apply adminLayout class

**Files:**
- Modify: `src/components/AdminAppLayout/AdminAppLayout.tsx`
- Modify: `src/components/AppLayout.module.css`

- [ ] **Step 1: Add `adminLayout` class to the wrapper div in `AdminAppLayout.tsx`**

Replace the existing return:
```tsx
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '../AdminSidebar/AdminSidebar'
import styles from '../AppLayout.module.css'

export function AdminAppLayout() {
  return (
    <div className={`${styles.layout} ${styles.adminLayout}`}>
      <AdminSidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Add `adminLayout` class to `src/components/AppLayout.module.css`**

Add at the end of the file:
```css
.adminLayout {
  /* Marker class — CSS variables are defined in global.css .adminLayout */
}
```

- [ ] **Step 3: Commit**
```bash
git add src/components/AdminAppLayout/AdminAppLayout.tsx src/components/AppLayout.module.css
git commit -m "feat(admin): apply adminLayout class to admin wrapper"
```

---

### Task 3: Rewrite AdminSidebar styles

**Files:**
- Modify: `src/components/Sidebar/Sidebar.module.css` — only the classes used by AdminSidebar (sidebar, top, logo, logoText, nav, navItem, active, icon, bottom, userInfo, userName, userEmail, logoutBtn)

Note: `AdminSidebar.tsx` imports `Sidebar.module.css` directly. We rewrite the shared module for both sidebars here. The user-facing `Sidebar.tsx` uses the same classes — check it renders acceptably after.

- [ ] **Step 1: Rewrite `src/components/Sidebar/Sidebar.module.css`** in full:

```css
.sidebar {
  width: var(--color-sidebar-width, 220px);
  background: var(--adm-sidebar-bg, var(--color-sidebar-bg));
  border-right: 1px solid var(--adm-sidebar-border, transparent);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
}

.top { flex: 1; padding: 20px 12px 16px; overflow-y: auto; }

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
  padding: 0 8px;
}

.logoImg { width: 32px; height: 32px; object-fit: contain; display: block; }

.logoText {
  font-family: 'IgraSans', sans-serif;
  font-size: 18px;
  font-weight: normal;
  color: var(--adm-text-primary, #fff);
  letter-spacing: -0.3px;
  line-height: 1;
}

.nav { display: flex; flex-direction: column; gap: 2px; }

.navItem {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--adm-nav-text, var(--color-sidebar-text));
  transition: background .15s, color .15s;
}

.navItem:hover {
  background: var(--adm-nav-active-bg, var(--color-sidebar-hover-bg));
  color: var(--adm-nav-active-text, #fff);
}

.navItem.active {
  background: var(--adm-nav-active-bg, var(--color-sidebar-active-bg));
  color: var(--adm-nav-active-text, var(--color-sidebar-active-text));
  font-weight: 600;
}

.icon {
  font-size: 15px;
  width: 20px;
  text-align: center;
  color: var(--adm-nav-icon, inherit);
}

.navItem.active .icon { color: var(--adm-nav-active-icon, inherit); }

.bottom {
  padding: 16px 12px;
  border-top: 1px solid var(--adm-sidebar-border, #2a2a2a);
}

.userInfo { margin-bottom: 10px; }

.userName {
  font-size: 13px;
  font-weight: 600;
  color: var(--adm-text-primary, #fff);
}

.userEmail {
  font-size: 11px;
  color: var(--adm-text-muted, var(--color-sidebar-text));
  margin-top: 2px;
}

.logoutBtn {
  width: 100%;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--adm-text-muted, var(--color-sidebar-text));
  text-align: left;
  transition: background .15s, color .15s;
}

.logoutBtn:hover {
  background: var(--adm-nav-active-bg, var(--color-sidebar-hover-bg));
  color: var(--adm-nav-active-text, #fff);
}
```

- [ ] **Step 2: Start dev server and visually check admin sidebar** at `/admin/dashboard` — should be white with gray active item, dark text.

- [ ] **Step 3: Check user-facing sidebar** at `/` — should still look acceptable (dark background from `--color-sidebar-bg` since `.adminLayout` vars are not applied there).

- [ ] **Step 4: Commit**
```bash
git add src/components/Sidebar/Sidebar.module.css
git commit -m "feat(admin): light sidebar theme using CSS variable fallbacks"
```

---

## Chunk 2: Admin page CSS modules

### Task 4: Rewrite AdminDashboardPage.module.css

**Files:**
- Modify: `src/pages/Admin/AdminDashboardPage.module.css`

- [ ] **Step 1: Rewrite the file:**

```css
.page { padding: 28px 32px; max-width: 1000px; }

.heading {
  font-size: 22px;
  font-weight: 700;
  color: var(--adm-text-primary);
  margin-bottom: 20px;
}

.statsRow {
  display: flex;
  gap: 14px;
  margin-bottom: 24px;
}

.statCard {
  flex: 1;
  background: var(--adm-card-bg);
  border: 1px solid var(--adm-card-border);
  border-radius: 10px;
  padding: 20px 22px;
  box-shadow: var(--adm-card-shadow);
}

.statValue {
  font-size: 32px;
  font-weight: 700;
  color: var(--adm-text-primary);
  line-height: 1;
  margin-bottom: 6px;
}

.statLabel {
  font-size: 12px;
  color: var(--adm-text-muted);
}

.sectionTitle {
  font-size: 14px;
  font-weight: 600;
  color: var(--adm-text-primary);
  margin-bottom: 10px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--adm-card-bg);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--adm-card-border);
  font-size: 14px;
}

.table th {
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: var(--adm-text-muted);
  padding: 11px 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--adm-table-header-bg);
  border-bottom: 1px solid var(--adm-card-border);
}

.table td {
  padding: 11px 16px;
  border-bottom: 1px solid var(--adm-table-row-border);
  color: var(--adm-text-secondary);
}

.table tr:last-child td { border-bottom: none; }

.nameLink {
  color: var(--adm-text-primary);
  text-decoration: none;
  font-weight: 500;
}
.nameLink:hover { text-decoration: underline; }
```

- [ ] **Step 2: Open `/admin/dashboard` and verify** — stat cards white, numbers big and black, table clean.

- [ ] **Step 3: Commit**
```bash
git add src/pages/Admin/AdminDashboardPage.module.css
git commit -m "feat(admin): restyle dashboard page"
```

---

### Task 5: Rewrite UsersListPage.module.css

**Files:**
- Modify: `src/pages/Admin/UsersListPage.module.css`

- [ ] **Step 1: Rewrite the file:**

```css
.heading { font-size: 22px; font-weight: 700; color: var(--adm-text-primary); margin-bottom: 20px; }

.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--adm-card-bg);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--adm-card-border);
  margin-bottom: 16px;
}

.table th {
  background: var(--adm-table-header-bg);
  color: var(--adm-text-muted);
  padding: 11px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--adm-card-border);
}

.table td {
  padding: 11px 16px;
  font-size: 13px;
  border-bottom: 1px solid var(--adm-table-row-border);
  color: var(--adm-text-secondary);
}

.table tr:last-child td { border-bottom: none; }

.avatarCell {
  width: 48px;
  padding: 8px 8px 8px 16px !important;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}

.avatarPlaceholder {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--adm-badge-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--adm-text-secondary);
  font-weight: 600;
}

.nameLink {
  color: var(--adm-text-primary);
  font-weight: 500;
  text-decoration: none;
}
.nameLink:hover { text-decoration: underline; }

.badge {
  display: inline-block;
  padding: 2px 9px;
  border-radius: 100px;
  font-size: 11px;
  background: var(--adm-badge-bg);
  color: var(--adm-badge-color);
  border: 1px solid var(--adm-badge-border);
}

.badgeAdmin {
  background: #f0fdf4;
  color: #166534;
  border-color: #bbf7d0;
}

.gearBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  color: var(--adm-text-muted);
  padding: 4px;
}
.gearBtn:hover { color: var(--adm-text-primary); }

.addBtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
  background: var(--adm-btn-bg);
  color: var(--adm-btn-color);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.empty {
  color: var(--adm-text-muted);
  padding: 32px 0;
  text-align: center;
  font-size: 14px;
}
```

- [ ] **Step 2: Open `/admin/users` and verify** — table white, avatars gray circles with initials, add button dark.

- [ ] **Step 3: Commit**
```bash
git add src/pages/Admin/UsersListPage.module.css
git commit -m "feat(admin): restyle users list page"
```

---

### Task 6: Rewrite UserDetailPage.module.css

**Files:**
- Modify: `src/pages/Admin/UserDetailPage.module.css`

- [ ] **Step 1: Rewrite the file:**

```css
.page { max-width: 900px; padding: 28px 32px; }

.backLink {
  display: inline-block;
  font-size: 13px;
  color: var(--adm-text-muted);
  text-decoration: none;
  margin-bottom: 16px;
}
.backLink:hover { color: var(--adm-text-primary); }

.heading { font-size: 22px; font-weight: 700; color: var(--adm-text-primary); margin-bottom: 24px; }

.layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.photoCard {
  width: 200px;
  flex-shrink: 0;
  background: var(--adm-card-bg);
  border-radius: 10px;
  border: 1px solid var(--adm-card-border);
  box-shadow: var(--adm-card-shadow);
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.avatarPlaceholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--adm-badge-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
}

.photoLabel {
  font-size: 13px;
  color: var(--adm-text-muted);
  font-weight: 500;
  cursor: pointer;
  text-align: center;
}
.photoLabel:hover { color: var(--adm-text-primary); text-decoration: underline; }
.photoInput { display: none; }

.dataCard {
  flex: 1;
  background: var(--adm-card-bg);
  border-radius: 10px;
  border: 1px solid var(--adm-card-border);
  box-shadow: var(--adm-card-shadow);
  padding: 24px 28px;
}

.cardTitle {
  font-size: 15px;
  font-weight: 600;
  color: var(--adm-text-primary);
  margin-bottom: 14px;
}

.divider {
  height: 1px;
  background: var(--adm-separator);
  margin-bottom: 18px;
}

.field { margin-bottom: 14px; }

.row3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 0;
}

.label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: var(--adm-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 5px;
}

.value {
  padding: 9px 12px;
  background: var(--adm-content-bg);
  border: 1px solid var(--adm-card-border);
  border-radius: 6px;
  font-size: 13px;
  color: var(--adm-text-secondary);
  min-height: 36px;
}

.input {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--adm-card-border);
  border-radius: 6px;
  font-size: 13px;
  background: var(--adm-card-bg);
  color: var(--adm-text-primary);
  box-sizing: border-box;
}
.input:focus { outline: none; border-color: #9ca3af; }

.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btnEdit, .btnSave {
  padding: 9px 24px;
  background: var(--adm-btn-bg);
  color: var(--adm-btn-color);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}
.btnEdit:hover, .btnSave:hover { opacity: .85; }

.btnCancel {
  padding: 9px 24px;
  background: transparent;
  color: var(--adm-text-muted);
  border: 1px solid var(--adm-card-border);
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
}

.notFound {
  color: var(--adm-text-muted);
  padding: 40px 0;
  font-size: 14px;
}
```

- [ ] **Step 2: Open `/admin/users/<any-id>` and verify** — cards white, fields clean, buttons dark.

- [ ] **Step 3: Commit**
```bash
git add src/pages/Admin/UserDetailPage.module.css
git commit -m "feat(admin): restyle user detail page"
```

---

### Task 7: Rewrite AdminProgressPage.module.css

**Files:**
- Modify: `src/pages/Admin/AdminProgressPage.module.css`

- [ ] **Step 1: Rewrite the file:**

```css
.page { padding: 28px 32px; max-width: 1000px; }

.heading {
  font-size: 22px;
  font-weight: 700;
  color: var(--adm-text-primary);
  margin-bottom: 20px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--adm-card-bg);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--adm-card-border);
  font-size: 13px;
}

.table th {
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  color: var(--adm-text-muted);
  padding: 11px 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  background: var(--adm-table-header-bg);
  border-bottom: 1px solid var(--adm-card-border);
}

.table td {
  padding: 11px 16px;
  border-bottom: 1px solid var(--adm-table-row-border);
  color: var(--adm-text-secondary);
  vertical-align: middle;
}

.table tr:last-child td { border-bottom: none; }

.nameLink {
  color: var(--adm-text-primary);
  text-decoration: none;
  font-weight: 500;
}
.nameLink:hover { text-decoration: underline; }

.progressCell { min-width: 140px; }

.empty {
  color: var(--adm-text-muted);
  font-size: 14px;
  padding: 40px 0;
}
```

- [ ] **Step 2: Open `/admin/progress` and verify** — table clean, progress bars visible.

- [ ] **Step 3: Commit**
```bash
git add src/pages/Admin/AdminProgressPage.module.css
git commit -m "feat(admin): restyle progress page"
```

---

### Task 8: Rewrite CoursesListPage.module.css and CourseDetailPage.module.css

**Files:**
- Modify: `src/pages/Admin/CoursesListPage.module.css`
- Modify: `src/pages/Admin/CourseDetailPage.module.css`

- [ ] **Step 1: Read current CoursesListPage.module.css** to understand existing classes, then rewrite it matching the pattern from Tasks 4–7 (white cards, `--adm-*` variables, no green accents). Replace:
  - All `var(--color-brand)` → `var(--adm-text-primary)` or `var(--adm-btn-bg)`
  - All `var(--color-brand-light)` / `var(--color-brand-dark)` → `var(--adm-badge-bg)` / `var(--adm-badge-color)`
  - All `var(--color-sidebar-bg)` on table headers → `var(--adm-table-header-bg)` with `color: var(--adm-text-muted)`
  - All `var(--color-surface)` → `var(--adm-card-bg)`
  - All `var(--color-border)` → `var(--adm-card-border)`
  - All `var(--shadow-card)` → `var(--adm-card-shadow)`
  - All `var(--color-text-primary)` → `var(--adm-text-primary)`
  - All `var(--color-text-secondary)` → `var(--adm-text-muted)`

- [ ] **Step 2: Apply the same token substitution to CourseDetailPage.module.css.** Additionally, replace `.tag` and `.statusOn` green styles with `--adm-badge-*` tokens.

- [ ] **Step 3: Open `/admin/courses` and `/admin/courses/<id>` and verify** visually.

- [ ] **Step 4: Commit**
```bash
git add src/pages/Admin/CoursesListPage.module.css src/pages/Admin/CourseDetailPage.module.css
git commit -m "feat(admin): restyle courses pages"
```

---

### Task 9: Rewrite NewUserPage.module.css

**Files:**
- Modify: `src/pages/Admin/NewUserPage.module.css`

- [ ] **Step 1: Rewrite the file:**

```css
.heading { font-size: 22px; font-weight: 700; color: var(--adm-text-primary); margin-bottom: 24px; }

.form { max-width: 480px; }

.field { margin-bottom: 16px; }

.label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: var(--adm-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 5px;
}

.input, .select {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--adm-card-border);
  border-radius: 6px;
  font-size: 13px;
  background: var(--adm-card-bg);
  color: var(--adm-text-primary);
  box-sizing: border-box;
}
.input:focus, .select:focus { outline: none; border-color: #9ca3af; }

.actions {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.btnCreate {
  padding: 9px 24px;
  background: var(--adm-btn-bg);
  color: var(--adm-btn-color);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.btnCancel {
  padding: 9px 24px;
  background: transparent;
  color: var(--adm-text-muted);
  border: 1px solid var(--adm-card-border);
  border-radius: 8px;
  font-size: 13px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
}

.avatarPlaceholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--adm-badge-bg);
  margin-bottom: 8px;
}
```

- [ ] **Step 2: Open `/admin/users/new` and verify** — form clean, buttons dark.

- [ ] **Step 3: Commit**
```bash
git add src/pages/Admin/NewUserPage.module.css
git commit -m "feat(admin): restyle new user form"
```

---

## Chunk 3: Admin content padding + final check

### Task 10: Wrap admin content area with padding

The `AdminAppLayout` renders `<Outlet />` inside `<main>`. Currently admin page CSS modules each specify their own padding. Centralise it so pages don't need to repeat it.

**Files:**
- Modify: `src/components/AppLayout.module.css`

- [ ] **Step 1: Add `.adminMain` class to `AppLayout.module.css`:**

```css
.adminMain {
  flex: 1;
  overflow-y: auto;
  min-height: 100vh;
  background: var(--adm-content-bg, #f9fafb);
}
```

- [ ] **Step 2: Update `AdminAppLayout.tsx` to use `adminMain`:**

```tsx
export function AdminAppLayout() {
  return (
    <div className={`${styles.layout} ${styles.adminLayout}`}>
      <AdminSidebar />
      <main className={styles.adminMain}>
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Commit**
```bash
git add src/components/AppLayout.module.css src/components/AdminAppLayout/AdminAppLayout.tsx
git commit -m "feat(admin): admin content area background"
```

---

### Task 11: Final visual pass — all admin pages

- [ ] **Step 1: Start dev server** (`npm run dev` or `yarn dev`)

- [ ] **Step 2: Visit each admin route and verify:**
  - `/admin/dashboard` — 3 stat cards, activity table
  - `/admin/users` — users table, add button
  - `/admin/users/<id>` — photo card + data card
  - `/admin/users/new` — form
  - `/admin/courses` — courses list
  - `/admin/courses/<id>` — course detail
  - `/admin/progress` — progress table

- [ ] **Step 3: Visit a user-facing route** (`/`, `/lesson/<id>`) and confirm it looks unchanged.

- [ ] **Step 4: Commit if any minor fixes were needed**
```bash
git add -p
git commit -m "fix(admin): final visual adjustments"
```
