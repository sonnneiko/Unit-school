# Unit School Platform — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React + Vite employee learning platform for UnitPay with login, lesson viewer (8 interactive slides), progress tracking, and admin panel.

**Architecture:** Single-page React app with React Router v6. AuthContext + localStorage for auth state. Mock TypeScript data files replace the backend. A Slide dispatcher component renders the correct sub-component per slide type. The persistent sidebar layout wraps all authenticated routes.

**Tech Stack:** React 18, Vite, TypeScript, React Router v6, CSS Modules, Vitest, @testing-library/react

---

## Chunk 1: Project Setup + Types + Styles

### Task 1: Scaffold Vite + React + TypeScript project

**Files:**
- Create: `package.json` (via Vite scaffold)
- Create: `vite.config.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Initialize project**

```bash
cd /Users/s.alhazova/Documents/GitHub/Unit-school
npm create vite@latest . -- --template react-ts
```

Expected: Vite scaffolds `src/`, `index.html`, `package.json`, `vite.config.ts`

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install react-router-dom
npm install -D vitest @vitest/ui @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Configure Vitest in vite.config.ts**

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

- [ ] **Step 4: Create test setup file**

```ts
// src/test/setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest",
"test:ui": "vitest --ui"
```

- [ ] **Step 6: Remove Vite boilerplate**

Delete: `src/App.css`, `src/assets/react.svg`, `public/vite.svg`
Clear `src/App.tsx` — replace with:
```tsx
export default function App() { return <div>Unit School</div> }
```
Clear `src/index.css` — empty file.

- [ ] **Step 7: Verify project runs**

```bash
npm run dev
```
Expected: Browser shows "Unit School" at `localhost:5173`

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React + TypeScript project"
```

---

### Task 2: TypeScript type definitions

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Write types file**

```ts
// src/types/index.ts

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  progress: Record<string, number> // lessonId → currentSlideIndex (0-based)
  lastActive?: string // ISO date string, e.g. "2026-04-20"
}

export interface Lesson {
  id: string
  title: string
  tag: string
  published: boolean
  slides: Slide[]
}

export type SlideType = 'welcome' | 'tabs' | 'info' | 'diagram' | 'cheatsheet' | 'finish'

export interface Slide {
  id: string // unique within lesson only
  type: SlideType
  content: WelcomeContent | TabsContent | InfoContent | DiagramContent | CheatsheetContent | FinishContent
}

export interface WelcomeContent {
  title: string
  subtitle: string
  ctaLabel: string
}

export interface TeamMember {
  name: string
  role: string
  description: string
  photoPlaceholder: string // CSS color string e.g. "#4CAF50"
}

export interface VendorItem {
  name: string
  scheme: string
  methods: string[]
  payout: string
  forWhom: string
}

export interface TabsContent {
  tabs: Array<{
    label: string
    itemType: 'team' | 'vendor' // discriminator for safe runtime narrowing
    items: TeamMember[] | VendorItem[]
  }>
}

export interface InfoContent {
  heading: string
  bullets: string[]
  illustration?: string
}

export interface DiagramContent {
  heading?: string
  nodes: Array<{ label: string; children?: string[] }>
}

export interface CheatsheetContent {
  sections: Array<{ title: string; headers: string[]; rows: string[][] }>
}

export interface FinishContent {
  title: string
  message: string
  nextLessonId: string | null
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript type definitions"
```

---

### Task 3: Global styles + CSS variables

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/main.tsx`

- [ ] **Step 1: Write global CSS**

```css
/* src/styles/global.css */

:root {
  --color-sidebar-bg: #1a1a1a;
  --color-sidebar-text: #888888;
  --color-sidebar-active-bg: #22c55e;
  --color-sidebar-active-text: #ffffff;
  --color-sidebar-hover-bg: #2a2a2a;
  --color-sidebar-width: 220px;

  --color-brand: #22c55e;
  --color-brand-dark: #16a34a;
  --color-brand-light: #dcfce7;

  --color-bg: #f5f5f5;
  --color-surface: #ffffff;
  --color-border: #e5e7eb;

  --color-text-primary: #1a1a1a;
  --color-text-secondary: #6b7280;
  --color-text-muted: #9ca3af;

  --color-locked: #9ca3af;
  --color-locked-bg: #f9fafb;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  --shadow-card: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.04);
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #root {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 16px;
  color: var(--color-text-primary);
  background: var(--color-bg);
}

a { text-decoration: none; color: inherit; }
button { cursor: pointer; font-family: inherit; border: none; background: none; }
```

- [ ] **Step 2: Import in main.tsx**

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css src/main.tsx
git commit -m "feat: add global CSS variables and reset"
```

---

## Chunk 2: Mock Data + Auth

### Task 4: Mock data files

**Files:**
- Create: `src/data/users.ts`
- Create: `src/data/lessons.ts`

- [ ] **Step 1: Write mock users**

```ts
// src/data/users.ts
import type { User } from '../types'

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Соня Алхазова',
    email: 'user@unitpay.ru',
    role: 'user',
    progress: {},
    lastActive: '2026-04-20',
  },
  {
    id: 'admin-1',
    name: 'Администратор',
    email: 'admin@unitpay.ru',
    role: 'admin',
    progress: {},
    lastActive: '2026-04-20',
  },
]

export const mockPasswords: Record<string, string> = {
  'user@unitpay.ru': 'password123',
  'admin@unitpay.ru': 'admin123',
}
```

- [ ] **Step 2: Write mock lessons**

