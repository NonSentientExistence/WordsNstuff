import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import GamePage from '../pages/game.page.js';

const { Given, Then } = createBdd();

const state = {
  gameP1: null,
  gameP2: null,
  gameId: null,
}

Given('ett nytt spel där spelare 1 har lagt senaste bokstaven', async ({ page, browser }) => {
  state.gameP1 = new GamePage(page);
  await state.gameP1.goto();
  await state.gameP1.startNewGame('Player 1');
  await state.gameP1.expectGameCreated();
  state.gameId = await state.gameP1.getGameId();

  const context2 = await browser.newContext();
  const page2 = await context2.newPage();
  state.gameP2 = new GamePage(page2);
  await state.gameP2.goto();
  await state.gameP2.joinGameById(state.gameId, 'Player 2');

  await state.gameP1.waitForStatus('InProgress');
  await state.gameP2.waitForStatus('InProgress');
  await state.gameP1.playLetter('t');
});

Then('spelare 2 ser claim-knappen som inte tillgänglig', async () => {
  await expect(state.gameP2.page.getByTestId('claim-btn')).toHaveCount(0);
});

Then('spelare 1 ser claim-knappen som inte tillgänglig under minimiordlängd', async () => {
  await expect(state.gameP1.page.getByTestId('claim-btn')).toHaveCount(0);
});