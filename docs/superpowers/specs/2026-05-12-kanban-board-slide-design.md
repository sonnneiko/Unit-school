# Спецификация: слайды «Взаимодействие с техническим отделом» (Задачи ПМ)

## Контекст

Новая тема в секции «Технические аспекты и интеграция» → топик «Взаимодействие с техническим отделом» (lessonId: `technical-tech`). Урок объясняет как аккаунт-менеджеры взаимодействуют с ПМами через канбан-доску Задачи ПМ в Teamly.

## Структура: 4 слайда

### Слайд 1 — Введение + чеклист

**Тип:** новый вариант `'intro'` внутри нового типа слайда `kanban`  
**Лейаут:** два столбца (как `RecurringSlide`) — `recurringFull`  
- Левый столбец: тег «Account + PM», заголовок «Доска Задачи ПМ», описание назначения доски, 3 буллита  
- Правый столбец: «Перед созданием карточки» — 3 нумерованных шага в карточках

**Данные:**
- Eyebrow: `Account + PM`
- Title: `Доска Задачи ПМ`
- Description: `Для запросов от отдела аккаунтов к техническому отделу по операционным кейсам используется канбан-доска Задачи ПМ в пространстве Account + PM.`
- Bullets: разобраться в ситуации / проверить самостоятельно / запросить информацию у мерчанта
- Checklist (правый столбец):
  1. Разобраться в ситуации мерчанта
  2. Проверить: можно ли решить без ПМа (база знаний, коллеги, шаблоны)
  3. Запросить у мерчанта всю нужную информацию (№ проекта, платежа, скриншот)

---

### Слайд 2 — Интерактивная канбан-доска

**Тип:** вариант `'board'`  
**Лейаут:** новый CSS-класс `kanbanFull` — полный экран, два столбца  
- Левый (flex: 1): тёмная Teamly-доска (`background: #2c2c3e`), горизонтальные колонки, реальные карточки  
- Правый (фиксированная ширина ~280px): светлая панель с описанием выбранной колонки

**Интерактивность:** клик по заголовку колонки — подсвечивает её и показывает описание справа  
**По умолчанию:** первая колонка активна при открытии слайда

**Колонки (7 штук):**

| id | badge | badgeColor | step | who | desc | hint |
|----|-------|-----------|------|-----|------|------|
| take | Взять в работу | red | 1 | АМ | АМ создал карточку с запросом от партнёра | Убедись, что разобрался в ситуации и проверил базу знаний |
| wip | В работе | blue | 2 | ПМ | ПМ взял карточку в работу | Не пиши в личку — ПМ уже работает |
| clarify | Требует уточнений | yellow | 3 | АМ | ПМ запросил доп. информацию — оставил комментарий | Проверь комментарий и предоставь информацию как можно быстрее |
| done | Готово | green | 4 | ПМ | ПМ полностью отписался по решению | Прочитай ответ ПМа и перешли мерчанту |
| processed | Обработано аккаунтингом | teal | 5 | АМ | АМ оповестил мерчанта и перевёл карточку | Финальная колонка — только после оповещения мерчанта |
| vendor | У вендора | gray | — | ПМ | ПМ ожидает ответа от вендора | Может занять несколько дней — не торопи |
| waiting | В ожидании (долгое) | purple | — | ПМ | ПМ ожидает решения долгое время | Если срочно — пиши в чат Взаимодействие Аккаунтинг \| PM |

**Пример карточек в слайде:**
- «В работе»: `696845 / 445293 interplay-rp.com тестовый платёж` — Волкова Елена
- «В ожидании»: `Некорректно отображается идентификатор клиента в разделе товары` — Долженкова Оксана
- «Готово»: `698506 пожелание по документации обработчика` — Долженкова Оксана

---

### Слайд 3 — Правила оформления карточек

