import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { UsersProvider } from '../context/UsersContext'
import { LessonsProvider } from '../context/LessonsContext'
import { CourseDetailPage } from '../pages/Admin/CourseDetailPage'

function wrap(lessonId: string) {
  return render(
    <UsersProvider>
      <LessonsProvider>
        <MemoryRouter initialEntries={[`/admin/courses/${lessonId}`]}>
          <Routes>
            <Route path="/admin/courses/:id" element={<CourseDetailPage />} />
            <Route path="/admin/courses" element={<div>CoursesList</div>} />
          </Routes>
        </MemoryRouter>
      </LessonsProvider>
    </UsersProvider>
  )
}

describe('CourseDetailPage', () => {
  it('shows course title', () => {
    wrap('day-1')
    expect(screen.getByText('Знакомство с UnitPay')).toBeInTheDocument()
  })

  it('shows not-found for unknown id', () => {
    wrap('unknown')
    expect(screen.getByText(/не найден/i)).toBeInTheDocument()
  })

  it('shows slide list section', () => {
    wrap('day-1')
    expect(screen.getByText('Слайды')).toBeInTheDocument()
  })

  it('shows employee progress section', () => {
    wrap('day-1')
    expect(screen.getByText('Прогресс сотрудников')).toBeInTheDocument()
  })
})
