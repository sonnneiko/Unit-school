import type {
  VatContent,
  VatDefinitionContent,
  VatLawContent,
  VatCalculationContent,
  VatSpecialContent,
  VatFaqContent,
} from '../../types'
import styles from './slides.module.css'

type Props = { content: VatContent }

export function VatSlide({ content }: Props) {
  switch (content.variant) {
    case 'definition':   return <VatDefinition content={content} />
    case 'law':          return <VatLaw content={content} />
    case 'calculation':  return <VatCalculation content={content} />
    case 'special':      return <VatSpecial content={content} />
    case 'faq':          return <VatFaq content={content} />
  }
}

function VatDefinition({ content }: { content: VatDefinitionContent }) {
  return (
    <div className={styles.recurringFull}>
      <div className={styles.recurringLeft}>
        <div className={styles.recurringTop}>
          <div className={styles.vatEyebrow}>{content.eyebrow}</div>
          <h1 className={styles.recurringTitle}>{content.title}</h1>
        </div>
        <div className={styles.recurringBody}>
          <div className={styles.vatAlert}>{content.alert}</div>
          <p className={styles.vatDesc}>{content.description}</p>
        </div>
      </div>

      <div className={styles.recurringRight}>
        <div className={styles.recurringTop}>
          <div className={styles.recurringRightHeading}>{content.rightLabel}</div>
        </div>
        <div className={styles.recurringBody}>
          {content.compareCards.map((card, i) => (
            <div
              key={i}
              className={`${styles.vatCompareCard} ${card.variant === 'receipt' ? styles.vatCompareCardReceipt : styles.vatCompareCardTxn}`}
            >
              <div className={styles.vatCardLabel}>{card.label}</div>
              <div className={styles.vatCardTitle}>{card.title}</div>
              <div className={styles.vatCardDesc}>{card.desc}</div>
              {card.badge && (
                <span className={`${styles.vatCardBadge} ${card.variant === 'receipt' ? styles.vatCardBadgeGrey : styles.vatCardBadgeGreen}`}>
                  {card.badge}
                </span>
              )}
            </div>
          ))}
          <div className={styles.vatNote}>{content.note}</div>
        </div>
      </div>
    </div>
  )
}

function VatLaw({ content }: { content: VatLawContent }) {
  return (
    <div className={styles.recurringFull}>
      <div className={styles.recurringLeft}>
        <div className={styles.recurringTop}>
          <div className={styles.vatEyebrow}>{content.eyebrow}</div>
          <h1 className={styles.recurringTitle}>{content.title}</h1>
        </div>
        <div className={styles.recurringBody}>
          <div className={styles.vatLawCard}>
            <div className={styles.vatLawTitle}>{content.lawTitle}</div>
            <div className={styles.vatLawText}>{content.lawText}</div>
          </div>
          <p className={styles.vatDesc}>{content.description}</p>
        </div>
      </div>

      <div className={styles.recurringRight}>
        <div className={styles.recurringTop}>
          <div className={styles.recurringRightHeading}>{content.rightLabel}</div>
        </div>
        <div className={styles.recurringBody}>
          <div className={styles.vatOpsPair}>
            <div className={styles.vatOpsCol}>
              <div className={`${styles.vatOpsHeader} ${styles.vatOpsHeaderRed}`}>❗ Облагаются НДС</div>
              {content.taxedItems.map((item, i) => (
                <div key={i} className={styles.vatOpsItem}>{item}</div>
              ))}
            </div>
            <div className={styles.vatOpsCol}>
              <div className={`${styles.vatOpsHeader} ${styles.vatOpsHeaderGreen}`}>✅ Не облагаются</div>
              {content.notTaxedItems.map((item, i) => (
                <div key={i} className={styles.vatOpsItem}>{item}</div>
              ))}
            </div>
          </div>
          <div className={styles.vatNote}>{content.note}</div>
        </div>
      </div>
    </div>
  )
}

