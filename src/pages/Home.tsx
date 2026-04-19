import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createLobby } from '../api'
import Header from '../parts/Header'

export default function Home() {
  const navigate = useNavigate()
  const [joinCode, setJoinCode] = useState('')

  const handleCreate = async () => {
    const code = await createLobby()
    navigate(`/lobby/${code}`)
  }

  const handleJoin = () => {
    if (joinCode.trim()) {
      navigate(`/lobby/${joinCode.trim().toUpperCase()}`)
    }
  }

  return (
    <div>
      <Header />
      <button onClick={handleCreate}>Skapa lobby</button>
      <h2>Eller gå med i en lobby</h2>
      <input
        type="text"
        placeholder="Skriv in lobbykod"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
      />
      <button onClick={handleJoin}>Gå med</button>
    </div>
  )
}
