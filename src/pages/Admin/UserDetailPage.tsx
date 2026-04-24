import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useUsers } from '../../context/UsersContext'
import { useLessons } from '../../context/LessonsContext'
import { roleLabel } from '../../utils/roleLabel'
import { computeLevel, LEVEL_LABELS, LEVEL_EMOJI } from '../../utils/level'
import type { User } from '../../types'
import styles from './UserDetailPage.module.css'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { users, updateUser, updatePassword } = useUsers()
  const { lessons } = useLessons()
  const [editing, setEditing] = useState(false)

  const user = users.find(u => u.id === id)

  const [form, setForm] = useState<Partial<User>>({})
  const [newPassword, setNewPassword] = useState('')

  if (!user) {
    return (
      <div className={styles.notFound}>
        <p>Пользователь не найден</p>
        <Link to="/admin/users" className={styles.backLink}>← Назад к списку</Link>
      </div>
    )
  }

  function startEdit() {
    setForm({
      firstName: user!.firstName ?? '',
      lastName: user!.lastName ?? '',
      patronymic: user!.patronymic ?? '',
      email: user!.email,
      phone: user!.phone ?? '',
      birthDate: user!.birthDate ?? '',
      role: user!.role,
      photo: user!.photo,
    })
    setNewPassword('')
    setEditing(true)
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setForm(f => ({ ...f, photo: reader.result as string }))
    reader.readAsDataURL(file)
  }

  function handleSave() {
    const patch: Partial<User> = { ...form }
    if (patch.firstName !== undefined || patch.lastName !== undefined) {
      patch.name = `${patch.firstName ?? user!.firstName ?? ''} ${patch.lastName ?? user!.lastName ?? ''}`.trim() || user!.name
    }
    updateUser(user!.id, patch)
    if (newPassword) updatePassword(user!.id, newPassword)
    setEditing(false)
  }

  const level = computeLevel(user, lessons)
  const photo = editing ? form.photo : user.photo
  const firstName = editing ? (form.firstName ?? '') : (user.firstName ?? user.name.split(' ')[0] ?? '')
  const lastName = editing ? (form.lastName ?? '') : (user.lastName ?? user.name.split(' ')[1] ?? '')
  const patronymic = editing ? (form.patronymic ?? '') : (user.patronymic ?? '')
  const email = editing ? (form.email ?? '') : user.email
  const phone = editing ? (form.phone ?? '') : (user.phone ?? '')
  const birthDate = editing ? (form.birthDate ?? '') : (user.birthDate ?? '')
  const role = editing ? (form.role ?? user.role) : user.role

  return (
    <div className={styles.page}>
      <Link to="/admin/users" className={styles.backLink}>← Сотрудники</Link>
      <h1 className={styles.heading}>{user.name}</h1>

      <div className={styles.layout}>
        <div className={styles.photoCard}>
          {photo
            ? <img src={photo} alt={user.name} className={styles.avatar} />
            : <div className={styles.avatarPlaceholder}>👤</div>
          }
          {editing && (
            <label className={styles.photoLabel}>
              Изменить фото
              <input type="file" accept="image/*" onChange={handlePhotoChange} className={styles.photoInput} />
            </label>
          )}
        </div>

        <div className={styles.dataCard}>
          <div className={styles.cardTitle}>Данные пользователя</div>
          <div className={styles.divider} />

          <div className={styles.field}>
            <label className={styles.label}>Логин (E-mail)</label>
            {editing
              ? <input className={styles.input} value={email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              : <div className={styles.value}>{email}</div>
            }
          </div>

          <div className={styles.row3}>
            <div className={styles.field}>
              <label className={styles.label}>Имя</label>
              {editing
                ? <input className={styles.input} value={firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
                : <div className={styles.value}>{firstName || '—'}</div>
              }
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Фамилия</label>
              {editing
                ? <input className={styles.input} value={lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
                : <div className={styles.value}>{lastName || '—'}</div>
              }
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Отчество</label>
              {editing
                ? <input className={styles.input} value={patronymic} onChange={e => setForm(f => ({ ...f, patronymic: e.target.value }))} />
                : <div className={styles.value}>{patronymic || '—'}</div>
              }
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Дата рождения</label>
            {editing
              ? <input className={styles.input} type="date" value={birthDate} onChange={e => setForm(f => ({ ...f, birthDate: e.target.value }))} />
              : <div className={styles.value}>{birthDate || '—'}</div>
            }
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Телефон</label>
            {editing
              ? <input className={styles.input} value={phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              : <div className={styles.value}>{phone || '—'}</div>
            }
          </div>

          <div className={styles.row3}>
            <div className={styles.field}>
              <label className={styles.label}>Роль</label>
              {editing
                ? (
                  <select className={styles.input} value={role} onChange={e => setForm(f => ({ ...f, role: e.target.value as User['role'] }))}>
                    <option value="user">Сотрудник</option>
                    <option value="support">Саппорт</option>
                    <option value="security">Служба безопасности</option>
                    <option value="developer">Разработчик</option>
                    <option value="account_manager">Аккаунт менеджер</option>
                    <option value="manager">Менеджер</option>
                  </select>
                )
                : <div className={styles.value}>{roleLabel(role)}</div>
              }
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Уровень</label>
              <div className={styles.value}>{LEVEL_EMOJI[level]} {LEVEL_LABELS[level]}</div>
            </div>
          </div>

          {editing && (
            <div className={styles.field}>
              <label className={styles.label}>Новый пароль</label>
              <input className={styles.input} type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Оставьте пустым, чтобы не менять" />
            </div>
          )}

          <div className={styles.actions}>
            {editing ? (
              <>
                <button className={styles.btnSave} onClick={handleSave}>Сохранить</button>
                <button className={styles.btnCancel} onClick={() => setEditing(false)}>Отмена</button>
              </>
            ) : (
              <button className={styles.btnEdit} onClick={startEdit}>Изменить</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
