import React from 'react'
import type { Lesson, User } from '../../types'
import { computeLevel, LEVEL_LABELS, LEVEL_ORDER, LEVEL_THRESHOLDS } from '../../utils/level'
import styles from './GrowthPath.module.css'

interface Props {
  user: User
  lessons: Lesson[]
}

export function GrowthPath({ user, lessons }: Props) {
  const current = computeLevel(user, lessons)
  const currentIdx = LEVEL_ORDER.indexOf(current)

  return (
    <div className={styles.card}>
      <div className={styles.label}>Твой путь развития</div>
      <div className={styles.path}>
        {LEVEL_ORDER.map((level, i) => {
          const isDone = i < currentIdx
          const isCurrent = i === currentIdx
          const threshold = LEVEL_THRESHOLDS[level]

          return (
            <React.Fragment key={level}>
              {i > 0 && <span className={styles.arrow}>→</span>}
              <div className={styles.stepWrap}>
                <span className={`${styles.step} ${isDone ? styles.stepDone : isCurrent ? styles.stepCurrent : styles.stepNext}`}>
                  {isDone ? '✓ ' : isCurrent ? '● ' : '○ '}{LEVEL_LABELS[level]}
                </span>
                <span className={`${styles.stepSub} ${isDone ? styles.stepSubDone : isCurrent ? styles.stepSubCurrent : styles.stepSubNext}`}>
                  {isDone && 'пройдено'}
                  {isCurrent && 'сейчас'}
                </span>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}
