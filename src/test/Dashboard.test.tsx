import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { DashboardPage } from '../pages/Dashboard/Dashboard'

beforeEach(() => localStorage.clear())

function renderDashboard(user = {
  id: 'user-1', name: 'Соня Алхазова', email: 'user@unitpay.ru', role: 'user', progress: {}
}) {
  localStorage.setItem('unit_school_user', JSON.stringify(user))
  return render(
    <AuthProvider>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('DashboardPage', () => {
  it('shows greeting with first name', () => {
    renderDashboard()
    expect(screen.getByText(/Привет, Соня/)).toBeInTheDocument()
  })

  it('shows Day 1 lesson card', () => {
    renderDashboard()
    expect(screen.getByText('Знакомство с UnitPay')).toBeInTheDocument()
  })

  it('shows Day 2 as locked', () => {
    renderDashboard()
    expect(screen.getByText('Скоро')).toBeInTheDocument()
  })

  it('shows saved progress on Day 1', () => {
    renderDashboard({ id: 'user-1', name: 'Соня Алхазова', email: 'user@unitpay.ru', role: 'user', progress: { 'day-1': 4 } })
    // Math.round(4/7*100) = 57
    expect(screen.getByText('57%')).toBeInTheDocument()
  })
})
