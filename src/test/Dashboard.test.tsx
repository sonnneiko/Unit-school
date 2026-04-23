import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { LessonsProvider } from '../context/LessonsContext'
import { AuthProvider } from '../context/AuthContext'
import { DashboardPage } from '../pages/Dashboard/Dashboard'

beforeEach(() => localStorage.clear())

function renderDashboard(user = {
  id: 'user-1', name: 'Соня Алхазова', email: 'user@unitpay.ru', role: 'user', progress: {}, streak: 0
}) {
  localStorage.setItem('unit_school_user', JSON.stringify(user))
  return render(
    <UsersProvider>
      <LessonsProvider>
        <AuthProvider>
          <MemoryRouter>
            <DashboardPage />
          </MemoryRouter>
        </AuthProvider>
      </LessonsProvider>
    </UsersProvider>
  )
}

describe('DashboardPage — empty state', () => {
  it('shows cat banner greeting', () => {
    renderDashboard()
    expect(screen.getByText(/Привет! Я Юнит/)).toBeInTheDocument()
  })

  it('shows start button', () => {
    renderDashboard()
    expect(screen.getByText('Начать обучение →')).toBeInTheDocument()
  })

  it('shows unpublished lesson as Скоро', () => {
    renderDashboard()
    expect(screen.getByText('Скоро')).toBeInTheDocument()
  })
})

describe('DashboardPage — in-progress state', () => {
  const userInProgress = {
    id: 'user-1', name: 'Соня Алхазова', email: 'user@unitpay.ru', role: 'user',
    progress: { 'day-1': 2 }, streak: 1, lastStreakDate: '2026-04-23'
  }

  it('shows continue hero', () => {
    renderDashboard(userInProgress)
    expect(screen.getByText('Продолжи с места, где остановился')).toBeInTheDocument()
  })

  it('shows growth path', () => {
    renderDashboard(userInProgress)
    expect(screen.getByText('Твой путь развития')).toBeInTheDocument()
  })

  it('shows achievements section', () => {
    renderDashboard(userInProgress)
    expect(screen.getByText('Последние достижения')).toBeInTheDocument()
  })

  it('shows first_slide achievement when progress exists', () => {
    renderDashboard(userInProgress)
    expect(screen.getByText('Поставил лапку в UnitSchool')).toBeInTheDocument()
  })
})
