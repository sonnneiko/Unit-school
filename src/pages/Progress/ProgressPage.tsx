import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLessons } from '../../context/LessonsContext'
import { computeLevel, isComplete, LEVEL_LABELS, LEVEL_ORDER, LEVEL_THRESHOLDS } from '../../utils/level'
import { computeAchievements } from '../../utils/achievements'
import { mockUsers } from '../../data/users'
import styles from './ProgressPage.module.css'

const ALL_ACHIEVEMENTS = [
  { key: 'first_slide',    name: 'Поставил лапку в UnitSchool', icon: '🐾', unlock: 'Открой первый слайд любого курса',           got: 'Ты открыл свой первый слайд!' },
  { key: 'first_course',   name: 'Курс покорён',                icon: '📘', unlock: 'Пройди любой курс полностью',                got: 'Ты завершил первый курс — так держать!' },
  { key: 'streak_ongoing', name: 'Лапка за лапкой',             icon: '📅', unlock: 'Начни стрик — учись хотя бы день подряд',    got: 'Ты начал свою серию дней!' },
  { key: 'level_up',       name: 'Открыл новый уровень',        icon: '⬆️', unlock: 'Набери достаточно курсов для следующего уровня', got: 'Ты перешёл на новый уровень!' },
  { key: 'middle_am',      name: 'Без паники, я аккаунт',       icon: '💼', unlock: 'Достигни уровня Middle AM',                  got: 'Ты стал Middle AM!' },
  { key: 'all_courses',    name: 'Мастер обучения',             icon: '🏆', unlock: 'Пройди все доступные курсы',                 got: 'Ты прошёл абсолютно все курсы!' },
  { key: 'streak_7',       name: '7 дней подряд',               icon: '🔥', unlock: 'Учись 7 дней подряд без перерыва',           got: 'Ты учился целую неделю без перерыва!' },
  { key: 'streak_30',      name: 'Месяц не сдаётся',            icon: '⚡', unlock: 'Учись 30 дней подряд без перерыва',          got: 'Ты учился целый месяц без перерыва!' },
]

const HEAT_COLORS = ['#f3f4f6', '#bbf7d0', '#4ade80', '#16a34a'] as const

function buildHeatmap(streak: number): number[] {
  const days = new Array(21).fill(0)
  const active = Math.min(streak, 21)
  for (let i = 0; i < active; i++) {
    const pos = 20 - i
    days[pos] = (i % 3) === 0 ? 3 : (i % 3) === 1 ? 1 : 2
  }
  return days
}


export function ProgressPage() {
  const [selectedAch, setSelectedAch] = useState<string | null>(null)
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
          <div className={styles.streakInner}>
            <div className={styles.streakLeft}>
              <div className={styles.streakTop}>
                <span className={styles.streakFlame}>🔥</span>
                <div>
                  <span className={styles.streakNum}>{user.streak}</span>
                  <div className={styles.streakLbl}>дней подряд</div>
                </div>
              </div>
            </div>
            <div className={styles.streakRight}>
              <div className={styles.heatmapLabel}>Последние 3 недели</div>
              <div className={styles.heatmap}>
                {heatmap.map((level, i) => (
                  <div key={i} className={styles.heatCell} style={level > 0 ? { background: HEAT_COLORS[level] } : undefined} />
                ))}
              </div>
              <div className={styles.heatLegend}>
                <span className={styles.heatDotEmpty} /> меньше
                {([1, 2, 3] as const).map(l => (
                  <span key={l} className={styles.heatDotGrad} style={{ background: HEAT_COLORS[l] }} />
                ))}
                больше
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GROWTH PATH */}
      <div className={styles.card}>
        <div className={styles.cardLabel}>Путь развития</div>
        <div className={styles.pathRow}>
          {LEVEL_ORDER.map((lvl, i) => {
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
              <div
                key={a.key}
                className={`${styles.achItem} ${unlocked ? '' : styles.achLocked}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedAch(selectedAch === a.key ? null : a.key)}
              >
                <div className={styles.achIcon}>{a.icon}</div>
                <span className={styles.achName}>{a.name}</span>
              </div>
            )
          })}
        </div>
        {selectedAch && (() => {
          const ach = ALL_ACHIEVEMENTS.find(a => a.key === selectedAch)!
          const unlocked = unlockedKeys.has(selectedAch)
          return (
            <div className={styles.achTooltip}>
              <span className={styles.achTooltipIcon}>{ach.icon}</span>
              <div>
                <div className={styles.achTooltipName}>{ach.name}</div>
                <div className={styles.achTooltipHint}>{unlocked ? ach.got : `Как получить: ${ach.unlock}`}</div>
              </div>
            </div>
          )
        })()}
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
