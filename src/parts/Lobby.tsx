import { useLobby } from '../hooks/useLobby'

interface LobbyProps {
  onStart: () => void
}

export default function Lobby({ onStart }: LobbyProps) {
  const { code, link, playerCount, status, handleStart, playerName, nameInput, setNameInput, handleSubmitName } = useLobby(onStart)

  return (
    <div>
      {!playerName && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>Vad heter du?</h2>
            <input
              type="text"
              placeholder="Skriv in ditt namn"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmitName()}
              autoFocus
            />
            <button onClick={handleSubmitName}>Bekräfta</button>
          </div>
        </div>
      )}
      <h1>Lobby: {code}</h1>
      <p>Dela denna länk: <strong>{link}</strong></p>
      <p>Spelare: {playerCount}/2</p>
      {playerCount === null && <p>Laddar...</p>}
      {playerCount !== null && playerCount < 2 && <p>Väntar på motståndare...</p>}
      {playerCount === 2 && status === 'ready' && playerName && (
        <button onClick={handleStart}>Starta spel</button>
      )}
    </div>
  )
}