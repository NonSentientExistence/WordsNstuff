export default {
  method: 'POST',
  url: '{{baseUrl}}/api/lobbies/{{lobbyCode}}/start',
  header: { 'X-Player-Token': '{{player1Token}}' }
};
export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));
}