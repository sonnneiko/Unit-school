# Admin Sidebar Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the shared user sidebar in admin routes with a dedicated AdminSidebar (Главная, Сотрудники, Курсы, Прогресс), add AdminDashboardPage and AdminProgressPage, remove course progress from UserDetailPage.

**Architecture:** Admin routes move out of AppLayout into a new AdminAppLayout that renders AdminSidebar. AdminSidebar reuses Sidebar.module.css styles. Two new pages are added: AdminDashboardPage (company overview stats) and AdminProgressPage (per-employee progress table). UserDetailPage loses its progress section.

**Tech Stack:** React, React Router v6, CSS Modules, TypeScript

---

## Chunk 1: AdminSidebar + AdminAppLayout + routing

### Task 1: Create AdminSidebar

**Files:**
- Create: `src/components/AdminSidebar/AdminSidebar.tsx`

- [ ] **Step 1: Create AdminSidebar.tsx**

```tsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo.svg'
import styles from '../Sidebar/Sidebar.module.css'

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Главная',     icon: '🏠' },
  { to: '/admin/users',     label: 'Сотрудники',  icon: '👥' },
  { to: '/admin/courses',   label: 'Курсы',       icon: '📖' },
  { to: '/admin/progress',  label: 'Прогресс',    icon: '📊' },
]

export function AdminSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.logo}>
          <img src={logo} alt="UnitSchool" className={styles.logoImg} />
          <span className={styles.logoText}>UnitSchool</span>
        </div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className={styles.bottom}>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user?.name}</div>
          <div className={styles.userEmail}>{user?.email}</div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AdminSidebar/AdminSidebar.tsx
git commit -m "feat: add AdminSidebar component"
```

---

### Task 2: Create AdminAppLayout

**Files:**
- Create: `src/components/AdminAppLayout/AdminAppLayout.tsx`

- [ ] **Step 1: Create AdminAppLayout.tsx**

```tsx
import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '../AdminSidebar/AdminSidebar'
import styles from '../AppLayout.module.css'

export function AdminAppLayout() {
  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AdminAppLayout/AdminAppLayout.tsx
git commit -m "feat: add AdminAppLayout"
```

---

### Task 3: Update App.tsx routing

**Files:**
- Modify: `src/App.tsx`

Current admin routes are nested inside `AppLayout` using relative child paths. Move them out into a sibling `AdminRoute` block wrapping `AdminAppLayout`. Note: child routes switch to absolute paths (intentional — cleaner to read at a glance). Also note: `/admin` now redirects to `/admin/dashboard` instead of the previous `/admin/users`.

- [ ] **Step 1: Update App.tsx**

Remove the `AdminRoute` block and its children from inside `<Route element={<AppLayout />}>` (currently last child of AppLayout). Then add it as a sibling of AppLayout, still inside PrivateRoute:

```tsx
<Route element={<AdminRoute />}>
  <Route element={<AdminAppLayout />}>
    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    <Route path="/admin/users" element={<UsersListPage />} />
    <Route path="/admin/users/new" element={<NewUserPage />} />
    <Route path="/admin/users/:id" element={<UserDetailPage />} />
    <Route path="/admin/courses" element={<CoursesListPage />} />
    <Route path="/admin/courses/:id" element={<CourseDetailPage />} />
    <Route path="/admin/progress" element={<AdminProgressPage />} />
  </Route>
</Route>
```

Add imports at the top of the file:
```tsx
import { AdminAppLayout } from './components/AdminAppLayout/AdminAppLayout'
import { AdminDashboardPage } from './pages/Admin/AdminDashboardPage'
import { AdminProgressPage } from './pages/Admin/AdminProgressPage'
```

Remove the now-unused import in the same edit:
```tsx
// Remove this line: import { AdminLayout } from './pages/Admin/AdminLayout'
```

- [ ] **Step 2: Verify app compiles**

```bash
npm run build 2>&1 | tail -20
```

