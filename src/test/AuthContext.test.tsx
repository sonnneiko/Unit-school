import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsersProvider } from '../context/UsersContext'
import { AuthProvider, useAuth } from '../context/AuthContext'

function TestConsumer() {
  const { user, login, logout, updateProgress } = useAuth()
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'null'}</span>
      <span data-testid="progress">{JSON.stringify(user?.progress ?? {})}</span>
      <button onClick={() => login('user@unitpay.ru', 'password123')}>Login User</button>
      <button onClick={() => login('admin@unitpay.ru', 'admin123')}>Login Admin</button>
      <button onClick={() => login('bad@email.ru', 'wrongpass').catch(() => {})}>Bad Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => updateProgress('day-1', 3)}>Update Progress</button>
    </div>
  )
}

function wrap(ui: React.ReactElement) {
  return render(<UsersProvider><AuthProvider>{ui}</AuthProvider></UsersProvider>)
}

beforeEach(() => { localStorage.clear() })

describe('AuthContext', () => {
  it('starts with no user', () => {
    wrap(<TestConsumer />)
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('logs in a regular user', async () => {
    wrap(<TestConsumer />)
    await userEvent.click(screen.getByText('Login User'))
    expect(screen.getByTestId('user').textContent).toBe('user@unitpay.ru')
  })

  it('logs in an admin user', async () => {
    wrap(<TestConsumer />)
    await userEvent.click(screen.getByText('Login Admin'))
    expect(screen.getByTestId('user').textContent).toBe('admin@unitpay.ru')
  })

  it('does not change user on bad credentials', async () => {
    wrap(<TestConsumer />)
    await userEvent.click(screen.getByText('Bad Login'))
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('logs out and clears user', async () => {
    wrap(<TestConsumer />)
    await userEvent.click(screen.getByText('Login User'))
    await userEvent.click(screen.getByText('Logout'))
    expect(screen.getByTestId('user').textContent).toBe('null')
  })

  it('persists session to localStorage on login', async () => {
    wrap(<TestConsumer />)
    await userEvent.click(screen.getByText('Login User'))
    expect(localStorage.getItem('unit_school_user')).not.toBeNull()
  })

  it('restores session from localStorage on mount', () => {
    const user = { id: 'user-1', name: 'Соня', email: 'user@unitpay.ru', role: 'user', progress: {} }
    localStorage.setItem('unit_school_user', JSON.stringify(user))
    wrap(<TestConsumer />)
    expect(screen.getByTestId('user').textContent).toBe('user@unitpay.ru')
  })

  it('updateProgress stores slideIndex for lessonId', async () => {
    wrap(<TestConsumer />)
    await userEvent.click(screen.getByText('Login User'))
    await userEvent.click(screen.getByText('Update Progress'))
    expect(screen.getByTestId('progress').textContent).toBe('{"day-1":3}')
  })

  it('updateProgress persists to localStorage', async () => {
    wrap(<TestConsumer />)
    await userEvent.click(screen.getByText('Login User'))
    await userEvent.click(screen.getByText('Update Progress'))
    const stored = JSON.parse(localStorage.getItem('unit_school_user') ?? '{}')
    expect(stored.progress['day-1']).toBe(3)
  })
})
