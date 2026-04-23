import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getGame, getLobby, submitWord, skipRound } from '../api'
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
  roundNumber: number
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
  const [timeLeft, setTimeLeft] = useState(30)
  const [opponentName, setOpponentName] = useState('Opponent')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const roundsRef = useRef(0)
  const damageDealtRef = useRef(0)
  const submittedAtRef = useRef<number | null>(null)
  const wordRef = useRef('')
  const namesFetchedRef = useRef(false)
  const token = getPlayerToken()
  const playerName = sessionStorage.getItem('playerName') || 'You'

  useEffect(() => {
    roundsRef.current = 0
    damageDealtRef.current = 0
  }, [])

  useEffect(() => {
    wordRef.current = word
  }, [word])

  const doSubmit = useCallback(async (currentWord: string) => {
    if (!code || !currentWord.trim()) return
    const { success, message: msg, damage } = await submitWord(code, currentWord.trim())
    if (success) {
      setSubmitted(true)
      setMessage('Word submitted! Waiting for opponent...')
      damageDealtRef.current += damage
      setWord('')
      wordRef.current = ''
      submittedAtRef.current = Date.now()
    } else {
      setMessage(msg)
    }
  }, [code])

  // Countdown timer — auto-submits or skips when it hits 0
  useEffect(() => {
    if (submitted) return

    let count = 30

    const timer = setInterval(() => {
      setTimeLeft(count)
      count -= 1
      if (count < 0) {
        clearInterval(timer)
        if (wordRef.current.trim()) {
          doSubmit(wordRef.current)
          setWord('')
        } else {
          skipRound(code!)
          setSubmitted(true)
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [submitted, code, doSubmit])

  // Poll game state every second
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      if (!code) return
      const data = await getGame(code)
      if (!data) return

      // Fetch opponent name once we know which player slot we occupy
      if (!namesFetchedRef.current) {
        namesFetchedRef.current = true
        getLobby(code).then((lobby) => {
          if (!lobby) return
          const isPlayer1 = data.player1Id === token
          const opp = isPlayer1 ? lobby.player2Name : lobby.player1Name
          if (opp) setOpponentName(opp)
        })
      }

      // Reset submitted state and increment round counter when a new round starts
      setGame(prev => {
        if (prev && prev.roundNumber !== data.roundNumber) {
          setSubmitted(false)
          roundsRef.current += 1
          submittedAtRef.current = null
        }
        return data
      })

      // Check if the opponent has timed out (35s since submit)
      if (submittedAtRef.current && Date.now() - submittedAtRef.current > 35000) {
        submittedAtRef.current = null
        setSubmitted(false)
        setMessage('Opponent timed out, submit a new word!')
      }

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
    await doSubmit(word)
  }

  const myHp = game?.player1Id === token ? game?.player1Hp : game?.player2Hp
  const opponentHp = game?.player1Id === token ? game?.player2Hp : game?.player1Hp
  const myLastWord = game?.player1Id === token ? game?.player1LastWord : game?.player2LastWord
  const opponentLastWord = game?.player1Id === token ? game?.player2LastWord : game?.player1LastWord
  const myLastDamage = game?.player1Id === token ? game?.player1LastDamage : game?.player2LastDamage
  const opponentLastDamage = game?.player1Id === token ? game?.player2LastDamage : game?.player1LastDamage

  return { game, word, setWord, submitted, message, timeLeft, myHp, opponentHp, handleSubmit, myLastWord, opponentLastWord, myLastDamage, opponentLastDamage, playerName, opponentName }
}
