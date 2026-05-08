# UnitPay Details Lessons Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two lessons to the "UnitPay: Все детали" section — "Рекуррентные платежи" and "Знакомство с help.unitpay" — and unlock the section.

**Architecture:** Pure data + minor type/component patches. No new components or slide types needed. Types extended minimally, two existing components patched, two lesson objects added to lessons.ts, courses.ts updated.

**Tech Stack:** React 18, TypeScript, Vite, lucide-react, CSS Modules

**Spec:** `docs/superpowers/specs/2026-05-08-unitpay-details-lessons-design.md`

---

## Chunk 1: Type and component fixes

### Task 1: Extend `ToolItem` type

**Files:**
- Modify: `src/types/index.ts` (lines 213–222)

- [ ] Open `src/types/index.ts` and find `ToolItem` interface (~line 213).

- [ ] Change `logo: string` → `logo?: string` and add `ctaUrl?: string`:

```typescript
export interface ToolItem {
  id: string
  title: string
  gradient: string
  logo?: string
  description: string
  videoUrl?: string
  ctaLabel?: string
  ctaUrl?: string
}
```

- [ ] Run TypeScript check:
```bash
npx tsc --noEmit
```
Expected: no new errors (existing `ToolsSlide` uses `tool.logo` inside `<img>` — will fix in Task 2).

- [ ] Commit:
```bash
git add src/types/index.ts
git commit -m "feat: make ToolItem.logo optional, add ctaUrl field"
```

---

### Task 2: Patch `ToolsSlide` — optional logo + ctaUrl button

**Files:**
- Modify: `src/components/slides/ToolsSlide.tsx`

- [ ] Open `src/components/slides/ToolsSlide.tsx`.

- [ ] Make the logo `<img>` conditional (line 27 area) and wire CTA button to `ctaUrl`. Replace the full file content:

```tsx
import { useState } from 'react'
import { PlayCircle } from 'lucide-react'
import type { ToolsContent, ToolItem } from '../../types'
import styles from './slides.module.css'

interface Props {
  content: ToolsContent
  onNext?: () => void
}

export function ToolsSlide({ content, onNext }: Props) {
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
            {tool.logo && (
              <div className={styles.toolCardIcon}>
                <img src={tool.logo} alt={tool.title} className={styles.toolCardLogo} />
              </div>
            )}
            <span className={styles.toolCardTitle}>{tool.title}</span>
          </div>
        ))}
      </div>

      {activeTool && (
        <div key={activeTool.id} className={`${styles.toolsDetail} ${styles.toolsDetailContent}`}>
          <h2 className={styles.toolsDetailTitle}>{activeTool.title}</h2>
          <p className={styles.toolsDetailDesc}>{activeTool.description}</p>

          {activeTool.ctaLabel ? (
            <button
              className={styles.toolsNextBtn}
              onClick={() => {
                if (activeTool.ctaUrl) {
                  window.open(activeTool.ctaUrl, '_blank', 'noopener,noreferrer')
                } else {
                  onNext?.()
                }
              }}
            >
              {activeTool.ctaLabel}
            </button>
          ) : activeTool.videoUrl ? (
            <iframe
              src={activeTool.videoUrl}
              className={styles.toolsVideoIframe}
              allowFullScreen
              title={activeTool.title}
            />
          ) : (
            <div className={styles.toolsVideoPlaceholder}>
              <PlayCircle size={48} />
              <span>Видео скоро появится</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] Run TypeScript check:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] Commit:
```bash
git add src/components/slides/ToolsSlide.tsx
git commit -m "feat: ToolsSlide — optional logo, ctaUrl opens in new tab"
```

---

### Task 3: Add icons to `FeatureSlide` ICON_MAP

**Files:**
- Modify: `src/components/slides/FeatureSlide.tsx` (line 1 and 6)

- [ ] Open `src/components/slides/FeatureSlide.tsx`.

- [ ] Update the import and ICON_MAP (lines 1 and 6):

```tsx
import { LayoutGrid, CreditCard, Printer, FileText, CheckSquare, Bell, type LucideIcon } from 'lucide-react'
```

```tsx
const ICON_MAP: Record<string, LucideIcon> = { LayoutGrid, CreditCard, Printer, FileText, CheckSquare, Bell }
```

- [ ] Run TypeScript check:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] Commit:
```bash
git add src/components/slides/FeatureSlide.tsx
git commit -m "feat: add FileText, CheckSquare, Bell icons to FeatureSlide ICON_MAP"
```

---

## Chunk 2: Data — courses.ts and lessons.ts

### Task 4: Update `courses.ts`

**Files:**
- Modify: `src/data/courses.ts` (lines 77–85)

- [ ] Open `src/data/courses.ts`, find the `unitpay-details` section (~line 77).

- [ ] Remove `comingSoon: true` and rename the help topic title:

```typescript
{
  id: 'unitpay-details',
  icon: '🔍',
  title: 'UnitPay: Все детали',
  topics: [
    { id: 'recurring', icon: '🔁', title: 'Рекуррентные платежи',     lessonId: 'details-recurring' },
    { id: 'help',      icon: '📖', title: 'Знакомство с help.unitpay', lessonId: 'details-help' },
  ],
},
```

- [ ] Commit:
```bash
git add src/data/courses.ts
git commit -m "feat: unlock unitpay-details section, rename help.unitpay topic"
```

---

### Task 5: Add lesson `details-recurring` to `lessons.ts`

**Files:**
- Modify: `src/data/lessons.ts` (append before closing `]` at line 1269)

- [ ] Open `src/data/lessons.ts`, go to the very end (line 1269).

- [ ] Insert the new lesson before the final `]`:

```typescript
  // ── UnitPay: Все детали ──────────────────────────────────────
  {
    id: 'details-recurring',
    title: 'Рекуррентные платежи',
    tag: 'UnitPay: Все детали',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'info',
        content: {
          heading: 'Рекуррентные платежи',
          bullets: [
            'Автоматические регулярные списания с карты без повторного ввода реквизитов и 3DS',
            'После первого согласия клиент не касается процесса — деньги уходят по расписанию',
            'Сумму и периодичность мерчант задаёт на своей стороне — полная гибкость',
            'Доступны только на эквайринге: карты, Tinkoff Pay, СБП',
          ],
        },
      },
      {
        id: 's2',
        type: 'kstati',
        content: {
          tips: [
            {
              title: 'Только через поддержку',
              text: 'Подключение требует согласования со Службой безопасности. Без этого шага рекуррентные платежи не заработают.',
            },
            {
              title: 'Только ЮЛ и ИП',
              text: 'Физлица не могут подключить рекуррентные платежи.',
            },
            {
              title: 'Подписки не мешают обычным платежам',
              text: 'Наличие подписок на проекте не ограничивает приём платежей обычным способом — партнёр может использовать оба формата одновременно.',
            },
          ],
        },
      },
      {
        id: 's3',
        type: 'feature',
        content: {
          heading: 'Что нужно добавить на проект для подписок',
          paragraphs: [
            'Перед тем как Служба безопасности согласует рекуррентные платежи, на проекте мерчанта должны быть реализованы три вещи.',
          ],
          features: [
            {
              icon: 'FileText',
              title: 'Форма регистрации перед оплатой',
              subtitle: 'Если на сайте нет стандартного личного кабинета — форма обязательна',
            },
            {
              icon: 'CheckSquare',
              title: 'Две обязательные галочки',
              subtitle: 'Согласие с условиями подписки + согласие с автосписанием конкретной суммы с периодичностью. Галочки не должны стоять автоматически',
            },
            {
              icon: 'Bell',
              title: 'Статус и отмена подписки',
              subtitle: 'Клиент должен иметь возможность проверить статус своей подписки и отменить её',
            },
          ],
        },
      },
    ],
  },
