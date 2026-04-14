export default {
  method: 'POST',
  url: '{{baseUrl}}/api/lobbies/{{lobbyCode}}/join'
};

export function preRequest() {
  pm.request.headers.add({ key: 'X-Player-Token', value: 'test-joiner-token' });
}

export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));
}