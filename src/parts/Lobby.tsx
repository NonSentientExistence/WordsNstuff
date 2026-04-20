import { useLobby } from '../hooks/useLobby'

interface LobbyProps {
  onStart: () => void
}

export default function Lobby({ onStart }: LobbyProps) {
  const { code, link, playerCount, status, handleStart } = useLobby(onStart)

  return (
    <div>
      <h1>Lobby: {code}</h1>
      <p>Dela denna länk: <strong>{link}</strong></p>
      <p>Spelare: {playerCount}/2</p>
      {playerCount === null && <p>Laddar...</p>}
      {playerCount !== null && playerCount < 2 && <p>Väntar på motståndare...</p>}
      {playerCount === 2 && status === 'ready' && (
        <button onClick={handleStart}>Starta spel</button>
      )}
    </div>
  )
}