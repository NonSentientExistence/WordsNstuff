import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Game from '../pages/Game'

describe('Game', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        status: 'InProgress',
        pool: ['T', 'A', 'N'],
        player1Hp: 100,
        player2Hp: 100,
        player1Id: 'token-1',
        player2Id: 'token-2'
      })
    } as Response)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('visar att spelet har startat', async () => {
    render(
      <MemoryRouter initialEntries={['/game/ABC123']}>
        <Routes>
          <Route path="/game/:code" element={<Game />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    expect(screen.getByText('WordsNstuff')).toBeInTheDocument()
  })
})
