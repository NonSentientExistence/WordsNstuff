import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Play from './pages/Play'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/:code" element={<Play />} />
      </Routes>
    </BrowserRouter>
  )
}