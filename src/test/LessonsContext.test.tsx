import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LessonsProvider, useLessons } from '../context/LessonsContext'

function Consumer() {
  const { lessons, togglePublished } = useLessons()
  return (
    <div>
      <span data-testid="count">{lessons.length}</span>
      <span data-testid="day1-published">{String(lessons.find(l => l.id === 'day-1')?.published)}</span>
      <button onClick={() => togglePublished('day-1')}>Toggle</button>
    </div>
  )
}

describe('LessonsContext', () => {
  it('initialises with mockLessons', () => {
    render(<LessonsProvider><Consumer /></LessonsProvider>)
    expect(Number(screen.getByTestId('count').textContent)).toBeGreaterThan(0)
  })

  it('day-1 starts published', () => {
    render(<LessonsProvider><Consumer /></LessonsProvider>)
    expect(screen.getByTestId('day1-published').textContent).toBe('true')
  })

  it('togglePublished flips published state', async () => {
    render(<LessonsProvider><Consumer /></LessonsProvider>)
    await userEvent.click(screen.getByText('Toggle'))
    expect(screen.getByTestId('day1-published').textContent).toBe('false')
  })
})
