import { useParams } from 'react-router-dom'

interface GameProps {
  onEnd: () => void
}

export default function Game({onEnd}: GameProps) {
  const { code } = useParams<{ code: string }>()
  return (
    <div>
      <h1>Spelet har startat!</h1>
      <p>Lobby: {code}</p>
      <button onClick={onEnd}>Avsluta spel</button> //Placeholder until corrected
    </div>
  )
}
