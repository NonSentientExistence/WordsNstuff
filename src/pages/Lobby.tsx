import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { joinLobby, getLobby, startGame, updateLobbyName } from '../api'

export default function Lobby() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [playerCount, setPlayerCount] = useState(0)
  const [status, setStatus] = useState('waiting')
  const hasJoined = useRef(false)

  const [playerName, setPlayerName] = useState(sessionStorage.getItem('playerName') || '')
  const [nameInput, setNameInput] = useState('')

  const link = `${window.location.origin}/lobby/${code}`

  const handleSubmitName = () => {
    const name = nameInput.trim()
    if (!name) return
    sessionStorage.setItem('playerName', name)
    setPlayerName(name)
    if (code) {
      if (!hasJoined.current) {
        hasJoined.current = true
        joinLobby(code, name).then(joined => {
          if (!joined) updateLobbyName(code, name)
        })
      } else {
        updateLobbyName(code, name)
      }
    }
  }

  useEffect(() => {
    if (!hasJoined.current && code && playerName) {
      hasJoined.current = true
      joinLobby(code, playerName).then(joined => {
        if (!joined) updateLobbyName(code, playerName)
      })
    }
  }, [code, playerName])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!code) return
      const lobby = await getLobby(code)
      if (!lobby) return
      setPlayerCount(lobby.playerCount)
      setStatus(lobby.status)
      if (lobby.status === 'playing') {
        navigate(`/game/${code}`)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [code, navigate])

  const handleStart = () => {
    if (code) startGame(code)
  }

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
      {playerCount < 2 && <p>Väntar på motståndare...</p>}
      {playerCount === 2 && status === 'ready' && playerName && (
        <button onClick={handleStart}>Starta spel</button>
      )}
    </div>
  )
}
