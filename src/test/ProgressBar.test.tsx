import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProgressBar } from '../components/ProgressBar/ProgressBar'

describe('ProgressBar', () => {
  it('renders the percentage label by default', () => {
    render(<ProgressBar value={57} />)
    expect(screen.getByText('57%')).toBeInTheDocument()
  })

  it('hides the label when showLabel is false', () => {
    render(<ProgressBar value={57} showLabel={false} />)
    expect(screen.queryByText('57%')).not.toBeInTheDocument()
  })

  it('renders fill div with correct width style', () => {
    const { container } = render(<ProgressBar value={75} />)
    const fill = container.querySelector('[style*="width: 75%"]')
    expect(fill).not.toBeNull()
  })

  it('clamps to 0 when value is negative', () => {
    const { container } = render(<ProgressBar value={-5} />)
    const fill = container.querySelector('[style*="width: 0%"]')
    expect(fill).not.toBeNull()
  })

  it('clamps to 100 when value exceeds 100', () => {
    const { container } = render(<ProgressBar value={120} />)
    const fill = container.querySelector('[style*="width: 100%"]')
    expect(fill).not.toBeNull()
  })
})
