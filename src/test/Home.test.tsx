import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Home from '../pages/Home'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return { ...actual, useNavigate: () => mockNavigate }
})

describe('Home', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ code: 'ABC123' })
    } as Response)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('visar skapa lobby-knapp', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByText('Skapa lobby')).toBeInTheDocument()
  })

  it('visar input för lobbykod', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    expect(screen.getByPlaceholderText('Skriv in lobbykod')).toBeInTheDocument()
  })

  it('anropar API och navigerar till lobby vid klick på Skapa lobby', async () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    fireEvent.click(screen.getByText('Skapa lobby'))
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/lobbies',
        expect.objectContaining({ method: 'POST' })
      )
      expect(mockNavigate).toHaveBeenCalledWith('/play/ABC123')
    })
  })

  it('navigerar till lobbykod med Gå med-knappen', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    fireEvent.change(screen.getByPlaceholderText('Skriv in lobbykod'), {
      target: { value: 'xyz789' }
    })
    fireEvent.click(screen.getByText('Gå med'))
    expect(mockNavigate).toHaveBeenCalledWith('/play/XYZ789')
  })

  it('Gå med gör ingenting om lobbykod är tom', () => {
    render(<MemoryRouter><Home /></MemoryRouter>)
    fireEvent.click(screen.getByText('Gå med'))
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
