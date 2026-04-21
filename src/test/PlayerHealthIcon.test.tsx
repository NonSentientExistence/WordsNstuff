import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PlayerHealthIcon from "../components/PlayerHealthIcon.tsx";

describe("PlayerHealthIcon", () => {
  it("renders with green color when HP is high (100%)", () => {
    render(<PlayerHealthIcon hp={100} size={64} showLabel={true} />);

    const container = document.querySelector(".head-container") as HTMLElement;
    expect(container).toBeTruthy();
    expect(container.className).toContain("status-healthy");

    const label = screen.getByText("100%");
    expect(label).toBeTruthy();
    expect(label.className).toContain("status-healthy");
  });

  it("shows yellow color and bandage when HP is 60%", () => {
    render(<PlayerHealthIcon hp={60} size={64} showLabel={true} />);

    const container = document.querySelector(".head-container") as HTMLElement;
    expect(container.className).toContain("status-damaged");

    const bandage = document.querySelector(".bandage-head");
    expect(bandage).toBeTruthy();

    const label = screen.getByText("60%");
    expect(label.className).toContain("status-damaged");
  });

  it("shows red color, blood overlay and cracks when HP is 20%", () => {
    render(<PlayerHealthIcon hp={20} size={64} showLabel={true} />);

    const container = document.querySelector(".head-container") as HTMLElement;
    expect(container.className).toContain("status-critical");

    const blood = document.querySelector(".blood-overlay");
    expect(blood).toBeTruthy();

    const cracks = document.querySelectorAll(".crack-overlay");
    expect(cracks.length).toBe(2); // critical har 2 cracks

    const mouth = document.querySelector(".mouth.sad");
    expect(mouth).toBeTruthy();
  });

  it("shows defeated styling when HP is 0", () => {
    render(<PlayerHealthIcon hp={0} size={64} showLabel={true} />);

    const container = document.querySelector(".head-container") as HTMLElement;
    expect(container.className).toContain("status-defeated");

    const cracks = document.querySelectorAll(".crack-overlay");
    expect(cracks.length).toBe(4); // defeated har 4 cracks

    const label = screen.getByText("0%");
    expect(label.className).toContain("status-defeated");
  });

  it("triggers onDamageTaken callback when HP decreases", () => {
    const onDamageTaken = vi.fn();
    const { rerender } = render(
      <PlayerHealthIcon hp={100} onDamageTaken={onDamageTaken} />,
    );

    rerender(<PlayerHealthIcon hp={80} onDamageTaken={onDamageTaken} />);

    expect(onDamageTaken).toHaveBeenCalledTimes(1);
  });

  it("does not trigger callback when HP increases", () => {
    const onDamageTaken = vi.fn();
    const { rerender } = render(
      <PlayerHealthIcon hp={50} onDamageTaken={onDamageTaken} />,
    );

    rerender(<PlayerHealthIcon hp={80} onDamageTaken={onDamageTaken} />);

    expect(onDamageTaken).not.toHaveBeenCalled();
  });

  it("applies damage-shake animation class on HP decrease", async () => {
    const { rerender } = render(<PlayerHealthIcon hp={100} />);

    const container = document.querySelector(".head-container") as HTMLElement;
    expect(container.classList.contains("damage-animation")).toBe(false);

    rerender(<PlayerHealthIcon hp={80} />);

    await waitFor(() => {
      expect(container.classList.contains("damage-animation")).toBe(true);
    });
  });
});

it("displays correct number of health segments", () => {
  render(<PlayerHealthIcon hp={75} size={64} />);

  const segments = document.querySelectorAll(".segment");
  expect(segments.length).toBe(6);

  const activeSegments = document.querySelectorAll(".segment.active");
  expect(activeSegments.length).toBe(5);
});

it("shows X eyes when HP is below 30%", () => {
  render(<PlayerHealthIcon hp={20} />);

  const leftEye = document.querySelector(".eye.left.x-eye");
  const rightEye = document.querySelector(".eye.right.x-eye");

  expect(leftEye).toBeTruthy();
  expect(rightEye).toBeTruthy();
});

it("shows sad mouth when HP is below 50%", () => {
  render(<PlayerHealthIcon hp={40} />);

  const mouth = document.querySelector(".mouth.sad");
  expect(mouth).toBeTruthy();
});

it("calculates health percentage correctly with custom maxHp", async () => {
  render(<PlayerHealthIcon hp={75} maxHp={150} size={64} showLabel={true} />);

  await waitFor(() => {
    const label = screen.getByText("50%");
    expect(label).toBeTruthy();
  });
});

it("handles negative HP gracefully", () => {
  render(<PlayerHealthIcon hp={-10} size={64} showLabel={true} />);

  const label = screen.getByText("0%");
  expect(label).toBeTruthy();
  expect(label.className).toContain("status-defeated");
});
