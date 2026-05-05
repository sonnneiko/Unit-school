# Accounting Lessons Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить 3 урока в раздел «Аккаунтинг» (intro, tools, chats) с двумя новыми типами слайдов (`tools`, `tgchats`) и анимацией буллетов в WelcomeSlide.

**Architecture:** Каждый новый тип слайда — отдельный компонент с интерфейсом контента в types/index.ts. Оба слайда используют split-layout (две колонны на весь экран): левая панель — список, правая — детали с fadeIn-анимацией при выборе. WelcomeSlide получает опциональный prop `image` для переопределения картинки.

**Tech Stack:** React 18, TypeScript, CSS Modules, lucide-react (уже установлен), Vite

---

## Chunk 1: Types, Data, WelcomeContent image prop

### Task 1: Обновить `src/types/index.ts`

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Добавить `image?: string` в WelcomeContent**

  Найти интерфейс `WelcomeContent` и добавить поле:
  ```ts
  export interface WelcomeContent {
    title: string
    subtitle: string
    ctaLabel: string
    bullets?: string[]
    image?: string   // путь к картинке (import-строка), опционально
  }
  ```

- [ ] **Step 2: Добавить `'tools'` и `'tgchats'` в `SlideType`**

  ```ts
  export type SlideType = 'welcome' | 'tabs' | 'info' | 'feature' | 'methods' | 'flowchart' | 'diagram' | 'cheatsheet' | 'merchant' | 'compare' | 'kassa' | 'acquiring' | 'vendors' | 'entities' | 'finish' | 'tools' | 'tgchats'
  ```

- [ ] **Step 3: Добавить интерфейсы для `tools`**

  После блока `EntitiesContent`:
  ```ts
  export interface ToolItem {
    id: string
    title: string
    gradient: string   // полная CSS строка: "linear-gradient(135deg, #AAA, #BBB)"
    icon: string       // имя иконки из lucide-react
    description: string
    videoUrl?: string  // embed URL (YouTube/Loom), опционально
  }

  export interface ToolsContent {
    tools: ToolItem[]
  }
  ```

- [ ] **Step 4: Добавить интерфейсы для `tgchats`**

  ```ts
  export interface TgChatItem {
    id: string
    name: string
    avatarImage?: string    // путь /team/filename.jpg
    avatarGradient?: string // CSS gradient если нет картинки
    avatarEmoji?: string    // emoji поверх градиента
    avatarText?: string     // короткий текст поверх градиента (напр. "PM")
    preview: string         // текст под названием в списке
    badge?: number          // число непрочитанных
    cardId: string          // id карточки описания
  }

  export interface TgChatCard {
    id: string
    name: string
    avatarImage?: string
    avatarGradient?: string
    avatarEmoji?: string
    avatarText?: string
    description: string
    tag: string
  }

  export interface TgChatsContent {
    chats: TgChatItem[]
    cards: TgChatCard[]
    downloadUrl?: string
    footerNote?: string
  }
  ```

- [ ] **Step 5: Добавить новые типы в union `Slide.content`**

  Найти строку с `export interface Slide` и расширить union:
  ```ts
  content: WelcomeContent | TabsContent | InfoContent | FeatureContent | MethodsContent | FlowchartContent | DiagramContent | CheatsheetContent | MerchantContent | CompareContent | KassaContent | AcquiringContent | VendorsSlideContent | EntitiesContent | FinishContent | ToolsContent | TgChatsContent
  ```

- [ ] **Step 6: Проверить TypeScript**

  ```bash
  cd /Users/s.alhazova/Documents/GitHub/Unit-school
  npx tsc --noEmit
  ```
  Ожидание: ошибок нет (или только о ещё не созданных компонентах)

---

### Task 2: Обновить `src/data/courses.ts`

**Files:**
- Modify: `src/data/courses.ts`

