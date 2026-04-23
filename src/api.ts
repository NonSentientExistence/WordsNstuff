import { getPlayerToken } from './playerToken'

function headers() {
  return {
    'X-Player-Token': getPlayerToken(),
    'Content-Type': 'application/json',
  }
}

export async function createLobby(name = 'Anonym'): Promise<string> {
  const res = await fetch('/api/lobbies', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ name }),
  })
  const data = await res.json()
  return data.code
}

export async function joinLobby(code: string, name = 'Anonym'): Promise<boolean> {
  const res = await fetch(`/api/lobbies/${code}/join`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ name }),
  })
  if (!res.ok) {
    const error = await res.text()
    console.error('joinLobby failed:', error)
  }
  return res.ok
}

export async function getLobby(code: string) {
  const res = await fetch(`/api/lobbies/${code}`, { headers: headers() })
  if (!res.ok) return null
  return res.json()
}

export async function updateLobbyName(code: string, name: string): Promise<boolean> {
  const res = await fetch(`/api/lobbies/${code}/name`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ name }),
  })
  return res.ok
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

export async function submitWord(code: string, word: string): Promise<{ success: boolean, message: string, damage: number }> {
  const res = await fetch(`/api/games/${code}/submit`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ word })
  })
  const message = res.ok ? '' : await res.text()
  const damage = res.ok ? (await res.json()).damage : 0
  return { success: res.ok, message, damage }
}

export async function skipRound(code: string): Promise<void> {
  await fetch(`/api/games/${code}/skip`, {
    method: 'POST',
    headers: headers()
  })
}

export async function resetLobby(code: string): Promise<boolean> {
  const res = await fetch(`/api/lobbies/${code}/reset`, { 
    method: 'POST', 
    headers: headers() 
  })
  return res.ok
}
