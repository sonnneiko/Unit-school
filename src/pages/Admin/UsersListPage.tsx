import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import { SettingsModal } from '../../components/SettingsModal/SettingsModal'
import type { User } from '../../types'
import styles from './UsersListPage.module.css'

export function UsersListPage() {
  const { users } = useUsers()
  const [editingUser, setEditingUser] = useState<User | null>(null)

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
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Последняя активность</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map(user => (
              <tr key={user.id}>
                <td>
                  <Link to={`/admin/users/${user.id}`} className={styles.nameLink}>
                    {user.name}
                  </Link>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`${styles.badge} ${user.role === 'admin' ? styles.badgeAdmin : ''}`}>
                    {user.role === 'admin' ? 'Администратор' : 'Сотрудник'}
                  </span>
                </td>
                <td>{user.lastActive ?? '—'}</td>
                <td>
                  <button
                    className={styles.gearBtn}
                    onClick={() => setEditingUser(user)}
                    aria-label="⚙"
                  >
                    ⚙
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/admin/users/new" className={styles.addBtn}>
        + Добавить сотрудника
      </Link>

      {editingUser && (
        <SettingsModal user={editingUser} onClose={() => setEditingUser(null)} />
      )}
    </>
  )
}
