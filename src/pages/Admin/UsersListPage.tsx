import { Link } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import { useLessons } from '../../context/LessonsContext'
import { roleLabel } from '../../utils/roleLabel'
import { computeLevel, LEVEL_LABELS, LEVEL_EMOJI } from '../../utils/level'
import styles from './UsersListPage.module.css'

export function UsersListPage() {
  const { users } = useUsers()
  const { lessons } = useLessons()

  const employees = users.filter(u => u.role !== 'admin')

  return (
    <>
      <h1 className={styles.heading}>Сотрудники</h1>

      {employees.length === 0 ? (
        <p className={styles.empty}>Нет сотрудников</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th></th>
              <th>Имя</th>
              <th>Email</th>
              <th>Должность</th>
              <th>Уровень</th>
              <th>Последняя активность</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(user => {
              const level = computeLevel(user, lessons)
              return (
              <tr key={user.id}>
                <td className={styles.avatarCell}>
                  {user.photo
                    ? <img src={user.photo} alt={user.name} className={styles.avatar} />
                    : <div className={styles.avatarPlaceholder}>👤</div>
                  }
                </td>
                <td>
                  <Link to={`/admin/users/${user.id}`} className={styles.nameLink}>
                    {user.name}
                  </Link>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={styles.badge}>
                    {roleLabel(user.role)}
                  </span>
                </td>
                <td>
                  <span className={styles.badge}>
                    {LEVEL_EMOJI[level]} {LEVEL_LABELS[level]}
                  </span>
                </td>
                <td>{user.lastActive ?? '—'}</td>
              </tr>
            )})}

          </tbody>
        </table>
      )}

      <Link to="/admin/users/new" className={styles.addBtn}>
        + Добавить сотрудника
      </Link>

    </>
  )
}
