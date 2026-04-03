export default {
  method: 'GET',
  url: '{{baseUrl}}/health'
};

export function postResponse() {
  pm.test('health returns 200', function () {
    pm.response.to.have.status(200);
  });
  const body = pm.response.json();
  pm.test('health payload has status ok', function () {
    pm.expect(body.status).to.eql('ok');
  });
}
