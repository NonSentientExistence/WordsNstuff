import { useState } from "react";
import Header from "../parts/Header";
import Lobby from "../parts/Lobby";
import Game from "../parts/Game";
import Finished from "../parts/Finished";

type GameState = 'lobby' | 'game' | 'finished'

export default function Play() {
    const [gameState, setGameState] = useState<GameState>('lobby')

    return (
        <div>
            <Header />
            {gameState === 'lobby' && <Lobby onStart={() => setGameState('game')} />}
            {gameState === 'game' && <Game onEnd={() => setGameState('finished')} />}
            {gameState === 'finished' && <Finished onReplay={() => setGameState('lobby')} />}
        </div>

    )
}