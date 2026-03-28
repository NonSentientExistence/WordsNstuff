import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then, And } = createBdd();

const state = {
  gameId: null,
  p1: null,
  p2: null,
  currentWord: '',
  claimResponse: null,
  actionResponse: null,
  allScores: { p1: [], p2: [] },
};

async function postJson(request, url, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['X-Player-Token'] = token;
  return request.post(url, { data: body, headers });
}

async function postNoBody(request, url, token) {
  const headers = {};
  if (token) headers['X-Player-Token'] = token;
  return request.post(url, { headers });
}

async function buildWord(request, baseURL, gameId, p1, p2, letters) {
  const turnOrder = [p1, p2, p1, p2, p1, p2, p1, p2];
  for (let i = 0; i < letters.length; i++) {
    const res = await postJson(
      request,
      `${baseUrl}/games/${gameId}/letter`,
      { letter: letters[i] },
      turnOrder[i]
    );
    expect(res.status()).toBe(200);
  }
}

async function parseResponse(res) {
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { raw: text };
  }
  return { status: res.status(), body };
}

Given('ett nytt API-spel med två spelare', async ({ request, baseURL }) => {
  const createRes = await postNoBody(request, `${baseURL}/games`);
  expect(createRes.status()).toBe(201);
  const createData = await createRes.json();
  state.gameId = createData.gameId;
  state.p1 = createData.playerToken;

  const joinRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/join`);
  expect(joinRes.status()).toBe(200);
  const joinData = await joinRes.json();
  state.p2 = joinData.playerToken;
});

When('spelare 1 lägger H E L \\(3 bokstäver\\) och claimar', async ({ request, baseURL }) => {
  // P1 plays H, P2 plays E, P1 plays L
  const playH = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'h' }, state.p1);
  expect(playH.status()).toBe(200);

  const playE = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'e' }, state.p2);
  expect(playE.status()).toBe(200);

  const playL = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'l' }, state.p1);
  expect(playL.status()).toBe(200);

  const claimRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/claim`, state.p1);
  expect(claimRes.status()).toBe(200);
  state.claimResponse = await claimRes.json();
  expect(state.claimResponse.status).toBe('PendingDispute');
  expect(state.claimResponse.pendingWord).toBe('HEL');
});

When('spelare 2 accepterar', async ({ request, baseURL }) => {
  const acceptRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/accept`, state.p2);
  expect(acceptRes.status()).toBe(200);
  state.actionResponse = await acceptRes.json();
});

Then('spelare 1 får poäng 9 \\(3² = 9\\)', async () => {
  expect(state.actionResponse.player1Score).toBe(9);
});

And('ordet återställs till tomt', async () => {
  expect(state.actionResponse.currentWord).toBe('');
});

And('nästa spelers tur är spelare 1 \\(opponent of claimer\\)', async () => {
  expect(state.actionResponse.activePlayerId).toBe(state.p1);
});

When('spelare 1 lägger C A T och claimar', async ({ request, baseURL }) => {
  const playC = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'c' }, state.p1);
  expect(playC.status()).toBe(200);

  const playA = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'a' }, state.p2);
  expect(playA.status()).toBe(200);

  const playT = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 't' }, state.p1);
  expect(playT.status()).toBe(200);

  const claimRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/claim`, state.p1);
  expect(claimRes.status()).toBe(200);
  state.claimResponse = await claimRes.json();
});

Then('spelare 2 har 4 accepts kvar \\(5 - 1\\)', async () => {
  expect(state.actionResponse.player2Accepts).toBe(4);
});

And('spelare 1 har fortfarande 5 accepts \\(ej påverkad\\)', async () => {
  expect(state.actionResponse.player1Accepts).toBe(5);
});

When('spelare 1 lägger C A T \\(2 letters placed by p1\\) och claimar', async ({ request, baseURL }) => {
  const playC = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'c' }, state.p1);
  expect(playC.status()).toBe(200);

  const playA = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'a' }, state.p2);
  expect(playA.status()).toBe(200);

  const playT = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 't' }, state.p1);
  expect(playT.status()).toBe(200);

  const claimRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/claim`, state.p1);
  expect(claimRes.status()).toBe(200);
  state.claimResponse = await claimRes.json();
});

When('spelare 2 bestrider \\(ord är giltigt\\)', async ({ request, baseURL }) => {
  const disputeRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/dispute`, state.p2);
  expect(disputeRes.status()).toBe(200);
  state.actionResponse = await disputeRes.json();
});

