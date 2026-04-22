import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Finished from '../parts/Finished'

vi.mock('../api', () => ({
  resetLobby: vi.fn().mockResolvedValue(true)
}))

const defaultStats = {
  rounds: 3,
  damageDealt: 45,
  won: false,
  playerName: 'Testspelaren',
  code: 'ABC123'
}

describe('Finished', () => {
  it('visar You Lose! när spelaren förlorade', () => {
    render(<Finished onReplay={() => {}} stats={defaultStats} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('You Lose!')
  })

  it('visar You Win! när spelaren vann', () => {
    render(<Finished onReplay={() => {}} stats={{ ...defaultStats, won: true }} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('You Win!')
  })

  it('visar spelarens namn', () => {
    render(<Finished onReplay={() => {}} stats={defaultStats} />)
    expect(screen.getByText(/Game Over, Testspelaren!/)).toBeInTheDocument()
  })

  it('visar spelstatistik', () => {
    render(<Finished onReplay={() => {}} stats={defaultStats} />)
    expect(screen.getByText(/Rounds played: 3/)).toBeInTheDocument()
    expect(screen.getByText(/Total damage dealt: 45/)).toBeInTheDocument()
  })

  it('anropar onReplay när Play Again klickas', async () => {
    const onReplay = vi.fn()
    render(<Finished onReplay={onReplay} stats={defaultStats} />)
    fireEvent.click(screen.getByText('Play Again'))
    await vi.waitFor(() => expect(onReplay).toHaveBeenCalled())
  })
})
