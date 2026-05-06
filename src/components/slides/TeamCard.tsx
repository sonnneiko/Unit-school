import type { TeamMember } from '../../types'
import styles from './slides.module.css'

export function TeamCard({ member, compact }: { member: TeamMember; compact?: boolean }) {
  const initials = member.name.split(' ').map(p => p[0]).join('').slice(0, 2)
  return (
    <div className={compact ? styles.teamCardVerticalCompact : styles.teamCardVertical}>
      {member.photo ? (
        <img src={member.photo} alt={member.name} className={compact ? styles.teamCardPhotoCompact : styles.teamCardPhoto} />
      ) : (
        <div
          className={compact ? styles.teamCardPhotoFallbackCompact : styles.teamCardPhotoFallback}
          style={{ background: member.photoPlaceholder }}
          aria-hidden="true"
        >
          {initials}
        </div>
      )}
      <div className={styles.teamCardBody}>
        <div className={styles.teamName}>{member.name}</div>
        <div className={styles.teamRole}>{member.role}</div>
        <div className={styles.teamDesc}>{member.description}</div>
      </div>
    </div>
  )
}
