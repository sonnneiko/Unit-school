import { useState } from 'react'
import type { NichesContent } from '../../types'
import styles from './slides.module.css'

interface Props { content: NichesContent }

export function NichesSlide({ content }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)
  const niche = content.niches[activeIdx]

  return (
    <div className={styles.nichesRoot}>
      <div className={styles.nichesList}>
        {content.niches.map((n, i) => (
          <div
            key={n.id}
            className={`${styles.nicheCard} ${i === activeIdx ? styles.nicheCardActive : ''}`}
            onClick={() => setActiveIdx(i)}
          >
            <div className={styles.nicheCardEmoji}>{n.emoji}</div>
            <div>
              <div className={styles.nicheCardTitle}>{n.title}</div>
              <div className={styles.nicheCardSub}>{n.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.nichesDetail}>
        <div className={styles.nichesDetailInner}>
          <div className={styles.nichesDetailHeader}>
            <div className={styles.nichesDetailEmoji}>{niche.emoji}</div>
            <div>
              <div className={styles.nichesDetailTitle}>{niche.title}</div>
              <div className={styles.nichesDetailSub}>{niche.sub}</div>
            </div>
          </div>

          <div className={styles.attrSectionBlock}>
            <div className={styles.attrSectionHead} style={{ color: '#3b82f6' }}>
              👥 Целевая аудитория
            </div>
            <div className={styles.attrSectionBody}>
              <div style={{ fontSize: 13, color: '#4b5563', marginBottom: 8 }}>{niche.whoText}</div>
              <div className={styles.nichesTags}>
                {niche.whoTags.map((tag, i) => (
                  <span key={i} className={styles.nichesTag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.attrSectionBlock}>
            <div className={styles.attrSectionHead} style={{ color: '#ef4444' }}>
              😤 Боли мерчанта
            </div>
            <div className={styles.attrSectionBody}>
              <div className={styles.attrDotList}>
                {niche.pains.map((pain, i) => (
                  <div key={i} className={styles.attrDotItem}>
                    <div className={styles.attrDot} />
                    <div className={styles.attrDotText}>{pain}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.attrSectionBlock}>
            <div className={styles.attrSectionHead} style={{ color: '#22c55e' }}>
              💬 Скрипт первого сообщения
            </div>
            <div className={styles.attrSectionBody}>
              <div className={styles.nichesScriptBox} dangerouslySetInnerHTML={{ __html: niche.script }} />
            </div>
          </div>

          {niche.note && (
            <div className={styles.attrTipBox}>{niche.note}</div>
          )}

          {niche.lifehack && (
            <div className={styles.nichesLifehack}>💡 {niche.lifehack}</div>
          )}
        </div>
      </div>
    </div>
  )
}
