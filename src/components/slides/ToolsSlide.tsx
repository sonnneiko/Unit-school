import { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import type { ToolsContent, ToolItem } from '../../types'
import styles from './slides.module.css'

interface Props {
  content: ToolsContent
}

function ToolIcon({ name }: { name: string }) {
  const Icon = (LucideIcons as Record<string, React.ComponentType<{ size?: number; color?: string }>>)[name]
  if (!Icon) return null
  return <Icon size={20} color="white" />
}

export function ToolsSlide({ content }: Props) {
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
            <div className={styles.toolCardIcon}>
              <ToolIcon name={tool.icon} />
            </div>
            <span className={styles.toolCardTitle}>{tool.title}</span>
          </div>
        ))}
      </div>

      {activeTool && (
        <div key={activeTool.id} className={`${styles.toolsDetail} ${styles.toolsDetailContent}`}>
          <h2 className={styles.toolsDetailTitle}>{activeTool.title}</h2>
          <p className={styles.toolsDetailDesc}>{activeTool.description}</p>
          {activeTool.videoUrl ? (
            <iframe
              src={activeTool.videoUrl}
              className={styles.toolsVideoIframe}
              allowFullScreen
              title={activeTool.title}
            />
          ) : (
            <div className={styles.toolsVideoPlaceholder}>
              <LucideIcons.PlayCircle size={48} />
              <span>Видео скоро появится</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
