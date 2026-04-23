export default {
  method: 'POST',
  url: '{{baseUrl}}/api/games/{{lobbyCode}}/submit',
  body: { word: 'XXXXXX' }
};

export function preRequest() {
  pm.request.headers.add({ key: 'X-Player-Token', value: pm.variables.get('player2Token') });
  pm.request.headers.add({ key: 'Content-Type', value: 'application/json' });
}

export function postResponse() {
  pm.test('Ogiltigt ord ger 400', () => pm.response.to.have.status(400));
}
