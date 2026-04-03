export default {
  method: 'POST',
  url: '{{baseUrl}}/games/{{gameId}}/join'
};

export function postResponse() {
  pm.response.to.have.status(409);
}
