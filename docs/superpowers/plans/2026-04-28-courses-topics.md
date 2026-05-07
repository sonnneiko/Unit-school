# Courses → Section → Topic Flow Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split "Основы UnitPay" into individual topic lessons with a new SectionPage that lists them with progress bars, accessible via `/courses/:sectionId`.

**Architecture:** Add a `Topic` type replacing `string[]` topics + `lessonIds`. New `SectionPage` lists topic cards. `CoursesPage` cards become links. `LessonPage` back-navigates to the section via router state. Nine new lessons replace `day-1`.

**Tech Stack:** React, React Router v6, CSS Modules, TypeScript

---

## Chunk 1: Types + Data

### Task 1: Update types

**Files:**
- Modify: `src/types/index.ts`

- [ ] Add `Topic` interface and update `Lesson` type. Replace `FinishContent` import reference from Lesson.tsx later.

```ts
// In src/types/index.ts, add after the Lesson interface:

export interface Topic {
  id: string
  icon: string
  title: string
  lessonId: string
}
```

The `Section` type lives in `CoursesPage.tsx` (local), not in `types/index.ts` — update it there in Task 3.

- [ ] Commit:
```bash
git add src/types/index.ts
git commit -m "feat: add Topic type"
```

---

### Task 2: Replace lessons data

**Files:**
- Modify: `src/data/lessons.ts`

- [ ] Replace entire file content. Remove `day-1` through `day-8`. Add 9 topic lessons. Each lesson ends on its last content slide (no finish slides).