```ts
// src/data/lessons.ts
import type { Lesson } from '../types'

export const mockLessons: Lesson[] = [
  {
    id: 'day-1',
    title: 'Знакомство с UnitPay',
    tag: 'День 1',
    published: true,
    slides: [
      {
        id: 'slide-1',
        type: 'welcome',
        content: {
          title: 'Добро пожаловать в команду Unitpay!',
          subtitle: 'Я котик Юнит 🐾 рад знакомству! В первые дни я буду рядом и помогу быстро освоиться.',
          ctaLabel: 'Начать обучение',
        },
      },
      {
        id: 'slide-2',
        type: 'tabs',
        content: {
          tabs: [
            {
              label: 'Управление',
              itemType: 'team',
              items: [
                { name: 'Дмитрий Козлов', role: 'CEO', description: 'Управляет продуктом и задаёт общее направление: куда мы идём, что развиваем и как делаем UnitPay лучше.', photoPlaceholder: '#4CAF50' },
                { name: 'Полина Есина', role: 'Deputy CEO', description: 'Отвечает за операционную деятельность — процессы, задачи и важные рабочие вопросы.', photoPlaceholder: '#2196F3' },
              ],
            },
            {
              label: 'Разработка',
              itemType: 'team',
              items: [
                { name: 'Роман Комиссаренко', role: 'Старший разработчик', description: 'Разработчик-путешественник. Пишет код из разных уголков мира и пробует странные булочки.', photoPlaceholder: '#9C27B0' },
                { name: 'Вадим Нижневский', role: 'Старший разработчик', description: 'Делает UnitPay стабильнее и надёжнее каждый день.', photoPlaceholder: '#FF5722' },
                { name: 'Василий Волгин', role: 'Тестировщик', description: 'Проводит ручное и автотестирование, проверяет новые функции перед внедрением в UnitPay.', photoPlaceholder: '#607D8B' },
                { name: 'Максим Шетхман', role: 'Разработчик', description: 'Backend-разработчик на PHP. Любит залипнуть в сериальчик. Помогает котяткам!', photoPlaceholder: '#795548' },
              ],
            },
            {
              label: 'Менеджмент',
              itemType: 'team',
              items: [
                { name: 'Артем Драгунов', role: 'Product Manager', description: 'Отвечает за создание и развитие продукта, формирует стратегию и приоритеты.', photoPlaceholder: '#FF9800' },
                { name: 'Анастасия Деева', role: 'Project Manager', description: 'Управляет задачами и коммуникацией внутри команды. Ценит ясность и чёткие договорённости.', photoPlaceholder: '#E91E63' },
              ],
            },
            {
              label: 'Аккаунтинг',
              itemType: 'team',
              items: [
                { name: 'Анастасия Калашникова', role: 'Руководитель аккаунтинга', description: 'Отвечает за контроль качества работы отдела, помогает сотрудникам расти и развиваться.', photoPlaceholder: '#00BCD4' },
                { name: 'Оксана Долженкова', role: 'Старший специалист аккаунтинга', description: 'Общается с VIP-мерчантами, обрабатывает триггеры и карточки. Делает крутые мемы.', photoPlaceholder: '#8BC34A' },
              ],
            },
            {
              label: 'Служба безопасности',
              itemType: 'team',
              items: [
                { name: 'Ани Тоноян', role: 'Служба безопасности', description: 'Следит за безопасностью и внимательно выискивает любые недочёты. Ходит по офису в крутых тапках.', photoPlaceholder: '#F44336' },
                { name: 'Светлана Григорьева', role: 'Служба безопасности', description: 'Контролирует безопасность UnitPay. Работает удалённо, но каждое утро начинает с крутой картинки в чате.', photoPlaceholder: '#FF5722' },
              ],
            },
          ],
        },
      },
      {
        id: 'slide-3',
        type: 'info',
        content: {
          heading: 'Знакомимся с UnitPay',
          bullets: [
            'UnitPay — платёжный агрегатор, который помогает бизнесам принимать онлайн-платежи',
            'Соединяем сайт клиента с банком (иногда сразу с несколькими)',
            'Решение для Telegram-ботов, подписок, сервисов, групп ВК',
            'Множество платёжных методов: карты РФ и зарубежные, СБП, SberPay, T-Pay, USDT',
            'Бесплатная онлайн-касса — Юнит.Чеки с бесшовной интеграцией',
          ],
        },
      },
      {
        id: 'slide-4',
        type: 'info',
        content: {
          heading: 'Методы приёма платежей в UnitPay',
          bullets: [
            '🟦 Карты Российских банков (МИР)',
            '🟣 Система Быстрых Платежей (СБП)',
            '🟢 SberPay — платёжная система Сбера',
            '🟡 T-Pay — платёжная система Т-Банка',
            '🔴 Карты международных банков',
            '🔵 USDT (криптовалюта)',
          ],
        },
      },
      {
        id: 'slide-5',
        type: 'diagram',
        content: {
          heading: 'Путь платежа',
          nodes: [
            { label: 'Покупатель' },
            { label: 'Магазин мерчанта' },
            { label: 'Страница оплаты UnitPay' },
            { label: 'Банк-эквайер' },
            { label: 'Банк-эмитент' },
            { label: 'Обработчик платежей UnitPay' },
          ],
        },
      },
      {
        id: 'slide-6',
        type: 'tabs',
        content: {
          tabs: [
            {
              label: 'Эквайринг',
              itemType: 'vendor',
              items: [
                { name: 'Т-Банк', scheme: 'Эквайринг', methods: ['Карты РФ', 'T-Pay'], payout: 'На р/с (T+1)', forWhom: 'ЮЛ / ИП' },
                { name: 'Банк 131', scheme: 'Эквайринг', methods: ['Карты РФ', 'СБП', 'SberPay'], payout: 'На р/с (T+2)', forWhom: 'ЮЛ / ИП' },
                { name: 'Точка Банк', scheme: 'Эквайринг', methods: ['Карты РФ', 'СБП'], payout: 'На р/с (T+1)', forWhom: 'ЮЛ / ИП' },
              ],
            },
            {
              label: 'Неттинг',
              itemType: 'vendor',
              items: [
                { name: 'Onlipay', scheme: 'Неттинг', methods: ['СБП'], payout: 'USDT (холд 24ч)', forWhom: 'ЮЛ / ИП / физлица' },
                { name: 'Platio', scheme: 'Неттинг', methods: ['Карты РФ/КЗ/зарубеж', 'СБП', 'USDT'], payout: 'RUB или USDT', forWhom: 'ЮЛ / ИП / физлица' },
                { name: 'Kanyon', scheme: 'Неттинг', methods: ['СБП'], payout: 'USDT (холд 24ч)', forWhom: 'ЮЛ / ИП / физлица' },
                { name: '2Can', scheme: 'Неттинг', methods: ['Карты РФ'], payout: 'USDT (холд 24ч)', forWhom: 'ЮЛ / ИП / физлица' },
              ],
            },
          ],
        },
      },
      {
        id: 'slide-7',
        type: 'cheatsheet',
        content: {
          sections: [
            {
              title: 'Кто есть кто',
              headers: ['Кто', 'Что делает'],
              rows: [
                ['Мерчант', 'Продавец, который принимает платежи через UnitPay'],
                ['Плательщик', 'Покупатель, который платит на сайте мерчанта'],
                ['Банк-эквайер', 'Банк-партнёр UnitPay, обрабатывает платёж'],
                ['Банк-эмитент', 'Банк плательщика, решает — пропустить или нет'],
                ['Поставщик / вендор', '«Прослойка» между банком и мерчантом (неттинг)'],
                ['Агрегатор', 'UnitPay — объединяет банки и методы оплаты'],
              ],
            },
            {
              title: 'Эквайринг vs Неттинг',
              headers: ['', 'Эквайринг', 'Неттинг'],
              rows: [
                ['Кто может', 'ЮЛ и ИП', 'ЮЛ, ИП и физлица'],
                ['Отчётность', 'Есть (реестры, чеки)', 'Нет'],
                ['Выплата', 'На расчётный счёт', 'На баланс UnitPay → сам выводит'],
                ['Комиссия', 'Ниже (прямой банк)', 'Выше (+ маржа вендора)'],
                ['Онлайн-касса', 'Нужна (54-ФЗ)', 'Не нужна'],
              ],
            },
          ],
        },
      },
      {
        id: 'slide-8',
        type: 'finish',
        content: {
          title: 'День 1 завершён',
          message: 'Вы большие молодцы! Сегодня вы узнали как устроен UnitPay, кто такие мерчанты, как работают платежи и чем эквайринг отличается от неттинга.',
          nextLessonId: null,
        },
      },
    ],
  },
  {
    id: 'day-2',
    title: 'Аккаунтинг',
    tag: 'День 2',
    published: false,
    slides: [],
  },
]
```

- [ ] **Step 3: Commit**

```bash
git add src/data/
git commit -m "feat: add mock data for users and Day 1 lessons"
```

