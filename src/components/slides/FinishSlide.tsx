import { Link } from 'react-router-dom'
import type { FinishContent, Lesson } from '../../types'
import styles from './slides.module.css'

interface Props {
  content: FinishContent
  nextLesson?: Lesson | null
}

export function FinishSlide({ content, nextLesson }: Props) {
  return (
    <div className={styles.slideWrapper}>
      <div className={styles.finishCard}>
        <span className={styles.finishCat}>🎉</span>
        <h2 className={styles.finishTitle}>{content.title}</h2>
        <p className={styles.finishMessage}>{content.message}</p>
        {nextLesson && nextLesson.published ? (
          <Link to={`/lesson/${nextLesson.id}`} className={styles.nextLink}>
            Следующий день: {nextLesson.title} →
          </Link>
        ) : (
          <span className={styles.comingSoon}>
            {nextLesson ? `${nextLesson.title} — скоро` : 'Скоро новые уроки'}
          </span>
        )}
      </div>
    </div>
  )
}
