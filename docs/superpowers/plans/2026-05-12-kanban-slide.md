# KanbanSlide Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить новый тип слайда `kanban` с 4 вариантами и урок `technical-tech` с 4 слайдами о доске «Задачи ПМ».

**Architecture:** Новый компонент `KanbanSlide.tsx` содержит 4 функции-варианта (`intro`, `board`, `rules`, `communication`). Варианты `intro`, `rules`, `communication` переиспользуют существующий CSS-лейаут `recurringFull`. Вариант `board` — новый интерактивный лейаут с тёмной Teamly-доской слева и светлой панелью справа.

**Tech Stack:** React, TypeScript, CSS Modules

**Spec:** `docs/superpowers/specs/2026-05-12-kanban-board-slide-design.md`

---

## Chunk 1: Types + CSS

### Task 1: Добавить типы в `src/types/index.ts`

**Files:**
- Modify: `src/types/index.ts:32,38`

- [ ] **Step 1: Добавить `'kanban'` в `SlideType`**

Найти строку 32 в `src/types/index.ts`:
```ts
export type SlideType = 'welcome' | ... | 'unitchecks'
```
Заменить на:
```ts
export type SlideType = 'welcome' | 'tabs' | 'info' | 'feature' | 'methods' | 'flowchart' | 'diagram' | 'cheatsheet' | 'merchant' | 'compare' | 'kassa' | 'acquiring' | 'vendors' | 'entities' | 'finish' | 'tools' | 'tgchats' | 'search' | 'niches' | 'funnel' | 'objections' | 'kstati' | 'recurring' | 'helpdocs' | 'vat' | 'requirements' | 'unitchecks' | 'kanban'
```

- [ ] **Step 2: Добавить типы Kanban в конец `src/types/index.ts`** (перед закрывающей строкой)

Добавить после последнего экспорта:
```ts
export type KanbanColumn = {
  id: string
  badge: string
  badgeColor: 'red' | 'blue' | 'yellow' | 'green' | 'teal' | 'gray' | 'purple'
  step: number | null
  who: string
  desc: string
  hint: string
  cards?: Array<{ title: string; assignee: string; assigneeColor: string }>
}

export type KanbanIntroContent = {
  variant: 'intro'
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  checklist: Array<{ step: number; text: string }>
}

export type KanbanBoardContent = {
  variant: 'board'
  boardTitle: string
  columns: KanbanColumn[]
}

export type KanbanRulesContent = {
  variant: 'rules'
  title: string
  formatLabel: string
  formatExample: string
  examples: string[]
  bodyRules: string[]
  warning: string
}

export type KanbanCommunicationContent = {
  variant: 'communication'
  title: string
  urgentText: string
  urgentChat: string
  dmAllowed: string[]
  dmForbidden: string[]
  exampleMessages: Array<{ sender: string; text: string }>
}
```

- [ ] **Step 3: Добавить Kanban-типы в union `Slide.content` (строка 38)**

Найти строку:
```ts
  content: WelcomeContent | ... | UnitChecksContent
```
Добавить в конец union:
```ts
  content: WelcomeContent | TabsContent | InfoContent | FeatureContent | MethodsContent | FlowchartContent | DiagramContent | CheatsheetContent | MerchantContent | CompareContent | KassaContent | AcquiringContent | VendorsSlideContent | EntitiesContent | FinishContent | ToolsContent | TgChatsContent | SearchContent | NichesContent | FunnelContent | ObjectionsContent | KstatiContent | RecurringOverviewContent | RecurringRequirementsContent | HelpIntroContent | HelpPortalsContent | VatContent | ReqContent | UnitChecksContent | KanbanIntroContent | KanbanBoardContent | KanbanRulesContent | KanbanCommunicationContent
```

- [ ] **Step 4: Проверить TypeScript**

```bash
npx tsc --noEmit
```
Ожидаемый вывод: без ошибок.

---

### Task 2: Добавить CSS-классы в `src/components/slides/slides.module.css`

**Files:**
- Modify: `src/components/slides/slides.module.css` (добавить в конец)

- [ ] **Step 1: Добавить CSS для варианта `board`**