**Тип:** вариант `'rules'`  
**Лейаут:** два столбца (как RecurringSlide)  
- Левый: заголовок «Правила оформления», описание формата темы, тёмные примеры карточек (стиль Teamly)  
- Правый: правила тела карточки (4 буллита) + предупреждение «без эмоций»

**Данные:**
- Format: `ID партнёра / проекта / № платежа + краткое описание`
- Примеры названий:
  - `444399 / не проходят не РФ платежи`
  - `691690 / проблемы с выплатами Платио`
  - `695078 / вопрос по интеграции`
  - `2177324699 / платеж в ожидании`
- Правила тела: подробный кейс / данные для проверки / скриншоты если нужны / проведённая аналитика
- Warning: `В карточке не должно быть лишней эмоционально окрашенной информации по ситуации.`

---

### Слайд 4 — Срочные вопросы и личные сообщения

**Тип:** вариант `'communication'`  
**Лейаут:** два столбца  
- Левый: блок «Срочный вопрос» (иконка ⚡ + текст про Telegram-чат) + разделитель + блок «Личные сообщения» (✓/✗ правила)  
- Правый: пример сообщения в Telegram-чат (тёмный стиль)

**Данные:**
- Title: `Срочные вопросы и личные сообщения`
- Urgent: чат `Взаимодействие Аккаунтинг | PM`, тегнуть ПМа, подробно описать
- DM правила:
  - ✓ Уточнение формулировки по карточке
  - ✗ Все остальные рабочие вопросы — только в карточке или общем чате
- exampleMessages (два примера):
  1. `@Alhazova_UnitPay @Deeva_Unitpay Срочная карточка.\nУ мерчанта 66666 перестали проходить платежи, каскад не сработал. Помогите разобраться. Ссылка на карточку: https://unitpay.teamly.ru/СуперСрочнаяКарточка`
  2. `@Alhazova_UnitPay @Deeva_Unitpay Пользователи массово обращаются с проблемами по недоступности оплаты и нашего сайта. Срочно посмотрите пожалуйста что случилось.`

---

## Новый тип слайда: `kanban`

### Добавить в `src/types/index.ts`

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

### Добавить в union `Slide.content`

В существующий тип `Slide['content']` добавить все четыре варианта.

### `SlideType`

Добавить `'kanban'` в enum/union `SlideType`.

---

## CSS

Новые классы в `slides.module.css`:

- `kanbanFull` — flex, height: 100%, overflow: hidden (аналог `tgFull`)
- `kanbanBoard` — flex: 1, background: #2c2c3e, flex-direction: column
- `kanbanBoardHeader` — padding, border-bottom rgba белого
- `kanbanCols` — flex, gap, overflow-x: auto, padding
- `kanbanCol` — flex: 1, flex-direction: column, cursor: pointer
- `kanbanColHeader` — border-radius, padding, transition, border (active highlight)
- `kanbanColBadge` — базовый класс бейджа
- `kanbanBadgeRed`, `kanbanBadgeBlue`, `kanbanBadgeYellow`, `kanbanBadgeGreen`, `kanbanBadgeTeal`, `kanbanBadgeGray`, `kanbanBadgePurple` — цветные модификаторы бейджей колонок
- `kanbanCard` — background: #3a3a50, border-radius, padding
- `kanbanDetail` — width: 280px, background: white, flex-direction: column
- `kanbanDetailTop`, `kanbanDetailBody`, `kanbanDetailHint` — панель описания
- `kanbanStepNum` — circle badge с цветом

---

## Данные в `src/data/lessons.ts`

Урок `technical-tech` создаётся в `lessons.ts` с `published: true` и 4 слайдами типа `kanban` с вариантами `intro`, `board`, `rules`, `communication`.

---

## Файлы к изменению

1. `src/types/index.ts`
2. `src/components/slides/Slide.tsx`
3. `src/components/slides/KanbanSlide.tsx` (новый)
4. `src/components/slides/slides.module.css`
5. `src/data/lessons.ts`
