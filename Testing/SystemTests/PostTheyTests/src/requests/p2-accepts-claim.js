export default {
  method: 'POST',
  url: '{{baseUrl}}/games/{{gameId}}/accept',
  headers: {
    'X-Player-Token': '{{p2Token}}',
  }
};

export function postResponse() {
  pm.test('accept resolves claim and resets word', function () {
    pm.response.to.have.status(200);
    const body = pm.response.json();
    pm.expect(body.status).to.eql('InProgress');
    pm.expect(body.currentWord).to.eql('');
    pm.expect(body.pendingWord).to.eql(null);
    const p2 = body.players.find(function (p) { return p.playerId === pm.collectionVariables.get('p2Token'); });
    pm.expect(p2).to.not.eql(undefined);
    pm.expect(p2.acceptsRemaining).to.eql(4);
  });
}
