import { useState, useEffect } from 'react'
import type {
  KanbanIntroContent,
  KanbanBoardContent,
  KanbanRulesContent,
  KanbanCommunicationContent,
} from '../../types'
import styles from './slides.module.css'

type Props = {
  content: KanbanIntroContent | KanbanBoardContent | KanbanRulesContent | KanbanCommunicationContent
  onLastTab?: (isLast: boolean) => void
}

export function KanbanSlide({ content, onLastTab }: Props) {
  if (content.variant === 'intro') return <KanbanIntro content={content} />
  if (content.variant === 'board') return <KanbanBoard content={content} onLastTab={onLastTab} />
  if (content.variant === 'rules') return <KanbanRules content={content} />
  return <KanbanCommunication content={content} />
}

function KanbanIntro({ content }: { content: KanbanIntroContent }) {
  return (
    <div className={styles.kanbanRulesFull}>
      <div className={styles.kanbanRulesTopLeft}>
        <div className={styles.recurringEyebrow}>{content.eyebrow}</div>
        <h1 className={styles.recurringTitle}>{content.title}</h1>
      </div>
      <div className={styles.kanbanRulesTopRight}>
        <div className={styles.recurringRightHeading}>Перед созданием карточки</div>
      </div>
      <div className={styles.kanbanRulesBodyLeft}>
        <p className={styles.recurringDesc}>{content.description}</p>
        <ul className={styles.recurringFacts}>
          {content.bullets.map((b, i) => (
            <li key={i} className={styles.recurringFact}>
              <span className={styles.recurringDot} />
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.kanbanRulesBodyRight}>
        {content.checklist.map((item) => (
          <div key={item.step} className={styles.kanbanCheckCard}>
            <div className={styles.kanbanCheckNum}>{item.step}</div>
            <div className={styles.kanbanCheckText}>{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const BADGE_CLASS: Record<string, string> = {
  red: styles.kanbanBadgeRed,
  blue: styles.kanbanBadgeBlue,
  yellow: styles.kanbanBadgeYellow,
  green: styles.kanbanBadgeGreen,
  teal: styles.kanbanBadgeTeal,
  gray: styles.kanbanBadgeGray,
  purple: styles.kanbanBadgePurple,
}

function KanbanBoard({ content, onLastTab }: { content: KanbanBoardContent; onLastTab?: (v: boolean) => void }) {
  const [activeId, setActiveId] = useState<string>(content.columns[0]?.id ?? '')
  const activeCol = content.columns.find(c => c.id === activeId)
  const lastColId = content.columns[content.columns.length - 1]?.id ?? ''
  const lastColName = content.columns[content.columns.length - 1]?.badge ?? ''

  useEffect(() => {
    onLastTab?.(activeId === lastColId)
  }, [activeId])

  return (
    <div className={styles.kanbanFull}>
      <div className={styles.kanbanBoard}>
        <div className={styles.kanbanBoardHeader}>
          <div className={styles.kanbanBoardTitle}>{content.boardTitle}</div>
          <div className={styles.kanbanBoardSubtitle}>{content.boardSubtitle ?? 'Account + PM · Таблица'}</div>
        </div>
        <div className={content.twoRows ? styles.kanbanColsTwoRows : styles.kanbanCols}>
          {content.columns.map(col => (
            <div
              key={col.id}
              className={`${styles.kanbanCol} ${col.id === activeId ? styles.kanbanColActive : ''}`}
              onClick={() => setActiveId(col.id)}
            >
              <div className={styles.kanbanColHeader}>
                <div className={`${styles.kanbanColBadge} ${BADGE_CLASS[col.badgeColor]}`}>
                  {col.badge}
                </div>
                <div className={styles.kanbanColCount}>{col.cards?.length ?? 0}</div>
              </div>
              {col.cards?.map((card, i) => (
                <div key={i} className={styles.kanbanCard}>
                  <div className={styles.kanbanCardTitle}>{card.title}</div>
                  <div className={styles.kanbanCardAssignee}>
                    <div
                      className={styles.kanbanCardAvatar}
                      style={{ background: card.assigneeColor }}
                    >
                      {card.assignee[0]}
                    </div>
                    {card.assignee}
                  </div>
                </div>
              ))}
              <div className={styles.kanbanAddCard}>+ Добавить карточку</div>
            </div>
          ))}
        </div>
        <div className={styles.kanbanBoardHint}>
          <div className={styles.kanbanBoardHintIcon}>↑</div>
          <div className={styles.kanbanBoardHintText}>Нажимай на колонки, чтобы изучить каждый этап доски</div>
          <div className={styles.kanbanBoardHintSub}>
            {activeId === lastColId
              ? 'Отлично! Ты изучил все этапы — можно двигаться дальше →'
              : `Дойди до колонки «${lastColName}», чтобы продолжить`}
          </div>
        </div>
      </div>

      <div className={styles.kanbanDetail}>
        {activeCol ? (
          <>
            <div className={styles.kanbanDetailTop}>
              <div className={styles.kanbanDetailEyebrow}>Описание колонки</div>
              <div className={styles.kanbanDetailStepRow}>
                <div
                  className={`${styles.kanbanStepNum} ${activeCol.step === null ? styles.kanbanStepNumGray : ''}`}
                >
                  {activeCol.step !== null ? activeCol.step : '→'}
                </div>
                <div className={styles.kanbanDetailColName}>{activeCol.badge}</div>
              </div>
            </div>
            <div className={styles.kanbanDetailBody}>
              <div><span className={styles.kanbanDetailWho}>{activeCol.who}</span></div>
              <div className={styles.kanbanDetailDesc}>{activeCol.desc}</div>
              <div className={styles.kanbanDetailHint}>
                <div className={styles.kanbanDetailHintTitle}>Что делать АМ</div>
                {activeCol.hint}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.kanbanDetailDefault}>
            <span>←</span>
            <span>Кликни на колонку, чтобы узнать что она значит</span>
          </div>
        )}
      </div>
    </div>
  )
}

function KanbanRules({ content }: { content: KanbanRulesContent }) {
  return (
    <div className={styles.kanbanRulesFull}>
      <div className={styles.kanbanRulesTopLeft}>
        <h1 className={styles.recurringTitle}>{content.title}</h1>
      </div>
      <div className={styles.kanbanRulesTopRight}>
        <div className={styles.recurringRightHeading}>Тело карточки</div>
      </div>
      <div className={styles.kanbanRulesBodyLeft}>
        <p className={styles.recurringDesc}>
          <strong>{content.formatLabel}:</strong> {content.formatExample}
        </p>
        <div className={styles.kanbanExamples}>
          {content.examples.map((ex, i) => (
            <div key={i} className={styles.kanbanExampleItem}>{ex}</div>
          ))}
        </div>
      </div>
      <div className={styles.kanbanRulesBodyRight}>
        <ul className={styles.recurringFacts}>
          {content.bodyRules.map((rule, i) => (
            <li key={i} className={styles.recurringFact}>
              <span className={styles.recurringDot} />
              {rule}
            </li>
          ))}
        </ul>
        {content.warning && <div className={styles.kanbanWarning}>⚠️ {content.warning}</div>}
      </div>
    </div>
  )
}

function KanbanCommunication({ content }: { content: KanbanCommunicationContent }) {
  return (
    <div className={styles.kanbanRulesFull}>
      <div className={styles.kanbanRulesTopLeft}>
        <h1 className={styles.recurringTitle}>{content.title}</h1>
      </div>
      <div className={styles.kanbanRulesTopRight}>
        <div className={styles.recurringRightHeading}>Пример сообщения в чат</div>
      </div>
      <div className={styles.kanbanRulesBodyLeft}>
        <div className={styles.recurringRightHeading} style={{ marginBottom: 12 }}>
          Срочный вопрос
        </div>
        <div className={styles.kanbanUrgentBlock}>
          <div className={styles.kanbanUrgentIcon}>⚡</div>
          <div className={styles.kanbanUrgentText}>{content.urgentText}</div>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '16px 0' }} />
        <div className={styles.recurringRightHeading} style={{ marginBottom: 12 }}>
          Личные сообщения
        </div>
        {content.dmAllowed.map((text, i) => (
          <div key={i} className={styles.kanbanDmRule}>
            <span className={styles.kanbanDmOk}>✓</span>
            <span>{text}</span>
          </div>
        ))}
        {content.dmForbidden.map((text, i) => (
          <div key={i} className={styles.kanbanDmRule}>
            <span className={styles.kanbanDmNo}>✗</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
      <div className={styles.kanbanRulesBodyRight}>
        <div className={styles.kanbanTgMock}>
          <div className={styles.kanbanTgMockTitle}>{content.urgentChat}</div>
          {content.exampleMessages.map((msg, i) => (
            <div key={i} className={styles.kanbanTgMessage}>
              {msg.text.split(/(@\S+)/g).map((part, j) =>
                part.startsWith('@')
                  ? <span key={j} className={styles.kanbanTgTag}>{part}</span>
                  : part
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
