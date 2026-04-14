export function getPlayerToken(): string {
  let token = sessionStorage.getItem('playerToken')
  if (!token) {
    token = crypto.randomUUID()
    sessionStorage.setItem('playerToken', token)
  }
  return token
}
