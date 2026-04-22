import { useState, useEffect, useRef } from "react"
import { joinLobby, getLobby, startGame, updateLobbyName } from '../api'
import { useParams } from "react-router-dom"

export function useLobby(onStart: () => void) {
    const { code } = useParams<{code: string}>()
    const [playerCount, setPlayerCount] = useState<number | null>(null)
    const [status, setStatus] = useState('waiting')
    const hasJoined = useRef(false)
    const [playerName, setPlayerName] = useState(sessionStorage.getItem('playerName') || '')
    const [nameInput, setNameInput] = useState('')

    const link = `${window.location.origin}/play/${code}`

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

    useEffect(() =>
    {
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
                onStart()
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [code, onStart])

    const handleStart = () => {
        if (code) startGame(code)
    }

    return {code, link, playerCount, status, handleStart, playerName, nameInput, setNameInput, handleSubmitName}
}