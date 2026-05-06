import { useEffect } from 'react'
import styles from './SlideNav.module.css'

interface Props {
  current: number // 0-based
  total: number
  onPrev: () => void
  onNext: () => void
  hideArrows?: boolean
  hideNext?: boolean
  hidePrev?: boolean
}

export function SlideNav({ current, total, onPrev, onNext, hideArrows, hideNext, hidePrev }: Props) {
  useEffect(() => {
    if (hideArrows) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onPrev, onNext, hideArrows])

  return (
    <div className={styles.nav}>
      {!(hideArrows || hidePrev)
        ? <button className={styles.arrow} onClick={onPrev} aria-label="Предыдущий слайд">←</button>
        : <span className={styles.arrowPlaceholder} />
      }
      <ol className={styles.dots} role="list">
        {Array.from({ length: total }).map((_, i) => (
          <li
            key={i}
            role="listitem"
            className={`${styles.dot} ${i < current ? styles.done : i === current ? styles.active : ''}`}
          />
        ))}
      </ol>
      {!(hideArrows || hideNext) && (
        <button
          className={styles.arrow}
          onClick={onNext}
          aria-label="Следующий слайд"
        >
          →
        </button>
      )}
    </div>
  )
}
