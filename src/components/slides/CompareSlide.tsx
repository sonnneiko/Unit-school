import type { CompareContent } from '../../types'
import styles from './slides.module.css'

export function CompareSlide({ content }: { content: CompareContent }) {
  return (
    <div className={styles.compareFull}>
      {content.panels.map((panel, i) => (
        <div key={i} className={styles.compareCol}>
          <h1 className={styles.compareTitle}>{panel.title}</h1>
          <p className={styles.compareDesc}>{panel.description}</p>
          <div className={`${styles.compareCard} ${panel.variant === 'green' ? styles.compareCardGreen : styles.compareCardBlue}`}>
            <p className={styles.compareCardTitle}>{panel.cardTitle}</p>
            <ul className={styles.compareCardBullets}>
              {panel.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
