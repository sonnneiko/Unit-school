import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '../AdminSidebar/AdminSidebar'
import styles from '../AppLayout.module.css'

export function AdminAppLayout() {
  return (
    <div className={styles.layout}>
      <AdminSidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
