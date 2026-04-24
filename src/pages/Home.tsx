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
      <Header title='WordsNstuff' subtitle='The arena where two players meet in word battles — build strong words, crush your opponent.' />
      <div className="page-wrapper">
        <div className="card">
          <h2>Create a new lobby</h2>
          <button onClick={handleCreate}>Create Lobby</button>
          <h2>Join existing lobby</h2>
          <input
            type="text"
            placeholder="Enter lobby code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
          <button onClick={handleJoin}>Join</button>
        </div>
      </div>
    </div>
  )
}
