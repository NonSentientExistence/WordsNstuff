export default {
  method: 'POST',
  url: '{{baseUrl}}/games/{{gameId}}/letter',
  headers: {
    'Content-Type': 'application/json',
    'X-Player-Token': '{{p2Token}}',
  },
  body: {
      "letter": "x"
  }
};

export function postResponse() {
  pm.test('out-of-turn letter is rejected with 409', function () {
    pm.response.to.have.status(409);
  });
}
