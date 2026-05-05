import type { EntitiesContent } from '../../types'
import styles from './slides.module.css'

export function EntitiesSlide({ content }: { content: EntitiesContent }) {
  return (
    <div className={styles.entitiesFull}>
      <h1 className={styles.entitiesHeading}>{content.heading}</h1>
      <div className={styles.entitiesPanels}>
        {content.panels.map((panel, i) => (
          <div
            key={i}
            className={`${styles.entitiesPanel} ${panel.variant === 'purple' ? styles.entitiesPanelPurple : styles.entitiesPanelPink}`}
          >
            <div className={styles.entitiesBlob} />
            <h2 className={styles.entitiesPanelTitle}>{panel.title}</h2>
            <div className={styles.entitiesParagraphs}>
              {panel.paragraphs.map((p, j) => (
                <p key={j} className={styles.entitiesPara}>{p}</p>
              ))}
            </div>
            <ul className={styles.entitiesBullets}>
              {panel.bullets.map((b, j) => (
                <li key={j} className={styles.entitiesBulletItem}>
                  <span className={`${styles.entitiesBulletIcon} ${panel.bulletIcon === 'diamond' ? styles.entitiesBulletDiamond : styles.entitiesBulletCircle}`} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
