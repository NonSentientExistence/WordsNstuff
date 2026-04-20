export default {
  method: 'POST',
  url: '{{baseUrl}}/api/lobbies/{{lobbyCode}}/join',
  header: { 'X-Player-Token': '{{player2Token}}' }
};
export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));
}