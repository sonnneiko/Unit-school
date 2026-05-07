import type { DiagramContent } from '../../types'
import styles from './slides.module.css'

export function DiagramSlide({ content }: { content: DiagramContent }) {
  return (
    <div className={styles.slideWrapper}>
      <div className={styles.diagramCard}>
        {content.heading && <h2 className={styles.slideHeading}>{content.heading}</h2>}
        <div className={styles.diagramFlow}>
          {content.nodes.map((node, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <span className={styles.diagramNode}>{node.label}</span>
              {i < content.nodes.length - 1 && (
                <span className={styles.diagramArrow}>→</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
