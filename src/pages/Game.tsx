import { useParams } from 'react-router-dom'

export default function Game() {
  const { code } = useParams<{ code: string }>()
  return (
    <div>
      <h1>Spelet har startat!</h1>
      <p>Lobby: {code}</p>
    </div>
  )
}
