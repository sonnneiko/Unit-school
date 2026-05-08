import type { HelpIntroContent, HelpPortalsContent } from '../../types'
import styles from './slides.module.css'

type Props = {
  content: HelpIntroContent | HelpPortalsContent
}

export function HelpDocsSlide({ content }: Props) {
  if (content.variant === 'intro') return <HelpIntro content={content} />
  return <HelpPortals content={content} />
}

function HelpIntro({ content }: { content: HelpIntroContent }) {
  return (
    <div className={styles.recurringFull}>
      <div className={styles.recurringLeft}>
        <div className={styles.recurringTop}>
          <div className={styles.recurringEyebrow}>{content.eyebrow}</div>
          <h1 className={styles.recurringTitle}>{content.title}</h1>
        </div>
        <div className={styles.recurringBody}>
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
      </div>

      <div className={styles.recurringRight}>
        <div className={styles.recurringTop}>
          <div className={styles.recurringRightHeading}>Когда пригодится</div>
        </div>
        <div className={styles.recurringBody}>
          {content.useCases.map((c, i) => (
            <div key={i} className={styles.recurringNote}>
              <div className={styles.recurringNoteTitle}>{c.title}</div>
              <div className={styles.recurringNoteText}>{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function HelpPortals({ content }: { content: HelpPortalsContent }) {
  return (
    <div className={styles.helpPortalsFull}>
      <div className={styles.helpPortalsHeader}>
        <h1 className={styles.helpPortalsTitle}>{content.title}</h1>
        <span className={styles.helpPortalsSub}>{content.subtitle}</span>
      </div>
      <div className={styles.helpPortalsCols}>
        {content.portals.map((portal, i) => (
          <div key={i} className={styles.helpPortalCol}>
            <div>
              <span className={`${styles.helpPortalBadge} ${portal.badgeVariant === 'blue' ? styles.helpPortalBadgeBlue : styles.helpPortalBadgePurple}`}>
                {portal.badge}
              </span>
              <div className={styles.helpPortalUrl}>{portal.url}</div>
              <div className={styles.helpPortalTagline}>{portal.tagline}</div>
            </div>
            <div className={styles.helpSectionsGrid}>
              {portal.sections.map((s, j) => (
                <div key={j} className={styles.helpSectionChip}>
                  <div className={styles.helpSectionName}>{s.icon} {s.name}</div>
                  <div className={styles.helpSectionDesc}>{s.desc}</div>
                </div>
              ))}
            </div>
            <a
              href={portal.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.helpPortalCta} ${portal.badgeVariant === 'blue' ? styles.helpPortalCtaBlue : styles.helpPortalCtaPurple}`}
            >
              Открыть →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