---

### Task 5: AuthContext

> **Note:** This plan extends the spec's `AuthContextValue` with `updateProgress` — needed for progress persistence without a backend. The spec's interface omits it because it describes the contract; the implementation adds what's needed.

**Files:**
- Create: `src/context/AuthContext.tsx`
- Create: `src/test/AuthContext.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/test/AuthContext.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

beforeEach(() => { localStorage.clear() })

describe('AuthContext', () => {
  it('starts with no user', () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('logs in a regular user', async () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    await userEvent.click(screen.getByText('Login User'))
    expect(screen.getByTestId('user').textContent).toBe('user@unitpay.ru')
  })

  it('logs in an admin user', async () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    await userEvent.click(screen.getByText('Login Admin'))
    expect(screen.getByTestId('user').textContent).toBe('admin@unitpay.ru')
  })

  it('does not change user on bad credentials', async () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    await userEvent.click(screen.getByText('Bad Login'))
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('logs out and clears user', async () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    await userEvent.click(screen.getByText('Login User'))
    await userEvent.click(screen.getByText('Logout'))
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('persists session to localStorage on login', async () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    await userEvent.click(screen.getByText('Login User'))
    expect(localStorage.getItem('unit_school_user')).not.toBeNull()
  })

  it('restores session from localStorage on mount', () => {
    const user = { id: 'user-1', name: 'Соня', email: 'user@unitpay.ru', role: 'user', progress: {} }
    localStorage.setItem('unit_school_user', JSON.stringify(user))
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    expect(screen.getByTestId('user').textContent).toBe('user@unitpay.ru')
  })

  it('updateProgress stores slideIndex for lessonId', async () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    await userEvent.click(screen.getByText('Login User'))
    await userEvent.click(screen.getByText('Update Progress'))
    expect(screen.getByTestId('progress').textContent).toBe('{"day-1":3}')
  })

  it('updateProgress persists to localStorage', async () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>)
    await userEvent.click(screen.getByText('Login User'))
    await userEvent.click(screen.getByText('Update Progress'))
    const stored = JSON.parse(localStorage.getItem('unit_school_user') ?? '{}')
    expect(stored.progress['day-1']).toBe(3)
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test src/test/AuthContext.test.tsx
```
Expected: FAIL — `AuthContext` module not found

- [ ] **Step 3: Implement AuthContext**

```tsx
// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react'
import type { User } from '../types'
import { mockUsers, mockPasswords } from '../data/users'

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
  const [user, setUser] = useState<User | null>(loadUserFromStorage)

  async function login(email: string, password: string) {
    const expectedPassword = mockPasswords[email]
    if (!expectedPassword || expectedPassword !== password) {
      throw new Error('Неверный email или пароль')
    }
    const found = mockUsers.find(u => u.email === email)
    if (!found) throw new Error('Пользователь не найден')
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

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm test src/test/AuthContext.test.tsx
```
Expected: All 9 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/context/AuthContext.tsx src/test/AuthContext.test.tsx
git commit -m "feat: add AuthContext with mock login and localStorage persistence"
```

---

## Chunk 3: Routing + Layout

### Task 6: Route guards + App router

**Files:**
- Create: `src/components/PrivateRoute.tsx`
- Create: `src/components/AdminRoute.tsx`
- Create: `src/test/routes.test.tsx`
- Modify: `src/App.tsx`
- Create stubs: `src/pages/Login/Login.tsx`, `src/pages/Dashboard/Dashboard.tsx`, `src/pages/Lesson/Lesson.tsx`, `src/pages/Admin/Admin.tsx`, `src/pages/NotFound/NotFound.tsx`
- Create stub: `src/components/AppLayout.tsx`

- [ ] **Step 1: Write failing tests for route guards**

```tsx
// src/test/routes.test.tsx
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { PrivateRoute } from '../components/PrivateRoute'
import { AdminRoute } from '../components/AdminRoute'

function wrap(ui: React.ReactElement, initialPath = '/') {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialPath]}>{ui}</MemoryRouter>
    </AuthProvider>
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

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test src/test/routes.test.tsx
```
Expected: FAIL — modules not found

- [ ] **Step 3: Implement PrivateRoute**

```tsx
// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function PrivateRoute() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
```

- [ ] **Step 4: Implement AdminRoute**

```tsx
// src/components/AdminRoute.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Must be nested inside PrivateRoute — unauthenticated users never reach this
export function AdminRoute() {
  const { user } = useAuth()
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />
}
```

- [ ] **Step 5: Run tests — confirm they pass**

```bash
npm test src/test/routes.test.tsx
```
Expected: All 4 tests PASS

- [ ] **Step 6: Create stub pages** (each as a separate file at the exact path shown)

Create `src/pages/Login/Login.tsx`:
```tsx
export function LoginPage() { return <div>Login</div> }
```

Create `src/pages/Dashboard/Dashboard.tsx`:
```tsx
export function DashboardPage() { return <div>Dashboard</div> }
```

Create `src/pages/Lesson/Lesson.tsx`:
```tsx
export function LessonPage() { return <div>Lesson</div> }
```

Create `src/pages/Admin/Admin.tsx`:
```tsx
export function AdminPage() { return <div>Admin</div> }
```

Create `src/pages/NotFound/NotFound.tsx`:
```tsx
export function NotFoundPage() { return <div>404 — Страница не найдена</div> }
```

Create `src/pages/Placeholder/Placeholder.tsx`:
```tsx
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div style={{ padding: '40px 48px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{title}</h1>
      <p style={{ color: 'var(--color-text-secondary)' }}>Скоро</p>
    </div>
  )
}
```

Create `src/components/AppLayout.tsx`:
```tsx
import { Outlet } from 'react-router-dom'
export function AppLayout() { return <Outlet /> }
```

- [ ] **Step 7: Wire up App.tsx**

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import { AdminRoute } from './components/AdminRoute'
import { AppLayout } from './components/AppLayout'
import { LoginPage } from './pages/Login/Login'
import { DashboardPage } from './pages/Dashboard/Dashboard'
import { LessonPage } from './pages/Lesson/Lesson'
import { AdminPage } from './pages/Admin/Admin'
import { NotFoundPage } from './pages/NotFound/NotFound'
import { PlaceholderPage } from './pages/Placeholder/Placeholder'
import { useAuth } from './context/AuthContext'

function LoginRoute() {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : <LoginPage />
}

export default function App() {
  return (
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
                <Route path="/admin" element={<AdminPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
```

- [ ] **Step 8: Verify dev server compiles**

```bash
npm run dev
```
Expected: No TypeScript errors, browser shows stub content

- [ ] **Step 9: Commit**

```bash
git add src/
git commit -m "feat: add routing, route guards, page stubs, and placeholder routes"
```

---

### Task 7: Sidebar + AppLayout

**Files:**
- Create: `src/components/Sidebar/Sidebar.tsx`
- Create: `src/components/Sidebar/Sidebar.module.css`
- Modify: `src/components/AppLayout.tsx`
- Create: `src/components/AppLayout.module.css`

- [ ] **Step 1: Implement Sidebar**

