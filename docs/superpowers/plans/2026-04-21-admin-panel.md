# Admin Panel Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single admin page with a multi-page admin panel covering employee management, employee detail, course management, and course detail.

**Architecture:** Six sub-routes under `/admin` protected by `AdminRoute`, all reading/writing shared React context (`UsersContext`, `LessonsContext`). `UsersProvider` wraps `AuthProvider` at the root so login reads live user state. All data is mock-based; no persistence across page reloads.

**Tech Stack:** React 18, TypeScript, React Router v6, Vitest + Testing Library, CSS Modules.

---

## Chunk 1: Foundations

### Task 1: Add `photo` field to User type

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Add the field**

In `src/types/index.ts`, add `photo?: string` to the `User` interface after the `lastActive` field:

```ts
export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  progress: Record<string, number>
  lastActive?: string
  photo?: string  // base64 data URL from FileReader.readAsDataURL
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add optional photo field to User type"
```

---

### Task 2: Extract ProgressBar component

**Files:**
- Create: `src/components/ProgressBar/ProgressBar.tsx`
- Create: `src/components/ProgressBar/ProgressBar.module.css`
- Create: `src/test/ProgressBar.test.tsx`
- Modify: `src/components/LessonCard/LessonCard.tsx` (use new component)
- Modify: `src/components/LessonCard/LessonCard.module.css` (remove progress styles)

- [ ] **Step 1: Write the failing test**

Create `src/test/ProgressBar.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from '../components/ProgressBar/ProgressBar'

describe('ProgressBar', () => {
  it('renders the percentage label by default', () => {
    render(<ProgressBar value={57} />)
    expect(screen.getByText('57%')).toBeInTheDocument()
  })

  it('hides the label when showLabel is false', () => {
    render(<ProgressBar value={57} showLabel={false} />)
    expect(screen.queryByText('57%')).not.toBeInTheDocument()
  })

  it('renders fill div with correct width style', () => {
    const { container } = render(<ProgressBar value={75} />)
    const fill = container.querySelector('[style*="width: 75%"]')
    expect(fill).not.toBeNull()
  })

  it('clamps to 0 when value is negative', () => {
    const { container } = render(<ProgressBar value={-5} />)
    const fill = container.querySelector('[style*="width: 0%"]')
    expect(fill).not.toBeNull()
  })

  it('clamps to 100 when value exceeds 100', () => {
    const { container } = render(<ProgressBar value={120} />)
    const fill = container.querySelector('[style*="width: 100%"]')
    expect(fill).not.toBeNull()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run src/test/ProgressBar.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create the CSS module**

Create `src/components/ProgressBar/ProgressBar.module.css` — copy the progress styles from `LessonCard.module.css`:

```css
.row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar {
  flex: 1;
  height: 6px;
  background: var(--color-border);
  border-radius: 100px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: var(--color-brand);
  border-radius: 100px;
  transition: width .3s ease;
}

.label {
  font-size: 12px;
  color: var(--color-text-secondary);
  min-width: 32px;
  text-align: right;
}
```

- [ ] **Step 4: Create the component**

Create `src/components/ProgressBar/ProgressBar.tsx`:

```tsx
import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  value: number
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ value, showLabel = true, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={`${styles.row}${className ? ` ${className}` : ''}`}>
      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${clamped}%` }} />
      </div>
      {showLabel && <span className={styles.label}>{clamped}%</span>}
    </div>
  )
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npx vitest run src/test/ProgressBar.test.tsx
```

Expected: 5 passing.

- [ ] **Step 6: Update LessonCard to use ProgressBar**

In `src/components/LessonCard/LessonCard.tsx`, replace the inline progress markup:

```tsx
import { Link } from 'react-router-dom'
import type { Lesson } from '../../types'
import { calcProgress } from '../slides/slideUtils'
import { ProgressBar } from '../ProgressBar/ProgressBar'
import styles from './LessonCard.module.css'

interface Props {
  lesson: Lesson
  progress: number
}

export function LessonCard({ lesson, progress }: Props) {
  const percent = calcProgress(progress, lesson.slides.length)

  if (!lesson.published) {
    return (
      <div className={`${styles.card} ${styles.locked}`}>
        <div className={styles.tag}>{lesson.tag}</div>
        <div className={styles.title}>{lesson.title}</div>
        <span className={styles.lockBadge}>Скоро</span>
      </div>
    )
  }

  return (
    <Link to={`/lesson/${lesson.id}`} className={styles.card}>
      <div className={styles.tag}>{lesson.tag}</div>
      <div className={styles.title}>{lesson.title}</div>
      <ProgressBar value={percent} />
    </Link>
  )
}
```

- [ ] **Step 7: Remove progress styles from LessonCard.module.css**

