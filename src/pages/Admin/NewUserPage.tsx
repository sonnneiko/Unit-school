import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import styles from './NewUserPage.module.css'

export function NewUserPage() {
  const navigate = useNavigate()
  const { addUser } = useUsers()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [photo, setPhoto] = useState<string | undefined>()

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleSubmit() {
    addUser(
      {
        id: crypto.randomUUID(),
        name: `${firstName} ${lastName}`.trim(),
        email,
        role,
        progress: {},
        photo,
      },
      password
    )
    navigate('/admin/users')
  }

  return (
    <>
      <h1 className={styles.heading}>Новый сотрудник</h1>
      <div className={styles.form}>
        {photo
          ? <img src={photo} alt="avatar" className={styles.avatar} />
          : <div className={styles.avatarPlaceholder} />
        }

        <div className={styles.field}>
          <label className={styles.label} htmlFor="firstName">Имя</label>
          <input id="firstName" className={styles.input} value={firstName} onChange={e => setFirstName(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="lastName">Фамилия</label>
          <input id="lastName" className={styles.input} value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input id="email" className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Пароль</label>
          <input id="password" className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="role">Роль</label>
          <select id="role" className={styles.select} value={role} onChange={e => setRole(e.target.value as 'user' | 'admin')}>
            <option value="user">Сотрудник</option>
            <option value="admin">Администратор</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="photo">Фото</label>
          <input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={() => navigate('/admin/users')}>Отмена</button>
          <button className={styles.btnCreate} onClick={handleSubmit}>Создать</button>
        </div>
      </div>
    </>
  )
}