```

- [ ] Run TypeScript check:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] Commit:
```bash
git add src/data/lessons.ts
git commit -m "feat: add details-recurring lesson (Рекуррентные платежи)"
```

---

### Task 6: Add lesson `details-help` to `lessons.ts`

**Files:**
- Modify: `src/data/lessons.ts` (append after `details-recurring`, before closing `]`)

- [ ] Continue in `src/data/lessons.ts`, insert after the `details-recurring` object:

```typescript
  {
    id: 'details-help',
    title: 'Знакомство с help.unitpay',
    tag: 'UnitPay: Все детали',
    published: true,
    slides: [
      {
        id: 's1',
        type: 'info',
        content: {
          heading: 'Документация UnitPay',
          bullets: [
            'Мерчанты часто приходят с техническими вопросами — многие ответы уже есть в доках',
            'Пригодится самому: статусы платежей, параметры API, коды ошибок, форматы выплат',
            'Пригодится для мерчанта: как добавить проект, готовые модули для CMS, онлайн-кассы',
          ],
        },
      },
      {
        id: 's2',
        type: 'tools',
        content: {
          tools: [
            {
              id: 'help-ru',
              title: 'help.unitpay.ru',
              gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              description: 'Основная документация для ЮЛ и ИП. Регистрация и проекты, платежи и подписки, выплаты, онлайн-кассы, готовые модули для 40+ CMS-платформ, справочник статусов и кодов.',
              ctaLabel: 'Открыть',
              ctaUrl: 'https://help.unitpay.ru',
            },
            {
              id: 'help-money',
              title: 'help.unitpay.money',
              gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
              description: 'Обновлённая версия документации на русском и английском. Начало работы, платежи, выплаты, личный кабинет, тестовое API. Удобно делиться с зарубежными партнёрами.',
              ctaLabel: 'Открыть',
              ctaUrl: 'https://help.unitpay.money',
            },
          ],
        },
      },
    ],
  },
```

- [ ] Run TypeScript check:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] Start dev server and verify visually:
```bash
npm run dev
```
Check:
  1. Раздел "UnitPay: Все детали" виден в курсе (не заблокирован comingSoon)
  2. Урок "Рекуррентные платежи": 3 слайда, иконки на слайде 3 отображаются
  3. Урок "Знакомство с help.unitpay": 2 слайда, кнопка "Открыть" открывает нужный URL в новой вкладке
  4. Существующие уроки на `tools`-слайдах не сломались

- [ ] Commit:
```bash
git add src/data/lessons.ts
git commit -m "feat: add details-help lesson (Знакомство с help.unitpay)"
```
