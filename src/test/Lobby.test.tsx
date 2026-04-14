import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Lobby from '../pages/Lobby'

describe('Lobby', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ code: 'XYZ789', playerCount: 1, status: 'waiting' })
    } as Response)
  })

  it('visar lobbykoden', async () => {
    render(
      <MemoryRouter initialEntries={['/lobby/XYZ789']}>
        <Routes>
          <Route path="/lobby/:code" element={<Lobby />} />
        </Routes>
      </MemoryRouter>
    )
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('XYZ789')
  })

  it('visar väntar på motståndare', async () => {
    render(
      <MemoryRouter initialEntries={['/lobby/XYZ789']}>
        <Routes>
          <Route path="/lobby/:code" element={<Lobby />} />
        </Routes>
      </MemoryRouter>
    )
    expect(await screen.findByText(/Väntar på motståndare/)).toBeInTheDocument()
  })
})



  it('visar lobbykoden', async () => {
    render(
      <MemoryRouter initialEntries={['/lobby/XYZ789']}>
        <Routes>
          <Route path="/lobby/:code" element={<Lobby />} />
        </Routes>
      </MemoryRouter>
    )
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('XYZ789')
  })

