import type { MethodsContent } from '../../types'
import styles from './slides.module.css'

export function MethodsSlide({ content }: { content: MethodsContent }) {
  return (
    <div className={styles.methodsFull}>
      <div className={styles.methodsLeft}>
        <h1 className={styles.methodsTitle}>{content.heading}</h1>
        <ul className={styles.methodsList}>
          {content.methods.map((m, i) => (
            <li key={i} className={styles.methodsItem}>
              <img src={m.logo} alt={m.name} className={styles.methodsLogo} />
              <span className={styles.methodsName}>{m.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.methodsRight}>
        <div className={styles.methodsMockup}>
          <img src={content.mockupImage} alt="Форма оплаты" className={styles.methodsMockupImg} />
        </div>
      </div>
    </div>
  )
}
