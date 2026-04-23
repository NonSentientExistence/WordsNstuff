import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createLobby } from '../api'
import Header from '../parts/Header'

export default function Home() {
  const navigate = useNavigate()
  const [joinCode, setJoinCode] = useState('')

  const handleCreate = async () => {
    const existingName = sessionStorage.getItem('playerName') ?? undefined
    const code = await createLobby(existingName)
    navigate(`/play/${code}`)
  }

  const handleJoin = () => {
    if (joinCode.trim()) {
      navigate(`/play/${joinCode.trim().toUpperCase()}`)
    }
  }

  return (
    <div>
      <Header title='WordsNstuff' subtitle='Arenan där två spelare möts i ordstrider — bygg starka ord, krossa motståndaren.' />
      <div className="page-wrapper">
        <div className="card">
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
      </div>
    </div>
  )
}
