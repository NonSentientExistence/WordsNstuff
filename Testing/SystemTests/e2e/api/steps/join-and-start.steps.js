import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

const state = {
  gameId: null,
  p1: null,
  p2: null,
  gameState: null,
  joinResponse: null,
};

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

// Join and Game Start Steps
Given('ett nytt spel skapats med spelare 1', async ({ request, baseURL }) => {
  const createRes = await postNoBody(request, `${baseURL}/games`);
  expect(createRes.status()).toBe(201);
  const createData = await createRes.json();
  state.gameId = createData.gameId;
  state.p1 = createData.playerToken;
});

When('spelare 2 joinnar med samma game ID', async ({ request, baseURL }) => {
  const joinRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/join`);
  expect(joinRes.status()).toBe(200);
  const joinData = await joinRes.json();
  state.p2 = joinData.playerToken;
  state.joinResponse = joinData;
});

Then('spelet har status InProgress och två spelare', async ({ request, baseURL }) => {
  const getRes = await request.get(`${baseURL}/games/${state.gameId}`);
  expect(getRes.status()).toBe(200);
  const gameState = await getRes.json();
  expect(gameState.status).toBe('InProgress');
  expect(gameState.players.length).toBe(2);
});

Given('ett spel i status InProgress med två spelare', async ({ request, baseURL }) => {
  const createRes = await postNoBody(request, `${baseURL}/games`);
  state.gameId = (await createRes.json()).gameId;
  state.p1 = (await createRes.json()).playerToken;
  const joinRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/join`);
  state.p2 = (await joinRes.json()).playerToken;
});

When('en tredje spelare försöker att joina', async ({ request, baseURL }) => {
  state.joinResponse = await postNoBody(request, `${baseURL}/games/${state.gameId}/join`);
});

Then('får tredje spelaren status 409 "Game is not joinable"', async () => {
  const parsed = await parseResponse(state.joinResponse);
  expect(parsed.status).toBe(409);
  expect((parsed.body?.error ?? '')).toContain('not joinable');
});

Given('ett nytt spel med två spelare', async ({ request, baseURL }) => {
  const createRes = await postNoBody(request, `${baseURL}/games`);
  expect(createRes.status()).toBe(201);
  state.gameId = (await createRes.json()).gameId;
  state.p1 = (await createRes.json()).playerToken;
  const joinRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/join`);
  state.p2 = (await joinRes.json()).playerToken;
});

When('spelare 2 försöker att joina samma spel igen', async ({ request, baseURL }) => {
  const res = await postNoBody(request, `${baseURL}/games/${state.gameId}/join`, state.p2);
  state.joinResponse = res;
});

Then('returnerar servern samma spelare 2 token', async () => {
  expect(state.joinResponse.status()).toBe(200);
  const data = await state.joinResponse.json();
  expect(data.playerToken).toBe(state.p2);
});

Then('spelet förblir oförändrat (status och spelarantal)', async ({ request, baseURL }) => {
  const getRes = await request.get(`${baseURL}/games/${state.gameId}`);
  const gameState = await getRes.json();
  expect(gameState.status).toBe('InProgress');
  expect(gameState.players.length).toBe(2);
});

// Rejoin Steps
Given('ett spel där spelare 1 och 2 är aktiva', async ({ request, baseURL }) => {
  const createRes = await postNoBody(request, `${baseURL}/games`);
  state.gameId = (await createRes.json()).gameId;
  state.p1 = (await createRes.json()).playerToken;
  const joinRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/join`);
  state.p2 = (await joinRes.json()).playerToken;
});

When('spelare 2 gör en rejoin-förfrågan med sitt token', async ({ request, baseURL }) => {
  const res = await postNoBody(request, `${baseURL}/games/${state.gameId}/join`, state.p2);
  expect(res.status()).toBe(200);
  state.joinResponse = res;
});

Then('får spelare 2 samma token tillbaka', async () => {
  const data = await state.joinResponse.json();
  expect(data.playerToken).toBe(state.p2);
});

Then('spelet förblir i samma status och samma spelar-state', async ({ request, baseURL }) => {
  const getRes = await request.get(`${baseURL}/games/${state.gameId}`);
  const gameState = await getRes.json();
  expect(gameState.status).toBe('InProgress');
  expect(gameState.players.length).toBe(2);
});

Given('ett spel där några bokstäver lagts och pending dispute', async ({ request, baseURL }) => {
  const createRes = await postNoBody(request, `${baseURL}/games`);
  state.gameId = (await createRes.json()).gameId;
  state.p1 = (await createRes.json()).playerToken;
  const joinRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/join`);
  state.p2 = (await joinRes.json()).playerToken;

  // Build CAT
  for (const letter of ['c', 'a', 't']) {
    const token = (letter === 'c' || letter === 't') ? state.p1 : state.p2;
    await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter }, token);
  }

  const claimRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/claim`, state.p1);
  expect(claimRes.status()).toBe(200);
  state.gameState = await claimRes.json();
  expect(state.gameState.status).toBe('PendingDispute');
});

When('spelare 2 rejoinnar', async ({ request, baseURL }) => {
  const res = await postNoBody(request, `${baseURL}/games/${state.gameId}/join`, state.p2);
  expect(res.status()).toBe(200);
});

Then('spelet visar samma ordstat, samma spelare, samma pending claim', async ({ request, baseURL }) => {
  const getRes = await request.get(`${baseURL}/games/${state.gameId}`);
  const restored = await getRes.json();
  expect(restored.status).toBe('PendingDispute');
  expect(restored.currentWord).toBe('CAT');
  expect(restored.pendingWord).toBe('CAT');
  expect(restored.players.length).toBe(2);
});

Given('ett spel med två spelare', async ({ request, baseURL }) => {
  const createRes = await postNoBody(request, `${baseURL}/games`);
  state.gameId = (await createRes.json()).gameId;
  state.p1 = (await createRes.json()).playerToken;
  const joinRes = await postNoBody(request, `${baseURL}/games/${state.gameId}/join`);
  state.p2 = (await joinRes.json()).playerToken;
});

Then('spelet är i status InProgress', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/games/${state.gameId}`);
  const gameState = await res.json();
  expect(gameState.status).toBe('InProgress');
});

Then('spelet har fortfarande exakt 2 spelare (ingen duplicering)', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/games/${state.gameId}`);
  const gameState = await res.json();
  expect(gameState.players.length).toBe(2);
});

And('spelare 2 är samma player ID', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/games/${state.gameId}`);
  const gameState = await res.json();
  expect(gameState.players[1].playerId).toBe(state.p2);
});

Given('ett nytt spel med spelare 1 enbart', async ({ request, baseURL }) => {
  const createRes = await postNoBody(request, `${baseURL}/games`);
  state.gameId = (await createRes.json()).gameId;
  state.p1 = (await createRes.json()).playerToken;
});

When('en helt ny speler försöker rejoin med ett falskt token', async ({ request, baseURL }) => {
  const fakeToken = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
  const res = await postNoBody(request, `${baseURL}/games/${state.gameId}/join`, fakeToken);
  expect(res.status()).toBe(200);
  const joinData = await res.json();
  state.p2 = joinData.playerToken;
});

Then('behandlas detta som ny join (ingen rejoin match)', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/games/${state.gameId}`);
  const gameState = await res.json();
  expect(gameState.players.length).toBe(2);
});

And('spelet startar normalt med två spelare', async ({ request, baseURL }) => {
  const res = await request.get(`${baseURL}/games/${state.gameId}`);
  const gameState = await res.json();
  expect(gameState.status).toBe('InProgress');
});
