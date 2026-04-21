import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsersProvider } from '../context/UsersContext'
import { SettingsModal } from '../components/SettingsModal/SettingsModal'
import type { User } from '../types'

const mockUser: User = {
  id: 'user-1',
  name: 'Соня Алхазова',
  email: 'user@unitpay.ru',
  role: 'user',
  progress: {},
}

function wrap(onClose = vi.fn()) {
  return render(
    <UsersProvider>
      <SettingsModal user={mockUser} onClose={onClose} />
    </UsersProvider>
  )
}

describe('SettingsModal', () => {
  it('renders email field pre-filled', () => {
    wrap()
    expect(screen.getByDisplayValue('user@unitpay.ru')).toBeInTheDocument()
  })

  it('renders role select pre-filled', () => {
    wrap()
    expect(screen.getByDisplayValue('Сотрудник')).toBeInTheDocument()
  })

  it('calls onClose when cancel is clicked', async () => {
    const onClose = vi.fn()
    wrap(onClose)
    await userEvent.click(screen.getByText('Отмена'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose after saving', async () => {
    const onClose = vi.fn()
    wrap(onClose)
    await userEvent.click(screen.getByText('Сохранить'))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
