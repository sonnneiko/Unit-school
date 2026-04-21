import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import { SettingsModal } from '../../components/SettingsModal/SettingsModal'
import styles from './UserDetailPage.module.css'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { users } = useUsers()
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

      {showSettings && (
        <SettingsModal user={user} onClose={() => setShowSettings(false)} />
      )}
    </>
  )
}
