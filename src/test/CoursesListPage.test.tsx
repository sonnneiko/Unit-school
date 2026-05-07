import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { LessonsProvider } from '../context/LessonsContext'
import { CoursesListPage } from '../pages/Admin/CoursesListPage'

function wrap() {
  return render(
    <UsersProvider>
      <LessonsProvider>
        <MemoryRouter>
          <CoursesListPage />
        </MemoryRouter>
      </LessonsProvider>
    </UsersProvider>
  )
}

describe('CoursesListPage', () => {
  it('shows all lessons', () => {
    wrap()
    expect(screen.getByText('Знакомство с UnitPay')).toBeInTheDocument()
    expect(screen.getByText('Аккаунтинг')).toBeInTheDocument()
  })

  it('shows publish toggle for each lesson', () => {
    wrap()
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('toggling changes button label', async () => {
    wrap()
    const publishedBtn = screen.getByText('Опубликован')
    await userEvent.click(publishedBtn)
    expect(screen.queryByText('Опубликован')).not.toBeInTheDocument()
    expect(screen.getAllByText('Скрыт').length).toBe(2)
  })
})
