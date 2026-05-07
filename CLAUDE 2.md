# CLAUDE.md

## Communication

Always respond in Russian unless explicitly asked otherwise.

## Workflow Efficiency

Avoid running unnecessary reviews, audits, or test runs unless explicitly requested. Be token-conscious - don't re-read files you've already seen this session.

## Code Editing

When implementing UI changes, check ALL files where the affected component/data appears - lesson titles, status badges, and section configs often live in multiple places.

When adding a new slide type, update ALL of these:
1. `src/types/index.ts` — добавить тип в `SlideType`, интерфейс контента, добавить в `Slide.content` union
2. `src/components/slides/Slide.tsx` — импорт компонента + case в switch
3. `src/components/slides/<NewSlide>.tsx` — сам компонент
4. `src/components/slides/slides.module.css` — CSS-классы
5. `src/data/lessons.ts` — данные

## Styling / CSS

When using CSS Modules, verify class hashing isn't preventing styles from applying. Test the visual output before declaring the task done.

Full-screen slides должны использовать `overflow: hidden`, не `overflow-y: auto` — иначе появляется скролл внутри слайда.

Progress bar (`.bar`) всегда должен иметь `overflow: hidden`, а ширина fill — `Math.min(100, ...)%` чтобы не выходила за 100%.

## Courses / Navigation

`comingSoon: true` на уровне `CourseLevel` скрывает ВСЕ секции и показывает заглушку. Чтобы показать секции со статусом "скоро", ставить `comingSoon: true` только на конкретную `Section`, не на весь уровень.

Deep-link в конкретный таб урока: `startTab?: number` в `Topic` → передаётся через `location.state.initialTab` → `AcquiringSlide` (и другие tab-слайды) читают через `initialTab` prop.

## Deployment

Project deployment: use Yandex Cloud VM with systemd autostart. Excluded chat IDs and SSH/deployment details are documented in DEPLOYMENT.md - read it before any deploy task.

## Assets / File Naming

Use Latin filenames only for static assets - Cyrillic filenames break on GitHub Pages.
Exception: `/public/vendors/` — логотипы банков с кириллическими именами, загружены пользователем вручную; не переименовывать.