```ts
import type { Lesson } from '../types'

export const mockLessons: Lesson[] = [
  // ── Команда ──────────────────────────────────────────────
  {
    id: 'unitpay-basics-team',
    title: 'Команда',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'welcome',
        content: {
          title: 'Добро пожаловать в команду Unitpay!',
          subtitle: 'Я котик Юнит 🐾 рад знакомству! В первые дни я буду рядом и помогу быстро освоиться.',
          ctaLabel: 'Начать',
        },
      },
      {
        id: 's2',
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
                { name: 'Максим Шетхман', role: 'Разработчик', description: 'Backend-разработчик. Помогает команде и разбирается во всём.', photoPlaceholder: '#795548' },
              ],
            },
            {
              label: 'Менеджмент',
              itemType: 'team',
              items: [
                { name: 'Артем Драгунов', role: 'Product Manager', description: 'Отвечает за создание и развитие продукта, формирует стратегию и приоритеты.', photoPlaceholder: '#FF9800' },
                { name: 'Анастасия Деева', role: 'Project Manager', description: 'Координирует работу разработчиков, следит за сроками и помогает доводить задачи до результата.', photoPlaceholder: '#E91E63' },
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
                { name: 'Ани Тоноян', role: 'Служба безопасности', description: 'Следит за безопасностью и выискивает недочёты в проектах. Ходит по офису в крутых тапках.', photoPlaceholder: '#F44336' },
                { name: 'Светлана Григорьева', role: 'Служба безопасности', description: 'Контролирует безопасность UnitPay. Работает удалённо, каждое утро начинает с крутой картинки в чате.', photoPlaceholder: '#FF5722' },
              ],
            },
          ],
        },
      },
    ],
  },

  // ── UnitPay ───────────────────────────────────────────────
  {
    id: 'unitpay-basics-about',
    title: 'UnitPay',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
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
    ],
  },

  // ── Методы приёма ─────────────────────────────────────────
  {
    id: 'unitpay-basics-methods',
    title: 'Методы приёма',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
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
    ],
  },

  // ── Путь платежей ─────────────────────────────────────────
  {
    id: 'unitpay-basics-path',
    title: 'Путь платежей',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'diagram',
        content: {
          heading: 'Путь платежа от плательщика до мерчанта',
          nodes: [
            { label: 'Покупатель', children: ['Выбирает товар и инициирует оплату', 'Магазин формирует заказ и передаёт данные в агрегатор'] },
            { label: 'Страница оплаты UnitPay', children: ['Покупатель вводит данные карты', 'Агрегатор направляет данные в банк-эквайер'] },
            { label: 'Банк-эквайер', children: ['Запрашивает авторизацию у банка-эмитента', 'Направляет данные в платёжную систему (Visa, MC, МИР)'] },
            { label: 'Банк-эмитент', children: ['Подтверждает или отклоняет платёж'] },
            { label: 'Обработчик платежей UnitPay' },
          ],
        },
      },
    ],
  },

  // ── Эквайринг ─────────────────────────────────────────────
  {
    id: 'unitpay-basics-acquiring',
    title: 'Эквайринг',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'info',
        content: {
          heading: 'Эквайринг',
          bullets: [
            'Классический "белый" способ приёма платежей через банк',
            'Включает отчётность, использование кассы и выплаты на расчётный счёт',
            'UnitPay подключается сразу к нескольким банкам — все методы на одной форме',
            'Банк-эквайер — партнёр UnitPay, обрабатывает операции и отправляет в платёжные системы',
            'Минусы прямого эквайринга: привязка к одному банку, не всегда доступны все методы',
          ],
        },
      },
    ],
  },

  // ── Неттинг ───────────────────────────────────────────────
  {
    id: 'unitpay-basics-netting',
    title: 'Неттинг',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'info',
        content: {
          heading: 'Неттинг',
          bullets: [
            'Схема похожа на эквайринг, но без отчётности, чеков и выплат на расчётный счёт',
            'Все денежные средства поступают на баланс UnitPay',
            'Можно работать без регистрации ИП или юридического лица',
            'Доступен для ООО/ИП и физических лиц',
            'Комиссия выше, чем при эквайринге (+ маржа вендора)',
          ],
        },
      },
    ],
  },

  // ── Юридические и физические лица ─────────────────────────
  {
    id: 'unitpay-basics-entities',
    title: 'Юридические и физические лица',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'info',
        content: {
          heading: 'Кто может работать с UnitPay',
          bullets: [
            '🔷 Юридические лица (ООО/АО/ИП): доступен эквайринг и неттинг, нужен верификационный платёж 2000р, домен unitpay.ru',
            '🔵 Физические лица: только неттинг, без верификационного платежа, домен unitpay.money',
            'Юридические лица ведут отчётность и работают с кассой',
            'Физические лица работают без чеков и отчётности',
          ],
        },
      },
    ],
  },

  // ── Касса ─────────────────────────────────────────────────
  {
    id: 'unitpay-basics-cash',
    title: 'Касса',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'info',
        content: {
          heading: 'Онлайн-кассы',
          bullets: [
            'Юнит.Чеки — бесплатная онлайн-касса от UnitPay',
            'Отправляем чеки клиентам мерчантов и в ОФД, откуда данные идут в налоговую',
            'Бесшовная интеграция с UnitPay, соответствует 54-ФЗ',
            'Поддержка любых систем налогообложения',
            'Также доступны сторонние кассы: АТОЛ, Модулькасса, екомкасса, Чек-Онлайн',
          ],
        },
      },
    ],
  },

  // ── Поставщики ────────────────────────────────────────────
  {
    id: 'unitpay-basics-vendors',
    title: 'Поставщики',
    tag: 'Основы UnitPay',
    published: true,
    slides: [
      {
        id: 's1',
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
                { name: 'SOM', scheme: 'Эквайринг', methods: ['Карты зарубежных банков'], payout: 'На р/с', forWhom: 'ЮЛ / ИП' },
              ],
            },
            {
              label: 'Неттинг',
              itemType: 'vendor',
              items: [
                { name: 'Onlipay', scheme: 'Неттинг', methods: ['СБП'], payout: 'USDT (холд 24ч)', forWhom: 'ЮЛ / ИП / физлица' },
                { name: 'Platio', scheme: 'Неттинг', methods: ['Карты РФ/КЗ/зарубеж', 'СБП', 'USDT'], payout: 'RUB или USDT', forWhom: 'ЮЛ / ИП / физлица' },
                { name: 'Kanyon', scheme: 'Неттинг', methods: ['СБП', 'USDT'], payout: 'USDT (холд 24ч)', forWhom: 'ЮЛ / ИП / физлица' },
                { name: '2Can', scheme: 'Неттинг', methods: ['Карты РФ'], payout: 'USDT (холд 24ч)', forWhom: 'ЮЛ / ИП / физлица' },
              ],
            },
          ],
        },
      },
    ],
  },
]
```

- [ ] Commit:
```bash
git add src/data/lessons.ts
git commit -m "feat: replace day-based lessons with topic lessons for Основы UnitPay"
```

---