```tsx
// src/components/Sidebar/Sidebar.tsx
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { to: '/', label: 'Главная', icon: '🏠', end: true },
  { to: '/courses', label: 'Курсы', icon: '📖', end: false },
  { to: '/progress', label: 'Прогресс', icon: '📊', end: false },
  { to: '/profile', label: 'Профиль', icon: '👤', end: false },
]

export function Sidebar() {
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
          <span className={styles.cat}>🐱</span>
          <span className={styles.logoText}>Unit School</span>
        </div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.icon}>⚙️</span>
              <span>Админ</span>
            </NavLink>
          )}
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

```css
/* src/components/Sidebar/Sidebar.module.css */
.sidebar {
  width: var(--color-sidebar-width);
  background: var(--color-sidebar-bg);
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

.cat { font-size: 24px; }

.logoText {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.3px;
}

.nav { display: flex; flex-direction: column; gap: 2px; }

.navItem {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-sidebar-text);
  transition: background .15s, color .15s;
}

.navItem:hover {
  background: var(--color-sidebar-hover-bg);
  color: #fff;
}

.navItem.active {
  background: var(--color-sidebar-active-bg);
  color: var(--color-sidebar-active-text);
  font-weight: 600;
}

.icon { font-size: 16px; width: 20px; text-align: center; }

.bottom {
  padding: 16px 12px;
  border-top: 1px solid #2a2a2a;
}

.userInfo { margin-bottom: 10px; }

.userName {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.userEmail {
  font-size: 11px;
  color: var(--color-sidebar-text);
  margin-top: 2px;
}

.logoutBtn {
  width: 100%;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: var(--color-sidebar-text);
  text-align: left;
  transition: background .15s, color .15s;
}

.logoutBtn:hover {
  background: var(--color-sidebar-hover-bg);
  color: #fff;
}
```

- [ ] **Step 2: Implement AppLayout**

```tsx
// src/components/AppLayout.tsx
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar/Sidebar'
import styles from './AppLayout.module.css'

export function AppLayout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
```

```css
/* src/components/AppLayout.module.css */
.layout {
  display: flex;
  min-height: 100vh;
}

.main {
  flex: 1;
  overflow-y: auto;
  min-height: 100vh;
}
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```
Temporarily set `localStorage.setItem('unit_school_user', JSON.stringify({id:'user-1',name:'Соня',email:'user@unitpay.ru',role:'user',progress:{}}))` in browser devtools, then navigate to `localhost:5173`. Expected: dark sidebar visible with nav items.

- [ ] **Step 4: Commit**

```bash
git add src/components/Sidebar/ src/components/AppLayout.tsx src/components/AppLayout.module.css
git commit -m "feat: add Sidebar and AppLayout"
```

---

## Chunk 4: Dashboard + LessonCard

### Task 8: LessonCard component

**Files:**
- Create: `src/components/LessonCard/LessonCard.tsx`
- Create: `src/components/LessonCard/LessonCard.module.css`
- Create: `src/test/LessonCard.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/test/LessonCard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LessonCard } from '../components/LessonCard/LessonCard'
import type { Lesson } from '../types'

const baseLesson: Lesson = {
  id: 'day-1',
  title: 'Знакомство с UnitPay',
  tag: 'День 1',
  published: true,
  slides: new Array(8).fill({ id: 'x', type: 'info', content: { heading: '', bullets: [] } }),
}

function renderCard(progress = 0, published = true) {
  return render(
    <MemoryRouter>
      <LessonCard lesson={{ ...baseLesson, published }} progress={progress} />
    </MemoryRouter>
  )
}

