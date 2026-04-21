export default {
  method: 'POST',
  url: '{{baseUrl}}/api/lobbies/{{lobbyCode}}/start'
};

export function preRequest() {
  pm.request.headers.add({ key: 'X-Player-Token', value: pm.variables.get('player1Token') });
}

export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));
}