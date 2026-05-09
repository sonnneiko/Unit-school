import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar/Sidebar'
import { CatGreeting } from './CatGreeting/CatGreeting'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showCat, setShowCat] = useState(false)

  useEffect(() => {
    if (location.state?.fromLogo) {
      setShowCat(true)
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state?.fromLogo])

  useEffect(() => {
    if (location.pathname !== '/') {
      setShowCat(false)
    }
  }, [location.pathname])

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
      {showCat && <CatGreeting onDone={() => setShowCat(false)} />}
    </div>
  )
}
