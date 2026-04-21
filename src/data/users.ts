import type { User } from '../types'

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Соня Алхазова',
    email: 'user@unitpay.ru',
    role: 'user',
    progress: {},
    lastActive: '2026-04-20',
  },
  {
    id: 'admin-1',
    name: 'Администратор',
    email: 'admin@unitpay.ru',
    role: 'admin',
    progress: {},
    lastActive: '2026-04-20',
  },
]

export const mockPasswords: Record<string, string> = {
  'user@unitpay.ru': 'password123',
  'admin@unitpay.ru': 'admin123',
}
