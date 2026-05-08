import { LayoutGrid, CreditCard, Printer, FileText, CheckSquare, Bell, type LucideIcon } from 'lucide-react'
import unitCat from '../../assets/unit-cat/Лайк (2).png'
import type { FeatureContent } from '../../types'
import styles from './slides.module.css'

const ICON_MAP: Record<string, LucideIcon> = { LayoutGrid, CreditCard, Printer, FileText, CheckSquare, Bell }

export function FeatureSlide({ content }: { content: FeatureContent }) {
  return (
    <div className={styles.featureFull}>
      <div className={styles.featureLeft}>
        <h1 className={styles.featureTitle}>{content.heading}</h1>
        <div className={styles.featureParagraphs}>
          {content.paragraphs.map((p, i) => (
            <p key={i} className={i === content.paragraphs.length - 1 ? styles.featureBodyAccent : styles.featureBody}>{p}</p>
          ))}
        </div>
        <ul className={styles.featureList}>
          {content.features.map((f, i) => {
            const Icon = ICON_MAP[f.icon]
            return (
              <li key={i} className={styles.featureItem}>
                {Icon && (
                  <span className={styles.featureIconWrap}>
                    <Icon size={20} />
                  </span>
                )}
                <div>
                  <div className={styles.featureItemTitle}>{f.title}</div>
                  <div className={styles.featureItemSubtitle}>{f.subtitle}</div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
      <div className={styles.featureRight}>
        <img src={unitCat} alt="Котик Юнит" className={styles.featureCat} />
      </div>
    </div>
  )
}
