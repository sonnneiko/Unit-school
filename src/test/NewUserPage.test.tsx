import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { NewUserPage } from '../pages/Admin/NewUserPage'

function wrap() {
  return render(
    <UsersProvider>
      <MemoryRouter initialEntries={['/admin/users/new']}>
        <Routes>
          <Route path="/admin/users/new" element={<NewUserPage />} />
          <Route path="/admin/users" element={<div>UsersList</div>} />
        </Routes>
      </MemoryRouter>
    </UsersProvider>
  )
}

beforeEach(() => localStorage.clear())

describe('NewUserPage', () => {
  it('renders all form fields', () => {
    wrap()
    expect(screen.getByLabelText(/Имя/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Фамилия/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Пароль/)).toBeInTheDocument()
  })

  it('navigates back on cancel', async () => {
    wrap()
    await userEvent.click(screen.getByText('Отмена'))
    expect(screen.getByText('UsersList')).toBeInTheDocument()
  })

  it('navigates to list after creating user', async () => {
    wrap()
    await userEvent.type(screen.getByLabelText(/Имя/), 'Тест')
    await userEvent.type(screen.getByLabelText(/Фамилия/), 'Юзер')
    await userEvent.type(screen.getByLabelText(/Email/), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/Пароль/), 'pass123')
    await userEvent.click(screen.getByText('Создать'))
    expect(screen.getByText('UsersList')).toBeInTheDocument()
  })
})
