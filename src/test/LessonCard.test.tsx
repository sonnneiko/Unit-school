import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { LessonCard } from '../components/LessonCard/LessonCard'
import type { Lesson } from '../types'

const baseLesson: Lesson = {
  id: 'day-1',
  title: 'Знакомство с UnitPay',
  tag: 'День 1',
  published: true,
  slides: new Array(8).fill({ id: 'x', type: 'info', content: { heading: '', bullets: [] } }),
}

function renderCard(progress = 0, published = true) {
  return render(
    <MemoryRouter>
      <LessonCard lesson={{ ...baseLesson, published }} progress={progress} />
    </MemoryRouter>
  )
}

describe('LessonCard', () => {
  it('renders lesson title and tag', () => {
    renderCard()
    expect(screen.getByText('Знакомство с UnitPay')).toBeInTheDocument()
    expect(screen.getByText('День 1')).toBeInTheDocument()
  })

  it('shows 0% at slide index 0', () => {
    renderCard(0)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('shows 43% at slide index 3 of 8 slides', () => {
    // Math.round(3 / 7 * 100) = 43
    renderCard(3)
    expect(screen.getByText('43%')).toBeInTheDocument()
  })

  it('shows 100% at slide index 7 of 8 slides', () => {
    renderCard(7)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })

  it('shows locked badge for unpublished lesson', () => {
    renderCard(0, false)
    expect(screen.getByText('Скоро')).toBeInTheDocument()
  })

  it('renders a link to /lesson/day-1 when published', () => {
    renderCard()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/lesson/day-1')
  })
})
