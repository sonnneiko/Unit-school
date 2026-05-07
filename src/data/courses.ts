import type { Topic } from '../types'

export type Section = {
  id: string
  icon: string
  title: string
  topics: Topic[]
  comingSoon?: boolean
}

export type CourseLevel = {
  id: string
  label: string
  milestoneEmoji: string
  milestoneColor: 'orange' | 'green'
  sections: Section[]
  comingSoon?: boolean
}

export const LEVELS: CourseLevel[] = [
  {
    id: 'junior-am',
    label: 'Junior AM',
    milestoneEmoji: '🏅',
    milestoneColor: 'orange',
    sections: [
      {
        id: 'unitpay-basics',
        icon: '📘',
        title: 'Основы UnitPay',
        topics: [
          { id: 'team',      icon: '👥', title: 'Команда',                      lessonId: 'unitpay-basics-team' },
          { id: 'about',     icon: '💡', title: 'UnitPay',                       lessonId: 'unitpay-basics-about' },
          { id: 'methods',   icon: '💳', title: 'Методы приёма',                 lessonId: 'unitpay-basics-methods' },
          { id: 'path',      icon: '🔄', title: 'Путь платежей',                 lessonId: 'unitpay-basics-path' },
          { id: 'merchant',      icon: '🏪', title: 'Магазин мерчанта',   lessonId: 'unitpay-basics-merchant' },
          { id: 'payment-page', icon: '💻', title: 'Страница оплаты',            lessonId: 'unitpay-basics-payment-page' },
          { id: 'banks',        icon: '🏛️', title: 'Банк-эквайер и Банк-эмитент', lessonId: 'unitpay-basics-banks' },
          { id: 'kassa',        icon: '🧾', title: 'Онлайн-кассы',               lessonId: 'unitpay-basics-kassa' },
          { id: 'acquiring',    icon: '🏦', title: 'Эквайринг',                   lessonId: 'unitpay-basics-acquiring' },
          { id: 'netting',      icon: '🔄', title: 'Неттинг',                      lessonId: 'unitpay-basics-acquiring', startTab: 3 },
          { id: 'vendors',   icon: '🤝', title: 'Поставщики',                    lessonId: 'unitpay-basics-vendors' },
          { id: 'entities',  icon: '🏢', title: 'Юридические и физические лица', lessonId: 'unitpay-basics-entities' },
        ],
      },
      {
        id: 'unitpay-accounting',
        icon: '📊',
        title: 'Аккаунтинг',
        topics: [
          { id: 'intro',  icon: '🧑‍💼', title: 'Аккаунтинг',  lessonId: 'accounting-intro' },
          { id: 'tools',  icon: '🛠️',  title: 'Инструменты', lessonId: 'accounting-tools' },
          { id: 'chats',  icon: '💬',  title: 'Чаты',         lessonId: 'accounting-chats' },
        ],
      },
    ],
  },
  {
    id: 'middle-am',
    label: 'Middle AM',
    milestoneEmoji: '🥈',
    milestoneColor: 'green',
    sections: [
      {
        id: 'unitpay-attraction',
        icon: '🎯',
        title: 'Привлечение мерчантов',
        topics: [
          { id: 'search',     icon: '🔍',  title: 'Поиск мерчантов',     lessonId: 'attraction-search' },
          { id: 'pitch',      icon: '💬',  title: 'Питч и аргументы',     lessonId: 'attraction-pitch' },
          { id: 'funnel',     icon: '🗺️', title: 'Ведение партнёра',     lessonId: 'attraction-funnel' },
          { id: 'objections', icon: '🛡️', title: 'Отработка возражений', lessonId: 'attraction-objections' },
        ],
      },
      {
        id: 'unitpay-details',
        icon: '🔍',
        title: 'UnitPay: Все детали',
        topics: [
          { id: 'recurring', icon: '🔁', title: 'Рекуррентные платежи',         lessonId: 'details-recurring' },
          { id: 'help',      icon: '📖', title: 'Знакомство с help.unitpay.ru', lessonId: 'details-help' },
        ],
        comingSoon: true,
      },
      {
        id: 'unitpay-finance',
        icon: '💰',
        title: 'Основы финансов и расчётов',
        topics: [
          { id: 'reconcile',  icon: '📊', title: 'Сверки',                   lessonId: 'finance-reconcile' },
          { id: 'commission', icon: '💹', title: 'Расчет комиссий',           lessonId: 'finance-commission' },
          { id: 'vat',        icon: '🧮', title: 'НДС в транзакциях UnitPay', lessonId: 'finance-vat' },
        ],
        comingSoon: true,
      },
      {
        id: 'unitpay-security',
        icon: '🛡️',
        title: 'Безопасность и документооборот',
        topics: [
          { id: 'chargebacks',  icon: '↩️', title: 'Чарджбеки',            lessonId: 'security-chargebacks' },
          { id: 'blacklist',    icon: '🚫', title: 'Черный список',         lessonId: 'security-blacklist' },
          { id: 'docs',         icon: '📄', title: 'Документооборот',       lessonId: 'security-docs' },
          { id: 'requirements', icon: '✅', title: 'Требования к проектам', lessonId: 'security-requirements' },
        ],
        comingSoon: true,
      },
      {
        id: 'unitpay-technical',
        icon: '⚙️',
        title: 'Технические аспекты и интеграция',
        topics: [
          { id: 'tech',        icon: '👨‍💻', title: 'Взаимодействие с техническим отделом', lessonId: 'technical-tech' },
          { id: 'redash',      icon: '📈', title: 'Редаш',                                lessonId: 'technical-redash' },
          { id: 'processor',   icon: '⚙️', title: 'Обработчик платежей',                  lessonId: 'technical-processor' },
          { id: 'integration', icon: '🔌', title: 'Интеграция',                            lessonId: 'technical-integration' },
        ],
        comingSoon: true,
      },
    ],
  },
  {
    id: 'senior-am',
    label: 'Senior AM',
    milestoneEmoji: '🏆',
    milestoneColor: 'green',
    sections: [
      {
        id: 'senior-ai',
        icon: '🤖',
        title: 'Работа с искусственным интеллектом',
        topics: [],
        comingSoon: true,
      },
      {
        id: 'senior-reporting',
        icon: '📋',
        title: 'Ведение отчётности',
        topics: [],
        comingSoon: true,
      },
    ],
  },
]
