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
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            <th>Сотрудник</th>
            <th>Пройдено курсов</th>
            <th>Средний прогресс</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(user => {
            const completed = publishedLessons.filter(l =>
              calcProgress(user.progress[l.id] ?? 0, l.slides.length) === 100
            ).length
            const avg = publishedLessons.length === 0 ? 0 : Math.round(
              publishedLessons.reduce((s, l) =>
                s + calcProgress(user.progress[l.id] ?? 0, l.slides.length), 0
              ) / publishedLessons.length
            )
            const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

            return (
              <tr key={user.id}>
                <td className={styles.avatarCell}>
                  <div className={styles.avatar}>{initials}</div>
                </td>
                <td>
                  <Link to={`/admin/progress/${user.id}`} className={styles.nameLink}>
                    {user.name}
                  </Link>
                </td>
                <td className={styles.coursesCell}>
                  <span className={styles.courseCount}>{completed}</span>
                  <span className={styles.courseTotal}> из {publishedLessons.length}</span>
                </td>
                <td>
                  <div className={styles.avgRow}>
                    <div className={styles.barBg}>
                      <div className={styles.barFill} style={{ width: `${avg}%` }} />
                    </div>
                    <span className={styles.pct}>{avg}%</span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
