import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLessons } from '../../context/LessonsContext'
import { computeLevel, isComplete, LESSON_BLOCK_TITLE, LEVEL_LABELS, LEVEL_EMOJI, LEVEL_ORDER, LEVEL_THRESHOLDS } from '../../utils/level'
import { computeAchievements } from '../../utils/achievements'
import { calcProgress } from '../../components/slides/slideUtils'
import { GrowthPath } from '../../components/GrowthPath/GrowthPath'
import { AchievementBadge } from '../../components/AchievementBadge/AchievementBadge'
import catImg from '../../assets/unit-cat/Unitpay Cat 1.png'
import styles from './Dashboard.module.css'
import type { Lesson } from '../../types'

export function DashboardPage() {
  const { user } = useAuth()
  const { lessons } = useLessons()
  const navigate = useNavigate()

  if (!user) return null

  const hasProgress = Object.keys(user.progress).length > 0
  const achievements = computeAchievements(user, lessons)
  const level = computeLevel(user, lessons)
  const nextLevel = LEVEL_ORDER[LEVEL_ORDER.indexOf(level) + 1]

  const publishedLessons = lessons.filter(l => l.published)
  const firstPublished = publishedLessons[0]

  function getContinueLesson(): Lesson | null {
    const inProgress = publishedLessons.filter(l => {
      const idx = user!.progress[l.id]
      return idx !== undefined && idx > 0 && !isComplete(l, user!)
    })
    if (inProgress.length > 0) {
      return inProgress.reduce((a, b) =>
        (user!.progress[b.id] ?? 0) > (user!.progress[a.id] ?? 0) ? b : a
      )
    }
    return null
  }

  const continueLesson = getContinueLesson()
  const allComplete = publishedLessons.every(l => isComplete(l, user))
  const unpublishedLessons = lessons.filter(l => !l.published)

  function courseBadge(lesson: Lesson) {
    const idx = user!.progress[lesson.id]
    if (idx === undefined || idx === 0) return <span className={styles.badgeBlue}>Начать</span>
    if (isComplete(lesson, user!)) return <span className={styles.badgeGreen}>Завершён</span>
    return <span className={styles.badgeBlue}>В процессе</span>
  }

  function journeySteps() {
    let activeIdx = lessons.findIndex(l => l.published && !isComplete(l, user!))
    if (activeIdx === -1) activeIdx = lessons.length
    let start = Math.max(0, activeIdx - 1)
    if (start + 3 > lessons.length) start = Math.max(0, lessons.length - 3)
    return lessons.slice(start, start + 3).map((l, rel) => {
      const abs = start + rel
      const done = l.published && isComplete(l, user!)
      const active = abs === activeIdx
      return { lesson: l, status: done ? 'done' as const : active ? 'active' as const : 'locked' as const }
    })
  }

  // ── EMPTY STATE ──
  if (!hasProgress) {
    const steps = journeySteps()
    return (
      <div className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroTitle}>Привет! Я Юнит — твой гид в мире UnitPay 🐾</div>
            <div className={styles.heroSub}>Начни своё обучение в UnitSchool</div>
            <div className={styles.heroDesc}>
              Познакомься с командой, разберись в платежах и стань настоящим специалистом UnitPay.
            </div>
            <button
              className={styles.btn}
              style={{ marginTop: 4, alignSelf: 'flex-start' }}
              onClick={() => navigate('/courses')}
            >
              Начать обучение →
            </button>
          </div>
          <div className={styles.heroCat}>
            <img src={catImg} alt="Юнит" />
          </div>
        </div>

        <GrowthPath user={user} lessons={lessons} />

        <div className={styles.grid2}>
          <div className={styles.card}>
            <div className={styles.cardLabel}>Твой маршрут</div>
            <div className={styles.journey}>
              {steps.map((step, i) => (
                <div key={step.lesson.id} className={styles.journeyStep}>
                  <div className={styles.journeyLeft}>
                    <div className={`${styles.stepNum} ${
                      step.status === 'done' ? styles.stepNumDone
                      : step.status === 'active' ? styles.stepNumActive
                      : styles.stepNumLocked
                    }`}>
                      {step.status === 'done' ? '✓' : i + 1}
                    </div>
                    {i < steps.length - 1 && <div className={styles.stepConnector} />}
                  </div>
                  <div className={styles.journeyBody}>
                    <div className={step.status === 'locked' ? styles.journeyTitleLocked : styles.journeyTitle}>
                      {LESSON_BLOCK_TITLE[step.lesson.id] ?? step.lesson.title}
                    </div>
                    {step.status === 'active' && step.lesson.published && (
                      <button className={styles.btnSmall} onClick={() => navigate(`/lesson/${step.lesson.id}`)}>
                        Начать →
                      </button>
                    )}
                    {step.status === 'locked' && (
                      <span className={styles.badgeGray}>{step.lesson.published ? 'Следующий' : 'Скоро'}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardLabel}>Достижения</div>
            <div className={styles.emptyAchievementsWrap}>
              <div className={styles.emptyAchievementsIcon}>🐾</div>
              <div className={styles.emptyAchievementsText}>Пока пусто — начни первый урок и получи свою первую награду!</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── IN PROGRESS STATE ──
  const completedCount = publishedLessons.filter(l => isComplete(l, user)).length
  const coursesToNextLevel = nextLevel ? Math.max(0, LEVEL_THRESHOLDS[nextLevel] - completedCount) : 0

  const ALL_ACHIEVEMENT_DEFS = [
    { key: 'first_slide', name: 'Поставил лапку в UnitSchool', icon: '🐾' },
    { key: 'first_course', name: 'Курс покорён', icon: '📘' },
    { key: 'streak_ongoing', name: 'Лапка за лапкой', icon: '📅' },
    { key: 'level_up', name: 'Открыл новый уровень', icon: '⬆️' },
    { key: 'middle_am', name: 'Без паники, я аккаунт', icon: '💼' },
  ]
  const unlockedKeys = new Set(achievements.map(a => a.key))
  const lockedDefs = ALL_ACHIEVEMENT_DEFS.filter(a => !unlockedKeys.has(a.key))

  return (
    <div className={styles.page}>

      {/* Hero block */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.levelRow}>
            <span className={styles.levelBadge}>
              {LEVEL_EMOJI[level]} {LEVEL_LABELS[level]}
            </span>
            {nextLevel && (
              <span className={styles.levelHint}>
                → до {LEVEL_LABELS[nextLevel]}: {coursesToNextLevel} {coursesToNextLevel === 1 ? 'курс' : 'курса'}
              </span>
            )}
          </div>

          {allComplete ? (
            <>
              <div className={styles.heroTitle}>Ты прошёл все доступные курсы! 🎉</div>
              <div className={styles.heroSub}>Новые курсы скоро появятся — следи за обновлениями</div>
            </>
          ) : continueLesson ? (
            <>
              <div className={styles.heroTitle}>Продолжи с места, где остановился</div>
              <div className={styles.continueRow}>
                <div className={styles.continueInfo}>
                  <div className={styles.continueTitle}>{continueLesson.title}</div>
                  <div className={styles.bar}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${calcProgress(user.progress[continueLesson.id] ?? 0, continueLesson.slides.length)}%` }}
                    />
                  </div>
                  <div className={styles.progressMeta}>
                    Слайд {(user.progress[continueLesson.id] ?? 0) + 1} из {continueLesson.slides.length}
                    {' · '}
                    {calcProgress(user.progress[continueLesson.id] ?? 0, continueLesson.slides.length)}%
                  </div>
                </div>
                <button className={styles.btn} onClick={() => navigate(`/lesson/${continueLesson.id}`)}>
                  Продолжить →
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={styles.heroTitle}>Продолжи с места, где остановился</div>
              <div className={styles.continueRow}>
                <div className={styles.continueInfo}>
                  <div className={styles.continueTitle}>{unpublishedLessons[0]?.title ?? 'Следующий курс'}</div>
                  <div className={styles.progressMeta}>Скоро откроется</div>
                </div>
                <button className={styles.btn} disabled>Скоро →</button>
              </div>
            </>
          )}
        </div>
        {allComplete && (
          <div className={styles.heroCat}>
            <img src={catImg} alt="Юнит" />
          </div>
        )}
      </div>

      {/* Growth path */}
      <GrowthPath user={user} lessons={lessons} />

      {/* Courses + Achievements */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Обучение</div>
          {(() => {
            let activeIdx = publishedLessons.findIndex(l => !isComplete(l, user))
            if (activeIdx === -1) activeIdx = Math.max(0, publishedLessons.length - 3)
            const visibleLessons = publishedLessons.slice(activeIdx, activeIdx + 3)
            return visibleLessons.map(lesson => (
              <div key={lesson.id} className={styles.courseRow} style={{ cursor: 'pointer' }} onClick={() => navigate(`/lesson/${lesson.id}`)}>
                <div style={{ flex: 1 }}>
                  <div className={styles.courseName}>{lesson.title}</div>
                  {user.progress[lesson.id] !== undefined && (
                    <div className={styles.bar} style={{ marginTop: 4 }}>
                      <div
                        className={styles.barFill}
                        style={{ width: `${calcProgress(user.progress[lesson.id], lesson.slides.length)}%` }}
                      />
                    </div>
                  )}
                </div>
                {courseBadge(lesson)}
              </div>
            ))
          })()}
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Уровень</div>
          <div className={styles.levelCardRow}>
            <div>
              <div className={styles.levelCardBadge}>
                {LEVEL_EMOJI[level]} {LEVEL_LABELS[level]}
              </div>
              {nextLevel ? (
                <>
                  <div className={styles.bar} style={{ marginTop: 10 }}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${Math.min(100, Math.round((completedCount / LEVEL_THRESHOLDS[nextLevel]) * 100))}%` }}
                    />
                  </div>
                  <div className={styles.levelNextHint} style={{ marginTop: 6 }}>
                    {completedCount} / {LEVEL_THRESHOLDS[nextLevel]} курсов · ещё {coursesToNextLevel} до {LEVEL_LABELS[nextLevel]}
                  </div>
                </>
              ) : (
                <div className={styles.levelMaxHint}>Максимальный уровень достигнут 🏆</div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Достижения</div>
          {achievements.map(a => <AchievementBadge key={a.key} achievement={a} />)}
          {lockedDefs.map(a => (
            <div key={a.key} className={styles.achievementLocked}>
              <div className={styles.achievementLockedIcon}>{a.icon}</div>
              <div className={styles.achievementLockedName}>{a.name}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
