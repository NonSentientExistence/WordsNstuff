import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('I press {string}', async ({ page }, text) => {
  await page.getByText(text, { exact: true }).click();
});

Then('I shall see a lobby code', async ({ page }) => {
  await expect(page.locator('h1')).toContainText(/Lobby:/);
});