### Task 3: Update CoursesPage data + Topic type

**Files:**
- Modify: `src/pages/Courses/CoursesPage.tsx`

- [ ] Replace local `Section` type and `LEVELS` data. Add `Topic` import. Make cards `<Link>`.

Replace the top of the file:

```tsx
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLessons } from '../../context/LessonsContext'
import { isComplete } from '../../utils/level'
import type { Topic } from '../../types'
import styles from './CoursesPage.module.css'

type Section = {
  id: string
  icon: string
  title: string
  topics: Topic[]
  comingSoon?: boolean
}

type Level = {
  id: string
  label: string
  milestoneEmoji: string
  milestoneColor: 'orange' | 'green'
  sections: Section[]
  comingSoon?: boolean
}

const LEVELS: Level[] = [
  {
    id: 'junior-am',
    label: 'Junior AM',
    milestoneEmoji: '🏅',
    milestoneColor: 'orange',
    sections: [
      {
        id: 'unitpay-basics',
        icon: '📘',
        title: 'Основы UnitPay',
        topics: [
          { id: 'team',     icon: '👥', title: 'Команда',                       lessonId: 'unitpay-basics-team' },
          { id: 'about',    icon: '💡', title: 'UnitPay',                        lessonId: 'unitpay-basics-about' },
          { id: 'methods',  icon: '💳', title: 'Методы приёма',                  lessonId: 'unitpay-basics-methods' },
          { id: 'path',     icon: '🔄', title: 'Путь платежей',                  lessonId: 'unitpay-basics-path' },
          { id: 'acquiring',icon: '🏦', title: 'Эквайринг',                      lessonId: 'unitpay-basics-acquiring' },
          { id: 'netting',  icon: '🔗', title: 'Неттинг',                        lessonId: 'unitpay-basics-netting' },
          { id: 'entities', icon: '🏢', title: 'Юридические и физические лица',  lessonId: 'unitpay-basics-entities' },
          { id: 'cash',     icon: '🧾', title: 'Касса',                          lessonId: 'unitpay-basics-cash' },
          { id: 'vendors',  icon: '🤝', title: 'Поставщики',                     lessonId: 'unitpay-basics-vendors' },
        ],
      },
      {
        id: 'unitpay-accounting',
        icon: '📊',
        title: 'Аккаунтинг',
        topics: [
          { id: 'tasks',    icon: '📋', title: 'Задачи',       lessonId: 'accounting-tasks' },
          { id: 'tools',    icon: '🛠️', title: 'Инструменты', lessonId: 'accounting-tools' },
          { id: 'workday',  icon: '📅', title: 'Рабочий день', lessonId: 'accounting-workday' },
          { id: 'chats',    icon: '💬', title: 'Чаты',         lessonId: 'accounting-chats' },
        ],
        comingSoon: true,
      },
    ],
  },
  {
    id: 'middle-am',
    label: 'Middle AM',
    milestoneEmoji: '🥈',
    milestoneColor: 'green',
    sections: [
      {
        id: 'unitpay-attraction',
        icon: '🎯',
        title: 'Привлечение',
        topics: [
          { id: 'search',  icon: '🔍', title: 'Поиск мерчантов',       lessonId: 'attraction-search' },
          { id: 'partner', icon: '🤝', title: 'Партнерская программа', lessonId: 'attraction-partner' },
        ],
        comingSoon: true,
      },
      {
        id: 'unitpay-details',
        icon: '🔍',
        title: 'UnitPay: Все детали',
        topics: [
          { id: 'recurring', icon: '🔁', title: 'Рекуррентные платежи',        lessonId: 'details-recurring' },
          { id: 'help',      icon: '📖', title: 'Знакомство с help.unitpay.ru', lessonId: 'details-help' },
        ],
        comingSoon: true,
      },
      {
        id: 'unitpay-finance',
        icon: '💰',
        title: 'Основы финансов и расчётов',
        topics: [
          { id: 'reconcile', icon: '📊', title: 'Сверки',                  lessonId: 'finance-reconcile' },
          { id: 'commission',icon: '💹', title: 'Расчет комиссий',          lessonId: 'finance-commission' },
          { id: 'vat',       icon: '🧮', title: 'НДС в транзакциях UnitPay',lessonId: 'finance-vat' },
        ],
        comingSoon: true,
      },
      {
        id: 'unitpay-security',
        icon: '🛡️',
        title: 'Безопасность и документооборот',
        topics: [
          { id: 'chargebacks', icon: '↩️', title: 'Чарджбеки',               lessonId: 'security-chargebacks' },
          { id: 'blacklist',   icon: '🚫', title: 'Черный список',            lessonId: 'security-blacklist' },
          { id: 'docs',        icon: '📄', title: 'Документооборот',          lessonId: 'security-docs' },
          { id: 'requirements',icon: '✅', title: 'Требования к проектам',    lessonId: 'security-requirements' },
        ],
        comingSoon: true,
      },
      {
        id: 'unitpay-technical',
        icon: '⚙️',
        title: 'Технические аспекты и интеграция',
        topics: [
          { id: 'tech',        icon: '👨‍💻', title: 'Взаимодействие с техническим отделом', lessonId: 'technical-tech' },
          { id: 'redash',      icon: '📈', title: 'Редаш',                               lessonId: 'technical-redash' },
          { id: 'processor',   icon: '⚙️', title: 'Обработчик платежей',                 lessonId: 'technical-processor' },
          { id: 'integration', icon: '🔌', title: 'Интеграция',                           lessonId: 'technical-integration' },
        ],
        comingSoon: true,
      },
    ],
  },
  {
    id: 'senior-am',
    label: 'Senior AM',
    milestoneEmoji: '🏆',
    milestoneColor: 'green',
    sections: [],
    comingSoon: true,
  },
]
```

