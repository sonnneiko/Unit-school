import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLessons } from '../../context/LessonsContext'
import { computeLevel, isComplete, LEVEL_LABELS, LEVEL_EMOJI, LEVEL_ORDER, LEVEL_THRESHOLDS } from '../../utils/level'
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

  // ── EMPTY STATE ──
  if (!hasProgress) {
    return (
      <div className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroTitle}>Привет! Я Юнит — твой гид в мире UnitPay 🐾</div>
            <div className={styles.heroSub}>Начни своё обучение в UnitSchool</div>
            <button
              className={styles.btn}
              style={{ marginTop: 6, alignSelf: 'flex-start' }}
              onClick={() => firstPublished && navigate(`/lesson/${firstPublished.id}`)}
            >
              Начать обучение →
            </button>
          </div>
          <div className={styles.heroCat}>
            <img src={catImg} alt="Юнит" />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>С чего начать</div>
          {publishedLessons.map(lesson => (
            <div key={lesson.id} className={styles.courseRow}>
              <span className={styles.courseName}>{lesson.title}</span>
              <span
                className={styles.badgeBlue}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
              >
                Начать
              </span>
            </div>
          ))}
          {unpublishedLessons.map(lesson => (
            <div key={lesson.id} className={`${styles.courseRow} ${styles.courseRowLocked}`}>
              <span className={styles.courseName}>{lesson.title}</span>
              <span className={styles.badgeGray}>Скоро</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── IN PROGRESS STATE ──
  const completedCount = publishedLessons.filter(l => isComplete(l, user)).length
  const coursesToNextLevel = nextLevel ? Math.max(0, LEVEL_THRESHOLDS[nextLevel] - completedCount) : 0

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
              <div className={styles.congrats}>Ты прошёл все доступные курсы! 🎉</div>
              <div className={styles.congratsSub}>Новые курсы скоро появятся</div>
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
      </div>

      {/* Growth path */}
      <GrowthPath user={user} lessons={lessons} />

      {/* Courses + Achievements */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardLabel}>Курсы</div>
          {publishedLessons.map(lesson => (
            <div key={lesson.id} className={styles.courseRow}>
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
          ))}
          {unpublishedLessons.map(lesson => (
            <div key={lesson.id} className={`${styles.courseRow} ${styles.courseRowLocked}`}>
              <span className={styles.courseName}>{lesson.title}</span>
              <span className={styles.badgeGray}>Скоро</span>
            </div>
          ))}
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>Последние достижения</div>
          {achievements.length === 0 ? (
            <div className={styles.emptyAchievements}>Пока нет достижений — начни обучение!</div>
          ) : (
            achievements.map(a => <AchievementBadge key={a.key} achievement={a} />)
          )}
        </div>
      </div>

    </div>
  )
}
