export default {
  method: 'GET',
  url: '{{baseUrl}}/api/greet/Anna'
};

export function postResponse() {
  pm.test('Status code is 200', () => pm.response.to.have.status(200));

  const json = pm.response.json();
  pm.test('Greeting contains name', () =>
    pm.expect(json.message).to.equal('Hello, Anna!')
  );
}