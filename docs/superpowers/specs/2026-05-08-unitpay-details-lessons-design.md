# Design: UnitPay Details — Two Lessons

**Date:** 2026-05-08
**Section:** UnitPay: Все детали (`unitpay-details`)
**Status:** Approved by user

---

## Context

The `unitpay-details` section in `courses.ts` has `comingSoon: true` and two topics with no lesson data yet:
- `details-recurring` — Рекуррентные платежи
- `details-help` — Знакомство с help.unitpay (rename in courses.ts: remove ".ru")

Target audience: account managers learning to sell and support UnitPay features.

---

## Lesson 1: Рекуррентные платежи (`details-recurring`)

**Scope:** Business-level only — no API params, no technical integration.

### Slide 1 — `info`

```
heading: "Рекуррентные платежи"
bullets:
  - Автоматические регулярные списания с карты без повторного ввода реквизитов и 3DS
  - После первого согласия клиент не касается процесса — деньги уходят по расписанию
  - Сумму и периодичность мерчант задаёт на своей стороне — полная гибкость
  - Доступны только на эквайринге: карты, Tinkoff Pay, СБП
```

### Slide 2 — `kstati`

3 tips:
1. **Только через поддержку** — подключение требует согласования со Службой безопасности; без этого шага не работает
2. **Только ЮЛ и ИП** — физлица не могут подключить рекуррентные платежи
3. **Наличие подписок не мешает обычным платежам** — партнёр может использовать оба формата одновременно

### Slide 3 — `feature`

```
heading: "Что нужно добавить на проект для подписок"
paragraphs: [краткое intro — без этого служба безопасности не согласует]
features:
  - icon: FileText, title: "Форма регистрации перед оплатой"
    subtitle: "Если на сайте нет стандартного личного кабинета — форма обязательна"
  - icon: CheckSquare, title: "Две обязательные галочки"
    subtitle: "Согласие с условиями подписки + согласие с автосписанием конкретной суммы с периодичностью. Галочки не должны стоять автоматически"
  - icon: Bell, title: "Статус и отмена подписки"
    subtitle: "Клиент должен иметь возможность проверить статус своей подписки и отменить её"
```

---

## Lesson 2: Знакомство с help.unitpay (`details-help`)

**Goal:** Teach AMs to navigate docs themselves and direct merchants to the right sections.

### courses.ts change

Rename topic title from `'Знакомство с help.unitpay.ru'` → `'Знакомство с help.unitpay'`

### Slide 1 — `info`

```
heading: "Документация UnitPay"
bullets:
  - Мерчанты часто приходят с техническими вопросами — многие ответы уже есть в доках
  - Пригодится самому: статусы платежей, параметры API, коды ошибок, форматы выплат
  - Пригодится для мерчанта: как добавить проект, готовые модули для CMS, онлайн-кассы
```

### Slide 2 — `tools`

Two tool cards:

**Card 1 — help.unitpay.ru**
- `title`: help.unitpay.ru
- `description`: Основная документация для ЮЛ и ИП. Регистрация и проекты, платежи и подписки, выплаты, онлайн-кассы, готовые модули для 40+ CMS-платформ, справочник статусов и кодов.
- `ctaLabel`: Открыть
- gradient: синий

**Card 2 — help.unitpay.money**
- `title`: help.unitpay.money
- `description`: Обновлённая версия документации на русском и английском. Начало работы, платежи, выплаты, личный кабинет, тестовое API. Удобно делиться с зарубежными партнёрами.
- `ctaLabel`: Открыть
- gradient: фиолетовый

---

## Files to change

1. `src/data/courses.ts` — rename topic title (remove ".ru")
2. `src/data/lessons.ts` — add two new lesson objects at the end
3. No new slide types needed — uses existing `info`, `kstati`, `feature`, `tools`
