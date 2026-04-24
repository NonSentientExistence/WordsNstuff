import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Play from '../pages/Play'

function renderLobby() {
  return render(
    <MemoryRouter initialEntries={['/play/XYZ789']}>
      <Routes>
        <Route path="/play/:code" element={<Play />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Lobby', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ playerCount: 1, status: 'waiting' })
    } as Response)
  })

  afterEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('shows the lobby code', async () => {
    renderLobby()
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('XYZ789')
  })

  it('shows waiting for opponent', async () => {
    vi.useFakeTimers()
    renderLobby()
    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(screen.getByText(/Waiting for opponent/)).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('shows name popup when no name is set', () => {
    renderLobby()
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
    expect(screen.getByText("What's your name?")).toBeInTheDocument()
  })

  it('closes popup and saves name when Confirm is clicked', () => {
    renderLobby()
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), {
      target: { value: 'Testspelaren' }
    })
    fireEvent.click(screen.getByText('Confirm'))
    expect(screen.queryByText("What's your name?")).not.toBeInTheDocument()
    expect(sessionStorage.getItem('playerName')).toBe('Testspelaren')
  })

  it('does not show popup when name already exists in sessionStorage', () => {
    sessionStorage.setItem('playerName', 'Befintligt namn')
    renderLobby()
    expect(screen.queryByPlaceholderText('Enter your name')).not.toBeInTheDocument()
  })

  it('does not show start button without a name even when lobby is ready', async () => {
    vi.useFakeTimers()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ playerCount: 2, status: 'ready' })
    } as Response)
    renderLobby()
    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(screen.queryByText('Start Game')).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  it('shows start button when name is set and lobby is ready', async () => {
    sessionStorage.setItem('playerName', 'Testspelaren')
    vi.useFakeTimers()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ playerCount: 2, status: 'ready' })
    } as Response)
    renderLobby()
    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(screen.getByText('Start Game')).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('does not crash and shows lobby when API responds with error (500)', async () => {
    vi.useFakeTimers()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => { throw new Error('Server error') },
    } as unknown as Response)
    renderLobby()
    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    vi.useRealTimers()
  })

  it('shows loading text when lobby API responds with error', async () => {
    vi.useFakeTimers()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => null,
    } as unknown as Response)
    renderLobby()
    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(screen.getByText(/Loading\.\.\./)).toBeInTheDocument()
    vi.useRealTimers()
  })
})
