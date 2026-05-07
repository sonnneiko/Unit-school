import type { KstatiContent } from '../../types'
import styles from './slides.module.css'

interface Props { content: KstatiContent }

export function KstatiSlide({ content }: Props) {
  return (
    <div className={styles.kstatiRoot}>
      <div className={styles.kstatiMain}>
        <div className={styles.kstatiLeft}>
          <div className={styles.kstatiBadge}>💬 Кстати</div>
          <div className={styles.kstatiList}>
            {content.tips.map((tip, i) => (
              <div key={i} className={styles.kstatiCard}>
                <div className={styles.kstatiNum}>{i + 1}</div>
                <div className={styles.kstatiCardBody}>
                  <div className={styles.kstatiCardTitle}>{tip.title}</div>
                  <div className={styles.kstatiCardText}>{tip.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {content.image && (
          <div className={styles.kstatiRight}>
            <img src={content.image} alt="" className={styles.kstatiCat} />
          </div>
        )}
      </div>
      <div className={styles.kstatiFooter}>парочка наставлений от кота Юнита</div>
    </div>
  )
}
