export default {
  method: 'POST',
  url: '{{baseUrl}}/games/{{gameId}}/validate-word',
  headers: {
    'Content-Type': 'application/json',
  },
  body: {
      "word": "ZZZZZZQ"
  }
};

export function postResponse() {
  pm.test('validate-word rejects invalid word', function () {
    pm.response.to.have.status(200);
    const body = pm.response.json();
    pm.expect(body.word).to.eql('ZZZZZZQ');
    pm.expect(body.valid).to.eql(false);
  });
}
