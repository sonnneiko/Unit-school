import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import logo from '../../assets/logo.svg'
import styles from '../Sidebar/Sidebar.module.css'

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Главная',     icon: '🏠' },
  { to: '/admin/users',     label: 'Сотрудники',  icon: '👥' },
  { to: '/admin/courses',   label: 'Курсы',       icon: '📖' },
  { to: '/admin/progress',  label: 'Прогресс',    icon: '📊' },
]

export function AdminSidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.logo}>
          <img src={logo} alt="UnitSchool" className={styles.logoImg} />
          <span className={styles.logoText}>UnitSchool</span>
        </div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
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
