export default {
  method: 'GET',
  url: '{{baseUrl}}/games/{{gameId}}'
};

export function postResponse() {
  pm.test('state fetch returns 200', function () {
    pm.response.to.have.status(200);
  });
  const body = pm.response.json();
  pm.test('state is in progress with 2 players', function () {
    pm.expect(body.status).to.eql('InProgress');
    pm.expect(body.players.length).to.eql(2);
  });
}
