import { useState, useCallback, useMemo, useEffect } from 'react'
import { useParams, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { mockLessons } from '../../data/lessons'
import { isComplete } from '../../utils/level'
import { getLessonNavInfo } from '../../utils/lessonNav'
import { Slide } from '../../components/slides/Slide'
import { SlideNav } from '../../components/SlideNav/SlideNav'
import styles from './Lesson.module.css'

export function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const { user, updateProgress } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const lesson = mockLessons.find(l => l.id === id)
  const initialSlide = lesson && user && isComplete(lesson, user) ? 0 : (user?.progress[id ?? ''] ?? 0)
  const [currentSlide, setCurrentSlide] = useState(initialSlide)
  const [onLastInternalTab, setOnLastInternalTab] = useState(false)

  useEffect(() => {
    if (!lesson || !user) return
    const startFromEnd = (location.state as { startFromEnd?: boolean } | null)?.startFromEnd
    const slide = startFromEnd
      ? lesson.slides.length - 1
      : isComplete(lesson, user) ? 0 : (user.progress[lesson.id] ?? 0)
    setCurrentSlide(slide)
  }, [id])

  const backUrl = (location.state as { from?: string } | null)?.from ?? '/courses'
  const initialTab = (location.state as { initialTab?: number } | null)?.initialTab
  const isLastSlide = currentSlide === (lesson?.slides.length ?? 1) - 1
  const navInfo = useMemo(() => id ? getLessonNavInfo(id) : null, [id])

  const goNext = useCallback(() => {
    if (isLastSlide) {
      if (id) updateProgress(id, (lesson?.slides.length ?? 1) - 1)
      if (navInfo?.nextLessonId) {
        navigate(`/lesson/${navInfo.nextLessonId}`, { state: { from: backUrl } })
      } else {
        navigate(backUrl, { state: { completedLessonId: id } })
      }
      return
    }
    setCurrentSlide(i => {
      const next = Math.min(i + 1, (lesson?.slides.length ?? 1) - 1)
      if (id) updateProgress(id, next)
      return next
    })
  }, [lesson, id, updateProgress, isLastSlide, navigate, backUrl, navInfo])

  const goPrev = useCallback(() => {
    if (currentSlide === 0) {
      if (navInfo?.prevLessonId) {
        navigate(`/lesson/${navInfo.prevLessonId}`, { state: { from: backUrl, startFromEnd: true } })
      } else {
        navigate(backUrl)
      }
      return
    }
    setCurrentSlide(i => i - 1)
  }, [currentSlide, id, updateProgress, navigate, backUrl, navInfo])

  if (!lesson) return <Navigate to="/" replace />

  const slide = lesson.slides[currentSlide]

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link to={backUrl} className={styles.back}>← Назад</Link>
        <span className={styles.title}>{lesson.title}</span>
        <span className={styles.tag}>{lesson.tag}</span>
        {navInfo && (
          <span className={styles.topicProgress}>
            {navInfo.topicIndex} / {navInfo.topicTotal}
          </span>
        )}
      </header>
      <div className={styles.slideArea}>
        <Slide slide={slide} onNext={goNext} nextLesson={null} onLastTab={setOnLastInternalTab} initialTab={initialTab} />
      </div>
      <SlideNav
        current={currentSlide}
        total={lesson.slides.length}
        onPrev={goPrev}
        onNext={goNext}
        hideNext={slide.hasInternalNav && !onLastInternalTab}
        hidePrev={currentSlide === 0 && !navInfo?.prevLessonId}
      />
    </div>
  )
}
