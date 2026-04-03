export default {
  method: 'POST',
  url: '{{baseUrl}}/games/{{gameId}}/join',
  headers: {
    'X-Player-Token': '{{p2Token}}',
  }
};

export function postResponse() {
  pm.test('rejoin returns same token', function () {
    pm.response.to.have.status(200);
    const body = pm.response.json();
    pm.expect(body.playerToken).to.eql(pm.collectionVariables.get('p2Token'));
  });
}
