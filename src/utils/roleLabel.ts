import type { User } from '../types'

const ROLE_LABELS: Record<User['role'], string> = {
  admin: 'Администратор',
  user: 'Сотрудник',
  support: 'Саппорт',
  account_manager: 'Аккаунт менеджер',
  security: 'Служба безопасности',
  developer: 'Разработчик',
  manager: 'Менеджер',
}

export function roleLabel(role: User['role']): string {
  return ROLE_LABELS[role] ?? role
}
