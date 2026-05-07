import { Fragment, useState } from 'react'
import type { FunnelContent } from '../../types'
import styles from './slides.module.css'

interface Props { content: FunnelContent }

const SOURCES = [
  '🔍 Google / Яндекс',
  '🤖 ChatGPT',
  '💬 Telegram-каналы',
  '📋 Каталоги сервисов',
  '🤝 Рекомендации партнёров',
]

const FOLLOWUPS = [
  { day: 'День 1', text: 'Отправил первое сообщение — кратко, без давления', active: true },
  { day: 'День 3–4', text: 'Напоминание: «Успели посмотреть информацию?»', active: false },
  { day: 'День 7', text: 'Финальный контакт: короткий оффер или вопрос', active: false },
  { day: 'Нет ответа', text: 'Пауза 2 недели → новый повод для касания', active: false },
]

export function FunnelSlide({ content }: Props) {
  const [activeIdx, setActiveIdx] = useState(0)
  const stage = content.stages[activeIdx]

  return (
    <div className={styles.funnelRoot}>
      <div className={styles.funnelPipeline}>
        <div className={styles.funnelPipelineInner}>
          {content.stages.map((s, i) => (
            <Fragment key={i}>
              <div
                className={`${styles.funnelStage} ${i === activeIdx ? styles.funnelStageActive : ''}`}
                onClick={() => setActiveIdx(i)}
              >
                <div className={styles.funnelStageShape}>
                  <div className={styles.funnelStageShapeBg} />
                  <div className={styles.funnelStageInner}>
                    <div className={styles.funnelStageEmoji}>{s.emoji}</div>
                    <div className={styles.funnelStageLabel}>{s.title}</div>
                  </div>
                </div>
                <div className={styles.funnelStageNum}>{i + 1}</div>
              </div>
              {i < content.stages.length - 1 && (
                <div className={styles.funnelArrow}>›</div>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      <div className={styles.funnelDetail}>
        <div className={styles.funnelDetailMain}>
          <div className={styles.funnelDetailHeader}>
            <div className={styles.funnelDetailEmoji}>{stage.emoji}</div>
            <div>
              <div className={styles.funnelDetailTitle}>{stage.title}</div>
              <div className={styles.funnelDetailSub}>{stage.sub}</div>
            </div>
          </div>

          {stage.sections.map((sec, si) => (
            <div key={si} className={styles.attrSectionBlock}>
              <div className={styles.attrSectionHead} style={{ color: sec.color }}>
                {sec.icon} {sec.label}
              </div>
              <div className={styles.attrSectionBody}>
                <div className={styles.attrDotList}>
                  {sec.content.split('\n').filter(Boolean).map((line, li) => (
                    <div key={li} className={styles.attrDotItem}>
                      <div className={styles.attrDot} />
                      <div className={styles.attrDotText} dangerouslySetInnerHTML={{ __html: line }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {stage.side !== 'none' && (
          <div className={styles.funnelDetailSide}>
            <div className={styles.funnelFollowupBlock}>
              {stage.side === 'sources' && (
                <>
                  <div className={styles.funnelFollowupTitle}>📍 ГДЕ ИСКАТЬ</div>
                  <div className={styles.funnelFuList}>
                    {SOURCES.map((src, i) => (
                      <div key={i} className={styles.funnelFuItem}>
                        <div className={`${styles.funnelFuDot} ${i === 0 ? styles.funnelFuDotActive : ''}`}>{i + 1}</div>
                        <div>
                          <div className={styles.funnelFuText}>{src}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {stage.side === 'followup' && (
                <>
                  <div className={styles.funnelFollowupTitle}>📅 ФОЛОУ-АП</div>
                  <div className={styles.funnelFuList}>
                    {FOLLOWUPS.map((fu, i) => (
                      <div key={i} className={styles.funnelFuItem}>
                        <div className={`${styles.funnelFuDot} ${fu.active ? styles.funnelFuDotActive : ''}`}>{i + 1}</div>
                        <div>
                          <div className={styles.funnelFuDay}>{fu.day}</div>
                          <div className={styles.funnelFuText}>{fu.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
