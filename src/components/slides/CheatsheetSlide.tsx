import type { CheatsheetContent } from '../../types'
import styles from './slides.module.css'

export function CheatsheetSlide({ content }: { content: CheatsheetContent }) {
  return (
    <div className={styles.slideWrapper}>
      <div className={styles.cheatsheetCard}>
        {content.sections.map((section, i) => (
          <div key={i} className={styles.cheatsheetSection}>
            <div className={styles.cheatsheetTitle}>{section.title}</div>
            <table className={styles.cheatsheetTable}>
              <thead>
                <tr>{section.headers.map((h, j) => <th key={j}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {section.rows.map((row, k) => (
                  <tr key={k}>{row.map((cell, l) => <td key={l}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}
