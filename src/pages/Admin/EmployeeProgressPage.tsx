import { Link, useParams } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import { useLessons } from '../../context/LessonsContext'
import { calcProgress } from '../../components/slides/slideUtils'
import styles from './EmployeeProgressPage.module.css'

export function EmployeeProgressPage() {
  const { id } = useParams<{ id: string }>()
  const { users } = useUsers()
  const { lessons } = useLessons()

  const user = users.find(u => u.id === id)
  const publishedLessons = lessons.filter(l => l.published)

  if (!user) {
    return (
      <div className={styles.page}>
        <p className={styles.notFound}>Сотрудник не найден</p>
      </div>
    )
  }

  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const courses = publishedLessons.map(lesson => ({
    lesson,
    pct: calcProgress(user.progress[lesson.id] ?? 0, lesson.slides.length),
  }))

  const completed = courses.filter(c => c.pct === 100).length
  const avg = courses.length === 0 ? 0 : Math.round(
    courses.reduce((s, c) => s + c.pct, 0) / courses.length
  )

  return (
    <div className={styles.page}>
      <Link to="/admin/progress" className={styles.backLink}>← Прогресс</Link>

      <div className={styles.header}>
        <div className={styles.avatar}>{initials}</div>
        <div>
          <div className={styles.name}>{user.name}</div>
          <div className={styles.meta}>{user.email}</div>
        </div>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{completed}</span>
            <span className={styles.statLabel}> из {courses.length} курсов</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>{avg}%</span>
            <span className={styles.statLabel}> среднее</span>
          </div>
        </div>
      </div>

      {courses.length === 0 ? (
        <p className={styles.empty}>Нет активных курсов</p>
      ) : (
        <div className={styles.courseList}>
          {courses.map(({ lesson, pct }) => (
            <div key={lesson.id} className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <span className={styles.courseTitle}>{lesson.title}</span>
                <span className={`${styles.pct} ${pct === 100 ? styles.pctDone : ''}`}>{pct}%</span>
              </div>
              <div className={styles.barBg}>
                <div
                  className={`${styles.barFill} ${pct === 100 ? styles.barDone : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
