import { useState } from "react";
import Header from "../parts/Header";
import Lobby from "../parts/Lobby";
import Game from "../parts/Game";
import Finished from "../parts/Finished";

type GameState = 'lobby' | 'game' | 'finished'

interface GameStats {
  rounds: number
  damageDealt: number
  won: boolean
  playerName: string
  code: string
}

export default function Play() {
    const [gameState, setGameState] = useState<GameState>('lobby')
    const [stats, setStats] = useState<GameStats | null>(null)

    return (
        <div>
            <Header />
            {gameState === 'lobby' && <Lobby onStart={() => setGameState('game')} />}
            {gameState === 'game' && (
                <Game onEnd={(s) => {
                    setStats(s)
                    setGameState('finished')
                }} /> 
                )}        
            {gameState === 'finished' && stats && (
            <Finished onReplay={() => setGameState('lobby')} stats={stats} />
            )}
        </div>
    )
}