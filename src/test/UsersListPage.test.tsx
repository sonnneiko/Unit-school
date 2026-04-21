import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { UsersListPage } from '../pages/Admin/UsersListPage'

function wrap() {
  return render(
    <UsersProvider>
      <MemoryRouter>
        <UsersListPage />
      </MemoryRouter>
    </UsersProvider>
  )
}

beforeEach(() => localStorage.clear())

describe('UsersListPage', () => {
  it('shows non-admin users', () => {
    wrap()
    expect(screen.getByText('Соня Алхазова')).toBeInTheDocument()
  })

  it('does not show admin users', () => {
    wrap()
    expect(screen.queryByText('Администратор')).not.toBeInTheDocument()
  })

  it('shows "+ Добавить сотрудника" button', () => {
    wrap()
    expect(screen.getByText(/Добавить сотрудника/)).toBeInTheDocument()
  })

  it('opens SettingsModal when gear icon is clicked', async () => {
    wrap()
    await userEvent.click(screen.getByRole('button', { name: /⚙/ }))
    expect(screen.getByText('Настройки пользователя')).toBeInTheDocument()
  })
})
