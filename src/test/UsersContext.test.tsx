import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsersProvider, useUsers } from '../context/UsersContext'

function Consumer() {
  const { users, passwords, addUser, updateUser, updatePassword } = useUsers()
  return (
    <div>
      <span data-testid="count">{users.length}</span>
      <span data-testid="pwd-user1">{passwords['user-1']}</span>
      <button onClick={() => addUser(
        { id: 'new-1', name: 'Новый', email: 'new@test.ru', role: 'user', progress: {} },
        'pass123'
      )}>Add</button>
      <button onClick={() => updateUser('user-1', { name: 'Изменён' })}>UpdateName</button>
      <button onClick={() => updatePassword('user-1', 'newpass')}>UpdatePwd</button>
      <span data-testid="name-user1">{users.find(u => u.id === 'user-1')?.name}</span>
      <span data-testid="pwd-after">{passwords['user-1']}</span>
    </div>
  )
}

describe('UsersContext', () => {
  it('initialises with mockUsers count', () => {
    render(<UsersProvider><Consumer /></UsersProvider>)
    expect(Number(screen.getByTestId('count').textContent)).toBeGreaterThan(0)
  })

  it('passwords are keyed by userId', () => {
    render(<UsersProvider><Consumer /></UsersProvider>)
    expect(screen.getByTestId('pwd-user1').textContent).toBe('password123')
  })

  it('addUser increases user count', async () => {
    render(<UsersProvider><Consumer /></UsersProvider>)
    const before = Number(screen.getByTestId('count').textContent)
    await userEvent.click(screen.getByText('Add'))
    expect(Number(screen.getByTestId('count').textContent)).toBe(before + 1)
  })

  it('updateUser changes a field', async () => {
    render(<UsersProvider><Consumer /></UsersProvider>)
    await userEvent.click(screen.getByText('UpdateName'))
    expect(screen.getByTestId('name-user1').textContent).toBe('Изменён')
  })

  it('updatePassword changes password by userId', async () => {
    render(<UsersProvider><Consumer /></UsersProvider>)
    await userEvent.click(screen.getByText('UpdatePwd'))
    expect(screen.getByTestId('pwd-after').textContent).toBe('newpass')
  })
})
