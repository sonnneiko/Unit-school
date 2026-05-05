import defaultCat from '../../assets/unit-cat/Unitpay Cat 1.png'
import type { WelcomeContent } from '../../types'
import styles from './slides.module.css'

interface Props {
  content: WelcomeContent
  onNext: () => void
}

export function WelcomeSlide({ content, onNext }: Props) {
  const catImage = content.image ?? defaultCat

  return (
    <div className={styles.welcomeFull}>
      <div className={styles.welcomeLeft}>
        <h1 className={styles.welcomeFullTitle}>{content.title}</h1>
        <p className={styles.welcomeFullSubtitle}>{content.subtitle}</p>
        {content.bullets && content.bullets.length > 0 && (
          <ul className={styles.welcomeBullets}>
            {content.bullets.map((bullet, i) => (
              <li
                key={i}
                className={styles.welcomeBulletItem}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <span className={styles.welcomeBulletDot} />
                {bullet}
              </li>
            ))}
          </ul>
        )}
        <button className={styles.ctaButton} onClick={onNext}>
          {content.ctaLabel} →
        </button>
      </div>
      <div className={styles.welcomeRight}>
        <img src={catImage} alt={content.title} className={styles.welcomeCat} />
      </div>
    </div>
  )
}
