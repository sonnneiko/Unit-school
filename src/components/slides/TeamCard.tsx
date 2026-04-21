import type { TeamMember } from '../../types'
import styles from './slides.module.css'

export function TeamCard({ member }: { member: TeamMember }) {
  const initials = member.name.split(' ').map(p => p[0]).join('').slice(0, 2)
  return (
    <div className={styles.teamCard}>
      <div
        className={styles.teamAvatar}
        style={{ background: member.photoPlaceholder }}
        aria-hidden="true"
      >
        {initials}
      </div>
      <div className={styles.teamInfo}>
        <div className={styles.teamName}>{member.name}</div>
        <div className={styles.teamRole}>{member.role}</div>
        <div className={styles.teamDesc}>{member.description}</div>
      </div>
    </div>
  )
}
