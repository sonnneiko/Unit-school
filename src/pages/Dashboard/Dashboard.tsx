import { useAuth } from '../../context/AuthContext'
import { mockLessons } from '../../data/lessons'
import { LessonCard } from '../../components/LessonCard/LessonCard'
import styles from './Dashboard.module.css'

export function DashboardPage() {
  const { user } = useAuth()
  const progress = user?.progress ?? {}

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.greeting}>Привет, {user?.name?.split(' ')[0]}! 🐾</h1>
        <p className={styles.subtitle}>Продолжай обучение — каждый шаг важен</p>
      </header>
      <section className={styles.grid}>
        {mockLessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            progress={progress[lesson.id] ?? 0}
          />
        ))}
      </section>
    </div>
  )
}