Expected: build errors only for missing `AdminDashboardPage` and `AdminProgressPage` (created in Chunk 2). If other errors appear — especially TypeScript errors about `AdminLayout` — double-check the import was removed in Step 1.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire AdminAppLayout into routing"
```

---

### Task 4: Delete AdminLayout

**Files:**
- Delete: `src/pages/Admin/AdminLayout.tsx`
- Delete: `src/pages/Admin/AdminLayout.module.css`

> **Note:** Run this only after Task 3 is committed. The import of `AdminLayout` must be removed from `App.tsx` first (done in Task 3 Step 1), otherwise the build will fail.

- [ ] **Step 1: Delete files**

```bash
rm src/pages/Admin/AdminLayout.tsx src/pages/Admin/AdminLayout.module.css
```

- [ ] **Step 2: Verify build still passes**

```bash
npm run build 2>&1 | tail -10
```

Expected: errors only for missing `AdminDashboardPage` and `AdminProgressPage` (same as after Task 3).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove AdminLayout (replaced by AdminAppLayout)"
```

---

## Chunk 2: New pages + UserDetailPage cleanup

### Task 5: AdminDashboardPage

**Files:**
- Create: `src/pages/Admin/AdminDashboardPage.tsx`
- Create: `src/pages/Admin/AdminDashboardPage.module.css`

- [ ] **Step 1: Create AdminDashboardPage.module.css**

```css
.page { padding: 40px 48px; max-width: 900px; }

.heading {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 32px;
}

.statsRow {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
}

.statCard {
  flex: 1;
  background: var(--color-card-bg, #1e1e1e);
  border: 1px solid #2a2a2a;
  border-radius: var(--radius-md, 12px);
  padding: 24px;
}

.statValue {
  font-size: 36px;
  font-weight: 700;
  color: var(--color-brand);
  line-height: 1;
  margin-bottom: 8px;
}

.statLabel {
  font-size: 13px;
  color: var(--color-text-secondary);
}

.sectionTitle {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 16px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  padding: 0 12px 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table td {
  padding: 12px;
  border-top: 1px solid #2a2a2a;
  color: var(--color-text-primary);
}

.nameLink {
  color: var(--color-brand);
  text-decoration: none;
  font-weight: 500;
}
.nameLink:hover { text-decoration: underline; }
```

- [ ] **Step 2: Create AdminDashboardPage.tsx**

```tsx
import { Link } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import { useLessons } from '../../context/LessonsContext'
import { calcProgress } from '../../components/slides/slideUtils'
import styles from './AdminDashboardPage.module.css'

export function AdminDashboardPage() {
  const { users } = useUsers()
  const { lessons } = useLessons()

  const employees = users.filter(u => u.role !== 'admin')
  const publishedLessons = lessons.filter(l => l.published)

  const avgProgress = employees.length === 0 ? 0 : Math.round(
    employees.reduce((sum, user) => {
      if (publishedLessons.length === 0) return sum
      const userAvg = publishedLessons.reduce((s, l) => {
        return s + calcProgress(user.progress[l.id] ?? 0, l.slides.length)
      }, 0) / publishedLessons.length
      return sum + userAvg
    }, 0) / employees.length
  )

  const recentEmployees = [...employees]
    .sort((a, b) => {
      if (!a.lastActive) return 1
      if (!b.lastActive) return -1
      return b.lastActive.localeCompare(a.lastActive)
    })
    .slice(0, 5)

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Главная</h1>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{employees.length}</div>
          <div className={styles.statLabel}>Сотрудников</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{publishedLessons.length}</div>
          <div className={styles.statLabel}>Активных курсов</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{avgProgress}%</div>
          <div className={styles.statLabel}>Средний прогресс</div>
        </div>
      </div>

      <div className={styles.sectionTitle}>Последняя активность</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Сотрудник</th>
            <th>Email</th>
            <th>Последняя активность</th>
          </tr>
        </thead>
        <tbody>
          {recentEmployees.map(user => (
            <tr key={user.id}>
              <td>
                <Link to={`/admin/users/${user.id}`} className={styles.nameLink}>
                  {user.name}
                </Link>
              </td>
              <td>{user.email}</td>
              <td>{user.lastActive ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build 2>&1 | tail -10
```

