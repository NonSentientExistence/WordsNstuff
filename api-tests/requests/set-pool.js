export default {
  method: 'POST',
  url: '{{baseUrl}}/api/games/{{lobbyCode}}/set-pool-test'
};
export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));
}