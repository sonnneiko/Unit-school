import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { to: '/', label: 'Главная', icon: '🏠', end: true },
  { to: '/courses', label: 'Обучение', icon: '📖', end: false },
  { to: '/progress', label: 'Прогресс', icon: '📊', end: false },
  { to: '/profile', label: 'Профиль', icon: '👤', end: false },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <button
          className={styles.logo}
          onClick={() => navigate('/', { state: { fromLogo: true } })}
        >
          <span className={styles.logoText}>UnitSchool</span>
        </button>
        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          {user?.role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.icon}>⚙️</span>
              <span>Админ</span>
            </NavLink>
          )}
        </nav>
      </div>
      <div className={styles.bottom}>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user?.name}</div>
          <div className={styles.userEmail}>{user?.email}</div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </aside>
  )
}