- [ ] **Step 1: Заменить topics в секции `unitpay-accounting`, убрать `comingSoon`**

  Найти блок:
  ```ts
  {
    id: 'unitpay-accounting',
    icon: '📊',
    title: 'Аккаунтинг',
    topics: [
      { id: 'tasks',   icon: '📋', title: 'Задачи',       lessonId: 'accounting-tasks' },
      { id: 'tools',   icon: '🛠️', title: 'Инструменты', lessonId: 'accounting-tools' },
      { id: 'workday', icon: '📅', title: 'Рабочий день', lessonId: 'accounting-workday' },
      { id: 'chats',   icon: '💬', title: 'Чаты',         lessonId: 'accounting-chats' },
    ],
    comingSoon: true,
  },
  ```

  Заменить на:
  ```ts
  {
    id: 'unitpay-accounting',
    icon: '📊',
    title: 'Аккаунтинг',
    topics: [
      { id: 'intro',  icon: '🧑‍💼', title: 'Аккаунтинг',  lessonId: 'accounting-intro' },
      { id: 'tools',  icon: '🛠️',  title: 'Инструменты', lessonId: 'accounting-tools' },
      { id: 'chats',  icon: '💬',  title: 'Чаты',         lessonId: 'accounting-chats' },
    ],
  },
  ```

- [ ] **Step 2: Проверить TypeScript**

  ```bash
  npx tsc --noEmit
  ```

---

### Task 3: Добавить 3 урока в `src/data/lessons.ts`

**Files:**
- Modify: `src/data/lessons.ts`

- [ ] **Step 1: Добавить импорт картинки для accounting-intro**

  В начало файла добавить:
  ```ts
  import accountingCat from '../assets/unit-cat/Аккаунтинг.png'
  ```

- [ ] **Step 2: Добавить урок `accounting-intro`**

  В конец массива `mockLessons` (перед закрывающей `]`):
  ```ts
  // ── Аккаунтинг: Введение ─────────────────────────────────
  {
    id: 'accounting-intro',
    title: 'Аккаунтинг',
    tag: 'Аккаунтинг',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'welcome',
        content: {
          title: 'Аккаунтинг',
          subtitle: 'Аккаунт-менеджер — это связующее звено между UnitPay и мерчантами. Именно они от лица UnitPay общаются с партнёрами, помогают им и сопровождают в работе с нашим сервисом.',
          ctaLabel: 'Начать',
          image: accountingCat,
          bullets: [
            'Поддержка мерчантов',
            'Мониторинг и аналитика',
            'Взаимодействие внутри команды',
            'Построение долгосрочных отношений',
          ],
        },
      },
    ],
  },
  ```

- [ ] **Step 3: Добавить урок `accounting-tools`**

  ```ts
  // ── Аккаунтинг: Инструменты ──────────────────────────────
  {
    id: 'accounting-tools',
    title: 'Инструменты',
    tag: 'Аккаунтинг',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'tools',
        content: {
          tools: [
            {
              id: 'admin',
              title: 'Adminка UnitPay',
              gradient: 'linear-gradient(135deg, #6BCB77, #4CAF50)',
              icon: 'Settings',
              description: 'Главный рабочий инструмент. Здесь всё: проекты, транзакции, настройки мерчантов, финансовые данные.',
            },
            {
              id: 'omnidesk',
              title: 'Omnidesk',
              gradient: 'linear-gradient(135deg, #9B59B6, #6c5ce7)',
              icon: 'MessageSquare',
              description: 'Система для взаимодействия с мерчантами и плательщиками. Обращения, тикеты, история переписки.',
            },
            {
              id: 'teamly',
              title: 'Teamly',
              gradient: 'linear-gradient(135deg, #F4A800, #e67e22)',
              icon: 'LayoutDashboard',
              description: 'Инструмент для взаимодействия с другими отделами. Задачи, документы, внутренние процессы.',
            },
            {
              id: 'telegram',
              title: 'Telegram',
              gradient: 'linear-gradient(135deg, #2AABEE, #0984e3)',
              icon: 'Send',
              description: 'Взаимодействие с командой, партнёрами и поставщиками.',
            },
          ],
        },
      },
    ],
  },
  ```

