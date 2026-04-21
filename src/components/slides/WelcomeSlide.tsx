import type { WelcomeContent } from '../../types'
import styles from './slides.module.css'

interface Props {
  content: WelcomeContent
  onNext: () => void
}

export function WelcomeSlide({ content, onNext }: Props) {
  return (
    <div className={styles.slideWrapper}>
      <div className={styles.welcomeCard}>
        <span className={styles.cat}>🐱</span>
        <h1 className={styles.welcomeTitle}>{content.title}</h1>
        <p className={styles.welcomeSubtitle}>{content.subtitle}</p>
        <button className={styles.ctaButton} onClick={onNext}>
          {content.ctaLabel} →
        </button>
      </div>
    </div>
  )
}
