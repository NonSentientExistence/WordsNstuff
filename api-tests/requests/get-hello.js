export default {
  method: 'GET',
  url: '{{baseUrl}}/api/hello'
};

export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));

  const json = pm.response.json();
  pm.test('Response has message field', () =>
    pm.expect(json.message).to.equal('Hello from .NET!')
  );
}