- [ ] **Step 4: Добавить урок `accounting-chats`**

  ```ts
  // ── Аккаунтинг: Чаты ─────────────────────────────────────
  {
    id: 'accounting-chats',
    title: 'Чаты',
    tag: 'Аккаунтинг',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'tgchats',
        content: {
          downloadUrl: '/chats-guide.pdf',
          footerNote: 'Это не все чаты — но основные, нужные на данном этапе. При добавлении в новые чаты тебе расскажут, для чего они.',
          chats: [
            {
              id: 'accounting',
              name: 'Аккаунтинг ✈️',
              avatarImage: '/team/аккаунтинг.jpg',
              preview: 'София: GIF',
              badge: 1209,
              cardId: 'accounting',
            },
            {
              id: 'sb',
              name: 'Взаимодействие с СБ ✈️',
              avatarGradient: 'linear-gradient(140deg, #9b59b6, #c39bd3)',
              avatarEmoji: '🐈',
              preview: 'София: может улучшим шаблон?',
              cardId: 'sb',
            },
            {
              id: 'ampm',
              name: 'Взаимодействие Аккаунтинг | PM ✈️',
              avatarGradient: 'linear-gradient(140deg, #00b894, #0984e3)',
              avatarText: 'PM',
              preview: 'София: окей, сделаем',
              cardId: 'ampm',
            },
            {
              id: 'alerts',
              name: 'Unitpay Alerts ✈️',
              avatarImage: '/team/Юнитпей алертс.jpg',
              preview: '🟢 Трафик восстановлен.',
              cardId: 'alerts',
            },
            {
              id: 'partners',
              name: 'Действия партнёров ✈️',
              avatarImage: '/team/действия партнеров.jpg',
              preview: 'UnitBot: Регистрация нового...',
              badge: 444,
              cardId: 'triggers',
            },
            {
              id: 'urlica',
              name: 'Юрлица Triggers ✈️',
              avatarGradient: 'linear-gradient(140deg, #e84393, #fd79a8)',
              avatarEmoji: '❗',
              preview: 'UnitBot: [Снижение оборота]',
              badge: 1528,
              cardId: 'triggers',
            },
            {
              id: 'site',
              name: 'Сайт недоступен TRIGGERS ✈️',
              avatarGradient: 'linear-gradient(140deg, #fd9644, #e55039)',
              avatarText: '满',
              preview: 'UnitBot: архив',
              cardId: 'triggers',
            },
          ],
          cards: [
            {
              id: 'accounting',
              name: 'Аккаунтинг',
              avatarImage: '/team/аккаунтинг.jpg',
              description: 'Общий чат всех аккаунт-менеджеров. Здесь обсуждаем рабочие вопросы, делимся информацией и координируемся внутри отдела. Иногда присылаем мемы.',
              tag: 'Внутренний чат отдела',
            },
            {
              id: 'sb',
              name: 'Взаимодействие с СБ',
              avatarGradient: 'linear-gradient(140deg, #9b59b6, #c39bd3)',
              avatarEmoji: '🐈',
              description: 'Чат для взаимодействия со службой безопасности. Сюда пишешь, когда нужна приоритетная проверка мерчанта, согласование проекта или есть вопросы по безопасности.',
              tag: 'Межотдельный',
            },
            {
              id: 'ampm',
              name: 'Взаимодействие Аккаунтинг | PM',
              avatarGradient: 'linear-gradient(140deg, #00b894, #0984e3)',
              avatarText: 'PM',
              description: 'Чат для совместной работы с менеджерами проектов и техническими специалистами. Здесь обсуждаются задачи, которые требуют участия нескольких отделов.',
              tag: 'Межотдельный',
            },
            {
              id: 'alerts',
              name: 'Unitpay Alerts',
              avatarImage: '/team/Юнитпей алертс.jpg',
              description: 'Автоматические оповещения о проблемах с доступностью сервисов UnitPay и об их восстановлении. Канал для наших мерчантов.',
              tag: 'Оповещения сервиса',
            },
            {
              id: 'triggers',
              name: 'Чаты с триггерами',
              avatarGradient: 'linear-gradient(140deg, #11998e, #38ef7d)',
              avatarEmoji: '⚡',
              description: 'Автоматические уведомления о действиях партнёров: регистрации, снижении оборота, недоступности сайта и других событиях. Подробнее о триггерах — в курсе «Технические аспекты и интеграция».',
              tag: 'Технические аспекты и интеграция →',
            },
          ],
        },
      },
    ],
  },
  ```

