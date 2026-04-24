import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

Given('I open the main page', async ({ page }) => {
  await page.goto('/');
});

Given('I open {string} in the browser', async ({ page }, path) => {
  await page.goto(path);
});

Then('I shall see a level {int} heading on the page', async ({ page }, level) => {
  const heading = page.locator(`h${level}`);
  await expect(heading).toBeVisible();
});

Then('I shall see the text {string}', async ({ page }, text) => {
  await expect(page.locator('body')).toContainText(text);
});
