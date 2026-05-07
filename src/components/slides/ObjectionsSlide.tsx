import { useState } from 'react'
import type { ObjectionsContent } from '../../types'
import styles from './slides.module.css'

interface Props { content: ObjectionsContent }

export function ObjectionsSlide({ content }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)
  const obj = content.objections[activeIdx]

  return (
    <div className={styles.objRoot}>
      <div className={styles.objList}>
        {content.objections.map((o, i) => (
          <div
            key={i}
            className={`${styles.objCard} ${i === activeIdx ? styles.objCardActive : ''}`}
            onClick={() => setActiveIdx(i)}
          >
            <div className={styles.objNum}>{i + 1}</div>
            <div className={styles.objCardText}>{o.emoji} {o.short}</div>
          </div>
        ))}
      </div>

      <div className={styles.objDetail}>
        <div className={styles.objDetailHeader}>
          <div className={styles.objDetailIcon}>{obj.emoji}</div>
          <div>
            <div className={styles.objDetailLabel}>ВОЗРАЖЕНИЕ</div>
            <div className={styles.objDetailTitle}>{obj.title}</div>
          </div>
        </div>

        <div className={styles.attrSectionBlock}>
          <div className={styles.attrSectionHead} style={{ color: '#f59e0b' }}>
            🧠 Почему мерчант так говорит
          </div>
          <div className={styles.attrSectionBody}>
            <div className={styles.attrDotItem}>
              <div className={styles.attrDot} />
              <div className={styles.attrDotText}>{obj.why}</div>
            </div>
          </div>
        </div>

        <div className={styles.attrSectionBlock}>
          <div className={styles.attrSectionHead} style={{ color: '#3b82f6' }}>
            💡 Логика ответа
          </div>
          <div className={styles.attrSectionBody}>
            <div className={styles.attrDotList}>
              {obj.reply.map((step, i) => (
                <div key={i} className={styles.attrDotItem}>
                  <div className={styles.attrDot} />
                  <div className={styles.attrDotText}>{step}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.attrSectionBlock}>
          <div className={styles.attrSectionHead} style={{ color: '#22c55e' }}>
            💬 Скрипт ответа
          </div>
          <div className={styles.attrSectionBody}>
            <div className={styles.objScriptBox} dangerouslySetInnerHTML={{ __html: obj.script }} />
          </div>
        </div>

        <div className={styles.attrTipBox}>{obj.tip}</div>
      </div>
    </div>
  )
}
