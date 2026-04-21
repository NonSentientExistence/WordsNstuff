import { useNavigate } from 'react-router-dom'

export default function Finished() {
  const navigate = useNavigate()

  return (
    <div>
      <h1>Game Over!</h1>
      <p>The game has ended.</p>
      <button onClick={() => navigate('/')}>Play Again</button>
    </div>
  )
}