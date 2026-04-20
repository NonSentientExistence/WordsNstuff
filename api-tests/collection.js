import getHello from './requests/get-hello.js';
import greetName from './requests/greet-name.js';
import createLobby from './requests/create-lobby.js';
import joinLobby from './requests/join-lobby.js';
import startGame from './requests/start-game.js';
import getGame from './requests/get-game.js';
import setPool from './requests/set-pool.js';
import submitWord from './requests/submit-word.js';

export const name = 'FromScratchAPI';

export function preRequest() {
  pm.variables.set('baseUrl', 'http://localhost:5001');
  //Simulates two players with unique tokens
  if (!pm.variables.get('player1Token')) {
    pm.variables.set('player1Token', 'test-player1-' + Date.now());
  }
  if (!pm.variables.get('player2Token')) {
    pm.variables.set('player2Token', 'test-player2-' + Date.now());
  }
}

export const order = [
  getHello,
  greetName,
  createLobby,
  joinLobby,
  startGame,
  getGame,
  setPool,
  submitWord
];