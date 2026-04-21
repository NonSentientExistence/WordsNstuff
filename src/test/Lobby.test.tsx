import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Lobby from '../pages/Lobby'

function renderLobby() {
  return render(
    <MemoryRouter initialEntries={['/lobby/XYZ789']}>
      <Routes>
        <Route path="/lobby/:code" element={<Lobby />} />
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

  it('visar lobbykoden', async () => {
    renderLobby()
    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent('XYZ789')
  })

  it('visar väntar på motståndare', async () => {
    renderLobby()
    expect(await screen.findByText(/Väntar på motståndare/)).toBeInTheDocument()
  })

  it('visar namn-popup när inget namn är satt', () => {
    renderLobby()
    expect(screen.getByPlaceholderText('Skriv in ditt namn')).toBeInTheDocument()
    expect(screen.getByText('Vad heter du?')).toBeInTheDocument()
  })

  it('stänger popup och sparar namn när bekräfta klickas', () => {
    renderLobby()
    fireEvent.change(screen.getByPlaceholderText('Skriv in ditt namn'), {
      target: { value: 'Testspelaren' }
    })
    fireEvent.click(screen.getByText('Bekräfta'))
    expect(screen.queryByText('Vad heter du?')).not.toBeInTheDocument()
    expect(sessionStorage.getItem('playerName')).toBe('Testspelaren')
  })

  it('visar inte popup när namn redan finns i sessionStorage', () => {
    sessionStorage.setItem('playerName', 'Befintligt namn')
    renderLobby()
    expect(screen.queryByPlaceholderText('Skriv in ditt namn')).not.toBeInTheDocument()
  })

  it('visar inte starta-knappen utan namn även när lobby är redo', async () => {
    vi.useFakeTimers()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ playerCount: 2, status: 'ready' })
    } as Response)
    renderLobby()
    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(screen.queryByText('Starta spel')).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  it('visar starta-knappen när namn är satt och lobby är redo', async () => {
    sessionStorage.setItem('playerName', 'Testspelaren')
    vi.useFakeTimers()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ playerCount: 2, status: 'ready' })
    } as Response)
    renderLobby()
    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(screen.getByText('Starta spel')).toBeInTheDocument()
    vi.useRealTimers()
  })
})
