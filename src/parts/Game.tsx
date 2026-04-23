import { useGame, type GameStats } from "../hooks/useGame"
import PlayerHealthIcon from "../components/PlayerHealthIcon";
import "../components/game.css";

interface GameProps {
  onEnd: (stats: GameStats) => void
}

export default function Game({ onEnd }: GameProps) {
  const { game, word, setWord, submitted, message, myHp, opponentHp, handleSubmit, myLastWord, opponentLastWord, myLastDamage, opponentLastDamage, playerName, opponentName } = useGame(onEnd)

  if (!game) return <p>Loading game...</p>;

  return (
    <div className="game-container">
      <h1>1v1 Battle To The Death</h1>

      <div className="health-display">
        <div className="player-section">
          <h2 style={{ color: "#3BAAFF" }}>{playerName}</h2>
          <PlayerHealthIcon hp={myHp ?? 0} maxHp={100} size={80} showLabel={true} />
          <p>Your word: {myLastWord ?? '—'} {opponentLastDamage ? `>>--${opponentLastDamage}-dmg--|>` : ''}</p>
        </div>

        <div className="player-section">
          <h2 style={{ color: "#F87402" }}>{opponentName}</h2>
          <PlayerHealthIcon hp={opponentHp ?? 0} maxHp={100} size={80} showLabel={true} />
          <p>Opponents word: {opponentLastWord ?? '—'} {myLastDamage ? `>>--${myLastDamage}-dmg--|>` : ''}</p>
        </div>
      </div>

      <div className="letter-pool">
        <h2>Letter Pool</h2>
        <div className="pool-letters">
          {game.pool.map((letter, index) => (
            <span key={index} className="pool-letter">{letter}</span>
          ))}
        </div>
      </div>

      <div className="word-input">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value.toUpperCase())}
          disabled={submitted}
          placeholder="Type your word..."
        />
        <button onClick={handleSubmit} disabled={submitted} className={submitted ? 'submitting' : ''}>
          {submitted ? "Waiting..." : "Submit Word"}
        </button>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
