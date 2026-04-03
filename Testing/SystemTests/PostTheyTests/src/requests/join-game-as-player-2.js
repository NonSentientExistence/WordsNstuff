export default {
  method: 'POST',
  url: '{{baseUrl}}/games/{{gameId}}/join'
};

export function postResponse() {
  pm.test('join returns 200', function () {
    pm.response.to.have.status(200);
  });
  const body = pm.response.json();
  pm.collectionVariables.set('p2Token', body.playerToken);
  pm.test('join returns player token', function () {
    pm.expect(body.playerToken).to.be.a('string');
  });
}
