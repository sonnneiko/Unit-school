# Attraction Lessons Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Реализовать секцию «Привлечение мерчантов» с 4 темами и 4 новыми типами интерактивных слайдов.

**Architecture:** Добавляем 4 новых типа слайдов (`search`, `niches`, `funnel`, `objections`) по существующему паттерну платформы — тип в `SlideType`, интерфейс контента в `types/index.ts`, компонент в `slides/`, CSS-классы в `slides.module.css`. Данные уроков хранятся в `lessons.ts`.

**Tech Stack:** React, TypeScript, CSS Modules (Vite). Нет unit-тестов — верификация через `tsc --noEmit` + визуальная проверка в dev-сервере (`npm run dev`).

**Spec:** `docs/superpowers/specs/2026-05-07-attraction-lesson-design.md`

---

## Chunk 1: Типы и CSS

### Task 1: Добавить типы в `src/types/index.ts`

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Добавить новые строки в `SlideType`**

Найти строку 32 (`export type SlideType = ...`) и дописать 4 новых значения:

```ts
export type SlideType = 'welcome' | 'tabs' | 'info' | 'feature' | 'methods' | 'flowchart' | 'diagram' | 'cheatsheet' | 'merchant' | 'compare' | 'kassa' | 'acquiring' | 'vendors' | 'entities' | 'finish' | 'tools' | 'tgchats' | 'search' | 'niches' | 'funnel' | 'objections'
```

- [ ] **Step 2: Добавить интерфейсы контента**

Вставить в конец файла (перед `export interface Topic`):

```ts
// ── Search slide ──────────────────────────────────────────────
export interface SearchChannel {
  icon: string
  title: string
  sub: string
  sections: {
    icon: string
    label: string
    color: string
    items: string[]       // каждый элемент — строка, может содержать HTML (<strong>)
  }[]
  tip: string
  side: {
    title: string
    items: string[]
  }
}

export interface SearchContent {
  channels: SearchChannel[]
}

// ── Niches slide ──────────────────────────────────────────────
export interface NicheItem {
  id: string
  emoji: string
  title: string
  sub: string
  whoText: string
  whoTags: string[]
  pains: string[]
  script: string          // HTML со <span class="ph"> для подсказок
  note: string
  lifehack?: string
}

export interface NichesContent {
  niches: NicheItem[]
}

// ── Funnel slide ──────────────────────────────────────────────
export interface FunnelSection {
  icon: string
  label: string
  color: string
  content: string         // HTML
}

export interface FunnelStage {
  emoji: string
  title: string
  sub: string
  sections: FunnelSection[]
  side: 'followup' | 'sources' | 'none'
}

export interface FunnelContent {
  stages: FunnelStage[]
}

// ── Objections slide ──────────────────────────────────────────
export interface ObjectionItem {
  emoji: string
  short: string           // текст карточки слева
  title: string           // заголовок детальной панели
  why: string
  reply: string[]         // 3 шага логики ответа
  script: string          // HTML со <span class="ph">
  tip: string
}

export interface ObjectionsContent {
  objections: ObjectionItem[]
}
```

- [ ] **Step 3: Добавить новые типы в union `Slide['content']`**

Найти строку со `content:` (строка 38) и дописать 4 новых типа:

```ts
  content: WelcomeContent | TabsContent | InfoContent | FeatureContent | MethodsContent | FlowchartContent | DiagramContent | CheatsheetContent | MerchantContent | CompareContent | KassaContent | AcquiringContent | VendorsSlideContent | EntitiesContent | FinishContent | ToolsContent | TgChatsContent | SearchContent | NichesContent | FunnelContent | ObjectionsContent
```

- [ ] **Step 4: Проверить TypeScript**

```bash
cd /Users/s.alhazova/Documents/GitHub/Unit-school && npx tsc --noEmit
```

Ожидаем: только ошибки про отсутствующие компоненты (они будут добавлены позже), но не про типы.

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add types for search/niches/funnel/objections slides"
```

---

### Task 2: Добавить CSS-классы в `src/components/slides/slides.module.css`

**Files:**
- Modify: `src/components/slides/slides.module.css` (вставить в конец файла)

- [ ] **Step 1: Вставить общие классы (переиспользуются во всех 4 слайдах)**

```css
/* ══════════════════════════════════════════════════════
   ОБЩИЕ УТИЛИТЫ ДЛЯ ATTRACTION SLIDES (светлая тема)
   ══════════════════════════════════════════════════════ */

.attrTopbar {
  background: #ffffff;
  padding: 9px 24px;
  font-size: 11px;
  color: #9ca3af;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.attrTopbarTitle {
  color: #374151;
  font-weight: 600;
}

