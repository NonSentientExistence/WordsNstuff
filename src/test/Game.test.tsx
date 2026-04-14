import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Game from '../pages/Game'

describe('Game', () => {
  it('visar att spelet har startat', () => {
    render(
      <MemoryRouter initialEntries={['/game/ABC123']}>
        <Routes>
          <Route path="/game/:code" element={<Game />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Spelet har startat!')).toBeInTheDocument()
  })
})