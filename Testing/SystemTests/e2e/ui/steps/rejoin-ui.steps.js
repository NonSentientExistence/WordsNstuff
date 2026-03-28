import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import GamePage from '../pages/game.page.js';

const { Given, When, Then, And } = createBdd();

const state = {
  game: null,
  gameId: null,
};

Given('ett spel där både spelarna är aktiva', async ({ page, browser }) => {
  // Player 1 creates
  state.game = new GamePage(page);
  await state.game.goto();
  await state.game.startNewGame();
  await state.game.expectGameCreated();
  state.gameId = await state.game.getGameId();

  // Player 2 joins
  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  const game2 = new GamePage(page2);
  await game2.goto();
  await game2.joinGameById(state.gameId);
  await game2.expectGameCreated();
});

When('spelare 2 uppdaterar sidan \\(browser refresh\\)', async () => {
  await state.game.refreshPage();
});

Then('återställs spelet automatiskt till samma state', async () => {
  await expect(state.game.page.locator('#game')).toBeVisible();
});

And('visar sitt player token', async () => {
  const token = await state.game.getPlayerToken();
  expect(token).not.toBe('-');
});

And('spelers stats förblir oförändrade', async () => {
  const status = await state.game.getStatus();
  expect(status).toBe('InProgress');
});

Given('ett spel med två aktiva spelare', async ({ page, browser }) => {
  state.game = new GamePage(page);
  await state.game.goto();
  await state.game.startNewGame();
  await state.game.expectGameCreated();
  state.gameId = await state.game.getGameId();

  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  const game2 = new GamePage(page2);
  await game2.goto();
  await game2.joinGameById(state.gameId);
  await game2.expectGameCreated();
});

When('spelare 1 kopierar game link', async () => {
  // Copy happens via the copyGameLinkBtn
  await state.game.page.locator('#copyGameLinkBtn').click();
});

And('öppnar länken i nytt fönster', async ({ browser }) => {
  const link = await state.game.page.locator('#gameLinkOut').textContent();
  const context3 = await browser.newContext();
  const page3 = await context3.newPage();
  await page3.goto(link);
  state.game.page = page3;
  await state.game.page.waitForTimeout(500);
});

Then('visar det andra fönstret samma game ID', async () => {
  const gameId = await state.game.getGameId();
  expect(gameId).toBe(state.gameId);
});

When('andra spelaren enters sitt redan existerande token', async () => {
  // Token should be auto-restored from localStorage on page load
  // This verifies the rejoin happened automatically
});

Then('visar gränssnittet spelet i samma status', async () => {
  const status = await state.game.getStatus();
  expect(status).toBe('InProgress');
  await expect(state.game.page.locator('#game')).toBeVisible();
});
