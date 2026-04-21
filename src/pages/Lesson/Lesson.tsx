import { useState, useCallback } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { mockLessons } from '../../data/lessons'
import { Slide } from '../../components/slides/Slide'
import { SlideNav } from '../../components/SlideNav/SlideNav'
import type { FinishContent } from '../../types'
import styles from './Lesson.module.css'

export function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const { user, updateProgress } = useAuth()
  const lesson = mockLessons.find(l => l.id === id)
  const initialSlide = user?.progress[id ?? ''] ?? 0
  const [currentSlide, setCurrentSlide] = useState(initialSlide)

  const goNext = useCallback(() => {
    setCurrentSlide(i => {
      const next = Math.min(i + 1, (lesson?.slides.length ?? 1) - 1)
      if (id) updateProgress(id, next)
      return next
    })
  }, [lesson, id, updateProgress])

  const goPrev = useCallback(() => {
    setCurrentSlide(i => {
      const prev = Math.max(i - 1, 0)
      if (id) updateProgress(id, prev)
      return prev
    })
  }, [id, updateProgress])

  if (!lesson) return <Navigate to="/" replace />

  const slide = lesson.slides[currentSlide]

  const nextLessonId = slide.type === 'finish'
    ? (slide.content as FinishContent).nextLessonId
    : null
  const nextLesson = nextLessonId ? mockLessons.find(l => l.id === nextLessonId) ?? null : null

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link to="/" className={styles.back}>← Назад</Link>
        <span className={styles.title}>{lesson.title}</span>
        <span className={styles.tag}>{lesson.tag}</span>
      </header>
      <div className={styles.slideArea}>
        <Slide slide={slide} onNext={goNext} nextLesson={nextLesson} />
      </div>
      <SlideNav
        current={currentSlide}
        total={lesson.slides.length}
        onPrev={goPrev}
        onNext={goNext}
      />
    </div>
  )
}
