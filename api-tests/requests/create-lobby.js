export default {
  method: 'POST',
  url: '{{baseUrl}}/api/lobbies',
  header: { 'X-Player-Token': '{{player1Token}}' }
};
export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));
  const json = pm.response.json();
  pm.test('Response has lobby code', () => pm.expect(json.code).to.be.a('string'));
  pm.variables.set('lobbyCode', json.code);
}