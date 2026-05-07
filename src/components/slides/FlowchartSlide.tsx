import { Fragment } from 'react'
import type { FlowchartContent } from '../../types'
import styles from './slides.module.css'

export function FlowchartSlide({ content }: { content: FlowchartContent }) {
  return (
    <div className={styles.flowchartFull}>
      <h1 className={styles.flowchartTitle}>{content.heading}</h1>

      <div className={styles.flowchartDiagram}>
        {content.steps.map((step, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <div className={styles.flowchartHArrowWrap}>
                <div className={styles.flowchartHArrow}>→</div>
              </div>
            )}

            <div className={styles.flowchartCol}>
              {/* Buyer circle above first column */}
              <div className={styles.flowchartColTop}>
                {i === 0 && (
                  <>
                    <div className={styles.flowchartBuyerCircle}>{content.buyerLabel}</div>
                    <div className={styles.flowchartVLine} />
                  </>
                )}
              </div>

              {/* Main box */}
              <div className={`${styles.flowchartBox} ${step.variant === 'green' ? styles.flowchartBoxGreen : styles.flowchartBoxBlue}`}>
                {step.logo && <img src={step.logo} alt={step.label} className={`${styles.flowchartBoxLogo} ${step.variant === 'green' ? styles.flowchartBoxLogoBlack : ''}`} />}
                <span>{step.label}</span>
              </div>

              {/* Actions */}
              <div className={styles.flowchartActions}>
                {step.actions.map((action, j) => (
                  <Fragment key={j}>
                    <div className={styles.flowchartVLine} />
                    <div className={styles.flowchartDot} />
                    <div className={styles.flowchartHex}>{action}</div>
                  </Fragment>
                ))}

                {/* Final node под последней колонкой */}
                {i === content.steps.length - 1 && content.finalNode && (
                  <>
                    <div className={styles.flowchartVLine} />
                    <div className={`${styles.flowchartBox} ${styles.flowchartBoxGreen}`}>
                      {content.finalNode.logo && (
                        <img src={content.finalNode.logo} alt={content.finalNode.label} className={`${styles.flowchartBoxLogo} ${styles.flowchartBoxLogoBlack}`} />
                      )}
                      <span>{content.finalNode.label}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