- [ ] **Step 5: Проверить TypeScript**

  ```bash
  npx tsc --noEmit
  ```
  Ожидание: ошибок нет.

- [ ] **Step 6: Commit**

  ```bash
  git add src/types/index.ts src/data/courses.ts src/data/lessons.ts
  git commit -m "feat(accounting): add types and data for 3 accounting lessons"
  ```

---

## Chunk 2: WelcomeSlide — image prop + bullet animation

> **Зависит от Chunk 1** — интерфейс `WelcomeContent` с полем `image` должен быть добавлен в Task 1.

### Task 4: Обновить `WelcomeSlide.tsx` и CSS

**Files:**
- Modify: `src/components/slides/WelcomeSlide.tsx`
- Modify: `src/components/slides/slides.module.css`

- [ ] **Step 1: Добавить анимацию буллетов в `slides.module.css`**

  Сначала проверить, существует ли класс `.welcomeBulletItem` в файле:
  ```bash
  grep -n "welcomeBulletItem" src/components/slides/slides.module.css
  ```

  **Если класс найден** — добавить только строку анимации к существующему блоку (не создавать новый):
  ```css
  /* добавить внутрь существующего .welcomeBulletItem: */
  animation: bulletFadeIn 0.35s ease both;
  ```
  И отдельно добавить keyframes в конец файла:
  ```css
  @keyframes bulletFadeIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  ```

  **Если класса нет** — добавить в конец файла:
  ```css
  @keyframes bulletFadeIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .welcomeBulletItem {
    animation: bulletFadeIn 0.35s ease both;
  }
  ```

- [ ] **Step 2: Обновить `WelcomeSlide.tsx` — поддержка `image` prop и `animation-delay`**

  Полное содержимое файла:
  ```tsx
  import defaultCat from '../../assets/unit-cat/Unitpay Cat 1.png'
  import type { WelcomeContent } from '../../types'
  import styles from './slides.module.css'

  interface Props {
    content: WelcomeContent
    onNext: () => void
  }

  export function WelcomeSlide({ content, onNext }: Props) {
    const catImage = content.image ?? defaultCat

    return (
      <div className={styles.welcomeFull}>
        <div className={styles.welcomeLeft}>
          <h1 className={styles.welcomeFullTitle}>{content.title}</h1>
          <p className={styles.welcomeFullSubtitle}>{content.subtitle}</p>
          {content.bullets && content.bullets.length > 0 && (
            <ul className={styles.welcomeBullets}>
              {content.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className={styles.welcomeBulletItem}
                  style={{ animationDelay: `${i * 150}ms` }}
                >
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
          <img src={catImage} alt={content.title} className={styles.welcomeCat} />
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 3: Запустить dev-сервер и проверить визуально**

  ```bash
  npm run dev
  ```
  Открыть урок «Команда» (первый в списке) — буллеты должны появляться последовательно с анимацией. Страница не должна сломаться.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/slides/WelcomeSlide.tsx src/components/slides/slides.module.css
  git commit -m "feat(WelcomeSlide): add image prop and staggered bullet animation"
  ```

---

## Chunk 3: ToolsSlide компонент

### Task 5: Создать `ToolsSlide.tsx`

**Files:**
- Create: `src/components/slides/ToolsSlide.tsx`
- Modify: `src/components/slides/slides.module.css`

