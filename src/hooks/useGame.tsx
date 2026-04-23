import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { getGame, submitWord, skipRound } from '../api'
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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const roundsRef = useRef(0)
  const damageDealtRef = useRef(0)
  const submittedAtRef = useRef<number | null>(null)
  const wordRef = useRef('')

  // Reset stats on mount to handle Play Again correctly
  useEffect(() => {
    roundsRef.current = 0
    damageDealtRef.current = 0
  }, [])

  // Keep wordRef in sync with word state
  useEffect(() => {
    wordRef.current = word
  }, [word])

  // Bypass submitted check so timer can always submit if a word is typed
  const doSubmit = async (currentWord: string) => {
    if (!code || !currentWord.trim()) return
    const { success, message: msg, damage } = await submitWord(code, currentWord.trim())
    if (success) {
      setSubmitted(true)
      setMessage('Word submitted! Waiting for opponent...')
      damageDealtRef.current += damage
      setWord('')
      wordRef.current = '' // ← clear ref too
      submittedAtRef.current = Date.now()
    } else {
      setMessage(msg)
    }
  }

  // Countdown timer, resets each round and auto submits or skips if runs out
  useEffect(() => {
    setTimeLeft(30)
    if (submitted) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const submitTimeout = setTimeout(() => {
      if (wordRef.current.trim()) {
        doSubmit(wordRef.current)
        setWord('')
      } else {
        skipRound(code!)
        setSubmitted(true)
      }
    }, 30000)

    return () => {
      clearInterval(timer)
      clearTimeout(submitTimeout)
    }
  }, [submitted])

  // Poll game state every second
  useEffect(() => {
    const token = getPlayerToken()
    const playerName = sessionStorage.getItem('playerName') || 'You'
    intervalRef.current = setInterval(async () => {
      if (!code) return
      const data = await getGame(code)
      if (!data) return
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

    return () => {
      clearInterval(intervalRef.current!)
    }
  }, [code, onEnd])

  // Calls doSubmit
  const handleSubmit = async () => {
    if (!code || !word.trim() || submitted) return
    await doSubmit(word)
  }

  const token = getPlayerToken()
  const myHp = game?.player1Id === token ? game?.player1Hp : game?.player2Hp
  const opponentHp = game?.player1Id === token ? game?.player2Hp : game?.player1Hp
  const myLastWord = game?.player1Id === token ? game?.player1LastWord : game?.player2LastWord
  const opponentLastWord = game?.player1Id === token ? game?.player2LastWord : game?.player1LastWord
  const myLastDamage = game?.player1Id === token ? game?.player1LastDamage : game?.player2LastDamage
  const opponentLastDamage = game?.player1Id === token ? game?.player2LastDamage : game?.player1LastDamage

  return { game, word, setWord, submitted, message, myHp, opponentHp, handleSubmit, timeLeft, myLastWord, opponentLastWord, myLastDamage, opponentLastDamage }
}