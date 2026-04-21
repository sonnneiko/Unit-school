import { Link } from 'react-router-dom'
import type { Lesson } from '../../types'
import { calcProgress } from '../slides/slideUtils'
import styles from './LessonCard.module.css'

interface Props {
  lesson: Lesson
  progress: number // currentSlideIndex (0-based)
}

export function LessonCard({ lesson, progress }: Props) {
  const percent = calcProgress(progress, lesson.slides.length)

  if (!lesson.published) {
    return (
      <div className={`${styles.card} ${styles.locked}`}>
        <div className={styles.tag}>{lesson.tag}</div>
        <div className={styles.title}>{lesson.title}</div>
        <span className={styles.lockBadge}>Скоро</span>
      </div>
    )
  }

  return (
    <Link to={`/lesson/${lesson.id}`} className={styles.card}>
      <div className={styles.tag}>{lesson.tag}</div>
      <div className={styles.title}>{lesson.title}</div>
      <div className={styles.progressRow}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${percent}%` }} />
        </div>
        <span className={styles.percent}>{percent}%</span>
      </div>
    </Link>
  )
}
