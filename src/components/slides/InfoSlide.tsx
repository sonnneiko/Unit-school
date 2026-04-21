import type { InfoContent } from '../../types'
import styles from './slides.module.css'

export function InfoSlide({ content }: { content: InfoContent }) {
  return (
    <div className={styles.slideWrapper}>
      <div className={styles.infoCard}>
        <h2 className={styles.slideHeading}>{content.heading}</h2>
        <ul className={styles.bulletList}>
          {content.bullets.map((bullet, i) => (
            <li key={i} className={styles.bulletItem}>
              <span className={styles.bullet} />
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