Then('spelare 1 får poäng 6 \\(2² × 1.5 = 6\\)', async () => {
  expect(state.actionResponse.player1Score).toBe(6);
});

And('spelare 2 får poäng 0', async () => {
  expect(state.actionResponse.player2Score).toBe(0);
});

And('spelare 2 har 4 disputes kvar \\(5 - 1\\)', async () => {
  expect(state.actionResponse.player2Disputes).toBe(4);
});

When('spelare 1 lägger T E S \\(2 letters placed by p1\\) och claimar', async ({ request, baseURL }) => {
  const playT = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 't' }, state.p1);
  expect(playT.status()).toBe(200);

  const playE = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'e' }, state.p2);
  expect(playE.status()).toBe(200);

  const playS = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 's' }, state.p1);
  expect(playS.status()).toBe(200);

  const claimRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/claim`, state.p1);
  expect(claimRes.status()).toBe(200);
  state.claimResponse = await claimRes.json();
});

When('spelare 2 bestrider \\(ord är ogiltigt\\)', async ({ request, baseURL }) => {
  const disputeRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/dispute`, state.p2);
  expect(disputeRes.status()).toBe(200);
  state.actionResponse = await disputeRes.json();
});

Then('spelare 1 får poäng 0', async () => {
  expect(state.actionResponse.player1Score).toBe(0);
});

And('spelare 2 får poäng 2 \\(2² × 0.5 = 2\\)', async () => {
  expect(state.actionResponse.player2Score).toBe(2);
});

Then('nästa aktiv spelare är spelare 1 \\(motsats av claimer\\)', async () => {
  expect(state.actionResponse.activePlayerId).toBe(state.p1);
});

When('spelare 1 bygger C A T igen och claimar', async ({ request, baseURL }) => {
  const playC = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'c' }, state.p1);
  expect(playC.status()).toBe(200);

  const playA = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'a' }, state.p2);
  expect(playA.status()).toBe(200);

  const playT = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 't' }, state.p1);
  expect(playT.status()).toBe(200);

  const claimRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/claim`, state.p1);
  expect(claimRes.status()).toBe(200);
  state.claimResponse = await claimRes.json();
});

Then('spelare 1 får 4 poäng \\(2²\\)', async () => {
  expect(state.actionResponse.player1Score).toBe(4);
});

When('spelare 2 bygger D O G \\(2 letters\\) och claimar', async ({ request, baseURL }) => {
  const playD = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'd' }, state.p2);
  expect(playD.status()).toBe(200);

  const playO = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'o' }, state.p1);
  expect(playO.status()).toBe(200);

  const playG = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'g' }, state.p2);
  expect(playG.status()).toBe(200);

  const claimRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/claim`, state.p2);
  expect(claimRes.status()).toBe(200);
  state.claimResponse = await claimRes.json();
});

And('spelare 1 bestrider och ord är giltigt', async ({ request, baseURL }) => {
  const disputeRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/dispute`, state.p1);
  expect(disputeRes.status()).toBe(200);
  state.actionResponse = await disputeRes.json();
});

Then('spelare 2 får 6 poäng \\(2² × 1.5\\)', async () => {
  expect(state.actionResponse.player2Score).toBe(6);
});

When('spelare 1 bygger T E S \\(2 letters\\) och claimar', async ({ request, baseURL }) => {
  const playT = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 't' }, state.p1);
  expect(playT.status()).toBe(200);

  const playE = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'e' }, state.p2);
  expect(playE.status()).toBe(200);

  const playS = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 's' }, state.p1);
  expect(playS.status()).toBe(200);

  const claimRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/claim`, state.p1);
  expect(claimRes.status()).toBe(200);
  state.claimResponse = await claimRes.json();
});

And('spelare 2 bestrider och ord är ogiltigt', async ({ request, baseURL }) => {
  const disputeRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/dispute`, state.p2);
  expect(disputeRes.status()).toBe(200);
  state.actionResponse = await disputeRes.json();
});

Then('spelare 1 får 0, spelare 2 får 2 poäng totalt \\(2 \\+ 6 = 8\\)', async () => {
  expect(state.actionResponse.player1Score).toBe(0);
  expect(state.actionResponse.player2Score).toBe(8);
});
