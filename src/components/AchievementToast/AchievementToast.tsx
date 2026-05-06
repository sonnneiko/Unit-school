import { useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './AchievementToast.module.css'

const AUTO_DISMISS_MS = 4000

export function AchievementToast() {
  const { toasts, dismissToast } = useAuth()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toast = toasts[0]

  useEffect(() => {
    if (!toast) return
    timerRef.current = setTimeout(dismissToast, AUTO_DISMISS_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [toast?.key])

  if (!toast) return null

  return (
    <div className={styles.toast} key={toast.key}>
      <span className={styles.icon}>{toast.icon}</span>
      <div className={styles.text}>
        <div className={styles.label}>Достижение разблокировано</div>
        <div className={styles.name}>{toast.name}</div>
      </div>
      <button className={styles.close} onClick={dismissToast} aria-label="Закрыть">✕</button>
    </div>
  )
}
