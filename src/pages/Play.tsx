import { useState } from "react";
import Header from "../parts/Header";
import Lobby from "../parts/Lobby";
import Game from "../parts/Game";

type GameState = 'lobby' | 'game'

export default function Play() {
    const [gameState, setGameState] = useState<GameState>('lobby')

    return (
        <div>
            <Header />
            {gameState === 'lobby' && <Lobby onStart={() => setGameState('game')} />}
            {gameState === 'game' && <Game onEnd={() => setGameState('lobby')} />}    
        </div>

    )
}