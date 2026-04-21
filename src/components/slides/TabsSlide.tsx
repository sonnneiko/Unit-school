import { useState } from 'react'
import type { TabsContent, TeamMember, VendorItem } from '../../types'
import { TeamCard } from './TeamCard'
import styles from './slides.module.css'

export function TabsSlide({ content }: { content: TabsContent }) {
  const [activeTab, setActiveTab] = useState(0)
  const tab = content.tabs[activeTab]

  return (
    <div className={styles.slideWrapper}>
      <div className={styles.tabsCard}>
        <div className={styles.tabRow}>
          {content.tabs.map((t, i) => (
            <button
              key={i}
              className={`${styles.tab} ${i === activeTab ? styles.tabActive : ''}`}
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