Добавить в конец файла:
```css
/* ===== KANBAN SLIDE ===== */

.kanbanFull {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}

.kanbanBoard {
  flex: 1;
  background: #2c2c3e;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.kanbanBoardHeader {
  padding: 20px 24px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.kanbanBoardTitle {
  color: rgba(255, 255, 255, 0.92);
  font-size: 16px;
  font-weight: 700;
}

.kanbanBoardSubtitle {
  color: rgba(255, 255, 255, 0.35);
  font-size: 12px;
  margin-top: 3px;
}

.kanbanCols {
  flex: 1;
  display: flex;
  padding: 12px;
  overflow-x: auto;
  scrollbar-width: none;
}

.kanbanCols::-webkit-scrollbar {
  display: none;
}

.kanbanCol {
  flex: 1;
  min-width: 110px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 5px;
  cursor: pointer;
}

.kanbanColHeader {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 6px;
  border-radius: 8px;
  margin-bottom: 2px;
  border: 2px solid transparent;
  transition: border-color 0.15s, background 0.15s;
}

.kanbanColActive .kanbanColHeader {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(91, 127, 255, 0.6);
}

.kanbanColBadge {
  flex: 1;
  border-radius: 10px;
  padding: 3px 8px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kanbanBadgeRed    { background: rgba(255, 80, 80, 0.18);   color: #ff8080; border: 1px solid rgba(255, 80, 80, 0.3); }
.kanbanBadgeBlue   { background: rgba(91, 127, 255, 0.18);  color: #8aa4ff; border: 1px solid rgba(91, 127, 255, 0.3); }
.kanbanBadgeYellow { background: rgba(255, 180, 50, 0.18);  color: #ffc060; border: 1px solid rgba(255, 180, 50, 0.3); }
.kanbanBadgeGreen  { background: rgba(50, 200, 100, 0.18);  color: #5cd68a; border: 1px solid rgba(50, 200, 100, 0.3); }
.kanbanBadgeTeal   { background: rgba(50, 180, 160, 0.18);  color: #50c8b0; border: 1px solid rgba(50, 180, 160, 0.3); }
.kanbanBadgeGray   { background: rgba(180, 180, 200, 0.12); color: #a0a0c0; border: 1px solid rgba(180, 180, 200, 0.2); }
.kanbanBadgePurple { background: rgba(160, 100, 255, 0.18); color: #c090ff; border: 1px solid rgba(160, 100, 255, 0.3); }

.kanbanColCount {
  color: rgba(255, 255, 255, 0.35);
  font-size: 10px;
  font-weight: 600;
  flex-shrink: 0;
}

.kanbanCard {
  background: #3a3a50;
  border-radius: 7px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.kanbanColActive .kanbanCard {
  border-color: rgba(91, 127, 255, 0.3);
}

.kanbanCardTitle {
  color: rgba(232, 232, 248, 0.9);
  font-size: 11px;
  font-weight: 600;
  line-height: 1.35;
}

.kanbanCardAssignee {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 4px;
  padding: 2px 7px 2px 4px;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.65);
}

.kanbanCardAvatar {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  color: white;
  font-weight: 700;
  flex-shrink: 0;
}

.kanbanAddCard {
  color: rgba(255, 255, 255, 0.2);
  font-size: 10px;
  padding: 4px 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.kanbanDetail {
  width: 280px;
  flex-shrink: 0;
  background: #fff;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.kanbanDetailTop {
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f0f0f5;
  flex-shrink: 0;
}

.kanbanDetailEyebrow {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #999;
  font-weight: 600;
  margin-bottom: 10px;
}

.kanbanDetailStepRow {
  display: flex;
  align-items: center;
  gap: 12px;
}

.kanbanStepNum {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #5b7fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
}

.kanbanStepNumGray {
  background: #aaa;
}

.kanbanDetailColName {
  font-size: 16px;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1.2;
}

.kanbanDetailBody {
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.kanbanDetailWho {
  display: inline-block;
  background: #eef1ff;
  color: #5b7fff;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
}

.kanbanDetailDesc {
  font-size: 14px;
  color: #444;
  line-height: 1.6;
}

.kanbanDetailHint {
  margin-top: auto;
  background: #f8f8fc;
  border-left: 3px solid #5b7fff;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 12px;
  color: #555;
  line-height: 1.55;
}

.kanbanDetailHintTitle {
  font-weight: 700;
  color: #333;
  font-size: 11px;
  margin-bottom: 4px;
}

.kanbanDetailDefault {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 24px;
  color: #bbb;
  text-align: center;
  font-size: 13px;
  line-height: 1.5;
}

/* Kanban intro: checklist cards */
.kanbanCheckCard {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.kanbanCheckNum {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #eef1ff;
  color: #5b7fff;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.kanbanCheckText {
  font-size: 15px;
  color: #374151;
  line-height: 1.5;
}

/* Kanban rules: dark example items */
.kanbanExamples {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
}

.kanbanExampleItem {
  background: #2c2c3e;
  border-radius: 6px;
  padding: 7px 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  font-family: monospace;
}

.kanbanWarning {
  background: #fff8ed;
  border: 1px solid #f5c96a;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  color: #7a5800;
  line-height: 1.5;
  margin-top: 8px;
}

/* Kanban communication */
.kanbanUrgentBlock {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.kanbanUrgentIcon {
  font-size: 22px;
  flex-shrink: 0;
  margin-top: 2px;
}

.kanbanUrgentText {
  font-size: 15px;
  color: #374151;
  line-height: 1.55;
}

.kanbanDmRule {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 15px;
  color: #374151;
  line-height: 1.4;
  margin-bottom: 6px;
}

.kanbanDmOk {
  color: #27c93f;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
  line-height: 1.3;
}

.kanbanDmNo {
  color: #ff5f56;
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
  line-height: 1.3;
}

.kanbanTgMock {
  background: #2c2c3e;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.kanbanTgMockTitle {
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-weight: 700;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 10px;
}

.kanbanTgMessage {
  background: #3d3d54;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.55;
  white-space: pre-wrap;
}

.kanbanTgTag {
  color: #8aa4ff;
  font-weight: 700;
}
```