Expected: only error remaining is missing `AdminProgressPage`.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Admin/AdminDashboardPage.tsx src/pages/Admin/AdminDashboardPage.module.css
git commit -m "feat: add AdminDashboardPage with stats and recent activity"
```

---

### Task 6: AdminProgressPage

**Files:**
- Create: `src/pages/Admin/AdminProgressPage.tsx`
- Create: `src/pages/Admin/AdminProgressPage.module.css`

- [ ] **Step 1: Create AdminProgressPage.module.css**

```css
.page { padding: 40px 48px; max-width: 1000px; }

.heading {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 32px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.table th {
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  padding: 0 12px 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.table td {
  padding: 12px;
  border-top: 1px solid #2a2a2a;
  color: var(--color-text-primary);
  vertical-align: middle;
}

.nameLink {
  color: var(--color-brand);
  text-decoration: none;
  font-weight: 500;
}
.nameLink:hover { text-decoration: underline; }

.progressCell { min-width: 140px; }

.empty {
  color: var(--color-text-secondary);
  font-size: 14px;
  padding: 40px 0;
}
```

- [ ] **Step 2: Create AdminProgressPage.tsx**

```tsx
import { Link } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import { useLessons } from '../../context/LessonsContext'
import { calcProgress } from '../../components/slides/slideUtils'
import { ProgressBar } from '../../components/ProgressBar/ProgressBar'
import styles from './AdminProgressPage.module.css'

export function AdminProgressPage() {
  const { users } = useUsers()
  const { lessons } = useLessons()

  const employees = users.filter(u => u.role !== 'admin')
  const publishedLessons = lessons.filter(l => l.published)

  if (employees.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.heading}>Прогресс</h1>
        <p className={styles.empty}>Нет сотрудников</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Прогресс</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Сотрудник</th>
            {publishedLessons.map(l => (
              <th key={l.id}>{l.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map(user => (
            <tr key={user.id}>
              <td>
                <Link to={`/admin/users/${user.id}`} className={styles.nameLink}>
                  {user.name}
                </Link>
              </td>
              {publishedLessons.map(lesson => {
                const pct = calcProgress(
                  user.progress[lesson.id] ?? 0,
                  lesson.slides.length
                )
                return (
                  <td key={lesson.id} className={styles.progressCell}>
                    <ProgressBar value={pct} />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build 2>&1 | tail -10
```

Expected: Build succeeded with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Admin/AdminProgressPage.tsx src/pages/Admin/AdminProgressPage.module.css
git commit -m "feat: add AdminProgressPage with per-employee course progress"
```

---

### Task 7: Remove progress section from UserDetailPage

**Files:**
- Modify: `src/pages/Admin/UserDetailPage.tsx`

Remove the "Прогресс по курсам" block and its unused imports.

- [ ] **Step 1: Edit UserDetailPage.tsx**

Remove these imports:
```tsx
// Remove:
import { useLessons } from '../../context/LessonsContext'
import { calcProgress } from '../../components/slides/slideUtils'
import { ProgressBar } from '../../components/ProgressBar/ProgressBar'
```

Remove `useLessons` hook call:
```tsx
// Remove:
const { lessons } = useLessons()
```

Remove `publishedLessons` variable and the entire progress section JSX:
```tsx
// Remove:
const publishedLessons = lessons.filter(l => l.published)

// Remove this JSX block:
<div className={styles.sectionTitle}>Прогресс по курсам</div>
{publishedLessons.map(lesson => {
  const slideIndex = user.progress[lesson.id] ?? 0
  const percent = calcProgress(slideIndex, lesson.slides.length)
  return (
    <div key={lesson.id} className={styles.courseRow}>
      <div className={styles.courseTitle}>{lesson.title}</div>
      <div className={styles.progressWrap}>
        <ProgressBar value={percent} />
      </div>
    </div>
  )
})}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build 2>&1 | tail -10
```

Expected: Build succeeded with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Admin/UserDetailPage.tsx
git commit -m "feat: remove course progress from UserDetailPage (moved to AdminProgressPage)"
```

---

## Done

All tasks complete. The admin panel now has its own sidebar with Главная, Сотрудники, Курсы, Прогресс. The user-facing app sidebar is unchanged.
