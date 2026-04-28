import styles from './CoursesPage.module.css'

type Section = {
  id: string
  icon: string
  title: string
  topics: string[]
}

type Level = {
  id: string
  label: string
  milestoneEmoji: string
  milestoneColor: 'orange' | 'green'
  sections: Section[]
  comingSoon?: boolean
}

const LEVELS: Level[] = [
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
          'Команда', 'UnitPay', 'Методы приёма', 'Путь платежей',
          'Неттинг', 'Эквайринг', 'Юридические и физические лица',
          'Касса', 'Поставщики',
        ],
      },
      {
        id: 'unitpay-accounting',
        icon: '📊',
        title: 'Аккаунтинг',
        topics: ['Задачи', 'Инструменты', 'Рабочий день', 'Чаты'],
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
        title: 'Привлечение',
        topics: ['Поиск мерчантов', 'Партнерская программа'],
      },
      {
        id: 'unitpay-details',
        icon: '🔍',
        title: 'UnitPay: Все детали',
        topics: ['Рекуррентные платежи', 'Знакомство с help.unitpay.ru'],
      },
      {
        id: 'unitpay-finance',
        icon: '💰',
        title: 'Основы финансов и расчётов',
        topics: ['Сверки', 'Расчет комиссий', 'НДС в транзакциях UnitPay'],
      },
      {
        id: 'unitpay-security',
        icon: '🛡️',
        title: 'Безопасность и документооборот',
        topics: ['Чарджбеки', 'Черный список', 'Документооборот', 'Требования к проектам'],
      },
      {
        id: 'unitpay-technical',
        icon: '⚙️',
        title: 'Технические аспекты и интеграция',
        topics: ['Взаимодействие с техническим отделом', 'Редаш', 'Обработчик платежей', 'Интеграция'],
      },
    ],
  },
  {
    id: 'senior-am',
    label: 'Senior AM',
    milestoneEmoji: '🏆',
    milestoneColor: 'green',
    sections: [],
    comingSoon: true,
  },
]

function SectionIcon({ icon }: { icon: string }) {
  const isImage = icon.startsWith('/') || icon.startsWith('http')
  if (isImage) {
    return <img src={icon} alt="" className={styles.sectionIconImg} />
  }
  return <span className={styles.sectionIconEmoji}>{icon}</span>
}

export function CoursesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Обучение</h1>
      </div>

      {LEVELS.map((level) => (
        <div key={level.id} className={styles.levelBlock}>
          <div className={styles.levelLabel}>{level.label}</div>

          {level.comingSoon ? (
            <div className={styles.comingSoonCard}>
              <span className={styles.comingSoonIcon}>✨</span>
              <div>
                <div className={styles.comingSoonTitle}>Блоки скоро появятся</div>
                <div className={styles.comingSoonSub}>Контент в разработке</div>
              </div>
            </div>
          ) : (
            level.sections.map(section => (
              <div key={section.id} className={styles.card}>
                <div className={styles.cardIcon}>
                  <SectionIcon icon={section.icon} />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTitle}>{section.title}</div>
                  <div className={styles.topicList}>
                    {section.topics.map(topic => (
                      <span key={topic} className={styles.topicChip}>{topic}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}

          {!level.comingSoon && (
            <div className={styles.milestone}>
              <div className={styles.milestoneLine} />
              <div className={`${styles.milestoneBadge} ${styles[`milestone_${level.milestoneColor}`]}`}>
                <span>{level.milestoneEmoji}</span>
                <span>{level.label}</span>
              </div>
              <div className={styles.milestoneLine} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
