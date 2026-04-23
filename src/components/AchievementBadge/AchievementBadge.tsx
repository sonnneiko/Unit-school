import type { Achievement } from '../../utils/achievements'
import styles from './AchievementBadge.module.css'

interface Props {
  achievement: Achievement
}

export function AchievementBadge({ achievement }: Props) {
  return (
    <div className={styles.row}>
      <div className={styles.icon}>{achievement.icon}</div>
      <div className={styles.text}>
        <div className={styles.name}>{achievement.name}</div>
        {achievement.unlockedAt && (
          <div className={styles.date}>{achievement.unlockedAt}</div>
        )}
      </div>
    </div>
  )
}
