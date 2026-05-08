import { useState } from 'react'
import { PlayCircle } from 'lucide-react'
import type { ToolsContent, ToolItem } from '../../types'
import styles from './slides.module.css'

interface Props {
  content: ToolsContent
  onNext?: () => void
}

export function ToolsSlide({ content, onNext }: Props) {
  const [activeId, setActiveId] = useState<string>(content.tools[0]?.id ?? '')

  const activeTool: ToolItem | undefined = content.tools.find(t => t.id === activeId)

  return (
    <div className={styles.toolsFull}>
      <div className={styles.toolsSidebar}>
        {content.tools.map(tool => (
          <div
            key={tool.id}
            className={`${styles.toolCard} ${tool.id === activeId ? styles.toolCardActive : ''}`}
            style={{ background: tool.gradient }}
            onClick={() => setActiveId(tool.id)}
          >
            {tool.logo && (
              <div className={styles.toolCardIcon}>
                <img src={tool.logo} alt={tool.title} className={styles.toolCardLogo} />
              </div>
            )}
            <span className={styles.toolCardTitle}>{tool.title}</span>
          </div>
        ))}
      </div>

      {activeTool && (
        <div key={activeTool.id} className={`${styles.toolsDetail} ${styles.toolsDetailContent}`}>
          <h2 className={styles.toolsDetailTitle}>{activeTool.title}</h2>
          <p className={styles.toolsDetailDesc}>{activeTool.description}</p>

          {activeTool.ctaLabel ? (
            <button
              className={styles.toolsNextBtn}
              onClick={() => {
                if (activeTool.ctaUrl) {
                  window.open(activeTool.ctaUrl, '_blank', 'noopener,noreferrer')
                } else {
                  onNext?.()
                }
              }}
            >
              {activeTool.ctaLabel}
            </button>
          ) : activeTool.videoUrl ? (
            <iframe
              src={activeTool.videoUrl}
              className={styles.toolsVideoIframe}
              allowFullScreen
              title={activeTool.title}
            />
          ) : (
            <div className={styles.toolsVideoPlaceholder}>
              <PlayCircle size={48} />
              <span>Видео скоро появится</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
