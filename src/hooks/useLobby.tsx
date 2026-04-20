import { useState, useEffect, useRef } from "react"
import { joinLobby, getLobby, startGame } from '../api'
import { useParams } from "react-router-dom"

export function useLobby(onStart: () => void) {
    const { code } = useParams<{code: string}>()
    const [playerCount, setPlayerCount] = useState<number | null>(null)
    const [status, setStatus] = useState('waiting')
    const hasJoined = useRef(false)

    const link = `${window.location.origin}/lobby/${code}`

    useEffect(() =>
    {
        if (!hasJoined.current && code) {
            hasJoined.current = true
            joinLobby(code)
        }
    }, [code])

    useEffect(() => {
        const interval = setInterval(async () => {
            if (!code) return
            const lobby = await getLobby(code)
            if (!lobby) return
            setPlayerCount(lobby.playerCount)
            setStatus(lobby.status)
            if (lobby.status === 'playing') {
                onStart()
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [code, onStart])

    const handleStart = () => {
        if (code) startGame(code)
    }

    return {code, link, playerCount, status, handleStart}
}