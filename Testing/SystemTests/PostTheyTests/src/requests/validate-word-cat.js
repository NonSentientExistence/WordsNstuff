export default {
  method: 'POST',
  url: '{{baseUrl}}/games/{{gameId}}/validate-word',
  headers: {
    'Content-Type': 'application/json',
  },
  body: {
      "word": "CAT"
  }
};

export function postResponse() {
  pm.test('validate-word accepts CAT as valid', function () {
    pm.response.to.have.status(200);
    const body = pm.response.json();
    pm.expect(body.word).to.eql('CAT');
    pm.expect(body.valid).to.eql(true);
  });
}
