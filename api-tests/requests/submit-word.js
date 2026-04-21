export default {
  method: 'POST',
  url: '{{baseUrl}}/api/games/{{lobbyCode}}/submit',
  body: { word: 'tan' }
};
export function preRequest() {
  pm.request.headers.add({ key: 'X-Player-Token', value: pm.variables.get('player1Token') });
  pm.request.headers.add({ key: 'Content-Type', value: 'application/json' });
}
export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));
}