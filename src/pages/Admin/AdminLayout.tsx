import { Outlet, Link, useLocation } from 'react-router-dom'
import styles from './AdminLayout.module.css'

const crumbMap: Record<string, string> = {
  '/admin/users': 'Сотрудники',
  '/admin/users/new': 'Новый сотрудник',
  '/admin/courses': 'Курсы',
}

export function AdminLayout() {
  const { pathname } = useLocation()

  const segments = pathname.split('/').filter(Boolean)
  const crumbs: { label: string; to: string }[] = [
    { label: 'Администрирование', to: '/admin/users' },
  ]
  if (segments.length > 1) {
    const section = `/${segments[0]}/${segments[1]}`
    const label = crumbMap[section]
    if (label) crumbs.push({ label, to: section })
  }
  if (segments.length > 2) {
    crumbs.push({ label: segments[2], to: pathname })
  }

  return (
    <div className={styles.layout}>
      <nav className={styles.breadcrumbs}>
        {crumbs.map((c, i) => (
          <span key={c.to}>
            {i > 0 && <span className={styles.sep}>/</span>}
            {i < crumbs.length - 1
              ? <Link to={c.to} className={styles.link}>{c.label}</Link>
              : <span className={styles.current}>{c.label}</span>
            }
          </span>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