.attrLessonTag {
  margin-left: auto;
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  padding: 3px 10px;
  border-radius: 5px;
  font-size: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.attrSectionBlock {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.attrSectionHead {
  padding: 9px 14px;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  gap: 7px;
  align-items: center;
}

.attrSectionBody {
  padding: 13px 14px;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.65;
}

.attrDotList {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attrDotItem {
  display: flex;
  gap: 9px;
  align-items: flex-start;
}

.attrDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  flex-shrink: 0;
  margin-top: 5px;
}

.attrDotText {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
}

.attrTipBox {
  background: rgba(251, 191, 36, 0.06);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 9px;
  padding: 10px 14px;
  font-size: 12px;
  color: #92400e;
  line-height: 1.6;
}

.attrSideCard {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.attrSideCardTitle {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 12px;
}

.attrCkRow {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 9px;
}

.attrCkRow:last-child {
  margin-bottom: 0;
}

.attrCkDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  margin-top: 5px;
  flex-shrink: 0;
}

.attrCkText {
  font-size: 12px;
  color: #4b5563;
  line-height: 1.45;
}

/* ph — плейсхолдеры в скриптах */
:global(.ph) {
  color: #15803d;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 3px;
  padding: 1px 5px;
  font-weight: 700;
  font-style: normal;
  font-size: 12px;
}
```

- [ ] **Step 2: Вставить CSS для SearchSlide**

```css
/* ══════════════════════════════════════════════════════
   SEARCH SLIDE
   ══════════════════════════════════════════════════════ */

.searchRoot {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f5f5f5;
}

.searchContent {
  flex: 1;
  padding: 22px 28px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: hidden;
}

.searchTabs {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.searchTab {
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  border: 1.5px solid #e5e7eb;
  background: #ffffff;
  color: #6b7280;
  transition: all 0.18s;
}

.searchTab:hover {
  border-color: #d1d5db;
}

.searchTabActive {
  background: #22c55e;
  border-color: #22c55e;
  color: #ffffff;
}

.searchPanel {
  flex: 1;
  display: flex;
  gap: 16px;
  min-height: 0;
}

.searchMain {
  flex: 1;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  overflow-y: auto;
}

.searchChannelHeader {
  display: flex;
  align-items: center;
  gap: 14px;
}

.searchChannelIcon {
  font-size: 28px;
  width: 50px;
  height: 50px;
  background: #f3f4f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.searchChannelName {
  font-size: 17px;
  font-weight: 800;
}

.searchChannelSub {
  font-size: 12px;
  color: #6b7280;
  margin-top: 3px;
}

.searchQueryTags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.searchQueryTag {
  display: inline-block;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  padding: 3px 9px;
  font-size: 12px;
  color: #15803d;
  font-weight: 600;
}

.searchSide {
  width: 225px;
  flex-shrink: 0;
}
```

- [ ] **Step 3: Вставить CSS для NichesSlide**

```css
/* ══════════════════════════════════════════════════════
   NICHES SLIDE
   ══════════════════════════════════════════════════════ */

.nichesRoot {
  flex: 1;
  display: flex;
  gap: 0;
  overflow: hidden;
  background: #f5f5f5;
}

.nichesList {
  width: 220px;
  flex-shrink: 0;
  padding: 20px 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.nicheCard {
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.18s;
  display: flex;
  gap: 10px;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.nicheCard:hover {
  border-color: #d1d5db;
}

.nicheCardActive {
  border-color: #22c55e;
  background: #f0fdf4;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.12);
}

.nicheCardEmoji {
  font-size: 22px;
  flex-shrink: 0;
}

.nicheCardTitle {
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  line-height: 1.3;
}

.nicheCardActive .nicheCardTitle {
  color: #15803d;
}

.nicheCardSub {
  font-size: 11px;
  color: #9ca3af;
  margin-top: 1px;
}

.nichesDetail {
  flex: 1;
  padding: 20px 20px 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
}

.nichesDetailInner {
  flex: 1;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 22px 26px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  overflow-y: auto;
}

.nichesDetailHeader {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nichesDetailEmoji {
  font-size: 32px;
  flex-shrink: 0;
}

.nichesDetailTitle {
  font-size: 18px;
  font-weight: 800;
}

.nichesDetailSub {
  font-size: 12px;
  color: #6b7280;
  margin-top: 3px;
}

.nichesTags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.nichesTag {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 12px;
  color: #4b5563;
  font-weight: 600;
}

.nichesScriptBox {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 13px;
  color: #374151;
  line-height: 1.75;
  font-style: italic;
}

.nichesLifehack {
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 9px;
  padding: 10px 14px;
  font-size: 12px;
  color: #1e40af;
  line-height: 1.6;
}

.nichesEmptyState {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 14px;
  gap: 10px;
  text-align: center;
}
```

- [ ] **Step 4: Вставить CSS для FunnelSlide**

```css
/* ══════════════════════════════════════════════════════
   FUNNEL SLIDE
   ══════════════════════════════════════════════════════ */

.funnelRoot {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f5f5f5;
}

.funnelPipeline {
  padding: 20px 28px 0;
  flex-shrink: 0;
}

.funnelPipelineInner {
  display: flex;
  align-items: center;
}

.funnelStage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding-bottom: 10px;
}

.funnelStageShape {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s;
}

.funnelStageShapeBg {
  position: absolute;
  inset: 0;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.funnelStage:first-child .funnelStageShapeBg {
  border-radius: 12px 6px 6px 12px;
}

.funnelStage:last-child .funnelStageShapeBg {
  border-radius: 6px 12px 12px 6px;
}

.funnelStageActive .funnelStageShapeBg {
  background: linear-gradient(135deg, #dcfce7, #f0fdf4);
  border-color: #22c55e;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.15);
}

.funnelStage:hover .funnelStageShapeBg {
  border-color: #d1d5db;
}

.funnelStageInner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
}

.funnelStageEmoji {
  font-size: 18px;
}

.funnelStageLabel {
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  text-align: center;
  line-height: 1.3;
}

.funnelStageActive .funnelStageLabel {
  color: #16a34a;
}

.funnelArrow {
  width: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
  font-size: 16px;
  margin-bottom: 10px;
  z-index: 2;
}

.funnelStageNum {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #f3f4f6;
  border: 1.5px solid #e5e7eb;
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px;
  transition: all 0.2s;
}

.funnelStageActive .funnelStageNum {
  background: #22c55e;
  border-color: #22c55e;
  color: #ffffff;
}

.funnelDetail {
  flex: 1;
  padding: 16px 28px 20px;
  display: flex;
  gap: 20px;
  overflow: hidden;
  min-height: 0;
}

.funnelDetailMain {
  flex: 1;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 22px 26px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.funnelDetailHeader {
  display: flex;
  align-items: center;
  gap: 14px;
}

.funnelDetailEmoji {
  font-size: 32px;
  flex-shrink: 0;
}

.funnelDetailTitle {
  font-size: 20px;
  font-weight: 800;
}

.funnelDetailSub {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}

.funnelDetailSide {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.funnelFollowupBlock {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 18px 16px;
  flex: 1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.funnelFollowupTitle {
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #9ca3af;
  font-weight: 700;
  margin-bottom: 14px;
}

.funnelFuList {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.funnelFuItem {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding-bottom: 14px;
  position: relative;
}

.funnelFuItem:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 13px;
  top: 22px;
  bottom: 0;
  width: 1.5px;
  background: #e5e7eb;
}

.funnelFuDot {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #f3f4f6;
  border: 1.5px solid #e5e7eb;
  font-size: 11px;
  font-weight: 800;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
}

.funnelFuDotActive {
  background: #dcfce7;
  border-color: #22c55e;
  color: #16a34a;
}

.funnelFuDay {
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 2px;
}

.funnelFuText {
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.5;
}

.funnelEmptyPane {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 13px;
  text-align: center;
}
```

- [ ] **Step 5: Вставить CSS для ObjectionsSlide**

```css
/* ══════════════════════════════════════════════════════
   OBJECTIONS SLIDE
   ══════════════════════════════════════════════════════ */

.objRoot {
  flex: 1;
  display: flex;
  gap: 16px;
  overflow: hidden;
  padding: 20px 28px;
  background: #f5f5f5;
}

.objList {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.objCard {
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.18s;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.objCard:hover {
  border-color: #d1d5db;
}

.objCardActive {
  border-color: #22c55e;
  background: #f0fdf4;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.12);
}

.objNum {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #f3f4f6;
  font-size: 11px;
  font-weight: 800;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
  transition: all 0.18s;
}

.objCardActive .objNum {
  background: #22c55e;
  color: #ffffff;
}

.objCardText {
  font-size: 13px;
  color: #374151;
  font-weight: 600;
  line-height: 1.4;
}

.objCardActive .objCardText {
  color: #15803d;
}

.objDetail {
  flex: 1;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  overflow-y: auto;
}

.objDetailHeader {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.objDetailIcon {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  background: #fef2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.objDetailLabel {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 4px;
}

.objDetailTitle {
  font-size: 17px;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.35;
}

.objScriptBox {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 13px;
  color: #374151;
  line-height: 1.75;
  font-style: italic;
}

.objEmptyState {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 14px;
  gap: 10px;
  text-align: center;
}

.objEmptyIcon {
  font-size: 32px;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/slides/slides.module.css
git commit -m "feat: add CSS classes for search/niches/funnel/objections slides"
```

---

## Chunk 2: Компоненты

### Task 3: Создать `SearchSlide.tsx`

**Files:**
- Create: `src/components/slides/SearchSlide.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
import { useState } from 'react'
import type { SearchContent } from '../../types'
import styles from './slides.module.css'

interface Props {
  content: SearchContent
}

export function SearchSlide({ content }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)
  const ch = content.channels[activeIdx]

  return (
    <div className={styles.searchRoot}>
      <div className={styles.searchContent}>
        <div className={styles.searchTabs}>
          {content.channels.map((c, i) => (
            <div
              key={i}
              className={`${styles.searchTab} ${i === activeIdx ? styles.searchTabActive : ''}`}
              onClick={() => setActiveIdx(i)}
            >
              {c.icon} {c.title}
            </div>
          ))}
        </div>

        <div className={styles.searchPanel}>
          <div className={styles.searchMain}>
            <div className={styles.searchChannelHeader}>
              <div className={styles.searchChannelIcon}>{ch.icon}</div>
              <div>
                <div className={styles.searchChannelName}>{ch.title}</div>
                <div className={styles.searchChannelSub}>{ch.sub}</div>
              </div>
            </div>

            {ch.sections.map((sec, si) => (
              <div key={si} className={styles.attrSectionBlock}>
                <div className={styles.attrSectionHead} style={{ color: sec.color }}>
                  {sec.icon} {sec.label}
                </div>
                <div className={styles.attrSectionBody}>
                  {sec.items.length > 0 && sec.items[0].startsWith('<span') ? (
                    <div className={styles.searchQueryTags}>
                      {sec.items.map((item, ii) => (
                        <span key={ii} className={styles.searchQueryTag} dangerouslySetInnerHTML={{ __html: item }} />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.attrDotList}>
                      {sec.items.map((item, ii) => (
                        <div key={ii} className={styles.attrDotItem}>
                          <div className={styles.attrDot} />
                          <div className={styles.attrDotText} dangerouslySetInnerHTML={{ __html: item }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className={styles.attrTipBox}>{ch.tip}</div>
          </div>

          <div className={styles.searchSide}>
            <div className={styles.attrSideCard}>
              <div className={styles.attrSideCardTitle}>{ch.side.title}</div>
              {ch.side.items.map((item, i) => (
                <div key={i} className={styles.attrCkRow}>
                  <div className={styles.attrCkDot} />
                  <div className={styles.attrCkText}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Проверить TypeScript**

```bash
cd /Users/s.alhazova/Documents/GitHub/Unit-school && npx tsc --noEmit 2>&1 | grep SearchSlide
```

Ожидаем: нет ошибок, связанных с SearchSlide.

- [ ] **Step 3: Commit**

```bash
git add src/components/slides/SearchSlide.tsx
git commit -m "feat: add SearchSlide component"
```

---

### Task 4: Создать `NichesSlide.tsx`

**Files:**
- Create: `src/components/slides/NichesSlide.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
import { useState } from 'react'
import type { NichesContent, NicheItem } from '../../types'
import styles from './slides.module.css'

interface Props {
  content: NichesContent
}

export function NichesSlide({ content }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const niche: NicheItem | undefined = content.niches.find(n => n.id === activeId)

  return (
    <div className={styles.nichesRoot}>
      <div className={styles.nichesList}>
        {content.niches.map(n => (
          <div
            key={n.id}
            className={`${styles.nicheCard} ${n.id === activeId ? styles.nicheCardActive : ''}`}
            onClick={() => setActiveId(n.id)}
          >
            <div className={styles.nicheCardEmoji}>{n.emoji}</div>
            <div>
              <div className={styles.nicheCardTitle}>{n.title}</div>
              <div className={styles.nicheCardSub}>{n.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.nichesDetail}>
        {!niche ? (
          <div className={styles.nichesEmptyState}>
            <span style={{ fontSize: 32 }}>👈</span>
            Выбери нишу слева
          </div>
        ) : (
          <div className={styles.nichesDetailInner}>
            <div className={styles.nichesDetailHeader}>
              <div className={styles.nichesDetailEmoji}>{niche.emoji}</div>
              <div>
                <div className={styles.nichesDetailTitle}>{niche.title}</div>
                <div className={styles.nichesDetailSub}>{niche.sub}</div>
              </div>
            </div>

            <div className={styles.attrSectionBlock}>
              <div className={styles.attrSectionHead} style={{ color: '#3b82f6' }}>👥 Кто это</div>
              <div className={styles.attrSectionBody}>
                <div style={{ marginBottom: 8 }}>{niche.whoText}</div>
                <div className={styles.nichesTags}>
                  {niche.whoTags.map((tag, i) => (
                    <span key={i} className={styles.nichesTag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.attrSectionBlock}>
              <div className={styles.attrSectionHead} style={{ color: '#ef4444' }}>😤 Боли с оплатой</div>
              <div className={styles.attrSectionBody}>
                <div className={styles.attrDotList}>
                  {niche.pains.map((pain, i) => (
                    <div key={i} className={styles.attrDotItem}>
                      <div className={styles.attrDot} />
                      <div className={styles.attrDotText}>{pain}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.attrSectionBlock}>
              <div className={styles.attrSectionHead} style={{ color: '#16a34a' }}>✍️ Первое сообщение</div>
              <div className={styles.attrSectionBody}>
                <div className={styles.nichesScriptBox} dangerouslySetInnerHTML={{ __html: niche.script }} />
              </div>
            </div>

            {niche.lifehack && (
              <div className={styles.nichesLifehack}>🔍 {niche.lifehack}</div>
            )}

            <div className={styles.attrTipBox}>💡 {niche.note}</div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Проверить TypeScript**

```bash
cd /Users/s.alhazova/Documents/GitHub/Unit-school && npx tsc --noEmit 2>&1 | grep NichesSlide
```

- [ ] **Step 3: Commit**

```bash
git add src/components/slides/NichesSlide.tsx
git commit -m "feat: add NichesSlide component"
```

---

### Task 5: Создать `FunnelSlide.tsx`

**Files:**
- Create: `src/components/slides/FunnelSlide.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
import { useState } from 'react'
import type { FunnelContent } from '../../types'
import styles from './slides.module.css'

interface Props {
  content: FunnelContent
}

const followupItems = [
  { day: 'D0',   text: '<strong>Написал</strong> первое сообщение' },
  { day: 'D+2',  text: 'Напоминание + one-pager' },
  { day: 'D+5',  text: '«Видели?» + главная выгода' },
  { day: 'D+10', text: 'Другой канал (ТГ / звонок)' },
  { day: 'D+15', text: 'Предложить пилот / тест' },
  { day: 'D+22', text: 'Когда вернуться? Напоминание' },
]

const sourceItems = [
  { icon: '🔍', title: 'Google / Яндекс', text: 'Запросы по нишам: «купить ключ», «подписка на курс»' },
  { icon: '📋', title: 'Каталоги и маркеты', text: 'Рейтинги игровых серверов, маркеты цифровых товаров' },
  { icon: '💬', title: 'Telegram-каналы', text: 'Чаты разработчиков, владельцев серверов, продавцов курсов' },
  { icon: '🤝', title: 'Партнёры', text: 'Студии и интеграторы — реферальное сотрудничество' },
]

export function FunnelSlide({ content }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)
  const stage = content.stages[activeIdx]

  return (
    <div className={styles.funnelRoot}>
      <div className={styles.funnelPipeline}>
        <div className={styles.funnelPipelineInner}>
          {content.stages.map((s, i) => (
            <>
              <div
                key={s.emoji}
                className={`${styles.funnelStage} ${i === activeIdx ? styles.funnelStageActive : ''}`}
                onClick={() => setActiveIdx(i)}
              >
                <div className={styles.funnelStageShape}>
                  <div className={styles.funnelStageShapeBg} />
                  <div className={styles.funnelStageInner}>
                    <div className={styles.funnelStageEmoji}>{s.emoji}</div>
                    <div className={styles.funnelStageLabel} dangerouslySetInnerHTML={{ __html: s.title.split(' ')[0] }} />
                  </div>
                </div>
                <div className={styles.funnelStageNum}>{i + 1}</div>
              </div>
              {i < content.stages.length - 1 && (
                <div key={`arrow-${i}`} className={styles.funnelArrow}>›</div>
              )}
            </>
          ))}
        </div>
      </div>

      <div className={styles.funnelDetail}>
        <div className={styles.funnelDetailMain}>
          <div className={styles.funnelDetailHeader}>
            <div className={styles.funnelDetailEmoji}>{stage.emoji}</div>
            <div>
              <div className={styles.funnelDetailTitle}>{stage.title}</div>
              <div className={styles.funnelDetailSub}>{stage.sub}</div>
            </div>
          </div>

          {stage.sections.map((sec, si) => (
            <div key={si} className={styles.attrSectionBlock}>
              <div className={styles.attrSectionHead} style={{ color: sec.color }}>
                {sec.icon} {sec.label}
              </div>
              <div className={styles.attrSectionBody} dangerouslySetInnerHTML={{ __html: sec.content }} />
            </div>
          ))}
        </div>

        <div className={styles.funnelDetailSide}>
          {stage.side === 'followup' && (
            <div className={styles.funnelFollowupBlock}>
              <div className={styles.funnelFollowupTitle}>📅 Фолоу-апы</div>
              <div className={styles.funnelFuList}>
                {followupItems.map((f, i) => (
                  <div key={i} className={styles.funnelFuItem}>
                    <div className={`${styles.funnelFuDot} ${i === 0 ? styles.funnelFuDotActive : ''}`}>{f.day}</div>
                    <div>
                      <div className={styles.funnelFuText} dangerouslySetInnerHTML={{ __html: f.text }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage.side === 'sources' && (
            <div className={styles.funnelFollowupBlock}>
              <div className={styles.funnelFollowupTitle}>📍 Где искать</div>
              <div className={styles.funnelFuList}>
                {sourceItems.map((item, i) => (
                  <div key={i} className={styles.funnelFuItem}>
                    <div className={styles.funnelFuDot} style={{ fontSize: 14 }}>{item.icon}</div>
                    <div>
                      <div className={styles.funnelFuDay}>{item.title}</div>
                      <div className={styles.funnelFuText}>{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stage.side === 'none' && (
            <div className={`${styles.funnelFollowupBlock} ${styles.funnelEmptyPane}`}>
              Мерч подключён.<br />Поддерживай связь и следи за первыми оплатами.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Проверить TypeScript**

```bash
cd /Users/s.alhazova/Documents/GitHub/Unit-school && npx tsc --noEmit 2>&1 | grep FunnelSlide
```

- [ ] **Step 3: Commit**

```bash
git add src/components/slides/FunnelSlide.tsx
git commit -m "feat: add FunnelSlide component"
```

---

### Task 6: Создать `ObjectionsSlide.tsx`

**Files:**
- Create: `src/components/slides/ObjectionsSlide.tsx`

- [ ] **Step 1: Создать компонент**

```tsx
import { useState } from 'react'
import type { ObjectionsContent, ObjectionItem } from '../../types'
import styles from './slides.module.css'

interface Props {
  content: ObjectionsContent
}

export function ObjectionsSlide({ content }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const obj: ObjectionItem | undefined = activeIdx !== null ? content.objections[activeIdx] : undefined

  return (
    <div className={styles.objRoot}>
      <div className={styles.objList}>
        {content.objections.map((o, i) => (
          <div
            key={i}
            className={`${styles.objCard} ${i === activeIdx ? styles.objCardActive : ''}`}
            onClick={() => setActiveIdx(i)}
          >
            <div className={styles.objNum}>{i + 1}</div>
            <div className={styles.objCardText}>{o.short}</div>
          </div>
        ))}
      </div>

      <div className={styles.objDetail}>
        {!obj ? (
          <div className={styles.objEmptyState}>
            <div className={styles.objEmptyIcon}>👈</div>
            Выбери возражение слева
          </div>
        ) : (
          <>
            <div className={styles.objDetailHeader}>
              <div className={styles.objDetailIcon}>{obj.emoji}</div>
              <div>
                <div className={styles.objDetailLabel}>Возражение</div>
                <div className={styles.objDetailTitle}>{obj.title}</div>
              </div>
            </div>

            <div className={styles.attrSectionBlock}>
              <div className={styles.attrSectionHead} style={{ color: '#6b7280' }}>🧠 Почему говорит</div>
              <div className={styles.attrSectionBody}>{obj.why}</div>
            </div>

            <div className={styles.attrSectionBlock}>
              <div className={styles.attrSectionHead} style={{ color: '#3b82f6' }}>💬 Логика ответа</div>
              <div className={styles.attrSectionBody}>
                <div className={styles.attrDotList}>
                  {obj.reply.map((r, i) => (
                    <div key={i} className={styles.attrDotItem}>
                      <div className={styles.attrDot} />
                      <div className={styles.attrDotText}>{r}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.attrSectionBlock}>
              <div className={styles.attrSectionHead} style={{ color: '#16a34a' }}>✍️ Пример ответа</div>
              <div className={styles.attrSectionBody}>
                <div className={styles.objScriptBox} dangerouslySetInnerHTML={{ __html: obj.script }} />
              </div>
            </div>

            <div className={styles.attrTipBox}>💡 {obj.tip}</div>
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Проверить TypeScript**

```bash
cd /Users/s.alhazova/Documents/GitHub/Unit-school && npx tsc --noEmit 2>&1 | grep ObjectionsSlide
```

- [ ] **Step 3: Commit**

```bash
git add src/components/slides/ObjectionsSlide.tsx
git commit -m "feat: add ObjectionsSlide component"
```

---

## Chunk 3: Роутинг и данные

### Task 7: Подключить компоненты в `Slide.tsx`

**Files:**
- Modify: `src/components/slides/Slide.tsx`

- [ ] **Step 1: Добавить импорты** (после строки с `import { TgChatsSlide }`)

```ts
import { SearchSlide } from './SearchSlide'
import { NichesSlide } from './NichesSlide'
import { FunnelSlide } from './FunnelSlide'
import { ObjectionsSlide } from './ObjectionsSlide'
```

- [ ] **Step 2: Добавить типы в деструктуризацию импорта из `../../types`** (строка 1)

Дописать в конец списка импортов из types:
```ts
SearchContent, NichesContent, FunnelContent, ObjectionsContent
```

- [ ] **Step 3: Добавить case в switch** (после `case 'tgchats':`)

```ts
    case 'search':
      return <SearchSlide content={slide.content as SearchContent} />
    case 'niches':
      return <NichesSlide content={slide.content as NichesContent} />
    case 'funnel':
      return <FunnelSlide content={slide.content as FunnelContent} />
    case 'objections':
      return <ObjectionsSlide content={slide.content as ObjectionsContent} />
```

- [ ] **Step 4: Проверить TypeScript**

```bash
cd /Users/s.alhazova/Documents/GitHub/Unit-school && npx tsc --noEmit
```

Ожидаем: 0 ошибок.

- [ ] **Step 5: Commit**

```bash
git add src/components/slides/Slide.tsx
git commit -m "feat: wire up search/niches/funnel/objections in Slide switch"
```

---

### Task 8: Обновить `src/data/courses.ts`

**Files:**
- Modify: `src/data/courses.ts`

- [ ] **Step 1: Заменить секцию `unitpay-attraction`**

Найти блок с `id: 'unitpay-attraction'` и заменить его целиком:

```ts
{
  id: 'unitpay-attraction',
  icon: '🎯',
  title: 'Привлечение мерчантов',
  topics: [
    { id: 'search',     icon: '🔍', title: 'Поиск мерчантов',     lessonId: 'attraction-search' },
    { id: 'pitch',      icon: '💬', title: 'Питч и аргументы',     lessonId: 'attraction-pitch' },
    { id: 'funnel',     icon: '🗺️', title: 'Ведение партнёра',     lessonId: 'attraction-funnel' },
    { id: 'objections', icon: '🛡️', title: 'Отработка возражений', lessonId: 'attraction-objections' },
  ],
},
```

Убедиться что `comingSoon: true` удалён (если был).

- [ ] **Step 2: Проверить TypeScript**

```bash
cd /Users/s.alhazova/Documents/GitHub/Unit-school && npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/data/courses.ts
git commit -m "feat: expand unitpay-attraction to 4 topics"
```

---

### Task 9: Добавить уроки в `src/data/lessons.ts`

**Files:**
- Modify: `src/data/lessons.ts`

- [ ] **Step 1: Добавить урок `attraction-search`**

Вставить в конец файла (перед закрывающей `]`):

```ts
// ── Привлечение: Поиск мерчантов ─────────────────────────────
{
  id: 'attraction-search',
  title: 'Поиск мерчантов',
  tag: 'Привлечение',
  published: true,
  slides: [
    {
      id: 's1',
      type: 'welcome',
      content: {
        title: 'Поиск мерчантов',
        subtitle: 'Где искать потенциальных партнёров и как к ним подходить',
        emoji: '🔍',
      },
    },
    {
      id: 's2',
      type: 'search',
      hasInternalNav: true,
      content: {
        channels: [
          {
            icon: '🔍',
            title: 'Google / Яндекс',
            sub: 'Самый широкий канал — сотни проектов за час',
            sections: [
              {
                icon: '📌', label: 'Примеры запросов', color: '#3b82f6',
                items: ['купить ключ steam', 'подписка на курс онлайн', 'цифровые товары магазин', 'SaaS подписка оплата', 'VPN купить подписку', 'игровой магазин minecraft'],
              },
              {
                icon: '✅', label: 'На что смотришь', color: '#22c55e',
                items: [
                  'Сайт живой — свежий контент, отзывы, даты активности',
                  'Продают цифровой / виртуальный продукт или доступ к сервису',
                  'Есть контакт: email в футере, форма обратной связи, Telegram',
                ],
              },
            ],
            tip: '💡 Ищи сайты на 2–5 странице выдачи — трафик уже есть, но ещё не гигант. Проще выйти на ЛПР и договориться.',
            side: {
              title: '📝 Что фиксируешь',
              items: ['Сайт и ниша проекта', 'Что именно продают', 'Контакт: email / Telegram', 'Текущий способ оплаты на сайте'],
            },
          },
          {
            icon: '🤖',
            title: 'ChatGPT',
            sub: 'Быстро получить список проектов по нише — без ручного гугления',
            sections: [
              {
                icon: '📌', label: 'Как использовать', color: '#3b82f6',
                items: [
                  'Попроси ИИ: <em style="color:#15803d">«Дай список популярных русскоязычных магазинов игровых ключей / VPN-сервисов / платформ с курсами»</em>',
                  'Уточни нишу, гео и размер: <em style="color:#15803d">«небольшие и средние, работают в СНГ»</em>',
                  'Попроси ИИ составить первое холодное сообщение под конкретный проект',
                  'Используй как отправную точку — проверяй каждый сайт руками перед контактом',
                ],
              },
              {
                icon: '✅', label: 'Примеры запросов в ChatGPT', color: '#22c55e',
                items: ['топ магазины ключей steam рунет', 'список SaaS стартапов СНГ с подпиской', 'платформы онлайн-курсов Россия небольшие', 'VPN сервисы для русскоязычных'],
              },
            ],
            tip: '💡 ИИ не знает актуальных данных — используй его для списка идей и шаблонов сообщений, а не как источник контактов.',
            side: {
              title: '💡 Полезные промпты',
              items: [
                '«Напиши холодное письмо для [ниша] на подключение эквайринга»',
                '«Какие боли у владельцев [ниша] с онлайн-оплатой?»',
                '«Дай 10 примеров [ниша] проектов в СНГ»',
              ],
            },
          },
          {
            icon: '💬',
            title: 'Telegram',
            sub: 'Живые сообщества — владельцы проектов, быстрый выход на контакт',
            sections: [
              {
                icon: '📌', label: 'Где искать', color: '#3b82f6',
                items: [
                  'Чаты владельцев игровых серверов (Minecraft, CS:GO, MTA)',
                  'Каналы продавцов цифровых товаров: ключи, аккаунты, Gift Card',
                  'Чаты инфобизнеса, онлайн-курсов, коучинга',
                  'Группы разработчиков Telegram-ботов и Mini Apps',
                ],
              },
              {
                icon: '✅', label: 'Как подходить', color: '#22c55e',
                items: [
                  'Сначала читай — найди тех, кто жалуется на эквайринг или ищет провайдера',
                  'Пиши в личку, а не в общий чат. Коротко, без шаблонного текста',
                  'Ссылайся на конкретный их вопрос или проблему из чата',
                ],
              },
            ],
            tip: '💡 Мониторь запросы «кто использует», «посоветуйте провайдера», «проблемы с оплатой» — это тёплые лиды.',
            side: {
              title: '🎯 Топ-чаты для старта',
              items: [
                'Чаты владельцев Minecraft / CS серверов',
                'Digital goods sellers RU/CIS',
                'Инфобизнес и EdTech чаты',
                'Telegram Mini Apps разработчики',
              ],
            },
          },
          {
            icon: '📋',
            title: 'Каталоги',
            sub: 'Сайты-рейтинги, где проекты собраны в одном месте',
            sections: [
              {
                icon: '📌', label: 'Что такое каталог', color: '#3b82f6',
                items: [
                  '<strong>Рейтинги игровых серверов</strong> — сайты, где сотни серверов регистрируются для привлечения игроков. У каждого — сайт и контакт владельца',
                  '<strong>Маркеты цифровых товаров</strong> — Plati.ru, Funpay: продавцы цифровых товаров с магазинами и контактами',
                  '<strong>Каталоги стартапов и SaaS</strong> — vc.ru, Product Hunt: там публикуют новые проекты с сайтами и командой',
                ],
              },
              {
                icon: '✅', label: 'Как работать', color: '#22c55e',
                items: [
                  'Открываешь топ по нише — сразу список живых проектов с сайтами',
                  'Проверяешь каждый: есть ли оплата на сайте и контакт владельца',
                ],
              },
            ],
            tip: '💡 Wappalyzer — расширение для браузера, покажет CMS и платёжный провайдер прямо на сайте. Ставь и проверяй на лету.',
            side: {
              title: '📍 Примеры каталогов',
              items: [
                'Рейтинги игровых серверов по нише',
                'plati.ru / funpay.ru — цифровые товары',
                'vc.ru / Product Hunt — стартапы и SaaS',
              ],
            },
          },
          {
            icon: '🤝',
            title: 'Партнёры',
            sub: 'Веб-студии уже работают с нужными мерчантами — договорись о рефералах',
            sections: [
              {
                icon: '📌', label: 'Кто это', color: '#3b82f6',
                items: [
                  '<strong>Веб-студии</strong> — делают сайты и магазины для бизнеса. Их клиенты потенциально нужны нам',
                  '<strong>Разработчики Telegram-ботов</strong> — строят платёжные боты, им нужен эквайер',
                  '<strong>CMS-интеграторы</strong> — настраивают WooCommerce, OpenCart. Могут рекомендовать нас',
                ],
              },
              {
                icon: '✅', label: 'Как действуешь', color: '#22c55e',
                items: [
                  '<strong>Шаг 1 — первый диалог:</strong> выходишь на контакт, знакомишься, коротко рассказываешь кто мы и предлагаешь партнёрство',
                  '<strong>Шаг 2 — получил интерес:</strong> не договариваешься самостоятельно — согласовываешь условия с генеральным директором',
                  '<strong>Шаг 3 — поддерживай:</strong> напоминай о себе раз в месяц, держи связь',
                ],
              },
            ],
            tip: '💡 Один договорённый партнёр-студия может привести 3–10 мерчантов за квартал без дополнительных усилий с твоей стороны.',
            side: {
              title: '📋 Что предложить студии',
              items: [
                '% с оборота каждого приведённого мерча',
                'Готовые модули для CMS (WP, OpenCart)',
                'Поддержка при интеграции от нашей команды',
                'Быстрая связь с тех. поддержкой',
                'Совместный кейс для портфолио студии',
              ],
            },
          },
        ],
      },
    },
  ],
},
```

- [ ] **Step 2: Добавить урок `attraction-pitch`**

```ts
// ── Привлечение: Питч и аргументы ────────────────────────────
{
  id: 'attraction-pitch',
  title: 'Питч и аргументы',
  tag: 'Привлечение',
  published: true,
  slides: [
    {
      id: 's1',
      type: 'welcome',
      content: {
        title: 'Питч и аргументы',
        subtitle: 'Как говорить с мерчантами из разных ниш — скрипты и боли',
        emoji: '💬',
      },
    },
    {
      id: 's2',
      type: 'niches',
      hasInternalNav: true,
      content: {
        niches: [
          {
            id: 'gaming',
            emoji: '🎮',
            title: 'Игровые проекты',
            sub: 'Серверы, магазины привилегий, игровые товары',
            whoText: 'Владельцы игровых серверов (Minecraft, CS:GO, MTA) и магазинов игровых товаров. Ориентированы на молодую аудиторию.',
            whoTags: ['Minecraft', 'CS:GO', 'MTA', 'игровые ключи', 'VIP / привилегии'],
            pains: [
              'Карточные платежи — основной способ покупки привилегий, часто нет нормального эквайринга',
              'Высокий фрод и чарджбеки от игроков',
              'Нужны быстрые выплаты — игровой бизнес работает на высоком обороте',
            ],
            script: 'Привет! Я из Unitpay — увидел ваш сервер <span class="ph">[название]</span>, впечатляет комьюнити. Занимаемся эквайрингом специально для игровых проектов — помогаем с приёмом карт и снижением фрода. Можем обсудить условия под ваш оборот?',
            note: 'Упор на фрод и чарджбеки — для игровых это больная тема. Покажи что понимаешь специфику.',
            lifehack: 'Wappalyzer покажет текущий платёжный провайдер прямо на сайте — используй перед контактом.',
          },
          {
            id: 'digital',
            emoji: '💿',
            title: 'Цифровые товары',
            sub: 'Ключи, аккаунты, Gift Card, доступы к сервисам',
            whoText: 'Магазины цифровых товаров: Steam-ключи, аккаунты, Gift Card, доступы к стриминговым сервисам.',
            whoTags: ['Steam ключи', 'Gift Card', 'аккаунты', 'цифровые доступы'],
            pains: [
              'Нужны международные карты — покупатели часто из разных стран',
              'Высокий риск фрода — цифровые товары нельзя вернуть, чарджбеки критичны',
              'Проблемы с одобрением у банков — ниша считается рискованной',
            ],
            script: 'Привет! Я из Unitpay. Вижу что у вас большой каталог — <span class="ph">[деталь с сайта]</span>. Работаем с цифровыми магазинами: международные карты, защита от фрода, хорошее одобрение в вашей нише. Готов рассказать подробнее?',
            note: 'Международные карты и защита от фрода — главные аргументы. Не начинай с комиссии.',
          },
          {
            id: 'saas',
            emoji: '⚙️',
            title: 'SaaS и подписки',
            sub: 'Сервисы с подписной моделью, b2b и b2c инструменты',
            whoText: 'Владельцы SaaS-продуктов: аналитика, автоматизация, VPN, инструменты для бизнеса — всё что работает по подписке.',
            whoTags: ['подписки', 'b2b SaaS', 'VPN', 'API-сервисы', 'платформы'],
            pains: [
              'Нужны рекуррентные платежи — автосписание по подписке',
              'Хотят принимать оплату внутри Telegram-бота',
              'Международная аудитория — нужны карты Visa/MC без ограничений',
            ],
            script: 'Привет! Я из Unitpay — увидел ваш сервис <span class="ph">[название]</span>. У вас подписная модель — у нас есть рекуррентные платежи и оплата прямо в Telegram-боте. Это удобно для ваших пользователей. Интересно?',
            note: 'Рекуррентные платежи и Telegram-интеграция — ключевые аргументы для SaaS.',
          },
          {
            id: 'ecom',
            emoji: '🛒',
            title: 'Интернет-магазины',
            sub: 'E-commerce на CMS: WooCommerce, OpenCart, CS-Cart',
            whoText: 'Владельцы интернет-магазинов на популярных CMS. Часто используют устаревшие или дорогие решения для оплаты.',
            whoTags: ['WooCommerce', 'OpenCart', 'CS-Cart', 'e-commerce'],
            pains: [
              'Дорогой или нестабильный текущий эквайер',
              'Нет готового модуля под их CMS',
              'Нужна бесплатная онлайн-касса для 54-ФЗ',
            ],
            script: 'Привет! Я из Unitpay — вижу что у вас магазин на <span class="ph">[CMS]</span>. У нас готовый модуль для вашей платформы, бесплатная касса для 54-ФЗ и хорошие ставки. Поставить модуль — дело 15 минут. Интересно посмотреть?',
            note: 'Готовый модуль и бесплатная касса — конкретные выгоды, которые сразу снимают возражения.',
            lifehack: 'Wappalyzer покажет CMS сайта прямо в браузере — используй перед контактом чтобы упомянуть нужный модуль.',
          },
          {
            id: 'vk',
            emoji: '💙',
            title: 'VK-сообщества',
            sub: 'Продажи через VK Маркет, донаты, подписки в сообществах',
            whoText: 'Владельцы VK-сообществ с монетизацией: продажа товаров, донаты от подписчиков, платный контент.',
            whoTags: ['VK Маркет', 'донаты', 'VK Donut', 'платный контент'],
            pains: [
              'VK Donut берёт большую комиссию с донатов',
              'Хотят принимать оплату вне VK — своя страница или бот',
              'Нет удобного способа монетизировать аудиторию за пределами VK',
            ],
            script: 'Привет! Я из Unitpay — подписан на ваше сообщество <span class="ph">[название]</span>. Если хотите принимать донаты или оплату вне VK с меньшей комиссией чем VK Donut — у нас есть решение. Готов показать как это работает.',
            note: 'Сравнение с VK Donut работает хорошо — многие знают его комиссию и хотят альтернативу.',
          },
        ],
      },
    },
  ],
},
```

- [ ] **Step 3: Добавить урок `attraction-funnel`**

```ts
// ── Привлечение: Ведение партнёра ────────────────────────────
{
  id: 'attraction-funnel',
  title: 'Ведение партнёра',
  tag: 'Привлечение',
  published: true,
  slides: [
    {
      id: 's1',
      type: 'welcome',
      content: {
        title: 'Ведение партнёра',
        subtitle: 'Путь от первого контакта до первого оборота — каждый шаг',
        emoji: '🗺️',
      },
    },
    {
      id: 's2',
      type: 'funnel',
      hasInternalNav: true,
      content: {
        stages: [
          {
            emoji: '🔍', title: 'Нашёл потенциального мерчанта',
            sub: 'Нашёл проект — теперь собираешь информацию перед первым контактом',
            sections: [
              {
                icon: '📌', label: 'Что делаешь', color: '#60a5fa',
                content: `<div class="checklist"><div class="check-item"><div class="check-dot"></div><div class="check-text">Заходишь на сайт — смотришь что продают, какие способы оплаты принимают</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text">Оцениваешь трафик — есть ли живые пользователи (отзывы, активность, даты)</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text">Находишь контакт — email, Telegram, форма обратной связи</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text">Фиксируешь: сайт, ниша, что продают, текущие способы оплаты</div></div></div>`,
              },
            ],
            side: 'sources',
          },
          {
            emoji: '✉️', title: 'Написал первое сообщение',
            sub: 'D0 — первый контакт. Цель: получить ответ, не продать',
            sections: [
              {
                icon: '📝', label: 'Структура первого сообщения', color: '#22c55e',
                content: `<div class="checklist"><div class="check-item"><div class="check-dot"></div><div class="check-text">Кто ты — одно предложение, без воды</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text">Почему пишешь именно им — конкретная деталь с их сайта</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text">Одна конкретная польза — не список всего, одна главная</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text">Конкретный следующий шаг — что именно предлагаешь сделать дальше</div></div></div>`,
              },
              {
                icon: '⚠️', label: 'Частые ошибки', color: '#f87171',
                content: '«Предлагаем широкий спектр услуг» — слишком общее · Стена текста — читать не будут · Нет конкретного следующего шага · Написали один раз и ждут',
              },
            ],
            side: 'followup',
          },
          {
            emoji: '💬', title: 'Первое общение',
            sub: 'Цель: понять задачи мерча и заинтересовать, не продавать',
            sections: [
              {
                icon: '🗣️', label: 'О чём говоришь', color: '#22c55e',
                content: `<div class="checklist"><div class="check-item"><div class="check-dot"></div><div class="check-text">Что продают, какая аудитория и гео</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text">Как сейчас принимают оплату — какой провайдер, что не устраивает</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text">Какая главная боль: одобрение / комиссия / фрод / интеграция / выплаты</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text">Под конкретную боль — короткий питч с нашим решением</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text">Фиксируешь договорённость: что дальше и когда</div></div></div>`,
              },
              {
                icon: '💡', label: 'Главное правило', color: '#fbbf24',
                content: '<div class="tip-box">⚡ Сначала слушаешь — потом говоришь. Нельзя предложить правильное решение не зная задачи мерча</div>',
              },
            ],
            side: 'followup',
          },
          {
            emoji: '📋', title: 'Предложение',
            sub: 'Отправляешь конкретные условия и готовишь мерча к старту',
            sections: [
              {
                icon: '📤', label: 'Что отправляешь', color: '#60a5fa',
                content: `<div class="checklist"><div class="check-item"><div class="check-dot"></div><div class="check-text">Методы оплаты и примерные ставки под их оборот</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text">Демо-магазин — чтобы мерч увидел как выглядит наша форма оплаты</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text">Чеклист документов для подключения</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text">Слот для созвона с менеджером, если нужен</div></div></div>`,
              },
              {
                icon: '⏱️', label: 'Фиксируй договорённости', color: '#fbbf24',
                content: '<div class="tip-box">📌 После любого общения — сообщение с итогами и следующим шагом. Мерч должен чётко понимать что происходит и когда</div>',
              },
            ],
            side: 'followup',
          },
          {
            emoji: '🔌', title: 'Подключение',
            sub: 'От согласования до активного терминала — ведёшь мерча на каждом шаге',
            sections: [
              {
                icon: '🗓️', label: 'Процесс подключения', color: '#22c55e',
                content: `<div class="checklist"><div class="check-item"><div class="check-dot"></div><div class="check-text"><strong>Шаг 1</strong> — регистрация мерча, добавление проекта и загрузка документов. Лучше чтобы мерч сделал это сразу</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text"><strong>Шаг 2</strong> — наша СБ проверяет проект. Если нужны доработки — передаём мерчанту и контролируем</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text"><strong>Шаг 3</strong> — после полного одобрения направляем заявку в банк. Мониторим ответ, поторапливаем если нужно</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text"><strong>Шаг 4</strong> — терминал подключён. Сообщаем мерчу, помогаем с интеграцией, подключаем тех. специалиста если требуется</div></div></div>`,
              },
              {
                icon: '🤝', label: 'Ты ведёшь, не ждёшь', color: '#60a5fa',
                content: 'На каждом шаге — ты инициатор. Не ждёшь пока мерч сам разберётся или банк сам ответит. Напоминаешь, уточняешь, помогаешь.',
              },
            ],
            side: 'followup',
          },
          {
            emoji: '💰', title: 'Первый оборот',
            sub: 'Мерч подключён. Твоя задача — помочь ему запустить и вырасти',
            sections: [
              {
                icon: '📊', label: 'Что делаешь', color: '#22c55e',
                content: `<div class="checklist"><div class="check-item"><div class="check-dot"></div><div class="check-text"><strong>Ежедневно</strong> — проверяешь запустил ли мерч оборот, обязательно напоминаешь о себе</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text"><strong>После старта</strong> — отслеживаешь как проходят платежи, смотришь на одобрение и фрод</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text"><strong>Рост оборота</strong> — через время смотришь на динамику, предлагаешь мерчу его повышать, подталкиваешь к масштабу</div></div><div class="check-item"><div class="check-dot"></div><div class="check-text"><strong>Всегда на связи</strong> — отвечаешь быстро на вопросы. Хороший старт → доверие → долгосрочные отношения</div></div></div>`,
              },
              {
                icon: '🚀', label: 'Долгосрочная цель', color: '#a78bfa',
                content: 'Рост оборота мерча = твой результат. Держи связь не только когда есть проблемы — это партнёрство, а не разовая продажа.',
              },
            ],
            side: 'none',
          },
        ],
      },
    },
  ],
},
```

- [ ] **Step 4: Добавить урок `attraction-objections`**

```ts
// ── Привлечение: Отработка возражений ────────────────────────
{
  id: 'attraction-objections',
  title: 'Отработка возражений',
  tag: 'Привлечение',
  published: true,
  slides: [
    {
      id: 's1',
      type: 'welcome',
      content: {
        title: 'Отработка возражений',
        subtitle: 'Как отвечать на типичные возражения мерчантов',
        emoji: '🛡️',
      },
    },
    {
      id: 's2',
      type: 'objections',
      hasInternalNav: true,
      content: {
        objections: [
          {
            emoji: '😐',
            short: '«У нас уже есть провайдер»',
            title: '«У нас уже есть провайдер, всё устраивает»',
            why: 'Мерч не видит смысла менять то, что работает. Боится сложностей перехода.',
            reply: [
              'Написал именно вам, потому что ваш проект реально заинтересовал — не шаблонная рассылка.',
              'У нас сильная поддержка: живые люди, быстрые ответы, помогаем с техническими вопросами — не бросаем после подключения.',
              'Не предлагаю переходить прямо сейчас. Просто расскажи что сейчас болит — посмотрим, есть ли нам что предложить конкретно под вас.',
            ],
            script: 'Я написал именно вам — увидел <span class="ph">[конкретная деталь проекта]</span> и понял, что это как раз наша ниша. Не предлагаю переходить прямо сейчас. Просто хочу познакомиться — у нас <span class="ph">поддержка, которая реально отвечает</span>, и мы по-настоящему ценим каждого партнёра. Расскажите — что сейчас важнее всего в работе с вашим провайдером?',
            tip: 'Никаких ставок и цифр в этом возражении — мерч не про деньги, он про стабильность. Акцент: написал лично, ценим партнёров, поддержка живая.',
          },
          {
            emoji: '💸',
            short: '«У вас высокая комиссия»',
            title: '«У конкурентов дешевле / комиссия высокая»',
            why: 'Мерч смотрит только на цифру в прайсе, не видит полной картины — ни одобрения, ни поддержки, ни гибкости условий.',
            reply: [
              'Комиссия снижается по мере роста оборота — обычно это происходит примерно через 2 месяца работы.',
              'Но ваш проект меня реально заинтересовал — я готов обсудить снижение уже сейчас, напрямую с генеральным директором.',
              'И кроме ставок у нас есть многое другое: высокое одобрение, живая поддержка, помощь с интеграцией, международные методы — это тоже влияет на итоговый доход.',
            ],
            script: 'Комиссия у нас стандартно снижается при росте оборота — обычно это вопрос пары месяцев работы. Но ваш проект меня очень заинтересовал, поэтому я готов <span class="ph">обсудить снижение сейчас с генеральным директором</span> — ещё до старта. И отдельно скажу: помимо ставки у нас <span class="ph">высокое одобрение, живая поддержка и помощь с интеграцией</span> — это тоже деньги, просто не в строке «комиссия».',
            tip: 'Сначала — конкретный оффер (готов идти к ГД ради них). Потом — расширь картину: мерч считает только ставку, а надо считать всё.',
          },
          {
            emoji: '🔧',
            short: '«Сложно интегрировать»',
            title: '«Сложно интегрировать / нет ресурсов на переход»',
            why: 'Мерч боится потратить время разработчика и столкнуться с проблемами.',
            reply: [
              'У нас готовые модули для популярных CMS: WooCommerce, OpenCart, CS-Cart.',
              'Если своей разработки нет — наша команда помогает с интеграцией.',
              'Для Telegram-ботов и кастомных решений — подробная документация и живая поддержка.',
            ],
            script: 'Понимаю, интеграция — это время. Под вашу платформу у нас уже есть <span class="ph">готовый модуль / пример кода</span>. Наш технический специалист может подключиться и помочь — это бесплатно. Сколько у вас обычно занимает подключение нового сервиса?',
            tip: 'Конкретизируй: не «мы поможем», а «у нас готовый модуль для вашей CMS» или «наш спец созвонится с вашим разработчиком».',
          },
          {
            emoji: '🤔',
            short: '«Не знаем вас / мало информации»',
            title: '«Не слышали о вас / мало знаем»',
            why: 'Мерч не готов рисковать деньгами с незнакомым провайдером.',
            reply: [
              'Мы работаем с 2014 года, обрабатываем платежи для тысяч проектов в СНГ.',
              'Специализируемся на нишах: игры, цифровые товары, SaaS, инфобизнес.',
              'Могу показать кейсы схожих проектов — чтобы было понятно как это работает у других.',
            ],
            script: 'Unitpay работает с 2014 года — мы специализируемся именно на <span class="ph">вашей нише</span>. Могу прислать пару кейсов похожих проектов, чтобы было понятно что мы умеем. И демо-магазин — посмотрите как выглядит форма оплаты у ваших пользователей.',
            tip: 'Не перечисляй факты списком. Предложи конкретный следующий шаг — кейс или демо. Это лучше слов.',
          },
          {
            emoji: '📄',
            short: '«Много документов для подключения»',
            title: '«Слишком много документов / долго подключаться»',
            why: 'Мерч не хочет тратить время на бумаги и боится бюрократии.',
            reply: [
              'Документы нужны один раз — дальше всё работает автоматически.',
              'Стандартный пакет: паспорт, ИП/ООО документы, описание проекта.',
              'Я помогаю на каждом шаге — что загрузить, как заполнить, что ответить СБ.',
            ],
            script: 'Да, документы нужны для банка — это стандарт для любого эквайера. Но это один раз. Я пришлю вам <span class="ph">чеклист на 5 пунктов</span> — большинство проектов собирают всё за день. И буду рядом если что-то непонятно.',
            tip: 'Сними страх конкретикой: «5 документов», «один раз», «я помогу». Абстрактное «несложно» не работает.',
          },
          {
            emoji: '🚫',
            short: '«Боимся блокировки / не пройдём СБ»',
            title: '«Боимся что СБ заблокирует / не одобрит наш проект»',
            why: 'Мерч слышал истории о блокировках и не хочет тратить время зря.',
            reply: [
              'Честный ответ: расскажи что именно продают и мы сразу скажем проходит ли ниша.',
              'Лучше узнать заранее, чем потратить время на документы и получить отказ.',
              'Есть чёткий список ниш которые мы не подключаем — если ваша не в нём, всё хорошо.',
            ],
            script: 'Давайте проверим сразу — расскажите коротко что продаёте и какая аудитория. Я скажу входит ли это в наши разрешённые ниши. <span class="ph">Честный ответ сразу</span> лучше, чем тратить время и потом получить отказ.',
            tip: 'Не обещай одобрение заранее. Предложи быструю проверку — это снимает неопределённость и показывает честность.',
          },
        ],
      },
    },
  ],
},
```

- [ ] **Step 5: Проверить TypeScript**

```bash
cd /Users/s.alhazova/Documents/GitHub/Unit-school && npx tsc --noEmit
```

Ожидаем: 0 ошибок.

- [ ] **Step 6: Запустить dev-сервер и проверить визуально**

```bash
cd /Users/s.alhazova/Documents/GitHub/Unit-school && npm run dev
```

Открыть в браузере: перейти в Middle AM → Привлечение мерчантов.  
Проверить каждую из 4 тем:
- Поиск мерчантов: 5 табов переключаются, боковая карточка меняется
- Питч и аргументы: 5 ниш слева, детальная панель справа открывается
- Ведение партнёра: пайплайн кликается, этапы переключаются, фолоу-апы и источники в боковой панели
- Отработка возражений: 6 карточек слева, детальная панель справа с «Почему говорит», «Логика ответа», скрипт, совет
- `overflow: hidden` на корне каждого слайда — нет скролла внутри слайда

- [ ] **Step 7: Commit**

```bash
git add src/data/lessons.ts src/data/courses.ts
git commit -m "feat: add attraction-search, attraction-pitch, attraction-funnel, attraction-objections lessons"
```

---

### Task 10: Финальная проверка

- [ ] **Step 1: Полный TypeScript-чек**

```bash
cd /Users/s.alhazova/Documents/GitHub/Unit-school && npx tsc --noEmit
```

Ожидаем: 0 ошибок.

- [ ] **Step 2: Проверить что старые уроки не сломались**

В dev-сервере пройтись по нескольким урокам Junior AM и Middle AM — убедиться что переключение слайдов работает, стили не поехали.

- [ ] **Step 3: Финальный коммит**

```bash
git add -A
git commit -m "feat: complete attraction merchants section with 4 topics and 4 new slide types"
```
