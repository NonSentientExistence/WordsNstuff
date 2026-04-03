export default {
  method: 'POST',
  url: '{{baseUrl}}/games/{{gameId}}/accept',
  headers: {
    'X-Player-Token': '{{p1Token}}',
  }
};

export function postResponse() {
  pm.response.to.have.status(409);
}