describe('LessonCard', () => {
  it('renders lesson title and tag', () => {
    renderCard()
    expect(screen.getByText('Знакомство с UnitPay')).toBeInTheDocument()
    expect(screen.getByText('День 1')).toBeInTheDocument()
  })

  it('shows 0% at slide index 0', () => {
    renderCard(0)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('shows 43% at slide index 3 of 8 slides', () => {
    // Math.round(3 / 7 * 100) = 43
    renderCard(3)
    expect(screen.getByText('43%')).toBeInTheDocument()
  })

  it('shows 100% at slide index 7 of 8 slides', () => {
    renderCard(7)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('shows locked badge for unpublished lesson', () => {
    renderCard(0, false)
    expect(screen.getByText('Скоро')).toBeInTheDocument()
  })

  it('renders a link to /lesson/day-1 when published', () => {
    renderCard()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/lesson/day-1')
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test src/test/LessonCard.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Implement LessonCard**

```tsx
// src/components/LessonCard/LessonCard.tsx
import { Link } from 'react-router-dom'
import type { Lesson } from '../../types'
import styles from './LessonCard.module.css'

interface Props {
  lesson: Lesson
  progress: number // currentSlideIndex (0-based)
}

function calcPercent(slideIndex: number, totalSlides: number): number {
  if (totalSlides <= 1) return 0
  return Math.round((slideIndex / (totalSlides - 1)) * 100)
}

export function LessonCard({ lesson, progress }: Props) {
  const percent = calcPercent(progress, lesson.slides.length)

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
      <div className={styles.progressRow}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${percent}%` }} />
        </div>
        <span className={styles.percent}>{percent}%</span>
      </div>
    </Link>
  )
}
```

```css
/* src/components/LessonCard/LessonCard.module.css */
.card {
  display: block;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 20px;
  box-shadow: var(--shadow-card);
  transition: transform .15s, box-shadow .15s;
}

.card:not(.locked):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
}

.locked { opacity: 0.55; cursor: default; }

.tag {
  display: inline-block;
  background: var(--color-brand-light);
  color: var(--color-brand-dark);
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 100px;
  margin-bottom: 8px;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 14px;
  line-height: 1.4;
}

.progressRow {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progressBar {
  flex: 1;
  height: 6px;
  background: var(--color-border);
  border-radius: 100px;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: var(--color-brand);
  border-radius: 100px;
  transition: width .3s ease;
}

.percent {
  font-size: 12px;
  color: var(--color-text-secondary);
  min-width: 32px;
  text-align: right;
}

.lockBadge {
  display: inline-block;
  background: var(--color-locked-bg);
  color: var(--color-locked);
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 100px;
  border: 1px solid var(--color-border);
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm test src/test/LessonCard.test.tsx
```
Expected: All 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/LessonCard/ src/test/LessonCard.test.tsx
git commit -m "feat: add LessonCard with progress bar and locked state"
```

---

### Task 9: Dashboard page

**Files:**
- Modify: `src/pages/Dashboard/Dashboard.tsx`
- Create: `src/pages/Dashboard/Dashboard.module.css`
- Create: `src/test/Dashboard.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/test/Dashboard.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { DashboardPage } from '../pages/Dashboard/Dashboard'

beforeEach(() => localStorage.clear())

function renderDashboard(user = {
  id: 'user-1', name: 'Соня Алхазова', email: 'user@unitpay.ru', role: 'user', progress: {}
}) {
  localStorage.setItem('unit_school_user', JSON.stringify(user))
  return render(
    <AuthProvider>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </AuthProvider>
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
    // Math.round(4/7*100) = 57
    expect(screen.getByText('57%')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test src/test/Dashboard.test.tsx
```
Expected: FAIL — assertions fail (stub renders no content, e.g. "Unable to find an element with the text: /Привет, Соня/")

- [ ] **Step 3: Implement Dashboard**

```tsx
// src/pages/Dashboard/Dashboard.tsx
import { useAuth } from '../../context/AuthContext'
import { mockLessons } from '../../data/lessons'
import { LessonCard } from '../../components/LessonCard/LessonCard'
import styles from './Dashboard.module.css'

export function DashboardPage() {
  const { user } = useAuth()
  const progress = user?.progress ?? {}

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.greeting}>Привет, {user?.name?.split(' ')[0]}! 🐾</h1>
        <p className={styles.subtitle}>Продолжай обучение — каждый шаг важен</p>
      </header>
      <section className={styles.grid}>
        {mockLessons.map(lesson => (
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

```css
/* src/pages/Dashboard/Dashboard.module.css */
.page { padding: 40px 48px; max-width: 1000px; }

.header { margin-bottom: 36px; }

.greeting {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 6px;
}

.subtitle {
  font-size: 15px;
  color: var(--color-text-secondary);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm test src/test/Dashboard.test.tsx
```
Expected: All 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Dashboard/ src/test/Dashboard.test.tsx
git commit -m "feat: add Dashboard page with tests"
```

---

## Chunk 5: Slide Components

### Task 10: Slide utilities + shared CSS + WelcomeSlide

**Files:**
- Create: `src/components/slides/slideUtils.ts`
- Create: `src/components/slides/slides.module.css`
- Create: `src/components/slides/WelcomeSlide.tsx`
- Create: `src/test/slideUtils.test.ts`

- [ ] **Step 1: Write failing tests for calcProgress**

```ts
// src/test/slideUtils.test.ts
import { describe, it, expect } from 'vitest'
import { calcProgress } from '../components/slides/slideUtils'

describe('calcProgress', () => {
  it('returns 0 for 0 slides', () => expect(calcProgress(0, 0)).toBe(0))
  it('returns 0 for 1 slide', () => expect(calcProgress(0, 1)).toBe(0))
  it('returns 0 at index 0 of 8', () => expect(calcProgress(0, 8)).toBe(0))
  it('returns 100 at index 7 of 8', () => expect(calcProgress(7, 8)).toBe(100))
  it('returns 43 at index 3 of 8', () => expect(calcProgress(3, 8)).toBe(43))
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test src/test/slideUtils.test.ts
```

- [ ] **Step 3: Implement slideUtils**

```ts
// src/components/slides/slideUtils.ts
export function calcProgress(currentIndex: number, totalSlides: number): number {
  if (totalSlides <= 1) return 0
  return Math.round((currentIndex / (totalSlides - 1)) * 100)
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm test src/test/slideUtils.test.ts
```
Expected: All 5 PASS

- [ ] **Step 5: Create shared slide CSS**

```css
/* src/components/slides/slides.module.css */

.slideWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

/* WelcomeSlide */
.welcomeCard {
  background: var(--color-sidebar-bg);
  color: #fff;
  border-radius: var(--radius-lg);
  padding: 48px 56px;
  text-align: center;
  max-width: 560px;
  width: 100%;
}

.cat { font-size: 64px; margin-bottom: 20px; display: block; }

.welcomeTitle {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 14px;
  line-height: 1.25;
}

.welcomeSubtitle {
  font-size: 16px;
  color: #aaa;
  margin-bottom: 32px;
  line-height: 1.6;
}

.ctaButton {
  background: var(--color-brand);
  color: #fff;
  padding: 12px 32px;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 600;
  transition: background .15s, transform .1s;
}

.ctaButton:hover {
  background: var(--color-brand-dark);
  transform: translateY(-1px);
}

/* InfoSlide */
.infoCard {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 48px 56px;
  max-width: 720px;
  width: 100%;
  box-shadow: var(--shadow-card);
}

.slideHeading {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 24px;
}

.bulletList { list-style: none; display: flex; flex-direction: column; gap: 12px; }

.bulletItem {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 15px;
  line-height: 1.5;
}

.bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-brand);
  flex-shrink: 0;
  margin-top: 7px;
}

/* DiagramSlide */
.diagramCard {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 48px 56px;
  max-width: 800px;
  width: 100%;
  box-shadow: var(--shadow-card);
}

.diagramFlow {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
  margin-top: 24px;
}

.diagramNode {
  background: var(--color-brand);
  color: #fff;
  padding: 12px 20px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 600;
  text-align: center;
}

.diagramArrow {
  font-size: 20px;
  color: var(--color-brand);
  padding: 0 8px;
}

/* CheatsheetSlide */
.cheatsheetCard {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 36px 44px;
  max-width: 900px;
  width: 100%;
  box-shadow: var(--shadow-card);
  overflow-x: auto;
}

.cheatsheetSection { margin-bottom: 32px; }
.cheatsheetSection:last-child { margin-bottom: 0; }

.cheatsheetTitle {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
  margin-bottom: 12px;
}

.cheatsheetTable { width: 100%; border-collapse: collapse; }

.cheatsheetTable th {
  background: var(--color-sidebar-bg);
  color: #fff;
  padding: 10px 14px;
  font-size: 13px;
  text-align: left;
  font-weight: 600;
}

.cheatsheetTable td {
  padding: 10px 14px;
  font-size: 13px;
  border-bottom: 1px solid var(--color-border);
}

.cheatsheetTable tr:last-child td { border-bottom: none; }
.cheatsheetTable tr:hover td { background: var(--color-brand-light); }

/* FinishSlide */
.finishCard {
  background: linear-gradient(135deg, var(--color-sidebar-bg) 0%, #2d2d2d 100%);
  border-radius: var(--radius-lg);
  padding: 60px 56px;
  text-align: center;
  max-width: 560px;
  width: 100%;
  color: #fff;
}

.finishCat { font-size: 64px; margin-bottom: 20px; display: block; }

.finishTitle {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
}

.finishMessage {
  font-size: 15px;
  color: #aaa;
  line-height: 1.6;
  margin-bottom: 32px;
}

.nextLink {
  display: inline-block;
  background: var(--color-brand);
  color: #fff;
  padding: 12px 32px;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 600;
  transition: background .15s;
}

.nextLink:hover { background: var(--color-brand-dark); }

.comingSoon {
  display: inline-block;
  background: #2a2a2a;
  color: #666;
  padding: 12px 32px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  border: 1px solid #333;
}

/* TabsSlide */
.tabsCard {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 36px 44px;
  max-width: 800px;
  width: 100%;
  box-shadow: var(--shadow-card);
}

.tabRow { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }

.tab {
  padding: 7px 16px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  background: var(--color-bg);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  transition: background .15s, color .15s;
}

.tab:hover { background: var(--color-brand-light); color: var(--color-brand-dark); }

.tabActive {
  background: var(--color-brand);
  color: #fff;
  border-color: var(--color-brand);
}

.tabContent { display: flex; flex-direction: column; gap: 16px; }

/* TeamCard (inside TabsSlide) */
.teamGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.teamCard {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: 14px;
}

.teamAvatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.teamInfo { flex: 1; }
.teamName { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
.teamRole { font-size: 12px; color: var(--color-brand-dark); font-weight: 500; margin-bottom: 4px; }
.teamDesc { font-size: 12px; color: var(--color-text-secondary); line-height: 1.4; }

/* VendorCard (inside TabsSlide) */
.vendorGrid { display: flex; flex-direction: column; gap: 10px; }

.vendorCard {
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.vendorName { font-size: 14px; font-weight: 700; min-width: 100px; }
.vendorMethods { font-size: 12px; color: var(--color-text-secondary); flex: 1; }
.vendorPayout { font-size: 12px; color: var(--color-brand-dark); font-weight: 500; }
.vendorWho { font-size: 11px; color: var(--color-text-muted); }
```

- [ ] **Step 6: Implement WelcomeSlide**

```tsx
// src/components/slides/WelcomeSlide.tsx
import type { WelcomeContent } from '../../types'
import styles from './slides.module.css'

interface Props {
  content: WelcomeContent
  onNext: () => void
}

export function WelcomeSlide({ content, onNext }: Props) {
  return (
    <div className={styles.slideWrapper}>
      <div className={styles.welcomeCard}>
        <span className={styles.cat}>🐱</span>
        <h1 className={styles.welcomeTitle}>{content.title}</h1>
        <p className={styles.welcomeSubtitle}>{content.subtitle}</p>
        <button className={styles.ctaButton} onClick={onNext}>
          {content.ctaLabel} →
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Update LessonCard to use calcProgress from slideUtils**

In `src/components/LessonCard/LessonCard.tsx`, remove the local `calcPercent` function and import `calcProgress` from slideUtils:

```tsx
// src/components/LessonCard/LessonCard.tsx  (updated imports section)
import { Link } from 'react-router-dom'
import type { Lesson } from '../../types'
import { calcProgress } from '../slides/slideUtils'
import styles from './LessonCard.module.css'
```

And change the usage:
```tsx
const percent = calcProgress(progress, lesson.slides.length)
```

- [ ] **Step 8: Re-run LessonCard tests to confirm they still pass**

```bash
npm test src/test/LessonCard.test.tsx
```
Expected: All 6 tests still PASS

- [ ] **Step 9: Commit**

```bash
git add src/components/slides/ src/test/slideUtils.test.ts src/components/LessonCard/LessonCard.tsx
git commit -m "feat: add slide utilities, shared CSS, WelcomeSlide; refactor LessonCard to use calcProgress"
```

---

### Task 11: Remaining slide components

**Files:**
- Create: `src/components/slides/InfoSlide.tsx`
- Create: `src/components/slides/DiagramSlide.tsx`
- Create: `src/components/slides/CheatsheetSlide.tsx`
- Create: `src/components/slides/FinishSlide.tsx`
- Create: `src/components/slides/TeamCard.tsx`
- Create: `src/components/slides/TabsSlide.tsx`
- Create: `src/components/slides/Slide.tsx`

- [ ] **Step 1: InfoSlide**

```tsx
// src/components/slides/InfoSlide.tsx
import type { InfoContent } from '../../types'
import styles from './slides.module.css'

export function InfoSlide({ content }: { content: InfoContent }) {
  return (
    <div className={styles.slideWrapper}>
      <div className={styles.infoCard}>
        <h2 className={styles.slideHeading}>{content.heading}</h2>
        <ul className={styles.bulletList}>
          {content.bullets.map((bullet, i) => (
            <li key={i} className={styles.bulletItem}>
              <span className={styles.bullet} />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: DiagramSlide**

```tsx
// src/components/slides/DiagramSlide.tsx
import type { DiagramContent } from '../../types'
import styles from './slides.module.css'

export function DiagramSlide({ content }: { content: DiagramContent }) {
  return (
    <div className={styles.slideWrapper}>
      <div className={styles.diagramCard}>
        {content.heading && <h2 className={styles.slideHeading}>{content.heading}</h2>}
        <div className={styles.diagramFlow}>
          {content.nodes.map((node, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <span className={styles.diagramNode}>{node.label}</span>
              {i < content.nodes.length - 1 && (
                <span className={styles.diagramArrow}>→</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: CheatsheetSlide**

```tsx
// src/components/slides/CheatsheetSlide.tsx
import type { CheatsheetContent } from '../../types'
import styles from './slides.module.css'

export function CheatsheetSlide({ content }: { content: CheatsheetContent }) {
  return (
    <div className={styles.slideWrapper}>
      <div className={styles.cheatsheetCard}>
        {content.sections.map((section, i) => (
          <div key={i} className={styles.cheatsheetSection}>
            <div className={styles.cheatsheetTitle}>{section.title}</div>
            <table className={styles.cheatsheetTable}>
              <thead>
                <tr>{section.headers.map((h, j) => <th key={j}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {section.rows.map((row, k) => (
                  <tr key={k}>{row.map((cell, l) => <td key={l}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: FinishSlide**

```tsx
// src/components/slides/FinishSlide.tsx
import { Link } from 'react-router-dom'
import type { FinishContent, Lesson } from '../../types'
import styles from './slides.module.css'

interface Props {
  content: FinishContent
  nextLesson?: Lesson | null
}

export function FinishSlide({ content, nextLesson }: Props) {
  return (
    <div className={styles.slideWrapper}>
      <div className={styles.finishCard}>
        <span className={styles.finishCat}>🎉</span>
        <h2 className={styles.finishTitle}>{content.title}</h2>
        <p className={styles.finishMessage}>{content.message}</p>
        {nextLesson && nextLesson.published ? (
          <Link to={`/lesson/${nextLesson.id}`} className={styles.nextLink}>
            Следующий день: {nextLesson.title} →
          </Link>
        ) : (
          <span className={styles.comingSoon}>
            {nextLesson ? `${nextLesson.title} — скоро` : 'Скоро новые уроки'}
          </span>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: TeamCard sub-component**

```tsx
// src/components/slides/TeamCard.tsx
import type { TeamMember } from '../../types'
import styles from './slides.module.css'

export function TeamCard({ member }: { member: TeamMember }) {
  const initials = member.name.split(' ').map(p => p[0]).join('').slice(0, 2)
  return (
    <div className={styles.teamCard}>
      <div
        className={styles.teamAvatar}
        style={{ background: member.photoPlaceholder }}
        aria-hidden="true"
      >
        {initials}
      </div>
      <div className={styles.teamInfo}>
        <div className={styles.teamName}>{member.name}</div>
        <div className={styles.teamRole}>{member.role}</div>
        <div className={styles.teamDesc}>{member.description}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: TabsSlide**

```tsx
// src/components/slides/TabsSlide.tsx
import { useState } from 'react'
import type { TabsContent, TeamMember, VendorItem } from '../../types'
import { TeamCard } from './TeamCard'
import styles from './slides.module.css'

export function TabsSlide({ content }: { content: TabsContent }) {
  const [activeTab, setActiveTab] = useState(0)
  const tab = content.tabs[activeTab]

  return (
    <div className={styles.slideWrapper}>
      <div className={styles.tabsCard}>
        <div className={styles.tabRow}>
          {content.tabs.map((t, i) => (
            <button
              key={i}
              className={`${styles.tab} ${i === activeTab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.tabContent}>
          {tab.itemType === 'team' ? (
            <div className={styles.teamGrid}>
              {(tab.items as TeamMember[]).map((member, i) => (
                <TeamCard key={i} member={member} />
              ))}
            </div>
          ) : (
            <div className={styles.vendorGrid}>
              {(tab.items as VendorItem[]).map((vendor, i) => (
                <div key={i} className={styles.vendorCard}>
                  <div className={styles.vendorName}>{vendor.name}</div>
                  <div className={styles.vendorMethods}>{vendor.methods.join(', ')}</div>
                  <div className={styles.vendorPayout}>{vendor.payout}</div>
                  <div className={styles.vendorWho}>{vendor.forWhom}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Slide dispatcher**

```tsx
// src/components/slides/Slide.tsx
import type { Slide as SlideType, Lesson, WelcomeContent, InfoContent, DiagramContent, CheatsheetContent, TabsContent, FinishContent } from '../../types'
import { WelcomeSlide } from './WelcomeSlide'
import { InfoSlide } from './InfoSlide'
import { DiagramSlide } from './DiagramSlide'
import { CheatsheetSlide } from './CheatsheetSlide'
import { TabsSlide } from './TabsSlide'
import { FinishSlide } from './FinishSlide'

interface Props {
  slide: SlideType
  onNext: () => void
  nextLesson?: Lesson | null
}

export function Slide({ slide, onNext, nextLesson }: Props) {
  switch (slide.type) {
    case 'welcome':
      return <WelcomeSlide content={slide.content as WelcomeContent} onNext={onNext} />
    case 'info':
      return <InfoSlide content={slide.content as InfoContent} />
    case 'diagram':
      return <DiagramSlide content={slide.content as DiagramContent} />
    case 'cheatsheet':
      return <CheatsheetSlide content={slide.content as CheatsheetContent} />
    case 'tabs':
      return <TabsSlide content={slide.content as TabsContent} />
    case 'finish':
      return <FinishSlide content={slide.content as FinishContent} nextLesson={nextLesson} />
    default:
      return <div>Неизвестный тип слайда</div>
  }
}
```

- [ ] **Step 8: Commit**

```bash
git add src/components/slides/
git commit -m "feat: add all slide components and Slide dispatcher"
```

---

## Chunk 6: Lesson Page + SlideNav

### Task 12: SlideNav component

**Files:**
- Create: `src/components/SlideNav/SlideNav.tsx`
- Create: `src/components/SlideNav/SlideNav.module.css`
- Create: `src/test/SlideNav.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/test/SlideNav.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SlideNav } from '../components/SlideNav/SlideNav'

function renderNav(current = 0, total = 5, onPrev = vi.fn(), onNext = vi.fn()) {
  return render(<SlideNav current={current} total={total} onPrev={onPrev} onNext={onNext} />)
}

describe('SlideNav', () => {
  it('renders correct number of dots', () => {
    renderNav(0, 5)
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })

  it('prev button is disabled on first slide', () => {
    renderNav(0, 5)
    expect(screen.getByLabelText('Предыдущий слайд')).toBeDisabled()
  })

  it('next button is disabled on last slide', () => {
    renderNav(4, 5)
    expect(screen.getByLabelText('Следующий слайд')).toBeDisabled()
  })

  it('calls onNext when next clicked', () => {
    const onNext = vi.fn()
    renderNav(0, 5, vi.fn(), onNext)
    fireEvent.click(screen.getByLabelText('Следующий слайд'))
    expect(onNext).toHaveBeenCalledOnce()
  })

  it('calls onPrev when prev clicked', () => {
    const onPrev = vi.fn()
    renderNav(2, 5, onPrev)
    fireEvent.click(screen.getByLabelText('Предыдущий слайд'))
    expect(onPrev).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm test src/test/SlideNav.test.tsx
```

- [ ] **Step 3: Implement SlideNav**

```tsx
// src/components/SlideNav/SlideNav.tsx
import { useEffect } from 'react'
import styles from './SlideNav.module.css'

interface Props {
  current: number // 0-based
  total: number
  onPrev: () => void
  onNext: () => void
}

export function SlideNav({ current, total, onPrev, onNext }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onPrev, onNext])

  return (
    <div className={styles.nav}>
      <ol className={styles.dots} role="list">
        {Array.from({ length: total }).map((_, i) => (
          <li
            key={i}
            role="listitem"
            className={`${styles.dot} ${i < current ? styles.done : i === current ? styles.active : ''}`}
          />
        ))}
      </ol>
      <div className={styles.arrows}>
        <button
          className={styles.arrow}
          onClick={onPrev}
          disabled={current === 0}
          aria-label="Предыдущий слайд"
        >
          ←
        </button>
        <span className={styles.counter}>{current + 1} / {total}</span>
        <button
          className={styles.arrow}
          onClick={onNext}
          disabled={current === total - 1}
          aria-label="Следующий слайд"
        >
          →
        </button>
      </div>
    </div>
  )
}
```

```css
/* src/components/SlideNav/SlideNav.module.css */
.nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
}

.dots { display: flex; gap: 6px; list-style: none; }

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border);
}

.done { background: var(--color-brand); }
.active { background: var(--color-brand-dark); width: 24px; border-radius: 4px; }

.arrows { display: flex; align-items: center; gap: 12px; }

.arrow {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: var(--color-sidebar-bg);
  color: #fff;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background .15s, opacity .15s;
}

.arrow:not(:disabled):hover { background: var(--color-brand); }
.arrow:disabled { opacity: 0.3; cursor: not-allowed; }

.counter {
  font-size: 13px;
  color: var(--color-text-secondary);
  min-width: 48px;
  text-align: center;
}
```

- [ ] **Step 4: Run tests — confirm they pass**

```bash
npm test src/test/SlideNav.test.tsx
```
Expected: All 5 PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/SlideNav/ src/test/SlideNav.test.tsx
git commit -m "feat: add SlideNav with keyboard navigation"
```

---

### Task 13: Lesson page

**Files:**
- Modify: `src/pages/Lesson/Lesson.tsx`
- Create: `src/pages/Lesson/Lesson.module.css`

- [ ] **Step 1: Implement Lesson page**

```tsx
// src/pages/Lesson/Lesson.tsx
import { useState, useCallback } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { mockLessons } from '../../data/lessons'
import { Slide } from '../../components/slides/Slide'
import { SlideNav } from '../../components/SlideNav/SlideNav'
import type { FinishContent } from '../../types'
import styles from './Lesson.module.css'

export function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const { user, updateProgress } = useAuth()
  const lesson = mockLessons.find(l => l.id === id)
  const initialSlide = user?.progress[id ?? ''] ?? 0
  const [currentSlide, setCurrentSlide] = useState(initialSlide)

  const goNext = useCallback(() => {
    setCurrentSlide(i => {
      const next = Math.min(i + 1, (lesson?.slides.length ?? 1) - 1)
      if (id) updateProgress(id, next)
      return next
    })
  }, [lesson, id, updateProgress])

  const goPrev = useCallback(() => {
    setCurrentSlide(i => {
      const prev = Math.max(i - 1, 0)
      if (id) updateProgress(id, prev)
      return prev
    })
  }, [id, updateProgress])

  if (!lesson) return <Navigate to="/" replace />

  const slide = lesson.slides[currentSlide]

  // Resolve nextLesson for FinishSlide without importing mockLessons in FinishSlide
  const nextLessonId = slide.type === 'finish'
    ? (slide.content as FinishContent).nextLessonId
    : null
  const nextLesson = nextLessonId ? mockLessons.find(l => l.id === nextLessonId) ?? null : null

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link to="/" className={styles.back}>← Назад</Link>
        <span className={styles.title}>{lesson.title}</span>
        <span className={styles.tag}>{lesson.tag}</span>
      </header>
      <div className={styles.slideArea}>
        <Slide slide={slide} onNext={goNext} nextLesson={nextLesson} />
      </div>
      <SlideNav
        current={currentSlide}
        total={lesson.slides.length}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  )
}
```

```css
/* src/pages/Lesson/Lesson.module.css */
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.topbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.back {
  font-size: 14px;
  color: var(--color-brand);
  font-weight: 500;
}

.back:hover { text-decoration: underline; }

.title {
  font-size: 15px;
  font-weight: 600;
}

.tag {
  background: var(--color-brand-light);
  color: var(--color-brand-dark);
  font-size: 11px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 100px;
}

.slideArea {
  flex: 1;
  overflow-y: auto;
  background: var(--color-bg);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Lesson/
git commit -m "feat: add Lesson page with slide viewer"
```

---

## Chunk 7: Login + Admin + Final Checks

### Task 14: Login page

**Files:**
- Modify: `src/pages/Login/Login.tsx`
- Create: `src/pages/Login/Login.module.css`

- [ ] **Step 1: Implement Login page**

```tsx
// src/pages/Login/Login.tsx
import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Login.module.css'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Неверный email или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.cat}>🐱</span>
          <span className={styles.brand}>Unit School</span>
        </div>
        <h1 className={styles.title}>Добро пожаловать!</h1>
        <p className={styles.subtitle}>Войдите в аккаунт чтобы начать обучение</p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@unitpay.ru"
              required
              autoComplete="email"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? 'Входим...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

```css
/* src/pages/Login/Login.module.css */
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-sidebar-bg);
  padding: 24px;
}

.card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: 44px 48px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0,0,0,.25);
}

.logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
.cat { font-size: 32px; }
.brand { font-size: 20px; font-weight: 700; }

.title { font-size: 22px; font-weight: 700; margin-bottom: 6px; }

.subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 28px;
}

.form { display: flex; flex-direction: column; gap: 18px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.label { font-size: 13px; font-weight: 600; }

.input {
  padding: 11px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  outline: none;
  font-family: inherit;
  transition: border-color .15s;
}

.input:focus { border-color: var(--color-brand); }

.error {
  font-size: 13px;
  color: #ef4444;
  padding: 8px 12px;
  background: #fef2f2;
  border-radius: var(--radius-sm);
}

.submit {
  padding: 12px;
  background: var(--color-brand);
  color: #fff;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 600;
  transition: background .15s;
  margin-top: 4px;
}

.submit:hover:not(:disabled) { background: var(--color-brand-dark); }
.submit:disabled { opacity: 0.6; cursor: not-allowed; }
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Login/
git commit -m "feat: add Login page"
```

---

### Task 15: Admin panel

**Files:**
- Modify: `src/pages/Admin/Admin.tsx`
- Create: `src/pages/Admin/Admin.module.css`

- [ ] **Step 1: Implement Admin page**

```tsx
// src/pages/Admin/Admin.tsx
import { useState } from 'react'
import { mockUsers } from '../../data/users'
import { mockLessons } from '../../data/lessons'
import type { Lesson } from '../../types'
import styles from './Admin.module.css'

export function AdminPage() {
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons)

  function togglePublished(id: string) {
    setLessons(prev =>
      prev.map(l => l.id === id ? { ...l, published: !l.published } : l)
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Администрирование</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Пользователи</h2>
        <table className={styles.table}>
          <thead>
            <tr><th>Имя</th><th>Email</th><th>Роль</th><th>Последняя активность</th></tr>
          </thead>
          <tbody>
            {mockUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`${styles.badge} ${user.role === 'admin' ? styles.badgeAdmin : ''}`}>
                    {user.role === 'admin' ? 'Администратор' : 'Сотрудник'}
                  </span>
                </td>
                <td>{user.lastActive ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Модули</h2>
        <table className={styles.table}>
          <thead>
            <tr><th>Название</th><th>Слайдов</th><th>Статус</th></tr>
          </thead>
          <tbody>
            {lessons.map(lesson => (
              <tr key={lesson.id}>
                <td>{lesson.title}</td>
                <td>{lesson.slides.length}</td>
                <td>
                  <button
                    className={`${styles.toggle} ${lesson.published ? styles.toggleOn : styles.toggleOff}`}
                    onClick={() => togglePublished(lesson.id)}
                  >
                    {lesson.published ? 'Опубликован' : 'Скрыт'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
```

```css
/* src/pages/Admin/Admin.module.css */
.page { padding: 40px 48px; max-width: 900px; }

.heading { font-size: 26px; font-weight: 700; margin-bottom: 36px; }

.section { margin-bottom: 40px; }

.sectionTitle {
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
  margin-bottom: 14px;
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

.toggle {
  padding: 5px 14px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  transition: background .15s;
}

.toggleOn {
  background: var(--color-brand-light);
  color: var(--color-brand-dark);
  border: 1px solid var(--color-brand);
}

.toggleOff {
  background: var(--color-locked-bg);
  color: var(--color-locked);
  border: 1px solid var(--color-border);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Admin/
git commit -m "feat: add Admin panel"
```

---

### Task 16: Final checks + .gitignore

- [ ] **Step 1: Run all tests**

```bash
npm test
```
Expected: All tests pass (AuthContext ×9, routes ×4, LessonCard ×6, SlideNav ×5, slideUtils ×5, Dashboard ×4 = 33 total)

- [ ] **Step 2: Production build passes**

```bash
npm run build
```
Expected: No TypeScript errors, `dist/` created successfully

- [ ] **Step 3: Add .superpowers to .gitignore**

Add to `.gitignore`:
```
.superpowers/
```

- [ ] **Step 4: Run dev server and manually verify all flows**

```bash
npm run dev
```

**User flow:**
1. `localhost:5173` → redirects to `/login`
2. Wrong credentials → error message shown
3. `user@unitpay.ru` / `password123` → dashboard
4. Day 1 card with 0% progress, Day 2 locked ("Скоро")
5. Click Day 1 → lesson opens, slide 1 (welcome with cat)
6. Click "Начать обучение" → goes to slide 2
7. Slide 2: tabs (Управление, Разработка, ...) — click each tab, see team cards
8. Arrow keys ←→ navigate slides
9. Slide 6: tabs (Эквайринг, Неттинг) — see vendor cards
10. Slide 7: cheatsheet tables
11. Slide 8: finish screen, "Скоро новые уроки"
12. Refresh → still logged in
13. Logout → back to `/login`

**Admin flow:**
1. Login as `admin@unitpay.ru` / `admin123`
2. Sidebar shows "Админ" link
3. `/admin` → user table + lessons table
4. Toggle Day 2 published state

- [ ] **Step 5: Final commit**

```bash
git add .gitignore
git commit -m "chore: finalize project setup"
```
