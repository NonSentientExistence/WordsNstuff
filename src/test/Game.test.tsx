import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Play from "../pages/Play";
import Game from "../parts/Game";

describe("Play", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    sessionStorage.setItem('playerName', 'Testspelaren')
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "playing",
        pool: ["T", "A", "N"],
        player1Hp: 100,
        player2Hp: 100,
        player1Id: "token-1",
        player2Id: "token-2",
      }),
    } as Response);
  });

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    sessionStorage.clear()
  })

  it('shows last word labels', async () => {
    render(
      <MemoryRouter initialEntries={['/play/ABC123']}>
        <Routes>
          <Route path="/play/:code" element={<Game onEnd={() => {}} />} />
        </Routes>
      </MemoryRouter>
    )
    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(screen.getByText(/Your word:/)).toBeInTheDocument()
    expect(screen.getByText(/Opponents word:/)).toBeInTheDocument()
  })

  it("visar att spelet har startat", async () => {
    render(
      <MemoryRouter initialEntries={["/play/ABC123"]}>
        <Routes>
          <Route path="/play/:code" element={<Play />} />
        </Routes>
      </MemoryRouter>
    );
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByAltText("WordsNstuff")).toBeInTheDocument();
  });

  it('visar en nedräkning när spelet är igång', async () => {
    render(
      <MemoryRouter initialEntries={['/play/ABC123']}>
        <Routes>
          <Route path="/play/:code" element={<Play />} />
        </Routes>
      </MemoryRouter>
    )
    // Advance through lobby poll to start game
    await act(async () => { vi.advanceTimersByTime(1000) })
    // Advance through game poll to display the timer
    await act(async () => { vi.advanceTimersByTime(1000) })
    expect(screen.getByText(/seconds left/)).toBeInTheDocument()
  })

  it('skippar rundan om inget ord är lagt och tiden tar slug', async () => {
    render(
      <MemoryRouter initialEntries={['/play/ABC123']}>
        <Routes>
          <Route path="/play/:code" element={<Play />} />
        </Routes>
      </MemoryRouter>
    )
    // Advance through lobby and game poll
    await act(async () => { vi.advanceTimersByTime(1000) })
    await act(async () => { vi.advanceTimersByTime(1000) })
    // Advance through the 30 second timer
    await act(async () => { vi.advanceTimersByTime(30000) })
    // Button should show Waiting if round was skipped
    expect(screen.getByText('Waiting...')).toBeInTheDocument()
  })
})