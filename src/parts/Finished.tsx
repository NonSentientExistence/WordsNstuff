interface FinsihedProps {
  onReplay: () => void;
}

export default function Finished({ onReplay }: FinsihedProps) {
  return (
    <div>
      <h1>Game Over!</h1>
      <p>The game has ended.</p>
      <button onClick={onReplay}>Play Again</button>
    </div>
  );
}
