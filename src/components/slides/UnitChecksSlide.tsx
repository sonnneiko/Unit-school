import type {
  UnitChecksContent,
  UnitChecksIntroContent,
  UnitChecksLawContent,
  UnitChecksSchemeContent,
  UnitChecksDataContent,
  UnitChecksFaqContent,
} from '../../types'
import styles from './slides.module.css'

// ── Slide 1: Intro ───────────────────────────────────────────
function UcIntro({ c }: { c: UnitChecksIntroContent }) {
  return (
    <div className={styles.recurringFull} style={{ flexDirection: 'row' }}>
      <div className={styles.recurringLeft}>
        <div className={styles.recurringTop}>
          <div className={styles.recurringEyebrow}>{c.eyebrow}</div>
          <h1 className={styles.recurringTitle} dangerouslySetInnerHTML={{ __html: c.title }} />
        </div>
        <div className={styles.recurringBody}>
          <div className={styles.ucWarn}>{c.warn}</div>
          <div className={styles.ucSectionLabel}>{c.checklistLabel}</div>
          <div className={styles.ucChecklist}>
            {c.checklist.map((item, i) => (
              <div key={i} className={styles.ucCheckItem}>
                <div className={styles.ucCheckIcon}>✓</div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.ucReceiptImg}>
        <img src={c.image} alt="ЮнитЧеки" />
      </div>
    </div>
  )
}

// ── Slide 2: 54-ФЗ ──────────────────────────────────────────
function UcLaw({ c }: { c: UnitChecksLawContent }) {
  return (
    <div className={styles.recurringFull} style={{ flexDirection: 'row' }}>
      <div className={styles.recurringLeft}>
        <div className={styles.recurringTop}>
          <div className={styles.recurringEyebrow}>{c.eyebrow}</div>
          <h1 className={styles.recurringTitle} dangerouslySetInnerHTML={{ __html: c.title }} />
        </div>
        <div className={styles.recurringBody}>
          <div className={styles.ucLawCard}>
            <div className={styles.ucLawTitle}>{c.lawCard.title}</div>
            <div className={styles.ucLawText}>{c.lawCard.text}</div>
          </div>
          <div className={styles.ucReqList}>
            {c.reqItems.map((r, i) => (
              <div key={i} className={styles.ucReqItem}>
                <span>{r.icon}</span>
                <span>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.recurringRight}>
        <div className={styles.recurringTop}>
          <div className={styles.recurringRightHeading}>{c.rightLabel}</div>
        </div>
        <div className={styles.recurringBody}>
          <table className={styles.ucFinesTable}>
            <thead>
              <tr>
                <th>Нарушение</th>
                <th>ИП</th>
                <th>Юр. лицо</th>
              </tr>
            </thead>
            <tbody>
              {c.fines.map((row, i) => (
                <tr key={i}>
                  <td className={styles.ucFinesName}>{row.name}</td>
                  <td className={row.ipClass === 'red' ? styles.ucFineRed : row.ipClass === 'orange' ? styles.ucFineOrange : undefined}>{row.ip}</td>
                  <td className={row.urClass === 'red' ? styles.ucFineRed : row.urClass === 'orange' ? styles.ucFineOrange : undefined}>{row.ur}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.ucAlert}>{c.alert}</div>
        </div>
      </div>
    </div>
  )
}

// ── Slide 3: Scheme ──────────────────────────────────────────
function UcScheme({ c }: { c: UnitChecksSchemeContent }) {
  return (
    <div className={styles.ucSchemeFull}>
      <div className={styles.ucSchemeHeader}>
        <div className={styles.recurringEyebrow}>{c.eyebrow}</div>
        <h1 className={styles.ucSchemeTitle}>{c.title}</h1>
      </div>
      <div className={styles.ucSchemeBody}>
        {c.nodes.map((node, i) => (
          <>
            <div key={node.title} className={`${styles.ucSchemeNode} ${styles[`ucNode_${node.variant}`]}`}>
              <div className={styles.ucNodeIcon}>{node.icon}</div>
              <div className={styles.ucNodeTitle}>{node.title}</div>
              <div className={styles.ucNodeRole}>{node.role}</div>
              <div className={styles.ucNodeDesc}>{node.desc}</div>
            </div>
            {i < c.nodes.length - 1 && <div key={`arrow-${i}`} className={styles.ucArrow}>→</div>}
          </>
        ))}
      </div>
    </div>
  )
}

// ── Slide 4: Data ────────────────────────────────────────────
function UcData({ c }: { c: UnitChecksDataContent }) {
  return (
    <div className={styles.recurringFull} style={{ flexDirection: 'row' }}>
      <div className={styles.recurringLeft}>
        <div className={styles.recurringTop}>
          <div className={styles.recurringEyebrow}>{c.eyebrow}</div>
          <h1 className={styles.recurringTitle} dangerouslySetInnerHTML={{ __html: c.title }} />
        </div>
        <div className={styles.recurringBody}>
          {c.leftBlocks.map((block, i) => (
            <div key={i} className={`${styles.ucDataBlock} ${styles[`ucDataBlock_${block.color}`]}`}>
              <div className={styles.ucDataBlockTitle}>{block.title}</div>
              {block.tags && (
                <div className={styles.ucDataTags}>
                  {block.tags.map((tag, j) => <span key={j} className={styles.ucDataTag}>{tag}</span>)}
                </div>
              )}
              {block.note && <div className={styles.ucDataBlockNote}>{block.note}</div>}
              {block.text && <div className={styles.ucDataBlockText}>{block.text}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.recurringRight}>
        <div className={styles.recurringTop}>
          <div className={styles.recurringRightHeading}>{c.rightLabel}</div>
        </div>
        <div className={styles.recurringBody}>
          <div className={styles.ucVatRates}>
            {c.vatRates.map((r, i) => <span key={i} className={styles.ucVatRate}>{r}</span>)}
          </div>
          <div className={styles.ucNote}>{c.vatNote}</div>
          <div className={`${styles.ucDataBlock} ${styles[`ucDataBlock_${c.partnersBlock.color}`]}`}>
            <div className={styles.ucDataBlockTitle}>{c.partnersBlock.title}</div>
            {c.partnersBlock.text && <div className={styles.ucDataBlockText}>{c.partnersBlock.text}</div>}
            {c.partnersBlock.note && <div className={styles.ucDataBlockNote}>{c.partnersBlock.note}</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Slide 5: FAQ ─────────────────────────────────────────────
function UcFaq({ c }: { c: UnitChecksFaqContent }) {
  return (
    <div className={styles.ucFaqFull}>
      <div className={styles.ucFaqHeader}>
        <div className={styles.recurringEyebrow}>{c.eyebrow}</div>
        <h1 className={styles.ucFaqTitle}>{c.title}</h1>
      </div>
      <div className={styles.ucFaqGrid}>
        {c.items.map((item, i) => (
          <div key={i} className={styles.ucFaqItem}>
            <div className={styles.ucFaqQ}>{item.q}</div>
            <div className={styles.ucFaqA}>{item.a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main dispatcher ──────────────────────────────────────────
export function UnitChecksSlide({ content }: { content: UnitChecksContent }) {
  switch (content.variant) {
    case 'uc-intro':    return <UcIntro c={content as UnitChecksIntroContent} />
    case 'uc-law':      return <UcLaw c={content as UnitChecksLawContent} />
    case 'uc-scheme':   return <UcScheme c={content as UnitChecksSchemeContent} />
    case 'uc-data':     return <UcData c={content as UnitChecksDataContent} />
    case 'uc-faq':      return <UcFaq c={content as UnitChecksFaqContent} />
    default:            return <div>Неизвестный вариант</div>
  }
}
