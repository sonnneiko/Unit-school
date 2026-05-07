import { useParams, Link } from 'react-router-dom'
import { useLessons } from '../../context/LessonsContext'
import { useUsers } from '../../context/UsersContext'
import { calcProgress } from '../../components/slides/slideUtils'
import { ProgressBar } from '../../components/ProgressBar/ProgressBar'
import type { Slide } from '../../types'
import styles from './CourseDetailPage.module.css'

function slideSummary(slide: Slide): string {
  const c = slide.content as Record<string, unknown>
  if (Array.isArray(c.tabs)) return (c.tabs as Array<{label:string}>).map(t => t.label).join(', ')
  if (Array.isArray(c.sections)) return (c.sections as Array<{title:string}>)[0]?.title ?? '—'
  if (Array.isArray(c.nodes)) return (c.nodes as Array<{label:string}>)[0]?.label ?? '—'
  if (typeof c.heading === 'string') return c.heading
  if (typeof c.title === 'string') return c.title
  return '—'
}

export function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { lessons } = useLessons()
  const { users } = useUsers()

  const lesson = lessons.find(l => l.id === id)

  if (!lesson) {
    return (
      <div className={styles.notFound}>
        <p>Курс не найден</p>
        <Link to="/admin/courses" className={styles.backLink}>← Назад к курсам</Link>
      </div>
    )
  }

  const employees = users.filter(u => u.role !== 'admin')

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>{lesson.title}</div>
        <div className={styles.meta}>
          <span className={styles.tag}>{lesson.tag}</span>
          <span className={lesson.published ? styles.statusOn : styles.statusOff}>
            {lesson.published ? 'Опубликован' : 'Скрыт'}
          </span>
          <span>{lesson.slides.length} слайдов</span>
        </div>
      </div>

      <div className={styles.sectionTitle}>Слайды</div>
      {lesson.slides.map((slide, i) => (
        <div key={slide.id} className={styles.slideItem}>
          <span className={styles.slideType}>{slide.type}</span>
          <span>{i + 1}. {slideSummary(slide)}</span>
        </div>
      ))}

      <div className={styles.sectionTitle}>Прогресс сотрудников</div>
      <table className={styles.table}>
        <thead>
          <tr><th>Сотрудник</th><th>Прогресс</th></tr>
        </thead>
        <tbody>
          {employees.map(user => {
            const slideIndex = user.progress[lesson.id] ?? 0
            const percent = calcProgress(slideIndex, lesson.slides.length)
            return (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td className={styles.progressCell}>
                  <ProgressBar value={percent} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
