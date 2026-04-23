import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
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

  // Chart data: avg progress per course
  const courseProgressData = publishedLessons.map(lesson => ({
    name: lesson.title.length > 12 ? lesson.title.slice(0, 12) + '…' : lesson.title,
    value: employees.length === 0 ? 0 : Math.round(
      employees.reduce((s, u) => s + calcProgress(u.progress[lesson.id] ?? 0, lesson.slides.length), 0)
      / employees.length
    ),
  }))

  // Chart data: per-employee overall progress (sorted by lastActive)
  const activityData = [...employees]
    .sort((a, b) => {
      if (!a.lastActive) return 1
      if (!b.lastActive) return -1
      return b.lastActive.localeCompare(a.lastActive)
    })
    .map(user => ({
      name: user.name.split(' ')[0],
      value: publishedLessons.length === 0 ? 0 : Math.round(
        publishedLessons.reduce((s, l) => s + calcProgress(user.progress[l.id] ?? 0, l.slides.length), 0)
        / publishedLessons.length
      ),
    }))

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

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <div className={styles.chartCardLabel}>Прогресс по курсам</div>
          <div className={styles.chartCardValue}>{avgProgress}%</div>
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={courseProgressData} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${v}%`, 'Прогресс']}
                />
                <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="url(#gradGreen)" dot={{ r: 3, fill: '#22c55e', strokeWidth: 0 }} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={styles.chartCard}>
          <div className={styles.chartCardLabel}>Активность сотрудников</div>
          <div className={styles.chartCardValue}>{activityData.filter(d => d.value > 0).length} из {employees.length}</div>
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={130}>
              <AreaChart data={activityData} margin={{ top: 8, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradAmber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${v}%`, 'Прогресс']}
                />
                <Area type="monotone" dataKey="value" stroke="#fbbf24" strokeWidth={2} fill="url(#gradAmber)" dot={{ r: 3, fill: '#fbbf24', strokeWidth: 0 }} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
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
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.lastActive ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
