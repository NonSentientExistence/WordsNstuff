import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Play from './pages/Play'
import Lobby from './pages/Lobby'
import Game from './pages/Game'
import Finished from './pages/Finished'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/:code" element={<Play />} />
        <Route path="/lobby/:code" element={<Lobby />} />
        <Route path="/game/:code" element={<Game />} />
        <Route path="/game/:code/finished" element={<Finished />} />
      </Routes>
    </BrowserRouter>
  )
}