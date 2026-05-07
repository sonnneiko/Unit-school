import { Outlet } from 'react-router-dom'
import { AdminSidebar } from '../AdminSidebar/AdminSidebar'
import styles from '../AppLayout.module.css'

export function AdminAppLayout() {
  return (
    <div className={`${styles.layout} adminLayout`}>
      <AdminSidebar />
      <main className={styles.adminMain}>
        <Outlet />
      </main>
    </div>
  )
}
