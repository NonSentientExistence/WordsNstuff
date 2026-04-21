import { getPlayerToken } from './playerToken'

function headers() {
  return { 'X-Player-Token': getPlayerToken() }
}

export async function createLobby(): Promise<string> {
  const res = await fetch('/api/lobbies', { method: 'POST', headers: headers() })
  const data = await res.json()
  return data.code
}

export async function joinLobby(code: string): Promise<boolean> {
  const res = await fetch(`/api/lobbies/${code}/join`, { method: 'POST', headers: headers() })
  if (!res.ok) {
    const error = await res.text()
    console.error('joinLobby failed:', error) // ← visa exakt felmeddelandet
  }
  return res.ok
}

export async function getLobby(code: string) {
  const res = await fetch(`/api/lobbies/${code}`, { headers: headers() })
  if (!res.ok) return null
  return res.json()
}

export async function startGame(code: string): Promise<boolean> {
  const res = await fetch(`/api/lobbies/${code}/start`, { method: 'POST', headers: headers() })
  return res.ok
}

export async function getGame(code: string) {
  const res = await fetch(`/api/games/${code}`, { headers: headers() })
  if (!res.ok) return null
  return res.json()
}

export async function submitWord(code: string, word: string): Promise<boolean> {
  const res = await fetch(`/api/games/${code}/submit`, {
    method: 'POST',
    headers: { ...headers(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ word })
  })
  return res.ok
}