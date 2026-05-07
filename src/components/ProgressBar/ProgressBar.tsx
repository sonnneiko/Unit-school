import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  value: number
  showLabel?: boolean
  className?: string
}

export function ProgressBar({ value, showLabel = true, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className={`${styles.row}${className ? ` ${className}` : ''}`}>
      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${clamped}%` }} />
      </div>
      {showLabel && <span className={styles.label}>{clamped}%</span>}
    </div>
  )
}