function VatCalculation({ content }: { content: VatCalculationContent }) {
  return (
    <div className={styles.vatCalcFull}>
      <div className={styles.vatCalcHeader}>
        <div className={styles.vatEyebrow}>{content.eyebrow}</div>
        <h1 className={styles.vatCalcTitle}>{content.title}</h1>
        <div className={styles.vatCalcSubtitle}>{content.subtitle}</div>
      </div>
      <div className={styles.vatCalcBody}>
        <div className={styles.vatFormula}>
          <div className={styles.vatFormulaLabel}>Формула</div>
          <div className={styles.vatFormulaEq}>{content.formulaEq}</div>
          <div className={styles.vatFormulaSub}>{content.formulaSub}</div>
          {content.formulaNotes.map((note, i) => (
            <div key={i} className={styles.vatFormulaNote}>{note}</div>
          ))}
        </div>
        <div className={styles.vatTariffCards}>
          {content.tariffs.map((t, i) => (
            <div key={i} className={`${styles.vatTariffCard} ${t.highlight ? styles.vatTariffCardHighlight : ''}`}>
              <div className={styles.vatTariffTier}>{t.tier}</div>
              <div className={styles.vatTariffVolume}>{t.volume}</div>
              <div className={styles.vatTariffRow}>
                <span>Базовая ставка</span><span>{t.baseRate}</span>
              </div>
              <div className={styles.vatTariffRow}>
                <span>НДС 22%</span><span>{t.vat}</span>
              </div>
              <div className={`${styles.vatTariffRow} ${styles.vatTariffTotal}`}>
                <span>Итого</span><span>{t.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function VatSpecial({ content }: { content: VatSpecialContent }) {
  return (
    <div className={styles.vatSpecialFull}>
      <div className={styles.vatSpecialLeft}>
        <div className={styles.recurringTop}>
          <div className={styles.vatEyebrow}>{content.eyebrow}</div>
          <h1 className={styles.recurringTitle}>{content.title}</h1>
        </div>
        <div className={styles.recurringBody}>
          {content.banks.map((bank, i) => (
            <div
              key={i}
              className={`${styles.vatBankCard} ${bank.variant === 'tochka' ? styles.vatBankCardTochka : styles.vatBankCardStandard}`}
            >
              <div className={styles.vatBankName}>{bank.name}</div>
              <div className={styles.vatBankDesc}>{bank.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.vatSpecialRight}>
        <div className={styles.recurringTop} style={{ paddingLeft: 36, paddingRight: 36 }}>
          <div className={styles.recurringRightHeading}>{content.rightLabel}</div>
        </div>
        <div className={styles.recurringBody} style={{ paddingLeft: 36, paddingRight: 36 }}>
          <div className={styles.vatMinCard}>
            <div className={styles.vatMinTitle}>{content.minCommTitle}</div>
            <div className={styles.vatMinRow}>{content.minCommDesc}</div>
            <div className={styles.vatMinRow} style={{ marginTop: 8 }}>{content.minCommCalc}</div>
            <span className={styles.vatMinHighlight}>всегда = 1,08 ₽</span>
            <div className={styles.vatMinRow} style={{ marginTop: 10 }}>{content.minCommConclusion}</div>
          </div>
          <div className={styles.vatNote} style={{ whiteSpace: 'pre-line' }}>{content.whereNote}</div>
        </div>
      </div>
    </div>
  )
}

function VatFaq({ content }: { content: VatFaqContent }) {
  return (
    <div className={styles.vatFaqFull}>
      <div className={styles.vatFaqHeader}>
        <div className={styles.vatEyebrow}>{content.eyebrow}</div>
        <h1 className={styles.vatFaqTitle}>{content.title}</h1>
      </div>
      <div className={styles.vatFaqGrid}>
        {content.items.map((item, i) => (
          <div key={i} className={styles.vatFaqItem}>
            <div className={styles.vatFaqQ}>{item.q}</div>
            <div className={styles.vatFaqA}>{item.a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
