import { Link } from 'react-router-dom'
import { useLessons } from '../../context/LessonsContext'
import { useUsers } from '../../context/UsersContext'
import styles from './CoursesListPage.module.css'

export function CoursesListPage() {
  const { lessons, togglePublished } = useLessons()
  const { users } = useUsers()

  function completedCount(lessonId: string, totalSlides: number): number {
    if (totalSlides <= 1) return 0
    return users.filter(u => (u.progress[lessonId] ?? -1) >= totalSlides - 1).length
  }

  return (
    <>
      <h1 className={styles.heading}>Курсы</h1>
      {lessons.length === 0 ? (
        <p className={styles.empty}>Нет курсов</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Название</th>
              <th>Слайдов</th>
              <th>Прошли</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {lessons.map(lesson => (
              <tr key={lesson.id}>
                <td>
                  <Link to={`/admin/courses/${lesson.id}`} className={styles.nameLink}>
                    {lesson.title}
                  </Link>
                </td>
                <td>{lesson.slides.length}</td>
                <td>{completedCount(lesson.id, lesson.slides.length)}</td>
                <td>
                  <button
                    className={lesson.published ? styles.toggleOn : styles.toggleOff}
                    onClick={() => togglePublished(lesson.id)}
                  >
                    {lesson.published ? 'Опубликован' : 'Скрыт'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
