import { useAuth } from '../../context/AuthContext'
import { useLessons } from '../../context/LessonsContext'
import { computeLevel, isComplete, LEVEL_LABELS, LEVEL_ORDER, LEVEL_THRESHOLDS } from '../../utils/level'
import { computeAchievements } from '../../utils/achievements'
import { mockUsers } from '../../data/users'
import styles from './ProgressPage.module.css'

const ALL_ACHIEVEMENTS = [
  { key: 'first_slide',    name: 'Поставил лапку в UnitSchool', icon: '🐾' },
  { key: 'first_course',   name: 'Курс покорён',                icon: '📘' },
  { key: 'streak_ongoing', name: 'Лапка за лапкой',             icon: '📅' },
  { key: 'level_up',       name: 'Открыл новый уровень',        icon: '⬆️' },
  { key: 'middle_am',      name: 'Без паники, я аккаунт',       icon: '💼' },
  { key: 'all_courses',    name: 'Мастер обучения',             icon: '🏆' },
  { key: 'streak_7',       name: '7 дней подряд',               icon: '🔥' },
  { key: 'streak_30',      name: 'Месяц не сдаётся',            icon: '⚡' },
]

const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function buildHeatmap(streak: number): boolean[] {
  const days = new Array(21).fill(false)
  const active = Math.min(streak, 21)
  for (let i = 0; i < active; i++) {
    days[20 - i] = true
  }
  return days
}

function buildActivityData(streak: number): number[] {
  const base = [20, 55, 80, 40, 100, 15, 60]
  if (streak === 0) return new Array(7).fill(0)
  const active = Math.min(streak, 7)
  return base.map((v, i) => (i >= 7 - active ? v : 0))
}

