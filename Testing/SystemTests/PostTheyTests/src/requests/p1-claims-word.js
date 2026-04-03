export default {
  method: 'POST',
  url: '{{baseUrl}}/games/{{gameId}}/claim',
  headers: {
    'X-Player-Token': '{{p1Token}}',
  }
};

export function postResponse() {
  pm.test('claim returns pending dispute', function () {
    pm.response.to.have.status(200);
    const body = pm.response.json();
    pm.expect(body.status).to.eql('PendingDispute');
    pm.expect(body.pendingWord).to.eql('TES');
  });
}
