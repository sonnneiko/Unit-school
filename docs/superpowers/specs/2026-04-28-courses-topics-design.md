# Design: Courses → Section → Topic flow

## Goal
Split "Основы UnitPay" (and future sections) into individual topic lessons with their own progress. User navigates: Courses page → Section page → Lesson slides.

## Data Model

### New `Topic` type (replaces `string[]` topics + `lessonIds`)
```ts
type Topic = {
  id: string
  icon: string
  title: string
  lessonId: string
}

type Section = {
  id: string
  icon: string
  title: string
  topics: Topic[]
  comingSoon?: boolean
}
```

### New lesson IDs for "Основы UnitPay"
| lessonId | Title |
|---|---|
| `unitpay-basics-team` | Команда |
| `unitpay-basics-about` | UnitPay |
| `unitpay-basics-methods` | Методы приёма |
| `unitpay-basics-path` | Путь платежей |
| `unitpay-basics-acquiring` | Эквайринг |
| `unitpay-basics-netting` | Неттинг |
| `unitpay-basics-entities` | Юридические и физические лица |
| `unitpay-basics-cash` | Касса |
| `unitpay-basics-vendors` | Поставщики |

No `finish` slides — lesson completes when user reaches the last slide.

## Routing
- `/courses/:sectionId` → `SectionPage`
- CoursesPage section cards become `<Link to="/courses/:sectionId">`
- Back from SectionPage → `/` (Courses)
- Back from Lesson → `/courses/:sectionId`

## SectionPage
- Header: "← Назад" + section title
- List of topic cards: icon + title + progress bar
- Status logic: same as CoursesPage (locked until previous complete)
- Click → `/lesson/:lessonId`
- No status badge; only progress bar (0–100%)

## CoursesPage changes
- Section cards: chips remain (from `topic.title`), card becomes clickable link
- Section progress = completed topics / total topics
- Remove `lessonIds` field

## Lesson changes
- `LessonPage` back button → navigate to `/courses/:sectionId` (derive from lesson ID prefix)
- When on last slide and user clicks Next → navigate back to section page

## Content per lesson (slides from existing day-1)
- `unitpay-basics-team`: welcome + tabs(team)
- `unitpay-basics-about`: info(UnitPay intro)
- `unitpay-basics-methods`: info(payment methods)
- `unitpay-basics-path`: diagram(payment path)
- `unitpay-basics-acquiring`: info(acquiring)
- `unitpay-basics-netting`: info(netting)
- `unitpay-basics-entities`: info(legal entities)
- `unitpay-basics-cash`: info(online cash)
- `unitpay-basics-vendors`: tabs(vendors)

## Files changed
- `src/types/index.ts` — add `Topic` type, update `Section`
- `src/data/lessons.ts` — remove `day-1..8`, add 9 new lessons
- `src/utils/level.ts` — update `computeLevel` and `LESSON_BLOCK_TITLE`
- `src/pages/Courses/CoursesPage.tsx` — update LEVELS data + card as Link
- `src/pages/Section/SectionPage.tsx` — new file
- `src/pages/Section/SectionPage.module.css` — new file
- `src/pages/Lesson/Lesson.tsx` — back button → section, next on last slide → section
- `src/App.tsx` — add `/courses/:sectionId` route