- [ ] **Step 1: Добавить CSS-классы для ToolsSlide в `slides.module.css`**

  Добавить в конец файла:
  ```css
  /* ToolsSlide */
  .toolsFull {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
  }

  .toolsSidebar {
    width: 320px;
    flex-shrink: 0;
    background: #f8f9fa;
    border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;
    padding: 32px 20px;
    gap: 10px;
    overflow-y: auto;
  }

  .toolCard {
    border-radius: 14px;
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    border: 2px solid transparent;
  }

  .toolCard:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }

  .toolCardActive {
    border-color: white;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);
  }

  .toolCardIcon {
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: white;
  }

  .toolCardTitle {
    color: white;
    font-size: 15px;
    font-weight: 700;
  }

  .toolsDetail {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 48px 56px;
    overflow-y: auto;
  }

  .toolsDetailTitle {
    font-size: 36px;
    font-weight: 800;
    color: #1a1a2e;
    margin-bottom: 16px;
    font-family: 'IgraSans', 'Manrope', sans-serif;
  }

  .toolsDetailDesc {
    font-size: 17px;
    color: #555;
    line-height: 1.7;
    margin-bottom: 32px;
    max-width: 560px;
  }

  .toolsVideoPlaceholder {
    background: #f0f2f5;
    border-radius: 16px;
    height: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #aaa;
    font-size: 15px;
    max-width: 600px;
  }

  .toolsVideoPlaceholder svg {
    opacity: 0.4;
  }

  .toolsVideoIframe {
    width: 100%;
    max-width: 600px;
    height: 340px;
    border-radius: 16px;
    border: none;
  }

  @keyframes toolDetailFadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .toolsDetailContent {
    animation: toolDetailFadeIn 0.22s ease both;
  }
  ```

- [ ] **Step 2: Создать `ToolsSlide.tsx`**

  ```tsx
  import { useState } from 'react'
  import * as LucideIcons from 'lucide-react'
  import type { ToolsContent, ToolItem } from '../../types'
  import styles from './slides.module.css'

  interface Props {
    content: ToolsContent
  }

  function ToolIcon({ name }: { name: string }) {
    const Icon = (LucideIcons as Record<string, React.ComponentType<{ size?: number; color?: string }>>)[name]
    if (!Icon) return null
    return <Icon size={20} color="white" />
  }

  export function ToolsSlide({ content }: Props) {
    const [activeId, setActiveId] = useState<string>(content.tools[0]?.id ?? '')

    const activeTool: ToolItem | undefined = content.tools.find(t => t.id === activeId)

    return (
      <div className={styles.toolsFull}>
        <div className={styles.toolsSidebar}>
          {content.tools.map(tool => (
            <div
              key={tool.id}
              className={`${styles.toolCard} ${tool.id === activeId ? styles.toolCardActive : ''}`}
              style={{ background: tool.gradient }}
              onClick={() => setActiveId(tool.id)}
            >
              <div className={styles.toolCardIcon}>
                <ToolIcon name={tool.icon} />
              </div>
              <span className={styles.toolCardTitle}>{tool.title}</span>
            </div>
          ))}
        </div>

        {activeTool && (
          <div key={activeTool.id} className={`${styles.toolsDetail} ${styles.toolsDetailContent}`}>
            <h2 className={styles.toolsDetailTitle}>{activeTool.title}</h2>
            <p className={styles.toolsDetailDesc}>{activeTool.description}</p>
            {activeTool.videoUrl ? (
              <iframe
                src={activeTool.videoUrl}
                className={styles.toolsVideoIframe}
                allowFullScreen
                title={activeTool.title}
              />
            ) : (
              <div className={styles.toolsVideoPlaceholder}>
                <LucideIcons.PlayCircle size={48} />
                <span>Видео скоро появится</span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
  ```

