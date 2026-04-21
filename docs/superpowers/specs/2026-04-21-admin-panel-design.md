# Admin Panel Redesign — Design Spec
Date: 2026-04-21

## Overview

Redesign the admin panel from a single-page table view into a multi-page management system with three main areas: employees, employee details, and course management.

## Routing Structure

```
/admin                → redirect to /admin/users
/admin/users          → UsersListPage
/admin/users/new      → NewUserPage
/admin/users/:id      → UserDetailPage
/admin/courses        → CoursesListPage
/admin/courses/:id    → CourseDetailPage
```

Routes are protected by the existing `AdminRoute` component.

## Pages

### 1. UsersListPage `/admin/users`

**Table columns:** Имя, Email, Роль, Последняя активность

- Shows only users with role `user` (admins are hidden)
- Clicking a user's name navigates to `/admin/users/:id`
- Gear icon (⚙) at the end of each row opens a modal to edit: email, password, role
- Role can be changed inline via a dropdown in the table row
- Button "+ Добавить сотрудника" at the bottom navigates to `/admin/users/new`

### 2. NewUserPage `/admin/users/new`

Form fields:
- Имя (first name)
- Фамилия (last name)
- Email
- Пароль
- Роль (select: Сотрудник / Администратор)
- Фото (file upload)

On submit: adds user to `mockUsers` and `mockPasswords`, redirects to `/admin/users`.

### 3. UserDetailPage `/admin/users/:id`

- Header: avatar/photo, name, email, role, last active date
- Gear icon (⚙) in top-right corner opens a settings modal (edit email, password, role)
- Course progress section: list of all published courses with progress bar and % completion per course
- Progress data sourced from `user.progress` (lessonId → slideIndex)

### 4. CoursesListPage `/admin/courses`

**Table columns:** Название, Слайдов, Прошли (count of users who completed), Статус

- Status is a toggle button: Опубликован / Скрыт
- Clicking course name navigates to `/admin/courses/:id`

### 5. CourseDetailPage `/admin/courses/:id`

- Header: title, tag, status, slide count
- Slide list: slide type + brief content summary
- Employee progress table: name, progress %, current slide index

## Data

All data remains mock-based (no backend). Changes (publish toggle, role change, new user) update local React state only — no persistence across sessions.

### Type additions needed

- `User.photo?: string` — optional photo URL or base64 for uploaded avatar

## Components

- `SettingsModal` — reusable modal for editing user email/password/role, used in both list and detail pages
- `ProgressBar` — reusable progress bar component (already used in Home page, reuse here)

## Navigation

The existing sidebar "Админ" link points to `/admin/users`. Admin sub-pages use breadcrumbs (e.g., "Админ / Сотрудники / Соня Алхазова") for back-navigation.

## Out of Scope

- Real backend / database persistence
- Bulk user actions
- Course creation or slide editing from admin panel
- Email sending or notifications
