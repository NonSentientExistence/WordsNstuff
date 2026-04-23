import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getGame, submitWord } from '../api'
import { getPlayerToken } from '../playerToken'

interface GameState {
  status: string
  pool: string[]
  player1Hp: number
  player2Hp: number
  player1Id: string
  player2Id: string
  player1LastWord: string | null
  player2LastWord: string | null
  player1LastDamage: number
  player2LastDamage: number
}

export interface GameStats {
  rounds: number
  damageDealt: number
  won: boolean
  playerName: string
  code: string
}

export function useGame(onEnd: (stats: GameStats) => void) {
    const { code } = useParams<{ code: string }>()
    const [game, setGame] = useState<GameState | null>(null)
    const [word, setWord] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [message, setMessage] = useState('')
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const roundsRef = useRef(0)
    const damageDealtRef = useRef(0)
    const token = getPlayerToken()
    const playerName = sessionStorage.getItem('playerName') || 'You'
    

  // Reset stats on mount to handle Play Again correctly
  useEffect(() => {
    roundsRef.current = 0
    damageDealtRef.current = 0
  }, [])

  // Poll game state every second
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      if (!code) return
      const data = await getGame(code)
      if (!data) return

      // Reset submitted state when HP changes and increase round count
      setGame(prev => {
        if (prev && (prev.player1Hp !== data.player1Hp || prev.player2Hp !== data.player2Hp)) {
          setSubmitted(false)
          roundsRef.current += 1
        }
        return data
      })

      // Game is over, pass final stats
      if (data.status === 'Finished') {
        clearInterval(intervalRef.current!)
        const myHp = data.player1Id === token ? data.player1Hp : data.player2Hp
        onEnd({
          rounds: roundsRef.current,
          damageDealt: damageDealtRef.current,
          won: myHp > 0,
          playerName,
          code: code!
        })
      }
    }, 1000)
    return () => clearInterval(intervalRef.current!)
  }, [code, onEnd])


  const handleSubmit = async () => {
    if (!code || !word.trim() || submitted) return
    const { success, message:msg, damage } = await submitWord(code, word.trim())
    if (success) {
      setSubmitted(true)
      setMessage('Word submitted! Nice one!')
      damageDealtRef.current += damage
      setWord('')
      setTimeout(() => setMessage(''), 3000)
    } else {
      setMessage(msg)  // Returned reason from backend
    }
  }


  const myHp = game?.player1Id === token ? game?.player1Hp : game?.player2Hp
  const opponentHp = game?.player1Id === token ? game?.player2Hp : game?.player1Hp

  const myLastWord = game?.player1Id === token ? game?.player1LastWord : game?.player2LastWord
  const opponentLastWord = game?.player1Id === token ? game?.player2LastWord : game?.player1LastWord
  const myLastDamage = game?.player1Id === token ? game?.player1LastDamage : game?.player2LastDamage
  const opponentLastDamage = game?.player1Id === token ? game?.player2LastDamage : game?.player1LastDamage

  return {game, word, setWord, submitted, message, myHp, opponentHp, handleSubmit, myLastWord, opponentLastWord, myLastDamage , opponentLastDamage }
}