- [ ] **Step 2: Проверить что TypeScript не сломался**

```bash
npx tsc --noEmit
```
Ожидаемый вывод: без ошибок.

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts src/components/slides/slides.module.css
git commit -m "feat: add kanban slide types and CSS"
```

---

## Chunk 2: KanbanSlide компонент + регистрация в Slide.tsx

### Task 3: Создать `src/components/slides/KanbanSlide.tsx`

**Files:**
- Create: `src/components/slides/KanbanSlide.tsx`

- [ ] **Step 1: Создать файл компонента**

```tsx
import { useState } from 'react'
import type {
  KanbanIntroContent,
  KanbanBoardContent,
  KanbanRulesContent,
  KanbanCommunicationContent,
} from '../../types'
import styles from './slides.module.css'

type Props = {
  content: KanbanIntroContent | KanbanBoardContent | KanbanRulesContent | KanbanCommunicationContent
}

export function KanbanSlide({ content }: Props) {
  if (content.variant === 'intro') return <KanbanIntro content={content} />
  if (content.variant === 'board') return <KanbanBoard content={content} />
  if (content.variant === 'rules') return <KanbanRules content={content} />
  return <KanbanCommunication content={content} />
}

function KanbanIntro({ content }: { content: KanbanIntroContent }) {
  return (
    <div className={styles.recurringFull}>
      <div className={styles.recurringLeft}>
        <div className={styles.recurringTop}>
          <div className={styles.recurringEyebrow}>{content.eyebrow}</div>
          <h1 className={styles.recurringTitle}>{content.title}</h1>
        </div>
        <div className={styles.recurringBody}>
          <p className={styles.recurringDesc}>{content.description}</p>
          <ul className={styles.recurringFacts}>
            {content.bullets.map((b, i) => (
              <li key={i} className={styles.recurringFact}>
                <span className={styles.recurringDot} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.recurringRight}>
        <div className={styles.recurringTop}>
          <div className={styles.recurringRightHeading}>Перед созданием карточки</div>
        </div>
        <div className={styles.recurringBody}>
          {content.checklist.map((item) => (
            <div key={item.step} className={styles.kanbanCheckCard}>
              <div className={styles.kanbanCheckNum}>{item.step}</div>
              <div className={styles.kanbanCheckText}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const BADGE_CLASS: Record<string, string> = {
  red: styles.kanbanBadgeRed,
  blue: styles.kanbanBadgeBlue,
  yellow: styles.kanbanBadgeYellow,
  green: styles.kanbanBadgeGreen,
  teal: styles.kanbanBadgeTeal,
  gray: styles.kanbanBadgeGray,
  purple: styles.kanbanBadgePurple,
}

function KanbanBoard({ content }: { content: KanbanBoardContent }) {
  const [activeId, setActiveId] = useState<string>(content.columns[0]?.id ?? '')
  const activeCol = content.columns.find(c => c.id === activeId)

  return (
    <div className={styles.kanbanFull}>
      <div className={styles.kanbanBoard}>
        <div className={styles.kanbanBoardHeader}>
          <div className={styles.kanbanBoardTitle}>{content.boardTitle}</div>
          <div className={styles.kanbanBoardSubtitle}>Account + PM · Таблица</div>
        </div>
        <div className={styles.kanbanCols}>
          {content.columns.map(col => (
            <div
              key={col.id}
              className={`${styles.kanbanCol} ${col.id === activeId ? styles.kanbanColActive : ''}`}
              onClick={() => setActiveId(col.id)}
            >
              <div className={styles.kanbanColHeader}>
                <div className={`${styles.kanbanColBadge} ${BADGE_CLASS[col.badgeColor]}`}>
                  {col.badge}
                </div>
                <div className={styles.kanbanColCount}>{col.cards?.length ?? 0}</div>
              </div>
              {col.cards?.map((card, i) => (
                <div key={i} className={styles.kanbanCard}>
                  <div className={styles.kanbanCardTitle}>{card.title}</div>
                  <div className={styles.kanbanCardAssignee}>
                    <div
                      className={styles.kanbanCardAvatar}
                      style={{ background: card.assigneeColor }}
                    >
                      {card.assignee[0]}
                    </div>
                    {card.assignee}
                  </div>
                </div>
              ))}
              <div className={styles.kanbanAddCard}>+ Добавить карточку</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.kanbanDetail}>
        {activeCol ? (
          <>
            <div className={styles.kanbanDetailTop}>
              <div className={styles.kanbanDetailEyebrow}>Описание колонки</div>
              <div className={styles.kanbanDetailStepRow}>
                <div
                  className={`${styles.kanbanStepNum} ${activeCol.step === null ? styles.kanbanStepNumGray : ''}`}
                >
                  {activeCol.step !== null ? activeCol.step : '→'}
                </div>
                <div className={styles.kanbanDetailColName}>{activeCol.badge}</div>
              </div>
            </div>
            <div className={styles.kanbanDetailBody}>
              <div><span className={styles.kanbanDetailWho}>{activeCol.who}</span></div>
              <div className={styles.kanbanDetailDesc}>{activeCol.desc}</div>
              <div className={styles.kanbanDetailHint}>
                <div className={styles.kanbanDetailHintTitle}>Что делать АМ</div>
                {activeCol.hint}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.kanbanDetailDefault}>
            <span>←</span>
            <span>Кликни на колонку, чтобы узнать что она значит</span>
          </div>
        )}
      </div>
    </div>
  )
}

function KanbanRules({ content }: { content: KanbanRulesContent }) {
  return (
    <div className={styles.recurringFull}>
      <div className={styles.recurringLeft}>
        <div className={styles.recurringTop}>
          <h1 className={styles.recurringTitle}>{content.title}</h1>
        </div>
        <div className={styles.recurringBody}>
          <p className={styles.recurringDesc}>
            <strong>{content.formatLabel}:</strong> {content.formatExample}
          </p>
          <div className={styles.kanbanExamples}>
            {content.examples.map((ex, i) => (
              <div key={i} className={styles.kanbanExampleItem}>{ex}</div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.recurringRight}>
        <div className={styles.recurringTop}>
          <div className={styles.recurringRightHeading}>Тело карточки</div>
        </div>
        <div className={styles.recurringBody}>
          <ul className={styles.recurringFacts}>
            {content.bodyRules.map((rule, i) => (
              <li key={i} className={styles.recurringFact}>
                <span className={styles.recurringDot} />
                {rule}
              </li>
            ))}
          </ul>
          <div className={styles.kanbanWarning}>⚠️ {content.warning}</div>
        </div>
      </div>
    </div>
  )
}

function KanbanCommunication({ content }: { content: KanbanCommunicationContent }) {
  return (
    <div className={styles.recurringFull}>
      <div className={styles.recurringLeft}>
        <div className={styles.recurringTop}>
          <h1 className={styles.recurringTitle}>{content.title}</h1>
        </div>
        <div className={styles.recurringBody}>
          <div className={styles.recurringRightHeading} style={{ marginBottom: 12 }}>
            Срочный вопрос
          </div>
          <div className={styles.kanbanUrgentBlock}>
            <div className={styles.kanbanUrgentIcon}>⚡</div>
            <div className={styles.kanbanUrgentText}>{content.urgentText}</div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '16px 0' }} />
          <div className={styles.recurringRightHeading} style={{ marginBottom: 12 }}>
            Личные сообщения
          </div>
          {content.dmAllowed.map((text, i) => (
            <div key={i} className={styles.kanbanDmRule}>
              <span className={styles.kanbanDmOk}>✓</span>
              <span>{text}</span>
            </div>
          ))}
          {content.dmForbidden.map((text, i) => (
            <div key={i} className={styles.kanbanDmRule}>
              <span className={styles.kanbanDmNo}>✗</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.recurringRight}>
        <div className={styles.recurringTop}>
          <div className={styles.recurringRightHeading}>Пример сообщения в чат</div>
        </div>
        <div className={styles.recurringBody}>
          <div className={styles.kanbanTgMock}>
            <div className={styles.kanbanTgMockTitle}>{content.urgentChat}</div>
            {content.exampleMessages.map((msg, i) => (
              <div key={i} className={styles.kanbanTgMessage}>
                {msg.text.split(/(@\S+)/g).map((part, j) =>
                  part.startsWith('@')
                    ? <span key={j} className={styles.kanbanTgTag}>{part}</span>
                    : part
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Проверить TypeScript**

```bash
npx tsc --noEmit
```
Ожидаемый вывод: без ошибок.

---

### Task 4: Зарегистрировать в `src/components/slides/Slide.tsx`

**Files:**
- Modify: `src/components/slides/Slide.tsx:1,93`

- [ ] **Step 1: Добавить импорт типов и компонента**

В строке 1 добавить `KanbanIntroContent, KanbanBoardContent, KanbanRulesContent, KanbanCommunicationContent` в import типов:
```ts
import type { Slide as SlideType, Lesson, WelcomeContent, InfoContent, FeatureContent, MethodsContent, FlowchartContent, DiagramContent, CheatsheetContent, TabsContent, MerchantContent, CompareContent, KassaContent, AcquiringContent, VendorsSlideContent, EntitiesContent, FinishContent, ToolsContent, TgChatsContent, SearchContent, NichesContent, FunnelContent, ObjectionsContent, KstatiContent, RecurringOverviewContent, RecurringRequirementsContent, HelpIntroContent, HelpPortalsContent, VatContent, ReqContent, UnitChecksContent, KanbanIntroContent, KanbanBoardContent, KanbanRulesContent, KanbanCommunicationContent } from '../../types'
```

После строки с `import { UnitChecksSlide }` добавить:
```ts
import { KanbanSlide } from './KanbanSlide'
```

- [ ] **Step 2: Добавить case в switch перед `default`**

После строки `case 'unitchecks':` добавить:
```ts
    case 'kanban':
      return <KanbanSlide content={slide.content as KanbanIntroContent | KanbanBoardContent | KanbanRulesContent | KanbanCommunicationContent} />
```

- [ ] **Step 3: Проверить TypeScript**

```bash
npx tsc --noEmit
```
Ожидаемый вывод: без ошибок.

- [ ] **Step 4: Commit**

```bash
git add src/components/slides/KanbanSlide.tsx src/components/slides/Slide.tsx
git commit -m "feat: add KanbanSlide component with 4 variants"
```

---

## Chunk 3: Данные урока

### Task 5: Добавить урок `technical-tech` в `src/data/lessons.ts`

**Files:**
- Modify: `src/data/lessons.ts` (добавить в конец массива, перед `]`)

- [ ] **Step 1: Добавить урок в конец массива `lessons`**

Найти последнюю строку массива (закрывающий `]`) и добавить перед ней новую запись:

```ts
  {
    id: 'technical-tech',
    title: 'Взаимодействие с техническим отделом',
    published: true,
    slides: [
      {
        id: '1',
        type: 'kanban',
        content: {
          variant: 'intro',
          eyebrow: 'Account + PM',
          title: 'Доска Задачи ПМ',
          description: 'Для запросов от отдела аккаунтов к техническому отделу по операционным кейсам используется канбан-доска Задачи ПМ в пространстве Account + PM.',
          bullets: [
            'Взаимодействие с техотделом — только через карточки на доске',
            'Не дублируй запрос в личку без необходимости',
            'Все кейсы сохраняются в истории — удобно отслеживать',
          ],
          checklist: [
            { step: 1, text: 'Разобраться в ситуации мерчанта' },
            { step: 2, text: 'Проверить: можно ли решить без ПМа — база знаний, коллеги, готовые шаблоны' },
            { step: 3, text: 'Запросить у мерчанта всю нужную информацию: № проекта, платежа, скриншот ошибки, ссылку на оплату' },
          ],
        },
      },
      {
        id: '2',
        type: 'kanban',
        hasInternalNav: true,
        content: {
          variant: 'board',
          boardTitle: 'Задачи ПМ',
          columns: [
            {
              id: 'take',
              badge: 'Взять в работу',
              badgeColor: 'red',
              step: 1,
              who: 'Действие: АМ',
              desc: 'Аккаунт-менеджер создал карточку с запросом от партнёра. Карточка ждёт, пока ПМ возьмёт её в работу.',
              hint: 'Убедись, что разобрался в ситуации и проверил базу знаний прежде чем создавать карточку.',
              cards: [],
            },
            {
              id: 'wip',
              badge: 'В работе',
              badgeColor: 'blue',
              step: 2,
              who: 'Действие: ПМ',
              desc: 'ПМ взял карточку в работу и разбирается в ситуации. Ожидай ответа.',
              hint: 'Не пиши в личку — ПМ уже работает над вопросом. Если прошло много времени, можно оставить комментарий в карточке.',
              cards: [
                { title: '696845 / 445293 interplay-rp.com тестовый платёж', assignee: 'Волкова Елена', assigneeColor: '#e8645a' },
              ],
            },
            {
              id: 'clarify',
              badge: 'Требует уточнений',
              badgeColor: 'yellow',
              step: 3,
              who: 'Действие: АМ',
              desc: 'ПМ задал вопрос или запросил дополнительную информацию — оставил комментарий и перевёл карточку сюда.',
              hint: 'Прочитай комментарий ПМа и предоставь запрошенную информацию как можно быстрее.',
              cards: [],
            },
            {
              id: 'done',
              badge: 'Готово',
              badgeColor: 'green',
              step: 4,
              who: 'Действие: ПМ',
              desc: 'ПМ полностью отписался по решению ситуации. Теперь АМ должен оповестить мерчанта и перевести карточку в «Обработано».',
              hint: 'Прочитай комментарий ПМа и перешли ответ мерчанту. После — переводи карточку в «Обработано аккаунтингом».',
              cards: [
                { title: '698506 пожелание по документации обработчика', assignee: 'Долженкова Оксана', assigneeColor: '#7b68ee' },
              ],
            },
            {
              id: 'processed',
              badge: 'Обработано аккаунтингом',
              badgeColor: 'teal',
              step: 5,
              who: 'Действие: АМ',
              desc: 'АМ оповестил мерчанта по карточке из колонки «Готово» и перевёл её сюда. Карточка закрыта.',
              hint: 'Это финальная колонка. Переводи карточку сюда только после того, как мерчант получил ответ.',
              cards: [],
            },
            {
              id: 'vendor',
              badge: 'У вендора',
              badgeColor: 'gray',
              step: null,
              who: 'Действие: ПМ',
              desc: 'ПМ ожидает ответа от вендора (банка, процессора) по вопросу из карточки. Срок зависит от вендора.',
              hint: 'Карточка может находиться здесь от нескольких часов до нескольких дней. Не торопи — ПМ следит за статусом.',
              cards: [],
            },
            {
              id: 'waiting',
              badge: 'В ожидании (долгое)',
              badgeColor: 'purple',
              step: null,
              who: 'Действие: ПМ',
              desc: 'ПМ ожидает ответа или решения в течение долгого времени — вопрос на стороне мерчанта или вендора затягивается.',
              hint: 'Если ситуация стала срочной — пиши в чат «Взаимодействие Аккаунтинг | PM» и тегни ПМа.',
              cards: [
                { title: 'Некорректно отображается идентификатор клиента в разделе товары', assignee: 'Долженкова Оксана', assigneeColor: '#7b68ee' },
              ],
            },
          ],
        },
      },
      {
        id: '3',
        type: 'kanban',
        content: {
          variant: 'rules',
          title: 'Правила оформления карточек',
          formatLabel: 'Тема карточки',
          formatExample: 'ID партнёра / проекта / № платежа + краткое описание ситуации',
          examples: [
            '444399 / не проходят не РФ платежи',
            '691690 / проблемы с выплатами Платио',
            '695078 / вопрос по интеграции',
            '2177324699 / платеж в ожидании',
          ],
          bodyRules: [
            'Подробная информация по произошедшему кейсу',
            'Данные для проверки в системе: № проекта, № платежа',
            'Скриншоты или скринкасты, если кейс подразумевает',
            'Какая работа была проведена по самостоятельной аналитике',
          ],
          warning: 'В карточке не должно быть лишней эмоционально окрашенной информации по ситуации.',
        },
      },
      {
        id: '4',
        type: 'kanban',
        content: {
          variant: 'communication',
          title: 'Срочные вопросы и личные сообщения',
          urgentText: 'Если возникла срочная ситуация и реакция ПМа нужна как можно скорее — напиши в Telegram-чат «Взаимодействие Аккаунтинг | PM», тегни ПМа и подробно опиши сложившуюся ситуацию.',
          urgentChat: 'Взаимодействие Аккаунтинг | PM',
          dmAllowed: [
            'Уточнить формулировку по карточке (если ответ ПМа непонятен)',
          ],
          dmForbidden: [
            'По всем остальным рабочим вопросам — обращаться в карточке или в общий чат',
          ],
          exampleMessages: [
            {
              sender: 'АМ',
              text: '@Alhazova_UnitPay @Deeva_Unitpay Срочная карточка.\nУ мерчанта 66666 перестали проходить платежи, каскад не сработал. Помогите разобраться. Ссылка на карточку: https://unitpay.teamly.ru/СуперСрочнаяКарточка',
            },
            {
              sender: 'АМ',
              text: '@Alhazova_UnitPay @Deeva_Unitpay Пользователи массово обращаются с проблемами по недоступности оплаты и нашего сайта. Срочно посмотрите пожалуйста что случилось.',
            },
          ],
        },
      },
    ],
  },
```

- [ ] **Step 2: Проверить TypeScript**

```bash
npx tsc --noEmit
```
Ожидаемый вывод: без ошибок.

- [ ] **Step 3: Открыть урок в браузере и проверить все 4 слайда**

Запустить dev-сервер (`npm run dev`), открыть урок `technical-tech` через раздел «Технические аспекты и интеграция». Проверить:
- Слайд 1: левый столбец с заголовком и буллитами, правый — 3 карточки чеклиста
- Слайд 2: тёмная доска, клик по каждой из 7 колонок показывает описание справа
- Слайд 3: формат + тёмные примеры слева, правила тела + предупреждение справа
- Слайд 4: срочные вопросы + ✓/✗ правила слева, два примера сообщений в тёмном блоке справа

- [ ] **Step 4: Commit**

```bash
git add src/data/lessons.ts
git commit -m "feat: add technical-tech lesson with kanban board slides"
```
