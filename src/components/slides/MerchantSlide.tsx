import type { MerchantContent } from '../../types'
import styles from './slides.module.css'

export function MerchantSlide({ content }: { content: MerchantContent }) {
  return (
    <div className={styles.merchantFull}>
      <div className={styles.merchantLeft}>
        <h1 className={styles.merchantTitle}>{content.heading}</h1>
        <p className={styles.merchantDesc}>{content.description}</p>
        <p className={styles.merchantAcceptLabel}>{content.acceptLabel}</p>
        <ul className={styles.merchantBullets}>
          {content.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>

      <div className={styles.merchantRight}>
        {content.layout === 'phone' ? (
          <div className={styles.merchantPhoneWrap}>
            <div className={styles.merchantPhoneFrame}>
              <div className={styles.merchantPhoneIsland} />
              <div className={styles.merchantPhoneScreen}>
                <img src={content.phoneImage} className={styles.merchantPhoneImg} alt="" />
                <div className={styles.merchantPhoneOverlay} />
                <img src={content.formImage} className={styles.merchantForm} alt="" />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.merchantMonitor}>
            <div className={styles.merchantMonitorScreen}>
              <img src={content.bgImage} className={styles.merchantBg} alt="" />
            </div>
            <div className={styles.merchantMonitorBase} />
            <div className={styles.merchantMonitorStand} />
          </div>
        )}
      </div>
    </div>
  )
}
