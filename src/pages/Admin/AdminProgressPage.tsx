import { Link } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import { useLessons } from '../../context/LessonsContext'
import { calcProgress } from '../../components/slides/slideUtils'
import styles from './AdminProgressPage.module.css'

export function AdminProgressPage() {
  const { users } = useUsers()
  const { lessons } = useLessons()

  const employees = users.filter(u => u.role !== 'admin')
  const publishedLessons = lessons.filter(l => l.published)

  if (employees.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.heading}>Прогресс</h1>
        <p className={styles.empty}>Нет сотрудников</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Прогресс</h1>
      <div className={styles.cards}>
        {employees.map(user => {
          const progresses = publishedLessons.map(lesson => ({
            lesson,
            pct: calcProgress(user.progress[lesson.id] ?? 0, lesson.slides.length),
          }))
          const avg = progresses.length === 0 ? 0 : Math.round(
            progresses.reduce((s, p) => s + p.pct, 0) / progresses.length
          )
          const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

          return (
            <div key={user.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                  <div className={styles.avatar}>{initials}</div>
                  <Link to={`/admin/users/${user.id}`} className={styles.nameLink}>
                    {user.name}
                  </Link>
                </div>
                <span className={styles.avg}>Среднее: {avg}%</span>
              </div>

              {progresses.length === 0 ? (
                <p className={styles.noCourses}>Нет активных курсов</p>
              ) : (
                <div className={styles.courseList}>
                  {progresses.map(({ lesson, pct }) => (
                    <div key={lesson.id} className={styles.courseRow}>
                      <span className={styles.courseTitle}>{lesson.title}</span>
                      <div className={styles.barBg}>
                        <div className={styles.barFill} style={{ width: `${pct}%` }} />
                      </div>
                      <span className={styles.pct}>{pct}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
