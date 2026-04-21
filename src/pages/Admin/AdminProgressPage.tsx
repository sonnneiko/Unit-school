import { Link } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import { useLessons } from '../../context/LessonsContext'
import { calcProgress } from '../../components/slides/slideUtils'
import { ProgressBar } from '../../components/ProgressBar/ProgressBar'
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
            <th>Сотрудник</th>
            {publishedLessons.map(l => (
              <th key={l.id}>{l.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map(user => (
            <tr key={user.id}>
              <td>
                <Link to={`/admin/users/${user.id}`} className={styles.nameLink}>
                  {user.name}
                </Link>
              </td>
              {publishedLessons.map(lesson => {
                const pct = calcProgress(
                  user.progress[lesson.id] ?? 0,
                  lesson.slides.length
                )
                return (
                  <td key={lesson.id} className={styles.progressCell}>
                    <ProgressBar value={pct} />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
