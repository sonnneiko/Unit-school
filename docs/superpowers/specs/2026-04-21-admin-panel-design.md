# Admin Panel Redesign — Design Spec
Date: 2026-04-21

## Overview

Redesign the admin panel from a single-page table view into a multi-page management system with three main areas: employees, employee details, and course management. All data is mock-based; no backend. Mutations update shared React state (via context), not the imported mock constants directly.

## Routing Structure

```
/admin                → redirect to /admin/users
/admin/users          → UsersListPage
/admin/users/new      → NewUserPage
/admin/users/:id      → UserDetailPage
/admin/courses        → CoursesListPage
/admin/courses/:id    → CourseDetailPage
```

### App.tsx nested route structure

```tsx
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Navigate to="/admin/users" replace />} />
    <Route path="users" element={<UsersListPage />} />
    <Route path="users/new" element={<NewUserPage />} />
    <Route path="users/:id" element={<UserDetailPage />} />
    <Route path="courses" element={<CoursesListPage />} />
    <Route path="courses/:id" element={<CourseDetailPage />} />
  </Route>
</Route>
```

`AdminLayout` is a thin wrapper component that renders breadcrumbs + `<Outlet />`. `AdminRoute` continues to guard by role.

## Shared State (Context)

### UsersContext

Holds the users array and passwords map. **`UsersProvider` wraps `AuthProvider`** in `App.tsx`, so that `AuthContext.login` can be refactored to read from `UsersContext` state instead of the frozen `mockUsers`/`mockPasswords` constants. This ensures email/password changes made by the admin are reflected at login.

```ts
interface UsersContextValue {
  users: User[]
  passwords: Record<string, string>  // keyed by userId, not email
  addUser: (user: User, password: string) => void
  updateUser: (id: string, patch: Partial<User>) => void
  updatePassword: (id: string, newPassword: string) => void  // keyed by userId
}
```

Initial values: `mockUsers` and a userId-keyed version of `mockPasswords` (converted on init: `{ 'user-1': 'password123', 'admin-1': 'admin123' }`).

`AuthContext.login` is updated to look up the user by email from `UsersContext.users`, then verify the password from `UsersContext.passwords[user.id]`.

### LessonsContext

Holds the lessons array. Provided at the root alongside `UsersContext`, so that published-status changes in the admin panel are reflected on the user-facing Dashboard without a page reload.

```ts
interface LessonsContextValue {
  lessons: Lesson[]
  togglePublished: (id: string) => void
}
```

Initial value: `mockLessons`.

## Progress Calculation

A user's progress on a lesson is stored in `user.progress` as `Record<lessonId, slideIndex>` (0-based). Completion percentage is calculated using `calcProgress(slideIndex, totalSlides)` from `src/components/slides/slideUtils.ts`.

**Completion threshold (for "Прошли" count):** A user is considered to have completed a course when `slides.length > 1` AND `progress[lessonId] >= lesson.slides.length - 1`. Lessons with 0 or 1 slides are never counted as completed.

**Display percentage:** Use `calcProgress(slideIndex, totalSlides)` for rendering progress bars. Note: `calcProgress` returns 0 for `totalSlides <= 1` — this is acceptable for the mock scope and consistent with the completion threshold above.

## Pre-implementation Steps

Before building the pages, these foundational changes must be done first:

1. **Add `photo?: string` to the `User` interface** in `src/types/index.ts`. Existing mock users in `src/data/users.ts` do not need updating (they simply have no photo).
2. **Extract `<ProgressBar>`** from `LessonCard` into `src/components/ProgressBar/ProgressBar.tsx`.
3. **Create `UsersContext`** in `src/context/UsersContext.tsx` and provide it at the root in `App.tsx`.
4. **Create `LessonsContext`** in `src/context/LessonsContext.tsx` and provide it at the root in `App.tsx`.
5. **Create `AdminLayout`** in `src/pages/Admin/AdminLayout.tsx` with breadcrumbs and `<Outlet />`.
6. **Update `App.tsx`** to use the nested route structure above.

## Components

### ProgressBar

File: `src/components/ProgressBar/ProgressBar.tsx`

```ts
interface ProgressBarProps {
  value: number       // 0–100
  showLabel?: boolean // whether to render the "XX%" text label; default true
  className?: string  // optional override for outer container
}
```

Renders a bar div + optional label span. Extracted from existing `LessonCard` styles.

### SettingsModal

Reusable modal for editing a single user's email, password, and role. Does **not** include photo editing. Used in both `UsersListPage` (per-row gear) and `UserDetailPage` (header gear).

## Pages

### 1. UsersListPage `/admin/users`

**Table columns:** Имя, Email, Роль, Последняя активность

- Shows only users with role `user` (admins are hidden)
- Clicking a user's name navigates to `/admin/users/:id`
- Gear icon (⚙) at the end of each row opens `SettingsModal` for that user (edit email, password, role)
- Role is changed only through `SettingsModal` — no inline dropdown in the table
- Button "+ Добавить сотрудника" at the bottom navigates to `/admin/users/new`
- Empty state: if no non-admin users exist, show "Нет сотрудников"

### 2. NewUserPage `/admin/users/new`

Form fields:
- Имя (first name)
- Фамилия (last name)
- Email
- Пароль
- Роль (select: Сотрудник / Администратор)
- Фото (file upload — stored as base64 string via `FileReader.readAsDataURL`)

Buttons: "Создать" (submit) and "Отмена" (navigates back to `/admin/users`).

On submit: generates a new `id` using `crypto.randomUUID()`, calls `addUser` from `UsersContext`, then navigates to `/admin/users`.

### 3. UserDetailPage `/admin/users/:id`

- If `:id` does not match any user: show "Пользователь не найден" with a back link to `/admin/users`
- Header: avatar (`user.photo` as `<img>` or a default grey placeholder), name, email, role, last active date
- Gear icon (⚙) in top-right corner opens `SettingsModal` (edit email, password, role — no photo)
- Course progress section: list of all published lessons from `LessonsContext` with `<ProgressBar>` and % per lesson
  - Use `calcProgress` for each lesson; 0% if no entry in `user.progress` or lesson has 0 slides

### 4. CoursesListPage `/admin/courses`

**Table columns:** Название, Слайдов, Прошли (count of users who completed), Статус

- "Прошли" computed from `UsersContext` users using the completion threshold above
- Status is a toggle button calling `togglePublished` from `LessonsContext`
- Clicking course name navigates to `/admin/courses/:id`
- Empty state: if no lessons exist, show "Нет курсов"

### 5. CourseDetailPage `/admin/courses/:id`

- If `:id` does not match any lesson: show "Курс не найден" with a back link to `/admin/courses`
- Header: title, tag, status badge, slide count
- Slide list: each slide's type + first line of content as a summary
- Employee progress table: name, `<ProgressBar>`, % completion (from `UsersContext`)

## Out of Scope

- Real backend / database persistence
- Bulk user actions
- Course creation or slide editing from admin panel
- Email sending or notifications
- Photo editing after user creation
