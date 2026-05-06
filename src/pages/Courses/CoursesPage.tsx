import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLessons } from '../../context/LessonsContext'
import { isComplete } from '../../utils/level'
import { LEVELS } from '../../data/courses'
import type { Section } from '../../data/courses'
import styles from './CoursesPage.module.css'

function SectionIcon({ icon }: { icon: string }) {
  const isImage = icon.startsWith('/') || icon.startsWith('http')
  if (isImage) return <img src={icon} alt="" className={styles.sectionIconImg} />
  return <span className={styles.sectionIconEmoji}>{icon}</span>
}

type SectionStatus = 'complete' | 'active' | 'locked'

export function CoursesPage() {
  const { user } = useAuth()
  const { lessons } = useLessons()

  const lessonMap = new Map(lessons.map(l => [l.id, l]))

  function isSectionComplete(section: Section): boolean {
    if (!user) return false
    return section.topics.every(topic => {
      const l = lessonMap.get(topic.lessonId)
      return l ? isComplete(l, user) : false
    })
  }

  function getSectionProgress(section: Section): number {
    if (!user) return 0
    const total = section.topics.length
    const done = section.topics.filter(topic => {
      const l = lessonMap.get(topic.lessonId)
      return l ? isComplete(l, user) : false
    }).length
    return total === 0 ? 0 : done / total
  }

  const allSections = LEVELS.flatMap(l => l.sections)
  const statusMap = new Map<string, SectionStatus>()
  let prevComplete = true
  for (const section of allSections) {
    const complete = isSectionComplete(section)
    if (complete) {
      statusMap.set(section.id, 'complete')
    } else if (prevComplete) {
      statusMap.set(section.id, 'active')
    } else {
      statusMap.set(section.id, 'locked')
    }
    prevComplete = complete
  }

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
            level.sections.map(section => {
              const status = statusMap.get(section.id) ?? 'locked'
              const progress = getSectionProgress(section)
              const isClickable = status !== 'locked' && !section.comingSoon

              const cardContent = (
                <>
                  <div className={`${styles.cardIcon} ${styles[`cardIcon_${status}`]}`}>
                    {status === 'locked'
                      ? <span className={styles.sectionIconEmoji}>🔒</span>
                      : <SectionIcon icon={section.icon} />
                    }
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.cardTitle}>{section.title}</div>
                    <div className={styles.topicList}>
                      {section.topics.map(topic => (
                        <span
                          key={topic.id}
                          className={`${styles.topicChip} ${status === 'active' ? styles.topicChip_active : ''}`}
                        >
                          {topic.title}
                        </span>
                      ))}
                    </div>
                    {status !== 'locked' && (
                      <div className={styles.progressBar}>
                        <div
                          className={`${styles.progressFill} ${status === 'complete' ? styles.progressFill_complete : ''}`}
                          style={{ width: `${Math.round(progress * 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className={`${styles.statusBadge} ${styles[`statusBadge_${status}`]}`}>
                    {status === 'complete' && 'Завершено'}
                    {status === 'active' && 'В процессе'}
                    {status === 'locked' && 'Заблокировано'}
                  </div>
                </>
              )

              return isClickable ? (
                <Link
                  key={section.id}
                  to={`/courses/${section.id}`}
                  className={`${styles.card} ${styles[`card_${status}`]}`}
                  style={{ textDecoration: 'none' }}
                >
                  {cardContent}
                </Link>
              ) : (
                <div
                  key={section.id}
                  className={`${styles.card} ${styles[`card_${status}`]} ${section.comingSoon ? styles.card_comingSoon : ''}`}
                >
                  {cardContent}
                </div>
              )
            })
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
