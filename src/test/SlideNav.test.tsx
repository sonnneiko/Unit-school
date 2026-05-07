import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SlideNav } from '../components/SlideNav/SlideNav'

function renderNav(current = 0, total = 5, onPrev = vi.fn(), onNext = vi.fn()) {
  return render(<SlideNav current={current} total={total} onPrev={onPrev} onNext={onNext} />)
}

describe('SlideNav', () => {
  it('renders correct number of dots', () => {
    renderNav(0, 5)
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })

  it('prev button is disabled on first slide', () => {
    renderNav(0, 5)
    expect(screen.getByLabelText('Предыдущий слайд')).toBeDisabled()
  })

  it('next button is disabled on last slide', () => {
    renderNav(4, 5)
    expect(screen.getByLabelText('Следующий слайд')).toBeDisabled()
  })

  it('calls onNext when next clicked', () => {
    const onNext = vi.fn()
    renderNav(0, 5, vi.fn(), onNext)
    fireEvent.click(screen.getByLabelText('Следующий слайд'))
    expect(onNext).toHaveBeenCalledOnce()
  })

  it('calls onPrev when prev clicked', () => {
    const onPrev = vi.fn()
    renderNav(2, 5, onPrev)
    fireEvent.click(screen.getByLabelText('Предыдущий слайд'))
    expect(onPrev).toHaveBeenCalledOnce()
  })
})
