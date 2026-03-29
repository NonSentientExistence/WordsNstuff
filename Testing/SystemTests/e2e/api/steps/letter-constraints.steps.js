import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();
const And = Then;

const state = {
  gameId: null,
  p1: null,
  p2: null,
  word: '',
  lastError: null,
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

Given('ett nytt API-spel med två spelare för bokstavstester', async ({ request, baseURL }) => {
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

When("spelare 1 lägger bokstaven 'a' \\(lowercase\\)", async ({ request, baseURL }) => {
  const res = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'a' }, state.p1);
  expect(res.status()).toBe(200);
  const gameState = await res.json();
  state.word = gameState.currentWord;
  expect(state.word).toBe('A');
});

And("spelare 2 lägger bokstaven 'B' \\(uppercase\\)", async ({ request, baseURL }) => {
  const res = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'B' }, state.p2);
  expect(res.status()).toBe(200);
  const gameState = await res.json();
  state.word = gameState.currentWord;
  expect(state.word).toBe('AB');
});

And("spelare 1 lägger bokstaven 'c' \\(lowercase\\)", async ({ request, baseURL }) => {
  const res = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'c' }, state.p1);
  expect(res.status()).toBe(200);
  const gameState = await res.json();
  state.word = gameState.currentWord;
  expect(state.word).toBe('ABC');
});

Then('ordet är "ABC" \\(alla konverterade till versaler\\)', async () => {
  expect(state.word).toBe('ABC');
});

When("spelare 1 lägger bokstaven 'Å'", async ({ request, baseURL }) => {
  const res = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'Å' }, state.p1);
  expect(res.status()).toBe(200);
  const gameState = await res.json();
  state.word = gameState.currentWord;
});

Then('accepteras bokstaven und ordet blir "Å"', async () => {
  expect(state.word).toBe('Å');
});

When('spelare 1 försöker att lägga en tom bokstav', async ({ request, baseURL }) => {
  const res = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: '' }, state.p1);
  const parsed = await parseResponse(res);
  expect(parsed.status).toBe(400);
  expect((parsed.body?.error ?? '')).toContain('required');
  state.lastError = parsed.body?.error;
});

Then('får spelare 1 status 400 "Letter is required"', async () => {
  expect(state.lastError).toContain('required');
});

When('spelare 1 försöker att lägga "AB"', async ({ request, baseURL }) => {
  const res = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: 'AB' }, state.p1);
  const parsed = await parseResponse(res);
  expect(parsed.status).toBe(400);
  expect((parsed.body?.error ?? '')).toContain('exactly one');
  state.lastError = parsed.body?.error;
});

Then('får spelare 1 status 400 "Letter must be exactly one character"', async () => {
  expect(state.lastError).toContain('exactly one');
});

When("spelare 1 försöker att lägga '1'", async ({ request, baseURL }) => {
  const res = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: '1' }, state.p1);
  const parsed = await parseResponse(res);
  expect(parsed.status).toBe(400);
  expect((parsed.body?.error ?? '')).toContain('A-Z');
  state.lastError = parsed.body?.error;
});

Then('får spelare 1 status 400 "Letter must be A-Z"', async () => {
  expect(state.lastError).toContain('A-Z');
});

When("spelare 1 försöker att lägga '-'", async ({ request, baseURL }) => {
  const res = await postJson(request, `${baseURL}/games/${state.gameId}/letter`, { letter: '-' }, state.p1);
  const parsed = await parseResponse(res);
  expect(parsed.status).toBe(400);
  expect((parsed.body?.error ?? '')).toContain('A-Z');
  state.lastError = parsed.body?.error;
});
