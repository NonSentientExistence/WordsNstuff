import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Home from '../pages/Home'

describe('Home', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ code: 'ABC123' })
    } as Response)
  })

  it('visar skapa lobby-knapp', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByText('Skapa lobby')).toBeInTheDocument()
  })

  it('visar input för lobbykod', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByPlaceholderText('Skriv in lobbykod')).toBeInTheDocument()
  })
})
