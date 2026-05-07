# Spec: Секция «Привлечение мерчантов» — 4 темы

**Дата:** 2026-05-07  
**Статус:** Approved

## Контекст

Секция `unitpay-attraction` в курсе Middle AM сейчас скрыта (`comingSoon: true`) и содержит 2 темы-заглушки. Нужно заменить на 4 реальных темы с новыми типами слайдов. Тема «Партнёрская программа» отложена — будет добавлена позже.

## Изменения в данных

### `src/data/courses.ts`

Секция `unitpay-attraction` — заменить на 4 темы, убрать `comingSoon`:

```ts
{
  id: 'unitpay-attraction',
  icon: '🎯',
  title: 'Привлечение мерчантов',
  topics: [
    { id: 'search',     icon: '🔍', title: 'Поиск мерчантов',      lessonId: 'attraction-search' },
    { id: 'pitch',      icon: '💬', title: 'Питч и аргументы',      lessonId: 'attraction-pitch' },
    { id: 'funnel',     icon: '🗺️', title: 'Ведение партнёра',      lessonId: 'attraction-funnel' },
    { id: 'objections', icon: '🛡️', title: 'Отработка возражений',  lessonId: 'attraction-objections' },
  ],
}
```

### `src/data/lessons.ts`

Добавить 4 новых урока. Структура каждого — массив слайдов.

**attraction-search** — welcome + один слайд типа `search`  
**attraction-pitch** — welcome + один слайд типа `niches`  
**attraction-funnel** — welcome + один слайд типа `funnel`  
**attraction-objections** — welcome + один слайд типа `objections`

## Новые типы слайдов

### 1. `search` — Поиск мерчантов

Интерактивный слайд с табами по каналам поиска. Каждый таб — канал с основной панелью (заголовок, секции с точками, подсказка) и боковой карточкой.

**Каналы (5 табов):** Google/Яндекс, ChatGPT, Telegram, Каталоги, Партнёры.

```ts
interface SearchSlideContent {
  channels: {
    icon: string
    title: string
    sub: string
    sections: { icon: string; label: string; color: string; items: string[] }[]
    tip: string
    side: { title: string; items: string[] }
  }[]
}
```

**Компонент:** `src/components/slides/SearchSlide.tsx`

---

### 2. `niches` — Питч и аргументы

Интерактивный слайд с карточками ниш слева и детальной панелью справа. Клик на нишу разворачивает: целевая аудитория, боли, скрипт первого сообщения, лайфхак.

**Ниши (5):** Gaming, Digital, SaaS, E-com, VK-сообщества.

```ts
interface NichesSlideContent {
  niches: {
    emoji: string
    title: string
    sub: string
    whoText: string
    whoTags: string[]
    pains: string[]
    script: string        // HTML со span.ph для подсказок
    note: string
    lifehack?: string
  }[]
}
```

**Компонент:** `src/components/slides/NichesSlide.tsx`

---

### 3. `funnel` — Ведение партнёра

Интерактивный слайд с горизонтальным пайплайном (6 этапов) и детальной панелью. Клик на этап показывает: заголовок, подзаголовок, секции с точками, и боковую панель (фолоу-апы или источники).

**Этапы:** Нашёл → Написал → Общение → Предложение → Подключение → Оборот.

```ts
interface FunnelSlideContent {
  stages: {
    emoji: string
    title: string
    sub: string
    sections: { icon: string; label: string; color: string; content: string }[]
    side: 'followup' | 'sources' | 'none'
  }[]
}
```

**Компонент:** `src/components/slides/FunnelSlide.tsx`

---

### 4. `objections` — Отработка возражений

Интерактивный слайд: список возражений слева, детальная панель справа. Панель содержит: почему мерч так говорит, логика ответа (3 шага), скрипт с подсказками, жёлтая плашка-совет.

**Возражения (6):**
1. «У нас уже есть провайдер»
2. «У вас высокая комиссия»
3. «Сложно интегрировать»
4. «Не знаем вас»
5. «Много документов»
6. «Боимся блокировки»

```ts
interface ObjectionsSlideContent {
  objections: {
    emoji: string
    short: string         // текст карточки слева
    title: string         // заголовок детальной панели
    why: string           // почему мерч так говорит
    reply: string[]       // 3 шага логики ответа
    script: string        // HTML со span.ph
    tip: string           // жёлтая плашка
  }[]
}
```

**Компонент:** `src/components/slides/ObjectionsSlide.tsx`

---

## Файлы к изменению

| Файл | Что делать |
|------|------------|
| `src/types/index.ts` | Добавить `'search' \| 'niches' \| 'funnel' \| 'objections'` в `SlideType`; добавить 4 интерфейса контента; добавить в union `Slide['content']` |
| `src/components/slides/Slide.tsx` | Импорт 4 компонентов + 4 case в switch |
| `src/components/slides/SearchSlide.tsx` | Новый компонент |
| `src/components/slides/NichesSlide.tsx` | Новый компонент |
| `src/components/slides/FunnelSlide.tsx` | Новый компонент |
| `src/components/slides/ObjectionsSlide.tsx` | Новый компонент |
| `src/components/slides/slides.module.css` | CSS-классы для 4 компонентов (светлая тема) |
| `src/data/courses.ts` | Обновить секцию `unitpay-attraction` |
| `src/data/lessons.ts` | Добавить 4 урока с данными |

## Дизайн-токены (светлая тема)

Все новые слайды используют светлую тему платформы:

- Фон слайда: `#f5f5f5` (`--color-bg`)
- Поверхность карточек: `#ffffff` (`--color-surface`)
- Рамки: `#e5e7eb`
- Заголовки секций: `#f3f4f6` bg + `#e5e7eb` border
- Текст основной: `#1a1a1a`
- Текст вторичный: `#4b5563` / `#6b7280`
- Акцент: `#22c55e` (`--color-brand`), активные состояния: `#dcfce7` bg + `#22c55e` border
- Подсказки `ph`: `#15803d` + `rgba(34,197,94,.1)` bg

## Ограничения

- Все слайды: `overflow: hidden` на корневом элементе (без скролла внутри слайда)
- CSS Modules — проверять что хэши классов применяются корректно
- Данные слайдов — в `src/data/lessons.ts`, не в компонентах
