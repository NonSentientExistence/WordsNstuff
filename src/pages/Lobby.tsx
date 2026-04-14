import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { joinLobby, getLobby, startGame } from '../api'

export default function Lobby() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [playerCount, setPlayerCount] = useState(0)
  const [status, setStatus] = useState('waiting')
  const hasJoined = useRef(false)

  const link = `${window.location.origin}/lobby/${code}`

  // Join lobby vid första besök
  useEffect(() => {
    if (!hasJoined.current && code) {
      hasJoined.current = true
      joinLobby(code)
    }
  }, [code])

  // Polla lobby-status var 1s
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
      <h1>Lobby: {code}</h1>
      <p>Dela denna länk: <strong>{link}</strong></p>
      <p>Spelare: {playerCount}/2</p>
      {playerCount < 2 && <p>Väntar på motståndare...</p>}
      {playerCount === 2 && status === 'ready' && (
        <button onClick={handleStart}>Starta spel</button>
      )}
    </div>
  )
}
