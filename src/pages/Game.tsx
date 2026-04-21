import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getGame, getLobby, submitWord } from '../api'
import { getPlayerToken } from '../playerToken'

interface GameState {
  status: string
  pool: string[]
  player1Hp: number
  player2Hp: number
  player1Id: string
  player2Id: string
  player1Name?: string
  player2Name?: string
}

export default function Game() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [game, setGame] = useState<GameState | null>(null)
  const [lobbyNames, setLobbyNames] = useState<{ player1Name: string | null, player2Name: string | null }>({ player1Name: null, player2Name: null })
  const [word, setWord] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  

  useEffect(() => {
    if (code) getLobby(code).then(lobby => {
      if (lobby) setLobbyNames({ player1Name: lobby.player1Name, player2Name: lobby.player2Name })
    })
  }, [code])

  // Poll game state every second, reset submitted state when a new round starts
 useEffect(() => {
    intervalRef.current = setInterval(async () => {
      if (!code) return
      const data = await getGame(code)
      if (!data) return

      // Reset submitted when HP changes
      setGame(prev => {
        if (prev && (prev.player1Hp !== data.player1Hp || prev.player2Hp !== data.player2Hp)) {
          setSubmitted(false)
        }
        return data
      })

      if (data.status === 'Finished') {
        clearInterval(intervalRef.current!)
        navigate(`/game/${code}/finished`)
      }
    }, 1000)

    return () => clearInterval(intervalRef.current!)
  }, [code, navigate])


  const handleSubmit = async () => {
    if (!code || !word.trim() || submitted) return

    const success = await submitWord(code, word.trim())
    if (success) {
      setSubmitted(true)
      setMessage('Word submitted! Waiting for opponent...')
      setWord('')
    } else {
      setMessage('Invalid word, try again!')
    }
  }

  if (!game) return <p>Loading game...</p>

  const token = getPlayerToken()
  const isPlayer1 = game.player1Id === token
  const myHp = isPlayer1 ? game.player1Hp : game.player2Hp
  const opponentHp = isPlayer1 ? game.player2Hp : game.player1Hp
  const myName = sessionStorage.getItem('playerName') || 'Du'
  const opponentName = isPlayer1 ? (lobbyNames.player2Name || 'Opponent') : (lobbyNames.player1Name || 'Opponent')

  return (
    <div>
      <h1>WordsNstuff</h1>

      {/* HP display */}
      <div>
        <p>Your HP: {myHp} ({myName})</p>
        <p>Opponent HP: {opponentHp} ({opponentName})</p>
      </div>

      {/* Letter pool */}
      <div>
        <h2>Letter Pool</h2>
        <div>
          {game.pool.map((letter, index) => (
            <span key={index} style={{ margin: '4px', padding: '8px', border: '1px solid black' }}>
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
          {submitted ? 'Waiting...' : 'Submit Word'}
        </button>
      </div>

      {message && <p>{message}</p>}
    </div>
  )
}