import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Play from "../pages/Play";

describe("Play", () => {
  beforeEach(() => {
    vi.useFakeTimers();
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
    vi.useRealTimers();
  });

  it("visar att spelet har startat", async () => {
    render(
      <MemoryRouter initialEntries={["/play/ABC123"]}>
        <Routes>
          <Route path="/play/:code" element={<Play />} />
        </Routes>
      </MemoryRouter>,
    );
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByAltText("WordsNstuff")).toBeInTheDocument();
  });
});
