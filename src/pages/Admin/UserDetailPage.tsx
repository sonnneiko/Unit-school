import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import { useLessons } from '../../context/LessonsContext'
import { calcProgress } from '../../components/slides/slideUtils'
import { ProgressBar } from '../../components/ProgressBar/ProgressBar'
import { SettingsModal } from '../../components/SettingsModal/SettingsModal'
import styles from './UserDetailPage.module.css'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { users } = useUsers()
  const { lessons } = useLessons()
  const [showSettings, setShowSettings] = useState(false)

  const user = users.find(u => u.id === id)

  if (!user) {
    return (
      <div className={styles.notFound}>
        <p>Пользователь не найден</p>
        <Link to="/admin/users" className={styles.backLink}>← Назад к списку</Link>
      </div>
    )
  }

  const publishedLessons = lessons.filter(l => l.published)

  return (
    <>
      <div className={styles.header}>
        {user.photo
          ? <img src={user.photo} alt={user.name} className={styles.avatar} />
          : <div className={styles.avatarPlaceholder}>👤</div>
        }
        <div className={styles.info}>
          <div className={styles.name}>{user.name}</div>
          <div className={styles.meta}>
            {user.email} · {user.role === 'admin' ? 'Администратор' : 'Сотрудник'}
            {user.lastActive && ` · ${user.lastActive}`}
          </div>
        </div>
        <button className={styles.gearBtn} onClick={() => setShowSettings(true)} aria-label="⚙">⚙</button>
      </div>

      <div className={styles.sectionTitle}>Прогресс по курсам</div>
      {publishedLessons.map(lesson => {
        const slideIndex = user.progress[lesson.id] ?? 0
        const percent = calcProgress(slideIndex, lesson.slides.length)
        return (
          <div key={lesson.id} className={styles.courseRow}>
            <div className={styles.courseTitle}>{lesson.title}</div>
            <div className={styles.progressWrap}>
              <ProgressBar value={percent} />
            </div>
          </div>
        )
      })}

      {showSettings && (
        <SettingsModal user={user} onClose={() => setShowSettings(false)} />
      )}
    </>
  )
}
