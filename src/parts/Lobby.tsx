import { useLobby } from '../hooks/useLobby'

interface LobbyProps {
  onStart: () => void
}

export default function Lobby({ onStart }: LobbyProps) {
  const { code, link, playerCount, status, handleStart, playerName, nameInput, setNameInput, handleSubmitName } = useLobby(onStart)

  return (
    <div className="page-wrapper">
      {!playerName && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>What's your name?</h2>
            <input
              type="text"
              placeholder="Enter your name"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmitName()}
              autoFocus
            />
            <button onClick={handleSubmitName}>Confirm</button>
          </div>
        </div>
      )}
      <div className="card">
        <h1>Lobby: <span className="lobby-code">{code}</span></h1>
        <div className="lobby-info">
          <p>Share this link: <strong>{link}</strong></p>
          <p>Players: {playerCount}/2</p>
          {playerCount === null && <p>Loading...</p>}
          {playerCount !== null && playerCount < 2 && <p>Waiting for opponent...</p>}
        </div>
        {playerCount === 2 && status === 'ready' && playerName && (
          <button onClick={handleStart}>Start Game</button>
        )}
      </div>
    </div>
  )
}