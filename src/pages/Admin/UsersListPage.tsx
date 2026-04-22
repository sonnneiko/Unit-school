import { Link } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import { roleLabel } from '../../utils/roleLabel'
import styles from './UsersListPage.module.css'

export function UsersListPage() {
  const { users } = useUsers()

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
              <th>Роль</th>
              <th>Последняя активность</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(user => (
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
                  <span className={`${styles.badge} ${user.role === 'admin' ? styles.badgeAdmin : ''}`}>
                    {roleLabel(user.role)}
                  </span>
                </td>
                <td>{user.lastActive ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/admin/users/new" className={styles.addBtn}>
        + Добавить сотрудника
      </Link>

    </>
  )
}
