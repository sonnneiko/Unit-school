import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { LessonsProvider } from '../context/LessonsContext'
import { AuthProvider } from '../context/AuthContext'
import { ProgressPage } from '../pages/Progress/ProgressPage'

beforeEach(() => localStorage.clear())

function renderProgress(user = {
  id: 'user-1', name: 'Соня', email: 'user@unitpay.ru', role: 'user',
  progress: {}, streak: 0
}) {
  localStorage.setItem('unit_school_user', JSON.stringify(user))
  return render(
    <UsersProvider><LessonsProvider><AuthProvider>
      <MemoryRouter><ProgressPage /></MemoryRouter>
    </AuthProvider></LessonsProvider></UsersProvider>
  )
}

describe('ProgressPage', () => {
  it('renders heading', () => {
    renderProgress()
    expect(screen.getByText('Прогресс')).toBeInTheDocument()
  })

  it('shows streak 0 for new user', () => {
    renderProgress()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('shows streak days for active user', () => {
    renderProgress({ id: 'user-1', name: 'Соня', email: 'user@unitpay.ru', role: 'user',
      progress: { 'day-1': 7 }, streak: 15, lastStreakDate: '2026-04-24' })
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('shows Достижения section', () => {
    renderProgress()
    expect(screen.getByText('Достижения')).toBeInTheDocument()
  })

  it('shows peer comparison section', () => {
    renderProgress()
    expect(screen.getByText(/Сравнение с командой/)).toBeInTheDocument()
  })
})
