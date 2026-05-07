import type { KassaContent } from '../../types'
import styles from './slides.module.css'

export function KassaSlide({ content }: { content: KassaContent }) {
  return (
    <div className={styles.kassaFull}>
      <div className={styles.kassaLeft}>
        <h1 className={styles.kassaTitle}>{content.leftTitle}</h1>
        <h2 className={styles.kassaSubtitle}>
          {content.leftSubtitle}<span className={styles.kassaSubtitleAccent}>{content.leftSubtitleAccent}</span>
        </h2>
        <p className={styles.kassaDesc}>{content.leftDesc}</p>
        <ul className={styles.kassaBullets}>
          {content.leftBullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      </div>

      <div className={styles.kassaRight}>
        <h1 className={styles.kassaTitle}>{content.rightTitle}</h1>
        <p className={styles.kassaDesc}>{content.rightDesc}</p>
        <div className={styles.kassaGrid}>
          {content.rightPartners.map((p, i) => (
            <div
              key={i}
              className={`${styles.kassaCard} ${p.color === 'transparent' ? styles.kassaCardMore : ''}`}
              style={{ background: p.color === 'transparent' ? undefined : p.color }}
            >
              {p.logo
                ? <img src={p.logo} alt={p.name} className={styles.kassaCardLogo} />
                : p.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