- [ ] Update `isSectionComplete` and `getSectionProgress` to use `topic.lessonId`:

```tsx
function isSectionComplete(section: Section): boolean {
  if (!user) return false
  return section.topics.every(topic => {
    const l = lessonMap.get(topic.lessonId)
    return l ? isComplete(l, user) : false
  })
}

function getSectionProgress(section: Section): number {
  if (!user) return 0
  const total = section.topics.length
  const done = section.topics.filter(topic => {
    const l = lessonMap.get(topic.lessonId)
    return l ? isComplete(l, user) : false
  }).length
  return total === 0 ? 0 : done / total
}

// statusMap uses section.id same as before
const allSections = LEVELS.flatMap(l => l.sections)
```

- [ ] Update the render: replace `section.topics.map(topic => <span>...)` with `section.topics.map(t => <span key={t.id}...>{t.title}</span>)`. Wrap non-locked cards in `<Link>`:

```tsx
// Replace the card div with:
const CardWrapper = status === 'locked' || section.comingSoon
  ? ({ children }: { children: React.ReactNode }) => <div className={...}>{children}</div>
  : ({ children }: { children: React.ReactNode }) => (
      <Link to={`/courses/${section.id}`} className={...} style={{ textDecoration: 'none' }}>
        {children}
      </Link>
    )
```

Actually simpler — use conditional `as` or just put Link around the card content directly:

```tsx
{level.sections.map(section => {
  const status = statusMap.get(section.id) ?? 'locked'
  const progress = getSectionProgress(section)
  const isClickable = status !== 'locked' && !section.comingSoon

  const cardContent = (
    <>
      <div className={`${styles.cardIcon} ${styles[`cardIcon_${status}`]}`}>
        {status === 'locked'
          ? <span className={styles.sectionIconEmoji}>🔒</span>
          : <SectionIcon icon={section.icon} />
        }
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>{section.title}</div>
        <div className={styles.topicList}>
          {section.topics.map(topic => (
            <span
              key={topic.id}
              className={`${styles.topicChip} ${status === 'active' ? styles.topicChip_active : ''}`}
            >
              {topic.title}
            </span>
          ))}
        </div>
        {status !== 'locked' && (
          <div className={styles.progressBar}>
            <div
              className={`${styles.progressFill} ${status === 'complete' ? styles.progressFill_complete : ''}`}
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        )}
      </div>
      <div className={`${styles.statusBadge} ${styles[`statusBadge_${status}`]}`}>
        {status === 'complete' && 'Завершено'}
        {status === 'active' && 'В процессе'}
        {status === 'locked' && 'Заблокировано'}
      </div>
    </>
  )

  return isClickable ? (
    <Link
      key={section.id}
      to={`/courses/${section.id}`}
      className={`${styles.card} ${styles[`card_${status}`]}`}
      style={{ textDecoration: 'none' }}
    >
      {cardContent}
    </Link>
  ) : (
    <div
      key={section.id}
      className={`${styles.card} ${styles[`card_${status}`]}`}
    >
      {cardContent}
    </div>
  )
})}
```