- [ ] **Step 3: Добавить в `src/components/slides/Slide.tsx`**

  Добавить импорт после существующих импортов компонентов:
  ```ts
  import { ToolsSlide } from './ToolsSlide'
  ```

  Заменить строку импорта типов (строка 1) на:
  ```ts
  import type { Slide as SlideType, Lesson, WelcomeContent, InfoContent, FeatureContent, MethodsContent, FlowchartContent, DiagramContent, CheatsheetContent, TabsContent, MerchantContent, CompareContent, KassaContent, AcquiringContent, VendorsSlideContent, EntitiesContent, FinishContent, ToolsContent } from '../../types'
  ```

  Добавить case перед `default:`:
  ```ts
  case 'tools':
    return <ToolsSlide content={slide.content as ToolsContent} />
  ```

- [ ] **Step 4: Запустить dev-сервер и проверить**

  ```bash
  npm run dev
  ```
  - Открыть курс Junior AM → раздел «Аккаунтинг» — должны появиться 3 темы (не заглушка «скоро»)
  - Кликнуть «Инструменты» → открывается слайд с 4 карточками слева
  - Клик по каждой карточке — справа меняется контент с анимацией
  - Карточки без `videoUrl` показывают placeholder «Видео скоро появится»

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/slides/ToolsSlide.tsx src/components/slides/slides.module.css src/components/slides/Slide.tsx
  git commit -m "feat(ToolsSlide): add interactive tools slide with split layout"
  ```

---

## Chunk 4: TgChatsSlide компонент

### Task 6: Создать `TgChatsSlide.tsx`

**Files:**
- Create: `src/components/slides/TgChatsSlide.tsx`
- Modify: `src/components/slides/slides.module.css`

- [ ] **Step 1: Добавить CSS-классы для TgChatsSlide в `slides.module.css`**

  Добавить в конец файла:
  ```css
  /* TgChatsSlide */
  .tgFull {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
  }

  .tgSidebar {
    width: 340px;
    flex-shrink: 0;
    background: #1c2733;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .tgHeader {
    background: #17212b;
    padding: 20px 20px 14px;
    border-bottom: 1px solid #0d1117;
    flex-shrink: 0;
  }

  .tgHeaderTitle {
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  .tgTabs {
    display: flex;
    gap: 6px;
  }

  .tgTab {
    padding: 5px 14px;
    border-radius: 20px;
    font-size: 13px;
    color: #6c8998;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .tgTabActive {
    background: #2b5278;
    color: #3390ec;
    font-weight: 600;
  }

  .tgChatList {
    flex: 1;
    overflow-y: auto;
  }

  .tgChat {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid #1a2535;
    transition: background 0.15s;
  }

  .tgChat:hover {
    background: #243447;
  }

  .tgChatActive {
    background: #2b5278;
  }

  .tgAvatar {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
    overflow: hidden;
    font-family: system-ui, sans-serif;
  }

  .tgAvatarImg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .tgChatInfo {
    flex: 1;
    min-width: 0;
  }

  .tgChatName {
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tgChatPreview {
    color: #6c8998;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
  }

  .tgBadge {
    background: #3390ec;
    color: white;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 20px;
    flex-shrink: 0;
    min-width: 24px;
    text-align: center;
  }

  .tgDetail {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fff;
    overflow: hidden;
  }

  .tgDetailHeader {
    padding: 32px 52px 24px;
    border-bottom: 1px solid #f0f0f0;
    flex-shrink: 0;
  }

  .tgDetailTitle {
    font-size: 34px;
    font-weight: 800;
    color: #1a1a2e;
    font-family: 'IgraSans', 'Manrope', sans-serif;
  }

  .tgDetailSubtitle {
    font-size: 15px;
    color: #999;
    margin-top: 6px;
  }

  .tgDetailBody {
    flex: 1;
    padding: 32px 52px;
    overflow-y: auto;
  }

  .tgCard {
    background: #f7f8ff;
    border-radius: 16px;
    padding: 28px 32px;
    border-left: 4px solid #3390ec;
    animation: tgCardFadeIn 0.22s ease both;
  }

  @keyframes tgCardFadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .tgCardHeader {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  .tgCardAvatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 700;
    color: white;
    flex-shrink: 0;
    overflow: hidden;
    font-family: system-ui, sans-serif;
  }

  .tgCardName {
    font-size: 22px;
    font-weight: 700;
    color: #1a1a2e;
  }

  .tgCardDesc {
    font-size: 16px;
    color: #555;
    line-height: 1.7;
    margin-bottom: 18px;
  }

  .tgCardTag {
    display: inline-block;
    background: #e8f0fe;
    color: #3390ec;
    font-size: 12px;
    font-weight: 600;
    padding: 5px 14px;
    border-radius: 20px;
  }

  .tgDefaultHint {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 12px;
    color: #ccc;
    font-size: 15px;
  }

  .tgFooter {
    padding: 18px 52px 22px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-shrink: 0;
  }

  .tgFooterNote {
    font-size: 13px;
    color: #aaa;
    line-height: 1.5;
    max-width: 380px;
  }

  .tgDownloadBtn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #3390ec;
    color: white;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
    flex-shrink: 0;
    transition: background 0.15s;
  }

  .tgDownloadBtn:hover {
    background: #2176d2;
  }
  ```

- [ ] **Step 2: Создать `TgChatsSlide.tsx`**

  ```tsx
  import { useState } from 'react'
  import type { TgChatsContent, TgChatItem, TgChatCard } from '../../types'
  import styles from './slides.module.css'

  interface Props {
    content: TgChatsContent
  }

  function Avatar({
    avatarImage, avatarGradient, avatarEmoji, avatarText, className,
  }: Pick<TgChatItem, 'avatarImage' | 'avatarGradient' | 'avatarEmoji' | 'avatarText'> & { className: string }) {
    if (avatarImage) {
      return (
        <div className={className} style={{ background: '#333' }}>
          <img src={avatarImage} alt="" className={styles.tgAvatarImg} />
        </div>
      )
    }
    return (
      <div className={className} style={{ background: avatarGradient ?? '#555' }}>
        {avatarEmoji ?? avatarText ?? ''}
      </div>
    )
  }

  export function TgChatsSlide({ content }: Props) {
    const [activeTab, setActiveTab] = useState<'all' | 'triggers'>('all')
    const [activeCardId, setActiveCardId] = useState<string>(content.chats[0]?.cardId ?? '')
    const [activeChatId, setActiveChatId] = useState<string>(content.chats[0]?.id ?? '')

    const visibleChats = activeTab === 'all'
      ? content.chats
      : content.chats.filter(c => c.cardId === 'triggers')

    const activeCard: TgChatCard | undefined = content.cards.find(c => c.id === activeCardId)

    function handleChatClick(chat: TgChatItem) {
      setActiveChatId(chat.id)
      setActiveCardId(chat.cardId)
    }

    return (
      <div className={styles.tgFull}>
        {/* LEFT: TG Sidebar */}
        <div className={styles.tgSidebar}>
          <div className={styles.tgHeader}>
            <div className={styles.tgHeaderTitle}>Чаты</div>
            <div className={styles.tgTabs}>
              <div
                className={`${styles.tgTab} ${activeTab === 'all' ? styles.tgTabActive : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Все
              </div>
              <div
                className={`${styles.tgTab} ${activeTab === 'triggers' ? styles.tgTabActive : ''}`}
                onClick={() => setActiveTab('triggers')}
              >
                Триггеры
              </div>
            </div>
          </div>

          <div className={styles.tgChatList}>
            {visibleChats.map(chat => (
              <div
                key={chat.id}
                className={`${styles.tgChat} ${chat.id === activeChatId ? styles.tgChatActive : ''}`}
                onClick={() => handleChatClick(chat)}
              >
                <Avatar
                  avatarImage={chat.avatarImage}
                  avatarGradient={chat.avatarGradient}
                  avatarEmoji={chat.avatarEmoji}
                  avatarText={chat.avatarText}
                  className={styles.tgAvatar}
                />
                <div className={styles.tgChatInfo}>
                  <div className={styles.tgChatName}>{chat.name}</div>
                  <div className={styles.tgChatPreview}>{chat.preview}</div>
                </div>
                {chat.badge != null && (
                  <div className={styles.tgBadge}>{chat.badge}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Detail */}
        <div className={styles.tgDetail}>
          <div className={styles.tgDetailHeader}>
            <div className={styles.tgDetailTitle}>Рабочие чаты</div>
            <div className={styles.tgDetailSubtitle}>Нажми на чат слева, чтобы узнать его назначение</div>
          </div>

          <div className={styles.tgDetailBody}>
            {activeCard ? (
              <div key={activeCard.id} className={styles.tgCard}>
                <div className={styles.tgCardHeader}>
                  <Avatar
                    avatarImage={activeCard.avatarImage}
                    avatarGradient={activeCard.avatarGradient}
                    avatarEmoji={activeCard.avatarEmoji}
                    avatarText={activeCard.avatarText}
                    className={styles.tgCardAvatar}
                  />
                  <div className={styles.tgCardName}>{activeCard.name}</div>
                </div>
                <p className={styles.tgCardDesc}>{activeCard.description}</p>
                <span className={styles.tgCardTag}>{activeCard.tag}</span>
              </div>
            ) : (
              <div className={styles.tgDefaultHint}>
                <span>←</span>
                <span>Выбери чат из списка</span>
              </div>
            )}
          </div>

          <div className={styles.tgFooter}>
            {content.footerNote && (
              <span className={styles.tgFooterNote}>{content.footerNote}</span>
            )}
            {content.downloadUrl && (
              <a href={content.downloadUrl} className={styles.tgDownloadBtn} download>
                ↓ Скачать список чатов
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 3: Добавить в `src/components/slides/Slide.tsx`**

  Добавить импорт после `ToolsSlide`:
  ```ts
  import { TgChatsSlide } from './TgChatsSlide'
  ```

  Заменить строку импорта типов на (добавить `TgChatsContent` в конец):
  ```ts
  import type { Slide as SlideType, Lesson, WelcomeContent, InfoContent, FeatureContent, MethodsContent, FlowchartContent, DiagramContent, CheatsheetContent, TabsContent, MerchantContent, CompareContent, KassaContent, AcquiringContent, VendorsSlideContent, EntitiesContent, FinishContent, ToolsContent, TgChatsContent } from '../../types'
  ```

  Добавить case перед `default:`:
  ```ts
  case 'tgchats':
    return <TgChatsSlide content={slide.content as TgChatsContent} />
  ```

- [ ] **Step 4: Запустить dev-сервер и проверить**

  ```bash
  npm run dev
  ```
  - Открыть Junior AM → Аккаунтинг → Чаты
  - Левая панель: 7 чатов с аватарками и превью
  - Клик по чату: справа появляется описание с анимацией
  - Вкладка «Триггеры»: фильтрует до 3 триггерных чатов
  - Все 3 триггерных чата → одна карточка «Чаты с триггерами»
  - Внизу кнопка «Скачать список чатов» (ведёт на `/chats-guide.pdf`)
  - Примечание под кнопкой

- [ ] **Step 5: Проверить урок «Аккаунтинг» (intro)**

  - Открыть Junior AM → Аккаунтинг → Аккаунтинг
  - Слева: заголовок «Аккаунтинг», текст, 4 буллета с анимацией появления, кнопка «Начать»
  - Справа: картинка котика в костюме супергероя (`Аккаунтинг.png`)

- [ ] **Step 6: Commit**

  ```bash
  git add src/components/slides/TgChatsSlide.tsx src/components/slides/slides.module.css src/components/slides/Slide.tsx
  git commit -m "feat(TgChatsSlide): add Telegram-style chats slide with interactive selection"
  ```
