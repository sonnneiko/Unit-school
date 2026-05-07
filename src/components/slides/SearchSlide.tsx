import { useState } from 'react'
import type { SearchContent } from '../../types'
import styles from './slides.module.css'

interface Props {
  content: SearchContent
}

export function SearchSlide({ content }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)
  const ch = content.channels[activeIdx]

  return (
    <div className={styles.searchRoot}>
      <div className={styles.searchContent}>
        <div className={styles.searchTabs}>
          {content.channels.map((c, i) => (
            <div
              key={i}
              className={`${styles.searchTab} ${i === activeIdx ? styles.searchTabActive : ''}`}
              onClick={() => setActiveIdx(i)}
            >
              {c.icon} {c.title}
            </div>
          ))}
        </div>

        <div className={styles.searchPanel}>
          <div className={styles.searchMain}>
            <div className={styles.searchChannelHeader}>
              <div className={styles.searchChannelIcon}>{ch.icon}</div>
              <div>
                <div className={styles.searchChannelName}>{ch.title}</div>
                <div className={styles.searchChannelSub}>{ch.sub}</div>
              </div>
            </div>

            {ch.sections.map((sec, si) => (
              <div key={si} className={styles.attrSectionBlock}>
                <div className={styles.attrSectionHead} style={{ color: sec.color }}>
                  {sec.icon} {sec.label}
                </div>
                <div className={styles.attrSectionBody}>
                  {sec.items.length > 0 && sec.items[0].startsWith('<span') ? (
                    <div className={styles.searchQueryTags}>
                      {sec.items.map((item, ii) => (
                        <span key={ii} className={styles.searchQueryTag} dangerouslySetInnerHTML={{ __html: item }} />
                      ))}
                    </div>
                  ) : (
                    <div className={styles.attrDotList}>
                      {sec.items.map((item, ii) => (
                        <div key={ii} className={styles.attrDotItem}>
                          <div className={styles.attrDot} />
                          <div className={styles.attrDotText} dangerouslySetInnerHTML={{ __html: item }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className={styles.attrTipBox}>{ch.tip}</div>
          </div>

          <div className={styles.searchSide}>
            <div className={styles.attrSideCard}>
              <div className={styles.attrSideCardTitle}>{ch.side.title}</div>
              {ch.side.items.map((item, i) => (
                <div key={i} className={styles.attrCkRow}>
                  <div className={styles.attrCkDot} />
                  <div className={styles.attrCkText}>{item}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
