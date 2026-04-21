import { useEffect } from 'react'
import styles from './SlideNav.module.css'

interface Props {
  current: number // 0-based
  total: number
  onPrev: () => void
  onNext: () => void
}

export function SlideNav({ current, total, onPrev, onNext }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onPrev, onNext])

  return (
    <div className={styles.nav}>
      <ol className={styles.dots} role="list">
        {Array.from({ length: total }).map((_, i) => (
          <li
            key={i}
            role="listitem"
            className={`${styles.dot} ${i < current ? styles.done : i === current ? styles.active : ''}`}
          />
        ))}
      </ol>
      <div className={styles.arrows}>
        <button
          className={styles.arrow}
          onClick={onPrev}
          disabled={current === 0}
          aria-label="Предыдущий слайд"
        >
          ←
        </button>
        <span className={styles.counter}>{current + 1} / {total}</span>
        <button
          className={styles.arrow}
          onClick={onNext}
          disabled={current === total - 1}
          aria-label="Следующий слайд"
        >
          →
        </button>
      </div>
    </div>
  )
}
