import { Link } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import { useLessons } from '../../context/LessonsContext'
import { calcProgress } from '../../components/slides/slideUtils'
import styles from './AdminDashboardPage.module.css'

export function AdminDashboardPage() {
  const { users } = useUsers()
  const { lessons } = useLessons()

  const employees = users.filter(u => u.role !== 'admin')
  const publishedLessons = lessons.filter(l => l.published)

  const avgProgress = employees.length === 0 ? 0 : Math.round(
    employees.reduce((sum, user) => {
      if (publishedLessons.length === 0) return sum
      const userAvg = publishedLessons.reduce((s, l) => {
        return s + calcProgress(user.progress[l.id] ?? 0, l.slides.length)
      }, 0) / publishedLessons.length
      return sum + userAvg
    }, 0) / employees.length
  )

  const recentEmployees = [...employees]
    .sort((a, b) => {
      if (!a.lastActive) return 1
      if (!b.lastActive) return -1
      return b.lastActive.localeCompare(a.lastActive)
    })
    .slice(0, 5)

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Главная</h1>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{employees.length}</div>
          <div className={styles.statLabel}>Сотрудников</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{publishedLessons.length}</div>
          <div className={styles.statLabel}>Активных курсов</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{avgProgress}%</div>
          <div className={styles.statLabel}>Средний прогресс</div>
        </div>
      </div>

      <div className={styles.sectionTitle}>Последняя активность</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Сотрудник</th>
            <th>Email</th>
            <th>Последняя активность</th>
          </tr>
        </thead>
        <tbody>
          {recentEmployees.map(user => (
            <tr key={user.id}>
              <td>
                <Link to={`/admin/users/${user.id}`} className={styles.nameLink}>
                  {user.name}
                </Link>
              </td>
              <td>{user.email}</td>
              <td>{user.lastActive ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
