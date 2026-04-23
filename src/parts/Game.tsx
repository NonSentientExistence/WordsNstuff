import { useGame, type GameStats } from "../hooks/useGame"
import PlayerHealthIcon from "../components/PlayerHealthIcon";
import "../components/game.css";

interface GameProps {
  onEnd: (stats: GameStats) => void
}

export default function Game({ onEnd }: GameProps) {
  const { game, word, setWord, submitted, message, myHp, opponentHp, handleSubmit, myLastWord, opponentLastWord, myLastDamage , opponentLastDamage } = useGame(onEnd)

  if (!game) return <p>Loading game...</p>;

  return (
    <div>
<h1>1v1 Battle To Death</h1>

      <div className="health-display">
        <div className="player-section">
          <h2 style={{ color: "#025BD6"}}>You</h2>
          <PlayerHealthIcon hp={myHp ?? 0} maxHp={100} size={80} showLabel={true} />
          <p style={{ color: "#025BD6"}}>Your word: {myLastWord ?? '—'} {opponentLastDamage ? `>>--${opponentLastDamage}-dmg--|>` : ''}</p>
        </div>

        <div className="player-section">
          <h2 style={{ color: "#F87402"}}>Opponent</h2>
          <PlayerHealthIcon
            hp={opponentHp ?? 0}
            maxHp={100}
            size={80}
            showLabel={true}
          />
          <p style={{ color: "#F87402"}}>Opponents word: {opponentLastWord ?? '—'} {myLastDamage ? `>>--${myLastDamage}-dmg--|>` : ''}</p>
        </div>
      </div>

      {/* Letter pool */}
      <div>
        <h2>Letter Pool</h2>
        <div>
          {game.pool.map((letter, index) => (
            <span
              key={index}
              style={{
                margin: "4px",
                padding: "8px",
                border: "1px solid black",
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Word input */}
      <div>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value.toUpperCase())}
          disabled={submitted}
          placeholder="Type your word..."
        />
        <button onClick={handleSubmit} disabled={submitted}>
          {submitted ? "Waiting..." : "Submit Word"}
        </button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}