export function ProgressPage() {
  const { user } = useAuth()
  const { lessons } = useLessons()
  if (!user) return null

  const publishedLessons = lessons.filter(l => l.published)
  const completedCount = publishedLessons.filter(l => isComplete(l, user)).length
  const totalCount = publishedLessons.length
  const completedPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const CIRC = 339.3
  const dashFill = (completedCount / Math.max(totalCount, 1)) * CIRC
  const dashGap = CIRC - dashFill

  const heatmap = buildHeatmap(user.streak)
  const activityData = buildActivityData(user.streak)
  const maxActivity = Math.max(...activityData, 1)

  const level = computeLevel(user, lessons)
  const levelIdx = LEVEL_ORDER.indexOf(level)

  function levelPct(lvl: typeof LEVEL_ORDER[number]): number {
    const idx = LEVEL_ORDER.indexOf(lvl)
    const next = LEVEL_ORDER[idx + 1]
    if (!next) return 100
    const from = LEVEL_THRESHOLDS[lvl]
    const to = LEVEL_THRESHOLDS[next]
    if (to === from) return 100
    return Math.round(Math.min(((completedCount - from) / (to - from)) * 100, 100))
  }

  const unlockedKeys = new Set(computeAchievements(user, lessons).map(a => a.key))

  const regularUsers = mockUsers.filter(u => u.role !== 'admin')
  function userCompletionPct(u: typeof user): number {
    if (totalCount === 0) return 0
    const done = publishedLessons.filter(l => isComplete(l, u)).length
    return Math.round((done / totalCount) * 100)
  }
  const peerPcts = regularUsers.map(userCompletionPct)
  const avgPct = peerPcts.length > 0 ? Math.round(peerPcts.reduce((a, b) => a + b, 0) / peerPcts.length) : 0
  const bestPct = Math.max(...peerPcts, 0)
  const percentile = peerPcts.length > 0
    ? Math.round((peerPcts.filter(p => p <= completedPct).length / peerPcts.length) * 100)
    : 100

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Прогресс</h1>

      {/* TOP ROW: Donut + Streak */}
      <div className={styles.topRow}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Прогресс курсов</div>
          <div className={styles.donutWrap}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" fill="none" stroke="#f3f4f6" strokeWidth="16" />
              <circle
                cx="70" cy="70" r="54" fill="none"
                stroke="#597ef7" strokeWidth="16"
                strokeDasharray={`${dashFill} ${dashGap}`}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
              />
            </svg>
            <div className={styles.donutCenter}>
              <span className={styles.donutBig}>{completedCount}/{totalCount}</span>
              <span className={styles.donutSub}>курсов</span>
            </div>
          </div>
          <div className={styles.donutMeta}>{completedPct}% завершено</div>
        </div>

        <div className={`${styles.card} ${styles.streakCard}`}>
          <div className={styles.cardLabel}>Стрик</div>
          <div className={styles.streakTop}>
            <span className={styles.streakFlame}>🔥</span>
            <div>
              <span className={styles.streakNum}>{user.streak}</span>
              <div className={styles.streakLbl}>дней подряд</div>
            </div>
          </div>
          <div className={styles.heatmapLabel}>Последние 3 недели</div>
          <div className={styles.heatmap}>
            {heatmap.map((active, i) => (
              <div key={i} className={`${styles.heatCell} ${active ? styles.heatActive : ''}`} />
            ))}
          </div>
          <div className={styles.heatLegend}>
            <span className={styles.heatDotEmpty} /> нет
            <span className={styles.heatDotActive} /> был
          </div>
        </div>
      </div>

      {/* ACTIVITY BAR CHART */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>Активность за неделю</div>
        <div className={styles.barChart}>
          {activityData.map((val, i) => (
            <div key={i} className={styles.barCol}>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ height: `${(val / maxActivity) * 100}%` }}
                />
              </div>
              <span className={`${styles.barLabel} ${i === activityData.length - 1 ? styles.barLabelToday : ''}`}>
                {DAY_LABELS[i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* GROWTH PATH */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>Путь развития</div>
        <div className={styles.pathRow}>
          {LEVEL_ORDER.filter(l => l !== 'novice').map((lvl, i) => {
            const absIdx = LEVEL_ORDER.indexOf(lvl)
            const isDone = absIdx < levelIdx
            const isCurrent = absIdx === levelIdx
            const pct = isCurrent ? levelPct(lvl) : undefined
            return (
              <div key={lvl} className={styles.pathStep}>
                {i > 0 && (
                  <div className={`${styles.pathLine} ${isDone ? styles.pathLineDone : ''}`} />
                )}
                <div className={`${styles.pathDot} ${isDone ? styles.pathDotDone : isCurrent ? styles.pathDotCurrent : styles.pathDotNext}`}>
                  {isDone ? '✓' : isCurrent && pct !== undefined ? `${pct}%` : '·'}
                </div>
                <span className={`${styles.pathLabel} ${isDone ? styles.pathLabelDone : isCurrent ? styles.pathLabelCurrent : styles.pathLabelNext}`}>
                  {LEVEL_LABELS[lvl]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ACHIEVEMENTS */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>Достижения</div>
        <div className={styles.achGrid}>
          {ALL_ACHIEVEMENTS.map(a => {
            const unlocked = unlockedKeys.has(a.key)
            return (
              <div key={a.key} className={`${styles.achItem} ${unlocked ? '' : styles.achLocked}`}>
                <div className={styles.achIcon}>{a.icon}</div>
                <span className={styles.achName}>{a.name}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* PEER COMPARISON */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>Сравнение с командой</div>
        <div className={styles.peersGrid}>
          <div className={styles.peerBars}>
            {[
              { label: `Я (${completedPct}%)`,   pct: completedPct, color: '#597ef7' },
              { label: `Среднее (${avgPct}%)`,    pct: avgPct,       color: '#d1d5db' },
              { label: `Лучший (${bestPct}%)`,    pct: bestPct,      color: '#86efac' },
            ].map(({ label, pct, color }) => (
              <div key={label} className={styles.peerRow}>
                <div className={styles.peerLabel}>{label}</div>
                <div className={styles.peerTrack}>
                  <div className={styles.peerFill} style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.peerCallout}>
            <div className={styles.peerCalloutBig}>Топ {Math.max(1, 100 - percentile + 1)}%</div>
            <div className={styles.peerCalloutLbl}>среди коллег</div>
          </div>
        </div>
      </div>
    </div>
  )
}
