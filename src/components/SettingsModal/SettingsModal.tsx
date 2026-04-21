import { useState } from 'react'
import type { User } from '../../types'
import { useUsers } from '../../context/UsersContext'
import styles from './SettingsModal.module.css'

interface Props {
  user: User
  onClose: () => void
}

export function SettingsModal({ user, onClose }: Props) {
  const { updateUser, updatePassword } = useUsers()
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>(user.role)

  function handleSave() {
    updateUser(user.id, { email, role })
    if (password) updatePassword(user.id, password)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.title}>Настройки пользователя</div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="settings-email">Email</label>
          <input id="settings-email" className={styles.input} value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="settings-password">Новый пароль</label>
          <input id="settings-password" className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Оставьте пустым, чтобы не менять" />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="settings-role">Роль</label>
          <select id="settings-role" className={styles.select} value={role} onChange={e => setRole(e.target.value as 'user' | 'admin')}>
            <option value="user">Сотрудник</option>
            <option value="admin">Администратор</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={onClose}>Отмена</button>
          <button className={styles.btnSave} onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  )
}
