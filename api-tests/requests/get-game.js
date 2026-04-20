export default {
  method: 'GET',
  url: '{{baseUrl}}/api/games/{{lobbyCode}}'
};
export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));
  const json = pm.response.json();
  pm.test('Game has status', () => pm.expect(json.status).to.equal('InProgress'));
  pm.test('Game has letter pool', () => pm.expect(json.pool).to.be.an('array'));
  pm.test('Game has players', () => {
    pm.expect(json.player1Hp).to.be.a('number');
    pm.expect(json.player2Hp).to.be.a('number');
  });
}