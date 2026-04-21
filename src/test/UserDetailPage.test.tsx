import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { LessonsProvider } from '../context/LessonsContext'
import { UserDetailPage } from '../pages/Admin/UserDetailPage'

function wrap(userId: string) {
  return render(
    <UsersProvider>
      <LessonsProvider>
        <MemoryRouter initialEntries={[`/admin/users/${userId}`]}>
          <Routes>
            <Route path="/admin/users/:id" element={<UserDetailPage />} />
            <Route path="/admin/users" element={<div>UsersList</div>} />
          </Routes>
        </MemoryRouter>
      </LessonsProvider>
    </UsersProvider>
  )
}

beforeEach(() => localStorage.clear())

describe('UserDetailPage', () => {
  it('shows user name and email', () => {
    wrap('user-1')
    expect(screen.getByText('Соня Алхазова')).toBeInTheDocument()
    expect(screen.getByText(/user@unitpay.ru/)).toBeInTheDocument()
  })

  it('shows not-found message for unknown id', () => {
    wrap('unknown-id')
    expect(screen.getByText(/не найден/i)).toBeInTheDocument()
  })

  it('opens settings modal on gear click', async () => {
    wrap('user-1')
    await userEvent.click(screen.getByRole('button', { name: /⚙/ }))
    expect(screen.getByText('Настройки пользователя')).toBeInTheDocument()
  })
})
