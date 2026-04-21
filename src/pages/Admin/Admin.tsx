import { useState } from 'react'
import { mockUsers } from '../../data/users'
import { mockLessons } from '../../data/lessons'
import type { Lesson } from '../../types'
import styles from './Admin.module.css'

export function AdminPage() {
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons)

  function togglePublished(id: string) {
    setLessons(prev =>
      prev.map(l => l.id === id ? { ...l, published: !l.published } : l)
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Администрирование</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Пользователи</h2>
        <table className={styles.table}>
          <thead>
            <tr><th>Имя</th><th>Email</th><th>Роль</th><th>Последняя активность</th></tr>
          </thead>
          <tbody>
            {mockUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`${styles.badge} ${user.role === 'admin' ? styles.badgeAdmin : ''}`}>
                    {user.role === 'admin' ? 'Администратор' : 'Сотрудник'}
                  </span>
                </td>
                <td>{user.lastActive ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Модули</h2>
        <table className={styles.table}>
          <thead>
            <tr><th>Название</th><th>Слайдов</th><th>Статус</th></tr>
          </thead>
          <tbody>
            {lessons.map(lesson => (
              <tr key={lesson.id}>
                <td>{lesson.title}</td>
                <td>{lesson.slides.length}</td>
                <td>
                  <button
                    className={`${styles.toggle} ${lesson.published ? styles.toggleOn : styles.toggleOff}`}
                    onClick={() => togglePublished(lesson.id)}
                  >
                    {lesson.published ? 'Опубликован' : 'Скрыт'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
