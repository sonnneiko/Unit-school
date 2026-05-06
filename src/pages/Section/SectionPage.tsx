import { Link, useParams, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLessons } from '../../context/LessonsContext'
import { isComplete } from '../../utils/level'
import { LEVELS } from '../../data/courses'
import styles from './SectionPage.module.css'

type TopicStatus = 'complete' | 'active' | 'new'

export function SectionPage() {
  const { sectionId } = useParams<{ sectionId: string }>()
  const { user } = useAuth()
  const { lessons } = useLessons()
  const location = useLocation()
  const completedLessonId = (location.state as { completedLessonId?: string } | null)?.completedLessonId

  const lessonMap = new Map(lessons.map(l => [l.id, l]))

  const section = LEVELS.flatMap(l => l.sections).find(s => s.id === sectionId)
  if (!section) return <Navigate to="/courses" replace />

  function getStatus(lessonId: string): TopicStatus {
    const l = lessonMap.get(lessonId)
    if (!l || !user) return 'new'
    if (isComplete(l, user)) return 'complete'
    const idx = user.progress[lessonId] ?? 0
    return idx > 0 ? 'active' : 'new'
  }

  function getProgress(lessonId: string): number {
    const l = lessonMap.get(lessonId)
    if (!l || !user) return 0
    if (isComplete(l, user)) return 1
    if (l.slides.length <= 1) return 0
    const idx = user.progress[lessonId] ?? 0
    return idx / (l.slides.length - 1)
  }

  const completedLesson = completedLessonId ? lessonMap.get(completedLessonId) : null

  return (
    <div className={styles.page}>
      {completedLesson && (
        <div className={styles.completionBanner}>
          <span className={styles.completionIcon}>✓</span>
          <span>Тема «{completedLesson.title}» пройдена! Можешь двигаться дальше.</span>
        </div>
      )}
      <div className={styles.header}>
        <Link to="/courses" className={styles.back}>← Назад</Link>
        <h1 className={styles.title}>{section.title}</h1>
      </div>

      <div className={styles.topicList}>
        {section.topics.map(topic => {
          const status = getStatus(topic.lessonId)
          const progress = getProgress(topic.lessonId)

          return (
            <Link
              key={topic.id}
              to={`/lesson/${topic.lessonId}`}
              state={{ from: `/courses/${sectionId}`, ...(topic.startTab !== undefined && { initialTab: topic.startTab }) }}
              className={`${styles.topicCard} ${styles[`topicCard_${status}`]}`}
              style={{ textDecoration: 'none' }}
            >
              <div className={styles.topicBody}>
                <div className={styles.topicTitle}>{topic.title}</div>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.progressFill} ${status === 'complete' ? styles.progressFill_complete : ''}`}
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
              </div>
              <div className={`${styles.statusBadge} ${styles[`statusBadge_${status}`]}`}>
                {status === 'complete' ? 'Завершено' : status === 'active' ? 'В процессе' : 'Не начат'}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
