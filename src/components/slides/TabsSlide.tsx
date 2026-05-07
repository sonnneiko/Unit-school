import { useState } from 'react'
import {
  Compass, Code, Eye, Smile, Shield,
  ChevronLeft, ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import type { TabsContent, TeamMember, VendorItem } from '../../types'
import { TeamCard } from './TeamCard'
import styles from './slides.module.css'

const ICON_MAP: Record<string, LucideIcon> = { Compass, Code, Eye, Smile, Shield }
const MEMBERS_PER_PAGE = 2

export function TabsSlide({ content, onLastTab }: { content: TabsContent; onLastTab?: (isLast: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<number>(0)
  const [page, setPage] = useState(0)

  const isTeamMode = content.title != null

  if (!isTeamMode) {
    // Legacy vendor/plain tabs — original layout
    const tab = content.tabs[activeTab ?? 0]
    const idx = activeTab ?? 0
    return (
      <div className={styles.slideWrapper}>
        <div className={styles.tabsCard}>
          <div className={styles.tabRow}>
            {content.tabs.map((t, i) => (
              <button
                key={i}
                className={`${styles.tab} ${i === idx ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className={styles.tabContent}>
            {tab.itemType === 'team' ? (
              <div className={styles.teamGrid}>
                {(tab.items as TeamMember[]).map((member, i) => (
                  <TeamCard key={i} member={member} />
                ))}
              </div>
            ) : (
              <div className={styles.vendorGrid}>
                {(tab.items as VendorItem[]).map((vendor, i) => (
                  <div key={i} className={styles.vendorCard}>
                    <div className={styles.vendorName}>{vendor.name}</div>
                    <div className={styles.vendorMethods}>{vendor.methods.join(', ')}</div>
                    <div className={styles.vendorPayout}>{vendor.payout}</div>
                    <div className={styles.vendorWho}>{vendor.forWhom}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Team mode — full-screen layout
  const tab = content.tabs[activeTab]
  const members = tab?.itemType === 'team' ? (tab.items as TeamMember[]) : []
  const use4Grid = members.length === 4
  const totalPages = use4Grid ? 1 : Math.ceil(members.length / MEMBERS_PER_PAGE)
  const pageMembers = use4Grid ? members : members.slice(page * MEMBERS_PER_PAGE, (page + 1) * MEMBERS_PER_PAGE)
  const hasInfoCard = tab?.tagline != null

  function handleTabClick(i: number) {
    setActiveTab(i)
    setPage(0)
    onLastTab?.(i === content.tabs.length - 1)
  }

  return (
    <div className={styles.teamTabsWrapper}>
      {content.title && <h2 className={styles.teamTabsTitle}>{content.title}</h2>}
      {content.subtitle && <p className={styles.teamTabsSubtitle}>{content.subtitle}</p>}

      <div className={styles.teamTabsTabRow}>
        {content.tabs.map((t, i) => {
          const Icon = t.icon ? ICON_MAP[t.icon] : null
          const isActive = i === activeTab
          return (
            <button
              key={i}
              className={`${styles.teamTabsTab} ${isActive ? styles.teamTabsTabActive : ''}`}
              onClick={() => handleTabClick(i)}
            >
              {Icon && <Icon size={15} />}
              {t.label}
            </button>
          )
        })}
      </div>

      <div className={styles.teamTabsContent}>
        <div className={hasInfoCard ? styles.teamTabsGrid : styles.teamTabsGrid2col}>
          <div className={use4Grid ? styles.teamCardsContainer4 : styles.teamCardsContainer}>
            {use4Grid ? (
              pageMembers.map((m, i) => <TeamCard key={i} member={m} compact />)
            ) : (
              <>
                {pageMembers[0] && <TeamCard member={pageMembers[0]} />}
                {pageMembers[1] ? (
                  <TeamCard member={pageMembers[1]} />
                ) : (
                  <div className={styles.teamCardPlaceholder} />
                )}
              </>
            )}
          </div>
          {hasInfoCard && (
            <div className={styles.teamInfoCard}>
              <div className={styles.teamInfoCardTitle}>{tab.tagline}</div>
              {tab.taglineBody && (
                <div className={styles.teamInfoCardBody}>{tab.taglineBody}</div>
              )}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className={styles.teamPagination}>
            <button
              className={styles.teamPaginationBtn}
              onClick={() => setPage(p => p - 1)}
              disabled={page === 0}
              aria-label="Предыдущие"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className={styles.teamPaginationBtn}
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages - 1}
              aria-label="Следующие"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
