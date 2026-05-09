import type {
  ReqContent,
  ReqIntroContent,
  ReqStatusesContent,
  ReqSiteContent,
  ReqPortalsContent,
  ReqProhibitedContent,
} from '../../types'
import styles from './slides.module.css'

type Props = { content: ReqContent }

export function RequirementsSlide({ content }: Props) {
  switch (content.variant) {
    case 'req-intro':      return <ReqIntro content={content} />
    case 'req-statuses':   return <ReqStatuses content={content} />
    case 'req-site':       return <ReqSite content={content} />
    case 'req-portals':    return <ReqPortals content={content} />
    case 'req-prohibited': return <ReqProhibited content={content} />
  }
}

function ReqIntro({ content }: { content: ReqIntroContent }) {
  return (
    <div className={styles.recurringFull}>
      <div className={styles.recurringLeft}>
        <div className={styles.recurringTop}>
          <div className={styles.vatEyebrow}>{content.eyebrow}</div>
          <h1 className={styles.recurringTitle}>{content.title}</h1>
        </div>
        <div className={styles.recurringBody}>
          {content.timelineItems.map((item, i) => (
            <div key={i} className={styles.reqTimelineRow}>
              <span className={styles.reqTimelineIcon}>{item.icon}</span>
              <span className={styles.reqTimelineText} dangerouslySetInnerHTML={{ __html: item.text }} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.recurringRight}>
        <div className={styles.recurringTop}>
          <div className={styles.recurringRightHeading}>{content.outcomesLabel}</div>
        </div>
        <div className={styles.recurringBody}>
          <div className={styles.reqOutcomePair}>
            {content.outcomes.map((o, i) => (
              <div key={i} className={`${styles.reqOutcomeCard} ${o.type === 'starter' ? styles.reqOutcomeStarter : styles.reqOutcomeFinal}`}>
                <div className={styles.reqOutcomeLabel}>{o.label}</div>
                <div className={styles.reqOutcomeTitle}>{o.title}</div>
                <div className={styles.reqOutcomeDesc}>{o.desc}</div>
              </div>
            ))}
          </div>
          <div className={styles.vatNote}>{content.note}</div>
        </div>
      </div>
    </div>
  )
}

function ReqStatuses({ content }: { content: ReqStatusesContent }) {
  return (
    <div className={styles.reqStatusFull}>
      <div className={styles.reqStatusHeader}>
        <div className={styles.vatEyebrow}>{content.eyebrow}</div>
        <h1 className={styles.vatCalcTitle}>{content.title}</h1>
      </div>
      <div className={styles.reqStatusBody}>
        {content.statuses.map((s, i) => (
          <div key={i} className={`${styles.reqStatusCard} ${styles[`reqStatus_${s.key}`]}`}>
            <div className={styles.reqStatusTop}>
              <div className={`${styles.reqStatusDot} ${styles[`reqStatusDot_${s.key}`]}`} />
              <div className={styles.reqStatusName}>{s.name}</div>
            </div>
            <div className={styles.reqStatusDesc}>{s.desc}</div>
            <div className={styles.reqStatusAction}>{s.action}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReqSite({ content }: { content: ReqSiteContent }) {
  return (
    <div className={styles.recurringFull}>
      <div className={styles.recurringLeft}>
        <div className={styles.recurringTop}>
          <div className={styles.vatEyebrow}>{content.eyebrow}</div>
          <h1 className={styles.recurringTitle}>{content.title}</h1>
        </div>
        <div className={styles.recurringBody}>
          <div className={styles.reqChecklist}>
            {content.checklist.map((item, i) => (
              <div key={i} className={styles.reqCheckItem}>
                <div className={styles.reqCheckIcon}>✓</div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.recurringRight}>
        <div className={styles.recurringTop}>
          <div className={styles.recurringRightHeading}>{content.rightLabel}</div>
        </div>
        <div className={styles.recurringBody}>
          <div className={styles.reqTechCards}>
            {content.techCards.map((card, i) => (
              <div key={i} className={styles.reqTechCard}>
                <div className={styles.reqTechTitle}>{card.icon} {card.title}</div>
                <div className={styles.reqTechDesc}>{card.desc}</div>
              </div>
            ))}
          </div>
          <div className={styles.vatNote}>{content.note}</div>
        </div>
      </div>
    </div>
  )
}

function ReqPortals({ content }: { content: ReqPortalsContent }) {
  return (
    <div className={styles.reqPortalsFull}>
      <div className={styles.reqPortalsHeader}>
        <div className={styles.vatEyebrow}>{content.eyebrow}</div>
        <h1 className={styles.vatCalcTitle}>{content.title}</h1>
      </div>
      <div className={styles.reqPortalsCols}>
        {content.portals.map((portal, i) => (
          <div key={i} className={`${styles.reqPortalCol} ${portal.badgeVariant === 'ru' ? styles.reqPortalColRu : styles.reqPortalColMoney}`}>
            <div>
              <span className={`${styles.reqPortalBadge} ${portal.badgeVariant === 'ru' ? styles.reqPortalBadgeRu : styles.reqPortalBadgeMoney}`}>
                {portal.badgeLabel}
              </span>
              <div className={styles.reqPortalUrl}>{portal.url}</div>
              <div className={styles.reqPortalTagline}
                dangerouslySetInnerHTML={{ __html: portal.tagline }}
              />
            </div>
            <div className={styles.reqPortalRows}>
              {portal.rows.map((row, j) => (
                <div key={j} className={styles.reqPortalRow}>
                  <span className={styles.reqPortalRowIcon}>{row.icon}</span>
                  <span className={styles.reqPortalRowText}>{row.text}</span>
                  {row.badge && (
                    <span className={`${styles.reqDiffBadge} ${
                      row.badgeVariant === 'ru' ? styles.reqDiffBadgeRu :
                      row.badgeVariant === 'money' ? styles.reqDiffBadgeMoney :
                      styles.reqDiffBadgeBoth
                    }`}>{row.badge}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReqProhibited({ content }: { content: ReqProhibitedContent }) {
  const half = Math.ceil(content.items.length / 2)
  const left = content.items.slice(0, half)
  const right = content.items.slice(half)

  return (
    <div className={styles.reqProhibFull}>
      <div className={styles.reqProhibHeader}>
        <div className={styles.vatEyebrow}>{content.eyebrow}</div>
        <h1 className={styles.vatFaqTitle}>{content.title}</h1>
      </div>
      <div className={styles.reqProhibBody}>
        {[left, right].map((col, ci) => (
          <div key={ci} className={styles.reqProhibCol}>
            {col.map((item, i) => (
              <div key={i} className={styles.reqProhibItem}>
                <div className={styles.reqProhibX}>✕</div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
