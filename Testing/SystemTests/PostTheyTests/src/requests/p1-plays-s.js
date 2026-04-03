export default {
  method: 'POST',
  url: '{{baseUrl}}/games/{{gameId}}/letter',
  headers: {
    'Content-Type': 'application/json',
    'X-Player-Token': '{{p1Token}}',
  },
  body: {
      "letter": "s"
  }
};

export function postResponse() {
  pm.response.to.have.status(200);
}
