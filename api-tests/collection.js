import getHello from './requests/get-hello.js';
import greetName from './requests/greet-name.js';
import createLobby from './requests/create-lobby.js';
import joinLobby from './requests/join-lobby.js';
import startGame from './requests/start-game.js';

export const name = 'FromScratchAPI';

export function preRequest() {
  pm.variables.set('baseUrl', 'http://localhost:5001');
}

export const order = [
  getHello,
  greetName,
  createLobby,
  joinLobby,
  startGame
];