import type { RecurringOverviewContent, RecurringRequirementsContent } from '../../types'
import styles from './slides.module.css'

type Props = {
  content: RecurringOverviewContent | RecurringRequirementsContent
}

export function RecurringSlide({ content }: Props) {
  if (content.variant === 'overview') return <RecurringOverview content={content} />
  return <RecurringRequirements content={content} />
}

function RecurringOverview({ content }: { content: RecurringOverviewContent }) {
  return (
    <div className={styles.recurringFull}>
      <div className={styles.recurringLeft}>
        <span className={styles.recurringTag}>{content.tag}</span>
        <h1 className={styles.recurringTitle}>{content.title}</h1>
        <p className={styles.recurringDesc}>{content.description}</p>
        <ul className={styles.recurringFacts}>
          {content.facts.map((f, i) => (
            <li key={i} className={styles.recurringFact}>
              <span className={styles.recurringDot} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.recurringRight}>
        <div className={styles.recurringRightHeading}>Важно знать</div>
        {content.notes.map((n, i) => (
          <div key={i} className={`${styles.recurringNote} ${n.warn ? styles.recurringNoteWarn : ''}`}>
            <div className={styles.recurringNoteTitle}>{n.title}</div>
            <div className={styles.recurringNoteText}>{n.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecurringRequirements({ content }: { content: RecurringRequirementsContent }) {
  return (
    <div className={`${styles.recurringFull} ${styles.recurringReqFull}`}>
      <div className={styles.recurringLeft}>
        <div className={styles.recurringEyebrow}>{content.eyebrow}</div>
        <h1 className={styles.recurringTitle}>{content.title}</h1>
        <p className={styles.recurringSubQuote}>{content.sub}</p>
        <div className={styles.recurringReqList}>
          {content.requirements.map((r, i) => (
            <div key={i} className={styles.recurringReqItem}>
              <div className={styles.recurringReqIcon}>{r.emoji}</div>
              <div>
                <div className={styles.recurringReqName}>{r.name}</div>
                <div className={styles.recurringReqDesc}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.recurringReqRight}>
        <div className={styles.recurringCheckCard}>
          <div className={styles.recurringCheckHeader}>Чеклист мерчанта</div>
          {content.checklist.map((item, i) => (
            <div key={i} className={`${styles.recurringCheckRow} ${item.done ? styles.recurringCheckDone : styles.recurringCheckPending}`}>
              <div className={`${styles.recurringCheckBox} ${item.done ? styles.recurringCheckBoxDone : ''}`}>
                {item.done && '✓'}
              </div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.recurringBadge}>{content.badge}</div>
      </div>
    </div>
  )
}
