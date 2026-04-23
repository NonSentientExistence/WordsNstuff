import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PlayerHealthIcon from '../components/PlayerHealthIcon'

describe('PlayerHealthIcon', () => {
  it('visar status-healthy vid 100 HP', () => {
    const { container } = render(<PlayerHealthIcon hp={100} />)
    expect(container.querySelector('.head-container')).toHaveClass('status-healthy')
  })

  it('visar status-healthy vid 61 HP', () => {
    const { container } = render(<PlayerHealthIcon hp={61} />)
    expect(container.querySelector('.head-container')).toHaveClass('status-healthy')
  })

  it('visar status-damaged vid 60 HP', () => {
    const { container } = render(<PlayerHealthIcon hp={60} />)
    expect(container.querySelector('.head-container')).toHaveClass('status-damaged')
  })

  it('visar bandage vid damaged (60 HP)', () => {
    const { container } = render(<PlayerHealthIcon hp={60} />)
    expect(container.querySelector('.bandage-head')).toBeInTheDocument()
  })

  it('visar INTE bandage vid healthy (100 HP)', () => {
    const { container } = render(<PlayerHealthIcon hp={100} />)
    expect(container.querySelector('.bandage-head')).not.toBeInTheDocument()
  })

  it('visar status-critical vid 20 HP', () => {
    const { container } = render(<PlayerHealthIcon hp={20} />)
    expect(container.querySelector('.head-container')).toHaveClass('status-critical')
  })

  it('visar blod och sprickor vid critical (20 HP)', () => {
    const { container } = render(<PlayerHealthIcon hp={20} />)
    expect(container.querySelector('.blood-overlay')).toBeInTheDocument()
    expect(container.querySelector('.crack-overlay')).toBeInTheDocument()
  })

  it('visar status-defeated vid 0 HP', () => {
    const { container } = render(<PlayerHealthIcon hp={0} />)
    expect(container.querySelector('.head-container')).toHaveClass('status-defeated')
  })

  it('visar INTE blod vid defeated (0 HP) – bara sprickor', () => {
    const { container } = render(<PlayerHealthIcon hp={0} />)
    expect(container.querySelector('.blood-overlay')).not.toBeInTheDocument()
    expect(container.querySelector('.crack-overlay')).toBeInTheDocument()
  })

  it('visar label med rätt procent när showLabel=true', () => {
    render(<PlayerHealthIcon hp={60} showLabel={true} />)
    expect(screen.getByText('60%')).toBeInTheDocument()
  })

  it('visar 0% vid defeated och showLabel=true', () => {
    render(<PlayerHealthIcon hp={0} showLabel={true} />)
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('visar INTE label när showLabel=false (default)', () => {
    const { container } = render(<PlayerHealthIcon hp={60} />)
    expect(container.querySelector('.health-label')).not.toBeInTheDocument()
  })

  it('rätt antal aktiva segment vid 100 HP (alla 6)', () => {
    const { container } = render(<PlayerHealthIcon hp={100} />)
    const activeSegments = container.querySelectorAll('.segment.active')
    expect(activeSegments.length).toBe(6)
  })

  it('inga aktiva segment vid 0 HP', () => {
    const { container } = render(<PlayerHealthIcon hp={0} />)
    const activeSegments = container.querySelectorAll('.segment.active')
    expect(activeSegments.length).toBe(0)
  })
})
