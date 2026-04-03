export default {
  method: 'POST',
  url: '{{baseUrl}}/games'
};

export function postResponse() {
  pm.test('create game returns 201', function () {
    pm.response.to.have.status(201);
  });
  const body = pm.response.json();
  pm.collectionVariables.set('gameId', body.gameId);
  pm.collectionVariables.set('p1Token', body.playerToken);
  pm.test('create payload includes ids', function () {
    pm.expect(body.gameId).to.be.a('string');
    pm.expect(body.playerToken).to.be.a('string');
  });
}
