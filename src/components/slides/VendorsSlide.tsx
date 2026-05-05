import type { VendorsSlideContent } from '../../types'
import styles from './slides.module.css'

export function VendorsSlide({ content }: { content: VendorsSlideContent }) {
  return (
    <div className={styles.vendorsFull}>
      <h1 className={styles.vendorsTitle}>{content.title}</h1>
      <div className={styles.vendorsGrid}>
        {content.cards.map((card, i) => (
          <div key={i} className={styles.vendorCard} style={{ background: card.gradient }}>
            <div className={styles.vendorCardTop}>
              <div className={styles.vendorCardName}>{card.name}</div>
              <div className={styles.vendorCardDesc}>{card.description}</div>
            </div>
            {card.logo ? (
              <img src={card.logo} alt={card.name} className={styles.vendorCardLogo} />
            ) : card.logoText ? (
              <div
                className={styles.vendorCardLogoText}
                style={{
                  background: card.logoBg ?? 'rgba(255,255,255,0.15)',
                  color: card.logoColor ?? '#fff',
                }}
              >
                {card.logoText}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