Also add `progressBar` and `progressFill` classes to `CoursesPage.module.css` (they may already exist — check; if not, add):

```css
.progressBar {
  height: 4px;
  background: var(--usr-badge-bg);
  border-radius: 2px;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: #597ef7;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progressFill_complete {
  background: #22c55e;
}

.topicChip_active {
  background: #eef1fe;
  color: #597ef7;
}
```

- [ ] Commit:
```bash
git add src/pages/Courses/CoursesPage.tsx src/pages/Courses/CoursesPage.module.css
git commit -m "feat: update CoursesPage to use Topic objects and link to section pages"
```

---

## Chunk 2: SectionPage + Routing

### Task 4: Create SectionPage

**Files:**
- Create: `src/pages/Section/SectionPage.tsx`
- Create: `src/pages/Section/SectionPage.module.css`

- [ ] Create `src/pages/Section/SectionPage.tsx`:

```tsx
import { Link, useParams, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLessons } from '../../context/LessonsContext'
import { isComplete } from '../../utils/level'
import styles from './SectionPage.module.css'

// Mirror of CoursesPage LEVELS — import from a shared source once needed
// For now re-declare just the section lookup (CoursesPage owns LEVELS)
// We re-use the same LEVELS constant by importing from CoursesPage data
// Best approach: extract LEVELS to a separate data file

// Since LEVELS is defined in CoursesPage, extract it to src/data/courses.ts in this task.
// See note below.
import { LEVELS } from '../../data/courses'

type TopicStatus = 'complete' | 'active' | 'locked'

export function SectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const { user } = useAuth()
  const { lessons } = useLessons()

  const lessonMap = new Map(lessons.map(l => [l.id, l]))

  // Find section across all levels
  const section = LEVELS.flatMap(l => l.sections).find(s => s.id === sectionId)
  if (!section) return <Navigate to="/courses" replace />

  // Compute topic statuses
  const topicStatuses = new Map<string, TopicStatus>()
  let prevComplete = true
  for (const topic of section.topics) {
    const l = lessonMap.get(topic.lessonId)
    const complete = l ? isComplete(l, user!) : false
    if (complete) {
      topicStatuses.set(topic.id, 'complete')
    } else if (prevComplete) {
      topicStatuses.set(topic.id, 'active')
    } else {
      topicStatuses.set(topic.id, 'locked')
    }
    prevComplete = complete
  }

  function getProgress(lessonId: string): number {
    const l = lessonMap.get(lessonId)
    if (!l || !user) return 0
    const idx = user.progress[lessonId] ?? 0
    return l.slides.length === 0 ? 0 : idx / (l.slides.length - 1)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/courses" className={styles.back}>← Назад</Link>
        <h1 className={styles.title}>{section.title}</h1>
      </div>

      <div className={styles.topicList}>
        {section.topics.map(topic => {
          const status = topicStatuses.get(topic.id) ?? 'locked'
          const progress = getProgress(topic.lessonId)
          const isClickable = status !== 'locked'

          const cardContent = (
            <>
              <div className={`${styles.topicIcon} ${styles[`topicIcon_${status}`]}`}>
                <span>{status === 'locked' ? '🔒' : topic.icon}</span>
              </div>
              <div className={styles.topicBody}>
                <div className={styles.topicTitle}>{topic.title}</div>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.progressFill} ${status === 'complete' ? styles.progressFill_complete : ''}`}
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
              </div>
              <div className={`${styles.statusBadge} ${styles[`statusBadge_${status}`]}`}>
                {status === 'complete' && 'Завершено'}
                {status === 'active' && 'В процессе'}
              </div>
            </>
          )

          return isClickable ? (
            <Link
              key={topic.id}
              to={`/lesson/${topic.lessonId}`}
              state={{ from: `/courses/${sectionId}` }}
              className={`${styles.topicCard} ${styles[`topicCard_${status}`]}`}
              style={{ textDecoration: 'none' }}
            >
              {cardContent}
            </Link>
          ) : (
            <div
              key={topic.id}
              className={`${styles.topicCard} ${styles[`topicCard_${status}`]}`}
            >
              {cardContent}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] Create `src/pages/Section/SectionPage.module.css`:

