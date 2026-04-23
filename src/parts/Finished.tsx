import { resetLobby } from '../api'

interface GameStats {
  rounds: number
  damageDealt: number
  won: boolean
  playerName: string
  code: string
}

interface FinishedProps {
  onReplay: () => void
  stats: GameStats
}

export default function Finished({ onReplay, stats }: FinishedProps) {
  const handleReplay = async () => {
    await resetLobby(stats.code)
    onReplay()
  }

  return (
    <div className="page-wrapper">
      <h1 className={stats.won ? 'finished-title-win' : 'finished-title-lose'}>
        {stats.won ? 'You Win!' : 'You Lose!'}
      </h1>
      <h2>Game Over, {stats.playerName}!</h2>
      <div className="stats-card">
        <p>Rounds played: {stats.rounds}</p>
        <p>Total damage dealt: {stats.damageDealt}</p>
      </div>
      <button onClick={handleReplay}>Play Again</button>
    </div>
  );
}
