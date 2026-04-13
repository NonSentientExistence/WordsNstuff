import getHello from './requests/get-hello.js';
import greetName from './requests/greet-name.js';

export const name = 'FromScratchAPI';

export function preRequest() {
  pm.variables.set('baseUrl', 'http://localhost:5001');
}

export const order = [
  getHello,
  greetName
];