```css
.page {
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}

.back {
  font-size: 13px;
  color: var(--usr-text-secondary);
  text-decoration: none;
}

.back:hover {
  color: var(--usr-text-primary);
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: var(--usr-text-primary);
}

.topicList {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.topicCard {
  background: var(--usr-card-bg);
  border: 1px solid var(--usr-card-border);
  border-radius: var(--radius-md);
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: box-shadow 0.15s ease;
}

.topicCard:hover {
  box-shadow: var(--usr-card-shadow), 0 4px 12px rgba(0,0,0,.06);
}

.topicCard_locked {
  opacity: 0.5;
  cursor: default;
}

.topicCard_active {
  border-color: #597ef7;
  box-shadow: 0 0 0 3px #eef1fe;
}

.topicIcon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--usr-badge-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
}

.topicIcon_locked {
  background: #f3f4f6;
}

.topicBody {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.topicTitle {
  font-size: 14px;
  font-weight: 600;
  color: var(--usr-text-primary);
}

.progressBar {
  height: 4px;
  background: var(--usr-badge-bg);
  border-radius: 2px;
  overflow: hidden;
}

.progressFill {
  height: 100%;
  background: #597ef7;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progressFill_complete {
  background: #22c55e;
}

.statusBadge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;
  flex-shrink: 0;
}

.statusBadge_complete {
  background: #dcfce7;
  color: #16a34a;
}

.statusBadge_active {
  background: #eef1fe;
  color: #597ef7;
}

.statusBadge_locked {
  display: none;
}
```

- [ ] Commit:
```bash
git add src/pages/Section/
git commit -m "feat: add SectionPage with topic cards and progress bars"
```

---

### Task 5: Extract LEVELS to shared data file

**Files:**
- Create: `src/data/courses.ts`
- Modify: `src/pages/Courses/CoursesPage.tsx` (import from data)
- Modify: `src/pages/Section/SectionPage.tsx` (import from data)

- [ ] Move `LEVELS` constant and related types (`Topic`, `Section`, `Level`) from `CoursesPage.tsx` to `src/data/courses.ts`. Export them.

```ts
// src/data/courses.ts
import type { Topic } from '../types'

export type Section = {
  id: string
  icon: string
  title: string
  topics: Topic[]
  comingSoon?: boolean
}

export type CourseLevel = {
  id: string
  label: string
  milestoneEmoji: string
  milestoneColor: 'orange' | 'green'
  sections: Section[]
  comingSoon?: boolean
}

export const LEVELS: CourseLevel[] = [
  // ... paste entire LEVELS array here from CoursesPage
]
```

- [ ] In `CoursesPage.tsx`: remove local type/data declarations, add `import { LEVELS, Section, CourseLevel } from '../../data/courses'`.

- [ ] In `SectionPage.tsx`: replace the comment placeholder with the real import.

- [ ] Commit:
```bash
git add src/data/courses.ts src/pages/Courses/CoursesPage.tsx src/pages/Section/SectionPage.tsx
git commit -m "refactor: extract LEVELS to src/data/courses.ts"
```

---

### Task 6: Add route + update LessonPage back navigation

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/pages/Lesson/Lesson.tsx`

- [ ] In `App.tsx`, add import and route:

```tsx
import { SectionPage } from './pages/Section/SectionPage'