Delete these rules from `src/components/LessonCard/LessonCard.module.css` (they've moved to ProgressBar.module.css):

```css
.progressRow { ... }   /* delete */
.progressBar { ... }   /* delete */
.progressFill { ... }  /* delete */
.percent { ... }       /* delete */
```

- [ ] **Step 8: Run all tests — expect pass**

```bash
npx vitest run
```

Expected: all passing.

- [ ] **Step 9: Commit**

```bash
git add src/components/ProgressBar/ src/components/LessonCard/ src/test/ProgressBar.test.tsx
git commit -m "feat: extract ProgressBar shared component from LessonCard"
```

---

### Task 3: Create UsersContext

**Files:**
- Create: `src/context/UsersContext.tsx`
- Create: `src/test/UsersContext.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/test/UsersContext.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsersProvider, useUsers } from '../context/UsersContext'

function Consumer() {
  const { users, passwords, addUser, updateUser, updatePassword } = useUsers()
  return (
    <div>
      <span data-testid="count">{users.length}</span>
      <span data-testid="pwd-user1">{passwords['user-1']}</span>
      <button onClick={() => addUser(
        { id: 'new-1', name: 'Новый', email: 'new@test.ru', role: 'user', progress: {} },
        'pass123'
      )}>Add</button>
      <button onClick={() => updateUser('user-1', { name: 'Изменён' })}>UpdateName</button>
      <button onClick={() => updatePassword('user-1', 'newpass')}>UpdatePwd</button>
      <span data-testid="name-user1">{users.find(u => u.id === 'user-1')?.name}</span>
      <span data-testid="pwd-after">{passwords['user-1']}</span>
    </div>
  )
}

describe('UsersContext', () => {
  it('initialises with mockUsers count', () => {
    render(<UsersProvider><Consumer /></UsersProvider>)
    expect(Number(screen.getByTestId('count').textContent)).toBeGreaterThan(0)
  })

  it('passwords are keyed by userId', () => {
    render(<UsersProvider><Consumer /></UsersProvider>)
    expect(screen.getByTestId('pwd-user1').textContent).toBe('password123')
  })

  it('addUser increases user count', async () => {
    render(<UsersProvider><Consumer /></UsersProvider>)
    const before = Number(screen.getByTestId('count').textContent)
    await userEvent.click(screen.getByText('Add'))
    expect(Number(screen.getByTestId('count').textContent)).toBe(before + 1)
  })

  it('updateUser changes a field', async () => {
    render(<UsersProvider><Consumer /></UsersProvider>)
    await userEvent.click(screen.getByText('UpdateName'))
    expect(screen.getByTestId('name-user1').textContent).toBe('Изменён')
  })

  it('updatePassword changes password by userId', async () => {
    render(<UsersProvider><Consumer /></UsersProvider>)
    await userEvent.click(screen.getByText('UpdatePwd'))
    expect(screen.getByTestId('pwd-after').textContent).toBe('newpass')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run src/test/UsersContext.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create UsersContext**

Create `src/context/UsersContext.tsx`:

```tsx
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import { mockUsers, mockPasswords } from '../data/users'

interface UsersContextValue {
  users: User[]
  passwords: Record<string, string>
  addUser: (user: User, password: string) => void
  updateUser: (id: string, patch: Partial<User>) => void
  updatePassword: (id: string, newPassword: string) => void
}

const UsersContext = createContext<UsersContextValue | null>(null)

function buildInitialPasswords(): Record<string, string> {
  const map: Record<string, string> = {}
  for (const user of mockUsers) {
    const pwd = mockPasswords[user.email]
    if (pwd) map[user.id] = pwd
  }
  return map
}

export function UsersProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [passwords, setPasswords] = useState<Record<string, string>>(buildInitialPasswords)

  function addUser(user: User, password: string) {
    setUsers(prev => [...prev, user])
    setPasswords(prev => ({ ...prev, [user.id]: password }))
  }

  function updateUser(id: string, patch: Partial<User>) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...patch } : u))
  }

  function updatePassword(id: string, newPassword: string) {
    setPasswords(prev => ({ ...prev, [id]: newPassword }))
  }

  return (
    <UsersContext.Provider value={{ users, passwords, addUser, updateUser, updatePassword }}>
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers(): UsersContextValue {
  const ctx = useContext(UsersContext)
  if (!ctx) throw new Error('useUsers must be used within UsersProvider')
  return ctx
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npx vitest run src/test/UsersContext.test.tsx
```

Expected: 5 passing.

- [ ] **Step 5: Commit**

```bash
git add src/context/UsersContext.tsx src/test/UsersContext.test.tsx
git commit -m "feat: add UsersContext with addUser/updateUser/updatePassword"
```

---

### Task 4: Create LessonsContext

**Files:**
- Create: `src/context/LessonsContext.tsx`
- Create: `src/test/LessonsContext.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/test/LessonsContext.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LessonsProvider, useLessons } from '../context/LessonsContext'

function Consumer() {
  const { lessons, togglePublished } = useLessons()
  return (
    <div>
      <span data-testid="count">{lessons.length}</span>
      <span data-testid="day1-published">{String(lessons.find(l => l.id === 'day-1')?.published)}</span>
      <button onClick={() => togglePublished('day-1')}>Toggle</button>
    </div>
  )
}

describe('LessonsContext', () => {
  it('initialises with mockLessons', () => {
    render(<LessonsProvider><Consumer /></LessonsProvider>)
    expect(Number(screen.getByTestId('count').textContent)).toBeGreaterThan(0)
  })

  it('day-1 starts published', () => {
    render(<LessonsProvider><Consumer /></LessonsProvider>)
    expect(screen.getByTestId('day1-published').textContent).toBe('true')
  })

  it('togglePublished flips published state', async () => {
    render(<LessonsProvider><Consumer /></LessonsProvider>)
    await userEvent.click(screen.getByText('Toggle'))
    expect(screen.getByTestId('day1-published').textContent).toBe('false')
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run src/test/LessonsContext.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create LessonsContext**

Create `src/context/LessonsContext.tsx`:

```tsx
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Lesson } from '../types'
import { mockLessons } from '../data/lessons'

interface LessonsContextValue {
  lessons: Lesson[]
  togglePublished: (id: string) => void
}

const LessonsContext = createContext<LessonsContextValue | null>(null)

export function LessonsProvider({ children }: { children: ReactNode }) {
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons)

  function togglePublished(id: string) {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, published: !l.published } : l))
  }

  return (
    <LessonsContext.Provider value={{ lessons, togglePublished }}>
      {children}
    </LessonsContext.Provider>
  )
}

export function useLessons(): LessonsContextValue {
  const ctx = useContext(LessonsContext)
  if (!ctx) throw new Error('useLessons must be used within LessonsProvider')
  return ctx
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npx vitest run src/test/LessonsContext.test.tsx
```

Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
git add src/context/LessonsContext.tsx src/test/LessonsContext.test.tsx
git commit -m "feat: add LessonsContext with togglePublished"
```

---

### Task 5: Refactor AuthContext + update tests

**Files:**
- Modify: `src/context/AuthContext.tsx`
- Modify: `src/test/AuthContext.test.tsx`
- Modify: `src/test/Dashboard.test.tsx`
- Modify: `src/test/routes.test.tsx`
- Modify: `src/test/LessonCard.test.tsx`
- Modify: `src/test/SlideNav.test.tsx`

- [ ] **Step 1: Refactor AuthContext to use UsersContext**

Replace `src/context/AuthContext.tsx` with the following (key change: `login` reads from `useUsers()` instead of the frozen `mockUsers`/`mockPasswords` constants):

```tsx
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types'
import { useUsers } from './UsersContext'

const STORAGE_KEY = 'unit_school_user'

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProgress: (lessonId: string, slideIndex: number) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function loadUserFromStorage(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { users, passwords } = useUsers()
  const [user, setUser] = useState<User | null>(loadUserFromStorage)

  async function login(email: string, password: string) {
    const found = users.find(u => u.email === email)
    if (!found) throw new Error('Пользователь не найден')
    const expectedPassword = passwords[found.id]
    if (!expectedPassword || expectedPassword !== password) {
      throw new Error('Неверный email или пароль')
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found))
    setUser(found)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  function updateProgress(lessonId: string, slideIndex: number) {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, progress: { ...prev.progress, [lessonId]: slideIndex } }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProgress }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

- [ ] **Step 3: Update AuthContext.test.tsx**

Replace every `render(<AuthProvider>…</AuthProvider>)` with `render(<UsersProvider><AuthProvider>…</AuthProvider></UsersProvider>)`. Also add the import. Full file:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsersProvider } from '../context/UsersContext'
import { AuthProvider, useAuth } from '../context/AuthContext'

function TestConsumer() {
  const { user, login, logout, updateProgress } = useAuth()
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'null'}</span>
      <span data-testid="progress">{JSON.stringify(user?.progress ?? {})}</span>
      <button onClick={() => login('user@unitpay.ru', 'password123')}>Login User</button>
      <button onClick={() => login('admin@unitpay.ru', 'admin123')}>Login Admin</button>
      <button onClick={() => login('bad@email.ru', 'wrongpass').catch(() => {})}>Bad Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => updateProgress('day-1', 3)}>Update Progress</button>
    </div>
  )
}

function wrap(ui: React.ReactElement) {
  return render(<UsersProvider><AuthProvider>{ui}</AuthProvider></UsersProvider>)
}

beforeEach(() => { localStorage.clear() })

describe('AuthContext', () => {
  it('starts with no user', () => {
    wrap(<TestConsumer />)
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('logs in a regular user', async () => {
    wrap(<TestConsumer />)
    await userEvent.click(screen.getByText('Login User'))
    expect(screen.getByTestId('user').textContent).toBe('user@unitpay.ru')
  })

  it('logs in an admin user', async () => {
    wrap(<TestConsumer />)
    await userEvent.click(screen.getByText('Login Admin'))
    expect(screen.getByTestId('user').textContent).toBe('admin@unitpay.ru')
  })

  it('does not change user on bad credentials', async () => {
    wrap(<TestConsumer />)
    await userEvent.click(screen.getByText('Bad Login'))
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('logs out and clears user', async () => {
    wrap(<TestConsumer />)
    await userEvent.click(screen.getByText('Login User'))
    await userEvent.click(screen.getByText('Logout'))
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('persists session to localStorage on login', async () => {
    wrap(<TestConsumer />)
    await userEvent.click(screen.getByText('Login User'))
    expect(localStorage.getItem('unit_school_user')).not.toBeNull()
  })

  it('restores session from localStorage on mount', () => {
    const user = { id: 'user-1', name: 'Соня', email: 'user@unitpay.ru', role: 'user', progress: {} }
    localStorage.setItem('unit_school_user', JSON.stringify(user))
    wrap(<TestConsumer />)
    expect(screen.getByTestId('user').textContent).toBe('user@unitpay.ru')
  })

  it('updateProgress stores slideIndex for lessonId', async () => {
    wrap(<TestConsumer />)
    await userEvent.click(screen.getByText('Login User'))
    await userEvent.click(screen.getByText('Update Progress'))
    expect(screen.getByTestId('progress').textContent).toBe('{"day-1":3}')
  })

  it('updateProgress persists to localStorage', async () => {
    wrap(<TestConsumer />)
    await userEvent.click(screen.getByText('Login User'))
    await userEvent.click(screen.getByText('Update Progress'))
    const stored = JSON.parse(localStorage.getItem('unit_school_user') ?? '{}')
    expect(stored.progress['day-1']).toBe(3)
  })
})
```

- [ ] **Step 4: Update Dashboard.test.tsx**

Replace every `render(<AuthProvider>…</AuthProvider>)` with the full provider stack. Full file:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { LessonsProvider } from '../context/LessonsContext'
import { AuthProvider } from '../context/AuthContext'
import { DashboardPage } from '../pages/Dashboard/Dashboard'

beforeEach(() => localStorage.clear())

function renderDashboard(user = {
  id: 'user-1', name: 'Соня Алхазова', email: 'user@unitpay.ru', role: 'user', progress: {}
}) {
  localStorage.setItem('unit_school_user', JSON.stringify(user))
  return render(
    <UsersProvider>
      <LessonsProvider>
        <AuthProvider>
          <MemoryRouter>
            <DashboardPage />
          </MemoryRouter>
        </AuthProvider>
      </LessonsProvider>
    </UsersProvider>
  )
}

describe('DashboardPage', () => {
  it('shows greeting with first name', () => {
    renderDashboard()
    expect(screen.getByText(/Привет, Соня/)).toBeInTheDocument()
  })

  it('shows Day 1 lesson card', () => {
    renderDashboard()
    expect(screen.getByText('Знакомство с UnitPay')).toBeInTheDocument()
  })

  it('shows Day 2 as locked', () => {
    renderDashboard()
    expect(screen.getByText('Скоро')).toBeInTheDocument()
  })

  it('shows saved progress on Day 1', () => {
    renderDashboard({ id: 'user-1', name: 'Соня Алхазова', email: 'user@unitpay.ru', role: 'user', progress: { 'day-1': 4 } })
    expect(screen.getByText('57%')).toBeInTheDocument()
  })
})
```

- [ ] **Step 5: Update routes.test.tsx**

Add `UsersProvider` wrap around `AuthProvider` in both `wrap` helpers. Full file:

```tsx
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { AuthProvider } from '../context/AuthContext'
import { PrivateRoute } from '../components/PrivateRoute'
import { AdminRoute } from '../components/AdminRoute'

function wrap(ui: React.ReactElement, initialPath = '/') {
  return render(
    <UsersProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={[initialPath]}>{ui}</MemoryRouter>
      </AuthProvider>
    </UsersProvider>
  )
}

beforeEach(() => localStorage.clear())
afterEach(() => localStorage.clear())

describe('PrivateRoute', () => {
  it('redirects unauthenticated user to /login', () => {
    wrap(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<div>Dashboard</div>} />
        </Route>
      </Routes>
    )
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    localStorage.setItem('unit_school_user', JSON.stringify({
      id: 'u1', name: 'Test', email: 'user@unitpay.ru', role: 'user', progress: {}
    }))
    wrap(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<div>Dashboard</div>} />
        </Route>
      </Routes>
    )
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })
})

describe('AdminRoute', () => {
  it('redirects non-admin user to /', () => {
    localStorage.setItem('unit_school_user', JSON.stringify({
      id: 'u1', name: 'Test', email: 'user@unitpay.ru', role: 'user', progress: {}
    }))
    wrap(
      <Routes>
        <Route path="/" element={<div>Dashboard</div>} />
        <Route element={<PrivateRoute />}>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin</div>} />
          </Route>
        </Route>
      </Routes>,
      '/admin'
    )
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.queryByText('Admin')).not.toBeInTheDocument()
  })

  it('renders admin page for admin user', () => {
    localStorage.setItem('unit_school_user', JSON.stringify({
      id: 'a1', name: 'Admin', email: 'admin@unitpay.ru', role: 'admin', progress: {}
    }))
    wrap(
      <Routes>
        <Route path="/" element={<div>Dashboard</div>} />
        <Route element={<PrivateRoute />}>
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<div>Admin</div>} />
          </Route>
        </Route>
      </Routes>,
      '/admin'
    )
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Check and update LessonCard.test.tsx and SlideNav.test.tsx**

Open each test file. If either renders a component that uses `useAuth()` (directly or indirectly), wrap with `UsersProvider` + `AuthProvider`. If they only test presentational components with no auth dependency, no change is needed.

Run to confirm:
```bash
npx vitest run src/test/LessonCard.test.tsx src/test/SlideNav.test.tsx
```

If any fail with "useUsers must be used within UsersProvider", add the wrapper.

- [ ] **Step 7: Run all tests — expect pass**

```bash
npx vitest run
```

Expected: all passing.

- [ ] **Step 8: Commit**

```bash
git add src/context/AuthContext.tsx src/test/AuthContext.test.tsx src/test/Dashboard.test.tsx src/test/routes.test.tsx src/test/LessonCard.test.tsx src/test/SlideNav.test.tsx
git commit -m "feat: refactor AuthContext to read from UsersContext; update tests"
```

---

### Task 6: Update Dashboard to use LessonsContext

**Files:**
- Modify: `src/pages/Dashboard/Dashboard.tsx`

- [ ] **Step 1: Update Dashboard to read from context**

Replace `mockLessons` import with `useLessons`:

```tsx
import { useAuth } from '../../context/AuthContext'
import { useLessons } from '../../context/LessonsContext'
import { LessonCard } from '../../components/LessonCard/LessonCard'
import styles from './Dashboard.module.css'

export function DashboardPage() {
  const { user } = useAuth()
  const { lessons } = useLessons()
  const progress = user?.progress ?? {}

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.greeting}>Привет, {user?.name?.split(' ')[0]}! 🐾</h1>
        <p className={styles.subtitle}>Продолжай обучение — каждый шаг важен</p>
      </header>
      <section className={styles.grid}>
        {lessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            progress={progress[lesson.id] ?? 0}
          />
        ))}
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Run all tests — expect pass**

```bash
npx vitest run
```

Expected: all passing.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Dashboard/Dashboard.tsx
git commit -m "feat: Dashboard reads lessons from LessonsContext"
```

---

### Task 7: AdminLayout + App.tsx routing

**Files:**
- Create: `src/pages/Admin/AdminLayout.tsx`
- Create: `src/pages/Admin/AdminLayout.module.css`
- Modify: `src/App.tsx`
- Delete: `src/pages/Admin/Admin.tsx` (replaced by new pages)
- Delete: `src/pages/Admin/Admin.module.css`

- [ ] **Step 1: Create AdminLayout**

Create `src/pages/Admin/AdminLayout.tsx`:

```tsx
import { Outlet, Link, useLocation } from 'react-router-dom'
import styles from './AdminLayout.module.css'

const crumbMap: Record<string, string> = {
  '/admin/users': 'Сотрудники',
  '/admin/users/new': 'Новый сотрудник',
  '/admin/courses': 'Курсы',
}

export function AdminLayout() {
  const { pathname } = useLocation()

  const segments = pathname.split('/').filter(Boolean)
  const crumbs: { label: string; to: string }[] = [
    { label: 'Администрирование', to: '/admin/users' },
  ]
  if (segments.length > 1) {
    const section = `/${segments[0]}/${segments[1]}`
    const label = crumbMap[section]
    if (label) crumbs.push({ label, to: section })
  }
  if (segments.length > 2) {
    crumbs.push({ label: segments[2], to: pathname })
  }

  return (
    <div className={styles.layout}>
      <nav className={styles.breadcrumbs}>
        {crumbs.map((c, i) => (
          <span key={c.to}>
            {i > 0 && <span className={styles.sep}>/</span>}
            {i < crumbs.length - 1
              ? <Link to={c.to} className={styles.link}>{c.label}</Link>
              : <span className={styles.current}>{c.label}</span>
            }
          </span>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
```

- [ ] **Step 2: Create AdminLayout.module.css**

Create `src/pages/Admin/AdminLayout.module.css`:

```css
.layout { padding: 40px 48px; max-width: 900px; }

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 28px;
}

.sep { margin: 0 4px; }

.link {
  color: var(--color-brand);
  text-decoration: none;
}
.link:hover { text-decoration: underline; }

.current { font-weight: 600; color: var(--color-text-primary); }
```

- [ ] **Step 3: Update App.tsx**

Replace `src/App.tsx` with the full provider + route tree:

```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UsersProvider } from './context/UsersContext'
import { LessonsProvider } from './context/LessonsContext'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import { AdminRoute } from './components/AdminRoute'
import { AppLayout } from './components/AppLayout'
import { AdminLayout } from './pages/Admin/AdminLayout'
import { LoginPage } from './pages/Login/Login'
import { DashboardPage } from './pages/Dashboard/Dashboard'
import { LessonPage } from './pages/Lesson/Lesson'
import { NotFoundPage } from './pages/NotFound/NotFound'
import { PlaceholderPage } from './pages/Placeholder/Placeholder'
import { UsersListPage } from './pages/Admin/UsersListPage'
import { NewUserPage } from './pages/Admin/NewUserPage'
import { UserDetailPage } from './pages/Admin/UserDetailPage'
import { CoursesListPage } from './pages/Admin/CoursesListPage'
import { CourseDetailPage } from './pages/Admin/CourseDetailPage'
import { useAuth } from './context/AuthContext'

function LoginRoute() {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : <LoginPage />
}

export default function App() {
  return (
    <UsersProvider>
      <LessonsProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginRoute />} />
              <Route element={<PrivateRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/lesson/:id" element={<LessonPage />} />
                  <Route path="/courses" element={<PlaceholderPage title="Курсы" />} />
                  <Route path="/progress" element={<PlaceholderPage title="Прогресс" />} />
                  <Route path="/profile" element={<PlaceholderPage title="Профиль" />} />
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Navigate to="/admin/users" replace />} />
                      <Route path="users" element={<UsersListPage />} />
                      <Route path="users/new" element={<NewUserPage />} />
                      <Route path="users/:id" element={<UserDetailPage />} />
                      <Route path="courses" element={<CoursesListPage />} />
                      <Route path="courses/:id" element={<CourseDetailPage />} />
                    </Route>
                  </Route>
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LessonsProvider>
    </UsersProvider>
  )
}
```

- [ ] **Step 4: Create stub pages so App.tsx compiles**

App.tsx imports 5 new page components that don't exist yet. Create minimal stubs so TypeScript doesn't block compilation. Each stub:

`src/pages/Admin/UsersListPage.tsx`:
```tsx
export function UsersListPage() { return <div>UsersListPage</div> }
```

`src/pages/Admin/NewUserPage.tsx`:
```tsx
export function NewUserPage() { return <div>NewUserPage</div> }
```

`src/pages/Admin/UserDetailPage.tsx`:
```tsx
export function UserDetailPage() { return <div>UserDetailPage</div> }
```

`src/pages/Admin/CoursesListPage.tsx`:
```tsx
export function CoursesListPage() { return <div>CoursesListPage</div> }
```

`src/pages/Admin/CourseDetailPage.tsx`:
```tsx
export function CourseDetailPage() { return <div>CourseDetailPage</div> }
```

- [ ] **Step 5: Delete old Admin files**

```bash
rm src/pages/Admin/Admin.tsx src/pages/Admin/Admin.module.css
```

- [ ] **Step 6: Run all tests — expect pass**

```bash
npx vitest run
```

Expected: all passing.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Admin/ src/App.tsx src/context/
git commit -m "feat: add AdminLayout and nested admin routes; stub new pages"
```

---

## Chunk 2: Users Management Pages

### Task 8: SettingsModal component

**Files:**
- Create: `src/components/SettingsModal/SettingsModal.tsx`
- Create: `src/components/SettingsModal/SettingsModal.module.css`
- Create: `src/test/SettingsModal.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/test/SettingsModal.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsersProvider } from '../context/UsersContext'
import { SettingsModal } from '../components/SettingsModal/SettingsModal'
import type { User } from '../types'

const mockUser: User = {
  id: 'user-1',
  name: 'Соня Алхазова',
  email: 'user@unitpay.ru',
  role: 'user',
  progress: {},
}

function wrap(onClose = vi.fn()) {
  return render(
    <UsersProvider>
      <SettingsModal user={mockUser} onClose={onClose} />
    </UsersProvider>
  )
}

describe('SettingsModal', () => {
  it('renders email field pre-filled', () => {
    wrap()
    expect(screen.getByDisplayValue('user@unitpay.ru')).toBeInTheDocument()
  })

  it('renders role select pre-filled', () => {
    wrap()
    expect(screen.getByDisplayValue('Сотрудник')).toBeInTheDocument()
  })

  it('calls onClose when cancel is clicked', async () => {
    const onClose = vi.fn()
    wrap(onClose)
    await userEvent.click(screen.getByText('Отмена'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose after saving', async () => {
    const onClose = vi.fn()
    wrap(onClose)
    await userEvent.click(screen.getByText('Сохранить'))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run src/test/SettingsModal.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create the CSS module**

Create `src/components/SettingsModal/SettingsModal.module.css`:

```css
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 28px 32px;
  width: 380px;
  box-shadow: 0 8px 32px rgba(0,0,0,.18);
}

.title {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 20px;
}

.field { margin-bottom: 14px; }

.label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.input, .select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm, 6px);
  font-size: 14px;
  background: var(--color-bg);
  color: var(--color-text-primary);
  box-sizing: border-box;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 22px;
}

.btnSave {
  padding: 8px 20px;
  background: var(--color-brand);
  color: #fff;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
}

.btnCancel {
  padding: 8px 20px;
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: 100px;
  font-size: 13px;
}
```

- [ ] **Step 4: Create the component**

Create `src/components/SettingsModal/SettingsModal.tsx`:

```tsx
import { useState } from 'react'
import type { User } from '../../types'
import { useUsers } from '../../context/UsersContext'
import styles from './SettingsModal.module.css'

interface Props {
  user: User
  onClose: () => void
}

export function SettingsModal({ user, onClose }: Props) {
  const { updateUser, updatePassword } = useUsers()
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>(user.role)

  function handleSave() {
    updateUser(user.id, { email, role })
    if (password) updatePassword(user.id, password)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.title}>Настройки пользователя</div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="settings-email">Email</label>
          <input id="settings-email" className={styles.input} value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="settings-password">Новый пароль</label>
          <input id="settings-password" className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Оставьте пустым, чтобы не менять" />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="settings-role">Роль</label>
          <select id="settings-role" className={styles.select} value={role} onChange={e => setRole(e.target.value as 'user' | 'admin')}>
            <option value="user">Сотрудник</option>
            <option value="admin">Администратор</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onClose}>Отмена</button>
          <button className={styles.btnSave} onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npx vitest run src/test/SettingsModal.test.tsx
```

Expected: 4 passing.

- [ ] **Step 6: Commit**

```bash
git add src/components/SettingsModal/ src/test/SettingsModal.test.tsx
git commit -m "feat: add SettingsModal for editing user email/password/role"
```

---

### Task 9: UsersListPage

**Files:**
- Modify: `src/pages/Admin/UsersListPage.tsx` (replace stub)
- Create: `src/pages/Admin/UsersListPage.module.css`
- Create: `src/test/UsersListPage.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/test/UsersListPage.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { UsersListPage } from '../pages/Admin/UsersListPage'

function wrap() {
  return render(
    <UsersProvider>
      <MemoryRouter>
        <UsersListPage />
      </MemoryRouter>
    </UsersProvider>
  )
}

beforeEach(() => localStorage.clear())

describe('UsersListPage', () => {
  it('shows non-admin users', () => {
    wrap()
    expect(screen.getByText('Соня Алхазова')).toBeInTheDocument()
  })

  it('does not show admin users', () => {
    wrap()
    expect(screen.queryByText('Администратор')).not.toBeInTheDocument()
  })

  it('shows "+ Добавить сотрудника" button', () => {
    wrap()
    expect(screen.getByText(/Добавить сотрудника/)).toBeInTheDocument()
  })

  it('opens SettingsModal when gear icon is clicked', async () => {
    wrap()
    await userEvent.click(screen.getByRole('button', { name: /⚙/ }))
    expect(screen.getByText('Настройки пользователя')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run src/test/UsersListPage.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create CSS module**

Create `src/pages/Admin/UsersListPage.module.css` — reuse admin table styles pattern:

```css
.heading { font-size: 26px; font-weight: 700; margin-bottom: 28px; }

.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-card);
  margin-bottom: 20px;
}

.table th {
  background: var(--color-sidebar-bg);
  color: #fff;
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
}

.table td {
  padding: 12px 16px;
  font-size: 14px;
  border-bottom: 1px solid var(--color-border);
}

.table tr:last-child td { border-bottom: none; }

.nameLink {
  color: var(--color-brand);
  font-weight: 600;
  text-decoration: none;
}
.nameLink:hover { text-decoration: underline; }

.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 12px;
  background: var(--color-bg);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.badgeAdmin {
  background: var(--color-brand-light);
  color: var(--color-brand-dark);
  border-color: var(--color-brand);
}

.gearBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: var(--color-text-secondary);
  padding: 4px;
}
.gearBtn:hover { color: var(--color-text-primary); }

.addBtn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: var(--color-brand);
  color: #fff;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.empty {
  color: var(--color-text-secondary);
  padding: 32px 0;
  text-align: center;
}
```

- [ ] **Step 4: Implement UsersListPage**

Replace stub in `src/pages/Admin/UsersListPage.tsx`:

```tsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import { SettingsModal } from '../../components/SettingsModal/SettingsModal'
import type { User } from '../../types'
import styles from './UsersListPage.module.css'

export function UsersListPage() {
  const { users } = useUsers()
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const employees = users.filter(u => u.role !== 'admin')

  return (
    <>
      <h1 className={styles.heading}>Сотрудники</h1>

      {employees.length === 0 ? (
        <p className={styles.empty}>Нет сотрудников</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Последняя активность</th>
              <th></th>
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
                <td>{user.email}</td>
                <td>
                  <span className={`${styles.badge} ${user.role === 'admin' ? styles.badgeAdmin : ''}`}>
                    {user.role === 'admin' ? 'Администратор' : 'Сотрудник'}
                  </span>
                </td>
                <td>{user.lastActive ?? '—'}</td>
                <td>
                  <button
                    className={styles.gearBtn}
                    onClick={() => setEditingUser(user)}
                    aria-label="⚙"
                  >
                    ⚙
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/admin/users/new" className={styles.addBtn}>
        + Добавить сотрудника
      </Link>

      {editingUser && (
        <SettingsModal user={editingUser} onClose={() => setEditingUser(null)} />
      )}
    </>
  )
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npx vitest run src/test/UsersListPage.test.tsx
```

Expected: 4 passing.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Admin/UsersListPage.tsx src/pages/Admin/UsersListPage.module.css src/test/UsersListPage.test.tsx
git commit -m "feat: implement UsersListPage with SettingsModal"
```

---

### Task 10: NewUserPage

**Files:**
- Modify: `src/pages/Admin/NewUserPage.tsx` (replace stub)
- Create: `src/pages/Admin/NewUserPage.module.css`
- Create: `src/test/NewUserPage.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/test/NewUserPage.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { NewUserPage } from '../pages/Admin/NewUserPage'

function wrap() {
  return render(
    <UsersProvider>
      <MemoryRouter initialEntries={['/admin/users/new']}>
        <Routes>
          <Route path="/admin/users/new" element={<NewUserPage />} />
          <Route path="/admin/users" element={<div>UsersList</div>} />
        </Routes>
      </MemoryRouter>
    </UsersProvider>
  )
}

beforeEach(() => localStorage.clear())

describe('NewUserPage', () => {
  it('renders all form fields', () => {
    wrap()
    expect(screen.getByLabelText(/Имя/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Фамилия/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Пароль/)).toBeInTheDocument()
  })

  it('navigates back on cancel', async () => {
    wrap()
    await userEvent.click(screen.getByText('Отмена'))
    expect(screen.getByText('UsersList')).toBeInTheDocument()
  })

  it('navigates to list after creating user', async () => {
    wrap()
    await userEvent.type(screen.getByLabelText(/Имя/), 'Тест')
    await userEvent.type(screen.getByLabelText(/Фамилия/), 'Юзер')
    await userEvent.type(screen.getByLabelText(/Email/), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/Пароль/), 'pass123')
    await userEvent.click(screen.getByText('Создать'))
    expect(screen.getByText('UsersList')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run src/test/NewUserPage.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create CSS module**

Create `src/pages/Admin/NewUserPage.module.css`:

```css
.heading { font-size: 26px; font-weight: 700; margin-bottom: 28px; }

.form { max-width: 480px; }

.field { margin-bottom: 16px; }

.label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.input, .select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm, 6px);
  font-size: 14px;
  background: var(--color-bg);
  color: var(--color-text-primary);
  box-sizing: border-box;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.btnCreate {
  padding: 10px 24px;
  background: var(--color-brand);
  color: #fff;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
}

.btnCancel {
  padding: 10px 24px;
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  border-radius: 100px;
  font-size: 14px;
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
  background: var(--color-border);
  margin-bottom: 8px;
}
```

- [ ] **Step 4: Implement NewUserPage**

Replace stub in `src/pages/Admin/NewUserPage.tsx`:

```tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import styles from './NewUserPage.module.css'

export function NewUserPage() {
  const navigate = useNavigate()
  const { addUser } = useUsers()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [photo, setPhoto] = useState<string | undefined>()

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleSubmit() {
    addUser(
      {
        id: crypto.randomUUID(),
        name: `${firstName} ${lastName}`.trim(),
        email,
        role,
        progress: {},
        photo,
      },
      password
    )
    navigate('/admin/users')
  }

  return (
    <>
      <h1 className={styles.heading}>Новый сотрудник</h1>
      <div className={styles.form}>
        {photo
          ? <img src={photo} alt="avatar" className={styles.avatar} />
          : <div className={styles.avatarPlaceholder} />
        }

        <div className={styles.field}>
          <label className={styles.label} htmlFor="firstName">Имя</label>
          <input id="firstName" className={styles.input} value={firstName} onChange={e => setFirstName(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="lastName">Фамилия</label>
          <input id="lastName" className={styles.input} value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input id="email" className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Пароль</label>
          <input id="password" className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="role">Роль</label>
          <select id="role" className={styles.select} value={role} onChange={e => setRole(e.target.value as 'user' | 'admin')}>
            <option value="user">Сотрудник</option>
            <option value="admin">Администратор</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="photo">Фото</label>
          <input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={() => navigate('/admin/users')}>Отмена</button>
          <button className={styles.btnCreate} onClick={handleSubmit}>Создать</button>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npx vitest run src/test/NewUserPage.test.tsx
```

Expected: 3 passing.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Admin/NewUserPage.tsx src/pages/Admin/NewUserPage.module.css src/test/NewUserPage.test.tsx
git commit -m "feat: implement NewUserPage with photo upload and user creation"
```

---

## Chunk 3: User Detail + Courses

### Task 11: UserDetailPage

**Files:**
- Modify: `src/pages/Admin/UserDetailPage.tsx` (replace stub)
- Create: `src/pages/Admin/UserDetailPage.module.css`
- Create: `src/test/UserDetailPage.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/test/UserDetailPage.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { LessonsProvider } from '../context/LessonsContext'
import { UserDetailPage } from '../pages/Admin/UserDetailPage'

function wrap(userId: string) {
  return render(
    <UsersProvider>
      <LessonsProvider>
        <MemoryRouter initialEntries={[`/admin/users/${userId}`]}>
          <Routes>
            <Route path="/admin/users/:id" element={<UserDetailPage />} />
            <Route path="/admin/users" element={<div>UsersList</div>} />
          </Routes>
        </MemoryRouter>
      </LessonsProvider>
    </UsersProvider>
  )
}

beforeEach(() => localStorage.clear())

describe('UserDetailPage', () => {
  it('shows user name and email', () => {
    wrap('user-1')
    expect(screen.getByText('Соня Алхазова')).toBeInTheDocument()
    expect(screen.getByText('user@unitpay.ru')).toBeInTheDocument()
  })

  it('shows not-found message for unknown id', () => {
    wrap('unknown-id')
    expect(screen.getByText(/не найден/i)).toBeInTheDocument()
  })

  it('shows course progress section', () => {
    wrap('user-1')
    expect(screen.getByText('Прогресс по курсам')).toBeInTheDocument()
  })

  it('opens settings modal on gear click', async () => {
    wrap('user-1')
    await userEvent.click(screen.getByRole('button', { name: /⚙/ }))
    expect(screen.getByText('Настройки пользователя')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run src/test/UserDetailPage.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create CSS module**

Create `src/pages/Admin/UserDetailPage.module.css`:

```css
.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  position: relative;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--color-border);
}

.avatarPlaceholder {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: var(--color-text-secondary);
}

.info { flex: 1; }

.name { font-size: 20px; font-weight: 700; }

.meta {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.gearBtn {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: var(--color-text-secondary);
}
.gearBtn:hover { color: var(--color-text-primary); }

.sectionTitle {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
  margin-bottom: 14px;
}

.courseRow {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.courseTitle {
  font-size: 14px;
  font-weight: 500;
  width: 200px;
  flex-shrink: 0;
}

.progressWrap { flex: 1; }

.notFound {
  color: var(--color-text-secondary);
  padding: 40px 0;
}

.backLink {
  color: var(--color-brand);
  text-decoration: none;
}
```

- [ ] **Step 4: Implement UserDetailPage**

Replace stub in `src/pages/Admin/UserDetailPage.tsx`:

```tsx
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import { useLessons } from '../../context/LessonsContext'
import { calcProgress } from '../../components/slides/slideUtils'
import { ProgressBar } from '../../components/ProgressBar/ProgressBar'
import { SettingsModal } from '../../components/SettingsModal/SettingsModal'
import styles from './UserDetailPage.module.css'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { users } = useUsers()
  const { lessons } = useLessons()
  const [showSettings, setShowSettings] = useState(false)

  const user = users.find(u => u.id === id)

  if (!user) {
    return (
      <div className={styles.notFound}>
        <p>Пользователь не найден</p>
        <Link to="/admin/users" className={styles.backLink}>← Назад к списку</Link>
      </div>
    )
  }

  const publishedLessons = lessons.filter(l => l.published)

  return (
    <>
      <div className={styles.header}>
        {user.photo
          ? <img src={user.photo} alt={user.name} className={styles.avatar} />
          : <div className={styles.avatarPlaceholder}>👤</div>
        }
        <div className={styles.info}>
          <div className={styles.name}>{user.name}</div>
          <div className={styles.meta}>
            {user.email} · {user.role === 'admin' ? 'Администратор' : 'Сотрудник'}
            {user.lastActive && ` · ${user.lastActive}`}
          </div>
        </div>
        <button className={styles.gearBtn} onClick={() => setShowSettings(true)} aria-label="⚙">⚙</button>
      </div>

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

      {showSettings && (
        <SettingsModal user={user} onClose={() => setShowSettings(false)} />
      )}
    </>
  )
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npx vitest run src/test/UserDetailPage.test.tsx
```

Expected: 4 passing.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Admin/UserDetailPage.tsx src/pages/Admin/UserDetailPage.module.css src/test/UserDetailPage.test.tsx
git commit -m "feat: implement UserDetailPage with course progress and settings"
```

---

### Task 12: CoursesListPage

**Files:**
- Modify: `src/pages/Admin/CoursesListPage.tsx` (replace stub)
- Create: `src/pages/Admin/CoursesListPage.module.css`
- Create: `src/test/CoursesListPage.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/test/CoursesListPage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { LessonsProvider } from '../context/LessonsContext'
import { CoursesListPage } from '../pages/Admin/CoursesListPage'

function wrap() {
  return render(
    <UsersProvider>
      <LessonsProvider>
        <MemoryRouter>
          <CoursesListPage />
        </MemoryRouter>
      </LessonsProvider>
    </UsersProvider>
  )
}

describe('CoursesListPage', () => {
  it('shows all lessons', () => {
    wrap()
    expect(screen.getByText('Знакомство с UnitPay')).toBeInTheDocument()
    expect(screen.getByText('Аккаунтинг')).toBeInTheDocument()
  })

  it('shows publish toggle for each lesson', () => {
    wrap()
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('toggling changes button label', async () => {
    wrap()
    const publishedBtn = screen.getByText('Опубликован')
    await userEvent.click(publishedBtn)
    expect(screen.queryByText('Опубликован')).not.toBeInTheDocument()
    expect(screen.getAllByText('Скрыт').length).toBe(2)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run src/test/CoursesListPage.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create CSS module**

Create `src/pages/Admin/CoursesListPage.module.css` — same table pattern as UsersListPage:

```css
.heading { font-size: 26px; font-weight: 700; margin-bottom: 28px; }

.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.table th {
  background: var(--color-sidebar-bg);
  color: #fff;
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
}

.table td {
  padding: 12px 16px;
  font-size: 14px;
  border-bottom: 1px solid var(--color-border);
}

.table tr:last-child td { border-bottom: none; }

.nameLink {
  color: var(--color-brand);
  font-weight: 600;
  text-decoration: none;
}
.nameLink:hover { text-decoration: underline; }

.toggleOn {
  padding: 5px 14px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  background: var(--color-brand-light);
  color: var(--color-brand-dark);
  border: 1px solid var(--color-brand);
  cursor: pointer;
}

.toggleOff {
  padding: 5px 14px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  background: var(--color-locked-bg);
  color: var(--color-locked);
  border: 1px solid var(--color-border);
  cursor: pointer;
}

.empty {
  color: var(--color-text-secondary);
  padding: 32px 0;
  text-align: center;
}
```

- [ ] **Step 4: Implement CoursesListPage**

Replace stub in `src/pages/Admin/CoursesListPage.tsx`:

```tsx
import { Link } from 'react-router-dom'
import { useLessons } from '../../context/LessonsContext'
import { useUsers } from '../../context/UsersContext'
import styles from './CoursesListPage.module.css'

export function CoursesListPage() {
  const { lessons, togglePublished } = useLessons()
  const { users } = useUsers()

  function completedCount(lessonId: string, totalSlides: number): number {
    if (totalSlides <= 1) return 0
    return users.filter(u => (u.progress[lessonId] ?? -1) >= totalSlides - 1).length
  }

  return (
    <>
      <h1 className={styles.heading}>Курсы</h1>
      {lessons.length === 0 ? (
        <p className={styles.empty}>Нет курсов</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Название</th>
              <th>Слайдов</th>
              <th>Прошли</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map(lesson => (
              <tr key={lesson.id}>
                <td>
                  <Link to={`/admin/courses/${lesson.id}`} className={styles.nameLink}>
                    {lesson.title}
                  </Link>
                </td>
                <td>{lesson.slides.length}</td>
                <td>{completedCount(lesson.id, lesson.slides.length)}</td>
                <td>
                  <button
                    className={lesson.published ? styles.toggleOn : styles.toggleOff}
                    onClick={() => togglePublished(lesson.id)}
                  >
                    {lesson.published ? 'Опубликован' : 'Скрыт'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npx vitest run src/test/CoursesListPage.test.tsx
```

Expected: 3 passing.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Admin/CoursesListPage.tsx src/pages/Admin/CoursesListPage.module.css src/test/CoursesListPage.test.tsx
git commit -m "feat: implement CoursesListPage with publish toggle and completion count"
```

---

### Task 13: CourseDetailPage

**Files:**
- Modify: `src/pages/Admin/CourseDetailPage.tsx` (replace stub)
- Create: `src/pages/Admin/CourseDetailPage.module.css`
- Create: `src/test/CourseDetailPage.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/test/CourseDetailPage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { LessonsProvider } from '../context/LessonsContext'
import { CourseDetailPage } from '../pages/Admin/CourseDetailPage'

function wrap(lessonId: string) {
  return render(
    <UsersProvider>
      <LessonsProvider>
        <MemoryRouter initialEntries={[`/admin/courses/${lessonId}`]}>
          <Routes>
            <Route path="/admin/courses/:id" element={<CourseDetailPage />} />
            <Route path="/admin/courses" element={<div>CoursesList</div>} />
          </Routes>
        </MemoryRouter>
      </LessonsProvider>
    </UsersProvider>
  )
}

describe('CourseDetailPage', () => {
  it('shows course title', () => {
    wrap('day-1')
    expect(screen.getByText('Знакомство с UnitPay')).toBeInTheDocument()
  })

  it('shows not-found for unknown id', () => {
    wrap('unknown')
    expect(screen.getByText(/не найден/i)).toBeInTheDocument()
  })

  it('shows slide list section', () => {
    wrap('day-1')
    expect(screen.getByText('Слайды')).toBeInTheDocument()
  })

  it('shows employee progress section', () => {
    wrap('day-1')
    expect(screen.getByText('Прогресс сотрудников')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run src/test/CourseDetailPage.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create a helper to get slide summary**

The slide summary extracts the first meaningful text from a slide's content. Add a utility function inline in the page component (no need for a separate file).

- [ ] **Step 4: Create CSS module**

Create `src/pages/Admin/CourseDetailPage.module.css`:

```css
.header { margin-bottom: 28px; }

.title { font-size: 24px; font-weight: 700; }

.meta {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 8px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.tag {
  display: inline-block;
  background: var(--color-brand-light);
  color: var(--color-brand-dark);
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 100px;
}

.statusOn {
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 11px;
  background: var(--color-brand-light);
  color: var(--color-brand-dark);
  border: 1px solid var(--color-brand);
}

.statusOff {
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 11px;
  background: var(--color-locked-bg);
  color: var(--color-locked);
  border: 1px solid var(--color-border);
}

.sectionTitle {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
  margin: 28px 0 12px;
}

.slideItem {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
}

.slideType {
  font-weight: 600;
  min-width: 100px;
  color: var(--color-text-secondary);
  text-transform: capitalize;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.table th {
  background: var(--color-sidebar-bg);
  color: #fff;
  padding: 10px 16px;
  text-align: left;
  font-size: 13px;
}

.table td {
  padding: 10px 16px;
  font-size: 14px;
  border-bottom: 1px solid var(--color-border);
}

.table tr:last-child td { border-bottom: none; }

.progressCell { min-width: 180px; }

.notFound {
  color: var(--color-text-secondary);
  padding: 40px 0;
}

.backLink { color: var(--color-brand); text-decoration: none; }
```

- [ ] **Step 5: Implement CourseDetailPage**

Replace stub in `src/pages/Admin/CourseDetailPage.tsx`:

```tsx
import { useParams, Link } from 'react-router-dom'
import { useLessons } from '../../context/LessonsContext'
import { useUsers } from '../../context/UsersContext'
import { calcProgress } from '../../components/slides/slideUtils'
import { ProgressBar } from '../../components/ProgressBar/ProgressBar'
import type { Slide } from '../../types'
import styles from './CourseDetailPage.module.css'

function slideSummary(slide: Slide): string {
  const c = slide.content as Record<string, unknown>
  if (Array.isArray(c.tabs)) return (c.tabs as Array<{label:string}>).map(t => t.label).join(', ')
  if (Array.isArray(c.sections)) return (c.sections as Array<{title:string}>)[0]?.title ?? '—'
  if (Array.isArray(c.nodes)) return (c.nodes as Array<{label:string}>)[0]?.label ?? '—'
  if (typeof c.heading === 'string') return c.heading
  if (typeof c.title === 'string') return c.title
  return '—'
}

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { lessons } = useLessons()
  const { users } = useUsers()

  const lesson = lessons.find(l => l.id === id)

  if (!lesson) {
    return (
      <div className={styles.notFound}>
        <p>Курс не найден</p>
        <Link to="/admin/courses" className={styles.backLink}>← Назад к курсам</Link>
      </div>
    )
  }

  const employees = users.filter(u => u.role !== 'admin')

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>{lesson.title}</div>
        <div className={styles.meta}>
          <span className={styles.tag}>{lesson.tag}</span>
          <span className={lesson.published ? styles.statusOn : styles.statusOff}>
            {lesson.published ? 'Опубликован' : 'Скрыт'}
          </span>
          <span>{lesson.slides.length} слайдов</span>
        </div>
      </div>

      <div className={styles.sectionTitle}>Слайды</div>
      {lesson.slides.map((slide, i) => (
        <div key={slide.id} className={styles.slideItem}>
          <span className={styles.slideType}>{slide.type}</span>
          <span>{i + 1}. {slideSummary(slide)}</span>
        </div>
      ))}

      <div className={styles.sectionTitle}>Прогресс сотрудников</div>
      <table className={styles.table}>
        <thead>
          <tr><th>Сотрудник</th><th>Прогресс</th></tr>
        </thead>
        <tbody>
          {employees.map(user => {
            const slideIndex = user.progress[lesson.id] ?? 0
            const percent = calcProgress(slideIndex, lesson.slides.length)
            return (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td className={styles.progressCell}>
                  <ProgressBar value={percent} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
```

- [ ] **Step 6: Run tests — expect pass**

```bash
npx vitest run src/test/CourseDetailPage.test.tsx
```

Expected: 4 passing.

- [ ] **Step 7: Run full test suite**

```bash
npx vitest run
```

Expected: all passing.

- [ ] **Step 8: Commit**

```bash
git add src/pages/Admin/CourseDetailPage.tsx src/pages/Admin/CourseDetailPage.module.css src/test/CourseDetailPage.test.tsx
git commit -m "feat: implement CourseDetailPage with slide list and employee progress"
```
