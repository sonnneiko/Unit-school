import { useState, useCallback } from 'react'
import { useParams, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { mockLessons } from '../../data/lessons'
import { Slide } from '../../components/slides/Slide'
import { SlideNav } from '../../components/SlideNav/SlideNav'
import styles from './Lesson.module.css'

export function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const { user, updateProgress } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const lesson = mockLessons.find(l => l.id === id)
  const initialSlide = user?.progress[id ?? ''] ?? 0
  const [currentSlide, setCurrentSlide] = useState(initialSlide)

  const backUrl = (location.state as { from?: string } | null)?.from ?? '/courses'
  const isLastSlide = currentSlide === (lesson?.slides.length ?? 1) - 1

  const goNext = useCallback(() => {
    if (isLastSlide) {
      if (id) updateProgress(id, (lesson?.slides.length ?? 1) - 1)
      navigate(backUrl)
      return
    }
    setCurrentSlide(i => {
      const next = Math.min(i + 1, (lesson?.slides.length ?? 1) - 1)
      if (id) updateProgress(id, next)
      return next
    })
  }, [lesson, id, updateProgress, isLastSlide, navigate, backUrl])

  const goPrev = useCallback(() => {
    setCurrentSlide(i => {
      const prev = Math.max(i - 1, 0)
      if (id) updateProgress(id, prev)
      return prev
    })
  }, [id, updateProgress])

  if (!lesson) return <Navigate to="/" replace />

  const slide = lesson.slides[currentSlide]

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link to={backUrl} className={styles.back}>← Назад</Link>
        <span className={styles.title}>{lesson.title}</span>
        <span className={styles.tag}>{lesson.tag}</span>
      </header>
      <div className={styles.slideArea}>
        <Slide slide={slide} onNext={goNext} nextLesson={null} />
      </div>
      {!slide.hasInternalNav && (
        <SlideNav
          current={currentSlide}
          total={lesson.slides.length}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  )
}
