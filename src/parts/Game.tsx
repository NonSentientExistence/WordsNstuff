import { useGame, type GameStats } from "../hooks/useGame"

interface GameProps {
  onEnd: (stats: GameStats) => void
}

export default function Game({ onEnd }: GameProps) {
  const { game, word, setWord, submitted, message, myHp, opponentHp, handleSubmit, myLastWord, opponentLastWord, myLastDamage , opponentLastDamage } = useGame(onEnd)
  
  return (
    <div>

      <h1>WordsNstuff</h1>

      {!game ? (
        <p>Loading game...</p>
      ) : (
        <>
          <div>
            -------------------------------------
            <p>Your HP: {myHp}</p>
            <p>Your word: {myLastWord ?? '—'} {opponentLastDamage ? `>>-${opponentLastDamage}-dmg--|>` : ''}</p>
            -------------------------------------
            <p>Opponent HP: {opponentHp}</p>
            <p>Opponents word: {opponentLastWord ?? '—'} {myLastDamage ? `>>--${myLastDamage}-dmg--|>` : ''}</p>
          </div>
          -------------------------------------
          <div>
            <h2>Letter Pool</h2>
            --------------
            <div>
              {game.pool.map((letter, index) => (
                <span key={index} style={{ margin: '4px', padding: '8px', border: '1px solid black' }}>
                  {letter}
                </span>
              ))}
            </div>
          </div>
-------------------------------------
-------------------------------------
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
          {submitted ? 'Waiting...' : 'Submit Word'}
        </button>
      </div>

      {message && <p>{message}</p>}
      </>
      )}
    </div>
  )
}