// Inside <Route element={<AppLayout />}>:
<Route path="/courses" element={<CoursesPage />} />
<Route path="/courses/:sectionId" element={<SectionPage />} />
```

- [ ] In `Lesson.tsx`, update back navigation and last-slide behavior:

```tsx
import { useState, useCallback } from 'react'
import { useParams, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { mockLessons } from '../../data/lessons'
import { Slide } from '../../components/slides/Slide'
import { SlideNav } from '../../components/SlideNav/SlideNav'
import styles from './Lesson.module.css'

export function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const { user, updateProgress } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const lesson = mockLessons.find(l => l.id === id)
  const initialSlide = user?.progress[id ?? ''] ?? 0
  const [currentSlide, setCurrentSlide] = useState(initialSlide)

  const backUrl = (location.state as { from?: string })?.from ?? '/courses'

  const isLastSlide = currentSlide === (lesson?.slides.length ?? 1) - 1

  const goNext = useCallback(() => {
    if (isLastSlide) {
      navigate(backUrl)
      return
    }
    setCurrentSlide(i => {
      const next = Math.min(i + 1, (lesson?.slides.length ?? 1) - 1)
      if (id) updateProgress(id, next)
      return next
    })
  }, [lesson, id, updateProgress, isLastSlide, navigate, backUrl])

  const goPrev = useCallback(() => {
    setCurrentSlide(i => {
      const prev = Math.max(i - 1, 0)
      if (id) updateProgress(id, prev)
      return prev
    })
  }, [id, updateProgress])

  if (!lesson) return <Navigate to="/" replace />

  const slide = lesson.slides[currentSlide]

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link to={backUrl} className={styles.back}>← Назад</Link>
        <span className={styles.title}>{lesson.title}</span>
        <span className={styles.tag}>{lesson.tag}</span>
      </header>
      <div className={styles.slideArea}>
        <Slide slide={slide} onNext={goNext} nextLesson={null} />
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

- [ ] Commit:
```bash
git add src/App.tsx src/pages/Lesson/Lesson.tsx
git commit -m "feat: add /courses/:sectionId route and update LessonPage back navigation"
```

---

### Task 7: Update level utilities

**Files:**
- Modify: `src/utils/level.ts`

- [ ] Update `computeLevel` to use new lesson IDs. Update `LESSON_BLOCK_TITLE`.

```ts
export function computeLevel(user: User, lessons: Lesson[]): Level {
  if (user.level) return user.level
  const lessonMap = new Map(lessons.map(l => [l.id, l]))
  const done = (id: string) => { const l = lessonMap.get(id); return l ? isComplete(l, user) : false }
  // Junior: completed all Основы UnitPay topics
  const basicsComplete = [
    'unitpay-basics-team', 'unitpay-basics-about', 'unitpay-basics-methods',
    'unitpay-basics-path', 'unitpay-basics-acquiring', 'unitpay-basics-netting',
    'unitpay-basics-entities', 'unitpay-basics-cash', 'unitpay-basics-vendors',
  ].every(id => done(id))
  if (basicsComplete) return 'junior'
  return 'novice'
}

export const LESSON_BLOCK_TITLE: Record<string, string> = {
  'unitpay-basics-team':     'Основы UnitPay',
  'unitpay-basics-about':    'Основы UnitPay',
  'unitpay-basics-methods':  'Основы UnitPay',
  'unitpay-basics-path':     'Основы UnitPay',
  'unitpay-basics-acquiring':'Основы UnitPay',
  'unitpay-basics-netting':  'Основы UnitPay',
  'unitpay-basics-entities': 'Основы UnitPay',
  'unitpay-basics-cash':     'Основы UnitPay',
  'unitpay-basics-vendors':  'Основы UnitPay',
}
```

- [ ] Commit:
```bash
git add src/utils/level.ts
git commit -m "feat: update level thresholds for topic-based lesson IDs"
```

---

### Task 8: Fix FinishSlide import in Lesson.tsx

**Files:**
- Modify: `src/types/index.ts` (optional cleanup)
- Modify: `src/components/slides/Slide.tsx`

- [ ] Remove unused `FinishContent` import from `Lesson.tsx` (already done in Task 6).
- [ ] Remove the `finish` case from `Slide.tsx` only if all lessons no longer use it. Since no lesson has finish slides now, keep the case in Slide.tsx for safety but it will never be triggered.
- [ ] Verify TypeScript compiles cleanly: `npx tsc --noEmit`

- [ ] Commit:
```bash
git commit -m "chore: cleanup unused finish slide references"
```

---

### Task 9: Smoke test

- [ ] Run dev server: `npm run dev`
- [ ] Navigate to `/courses` — section cards show topic chips, "Основы UnitPay" card is clickable
- [ ] Click "Основы UnitPay" → lands on `/courses/unitpay-basics` with 9 topic cards
- [ ] Click "Команда" → opens lesson with welcome + team slides
- [ ] Reach last slide, click Next → returns to `/courses/unitpay-basics`
- [ ] Progress bar fills on the topic card after completing a lesson
- [ ] Locked topics (beyond first) are greyed out

- [ ] Final commit if any fixes needed:
```bash
git add -A
git commit -m "fix: post-smoke-test corrections"
```
