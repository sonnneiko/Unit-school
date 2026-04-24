import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import styles from './Profile.module.css'

const ROLE_LABELS: Record<string, string> = {
  user: 'Сотрудник',
  admin: 'Администратор',
  manager: 'Менеджер',
  support: 'Поддержка',
  account_manager: 'Аккаунт-менеджер',
  security: 'Безопасность',
  developer: 'Разработчик',
}

function getInitials(user: { name: string; firstName?: string; lastName?: string }): string {
  const f = user.firstName ?? user.name.split(' ')[0] ?? ''
  const l = user.lastName ?? user.name.split(' ')[1] ?? ''
  return (f[0] ?? '') + (l[0] ?? '')
}

function parseName(user: { name: string; firstName?: string; lastName?: string; patronymic?: string }) {
  const parts = user.name.split(' ')
  return {
    firstName: user.firstName ?? parts[0] ?? '',
    lastName: user.lastName ?? parts[1] ?? '',
    patronymic: user.patronymic ?? '',
  }
}

export function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const [editing, setEditing] = useState(false)

  const parsed = user ? parseName(user) : { firstName: '', lastName: '', patronymic: '' }
  const [form, setForm] = useState({
    firstName: parsed.firstName,
    lastName: parsed.lastName,
    patronymic: parsed.patronymic,
    birthDate: user?.birthDate ?? '',
    phone: user?.phone ?? '',
    telegram: user?.telegram ?? '',
  })
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({})

  if (!user) return null

  function startEdit() {
    const p = parseName(user!)
    setForm({
      firstName: p.firstName,
      lastName: p.lastName,
      patronymic: p.patronymic,
      birthDate: user!.birthDate ?? '',
      phone: user!.phone ?? '',
      telegram: user!.telegram ?? '',
    })
    setErrors({})
    setEditing(true)
  }

  function cancel() {
    setErrors({})
    setEditing(false)
  }

  function save() {
    const errs: typeof errors = {}
    if (!form.firstName.trim()) errs.firstName = 'Обязательное поле'
    if (!form.lastName.trim()) errs.lastName = 'Обязательное поле'
    if (Object.keys(errs).length) { setErrors(errs); return }
    updateProfile({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      patronymic: form.patronymic.trim() || undefined,
      birthDate: form.birthDate.trim() || undefined,
      phone: form.phone.trim() || undefined,
      telegram: form.telegram.trim() || undefined,
    })
    setEditing(false)
  }

  function field(key: keyof typeof form, value: string) {
    setForm(f => ({ ...f, [key]: value }))
    if (key in errors) setErrors(e => ({ ...e, [key]: undefined }))
  }

  const initials = getInitials(user)
  const roleLabel = ROLE_LABELS[user.role] ?? user.role
  const displayName = [
    user.firstName ?? user.name.split(' ')[0],
    user.lastName ?? user.name.split(' ')[1],
  ].filter(Boolean).join(' ') || user.name

  return (
    <div className={styles.page}>
      <div className={styles.title}>Профиль</div>
      <div className={styles.card}>

        {/* Left panel */}
        <div className={styles.left}>
          <div className={styles.avatar}>
            {user.photo
              ? <img src={user.photo} alt={user.name} className={styles.avatarImg} />
              : <span>{initials.toUpperCase()}</span>
            }
          </div>
          <div className={styles.avatarName}>{displayName}</div>
          <div className={styles.avatarRole}>{roleLabel}</div>
          {editing && (
            <label className={styles.photoBtn}>
              Сменить фото
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = ev => updateProfile({ ...(ev.target?.result ? {} : {}) })
                reader.readAsDataURL(file)
              }} />
            </label>
          )}
        </div>

        {/* Right panel */}
        <div className={styles.right}>

          <div className={styles.sectionTitle}>Личные данные</div>
          <div className={styles.row3}>
            <div className={styles.field}>
              <div className={styles.label}>
                Имя{editing && <span className={styles.required}> *</span>}
              </div>
              {editing
                ? <input
                    className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                    value={form.firstName}
                    onChange={e => field('firstName', e.target.value)}
                  />
                : <div className={styles.value}>{user.firstName ?? user.name.split(' ')[0] ?? '—'}</div>
              }
              {errors.firstName && <div className={styles.errorMsg}>{errors.firstName}</div>}
            </div>
            <div className={styles.field}>
              <div className={styles.label}>
                Фамилия{editing && <span className={styles.required}> *</span>}
              </div>
              {editing
                ? <input
                    className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                    value={form.lastName}
                    onChange={e => field('lastName', e.target.value)}
                  />
                : <div className={styles.value}>{user.lastName ?? user.name.split(' ')[1] ?? '—'}</div>
              }
              {errors.lastName && <div className={styles.errorMsg}>{errors.lastName}</div>}
            </div>
            <div className={styles.field}>
              <div className={styles.label}>Отчество</div>
              {editing
                ? <input className={styles.input} value={form.patronymic} onChange={e => field('patronymic', e.target.value)} placeholder="—" />
                : <div className={`${styles.value} ${!user.patronymic ? styles.valueMuted : ''}`}>{user.patronymic || '—'}</div>
              }
            </div>
          </div>

          <div className={styles.row2}>
            <div className={styles.field}>
              <div className={styles.label}>Дата рождения</div>
              {editing
                ? <input className={styles.input} value={form.birthDate} onChange={e => field('birthDate', e.target.value)} placeholder="дд.мм.гггг" />
                : <div className={`${styles.value} ${!user.birthDate ? styles.valueMuted : ''}`}>{user.birthDate || '—'}</div>
              }
            </div>
            <div className={styles.field}>
              <div className={styles.label}>Телефон</div>
              {editing
                ? <input className={styles.input} value={form.phone} onChange={e => field('phone', e.target.value)} placeholder="+7 (___) ___-__-__" />
                : <div className={`${styles.value} ${!user.phone ? styles.valueMuted : ''}`}>{user.phone || '—'}</div>
              }
            </div>
          </div>

          <div className={styles.sectionTitle}>Контакты</div>
          <div className={styles.row2}>
            <div className={styles.field}>
              <div className={styles.label}>
                E-mail{editing && <span className={styles.lockIcon}>🔒</span>}
              </div>
              <div className={`${styles.value} ${editing ? styles.valueLocked : ''}`}>{user.email}</div>
            </div>
            <div className={styles.field}>
              <div className={styles.label}>Telegram</div>
              {editing
                ? <input className={styles.input} value={form.telegram} onChange={e => field('telegram', e.target.value)} placeholder="@username" />
                : <div className={`${styles.value} ${!user.telegram ? styles.valueMuted : styles.valueTg}`}>{user.telegram || '—'}</div>
              }
            </div>
          </div>

          <div className={styles.sectionTitle}>Должность</div>
          <div className={styles.field}>
            <div className={styles.label}>
              Роль{editing && <span className={styles.lockIcon}>🔒</span>}
            </div>
            <div className={`${styles.value} ${editing ? styles.valueLocked : ''}`}>{roleLabel}</div>
          </div>

          <div className={styles.divider} />
          <div className={styles.btnRow}>
            {editing ? (
              <>
                <button className={styles.btnPrimary} onClick={save}>Сохранить</button>
                <button className={styles.btnSecondary} onClick={cancel}>Отмена</button>
              </>
            ) : (
              <button className={styles.btnPrimary} onClick={startEdit}>Изменить</button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
