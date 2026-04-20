export default {
  method: 'POST',
  url: '{{baseUrl}}/api/games/{{lobbyCode}}/submit',
  header: {
    'X-Player-Token': '{{player1Token}}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ word: 'cat' })
};
export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));
}