import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('jag klickar på {string}', async ({ page }, text) => {
  await page.getByText(text, { exact: true }).click();
});

Then('ska jag se en lobbykod på sidan', async ({ page }) => {
  await expect(page.locator('h1')).toContainText(/Lobby:/);
});
