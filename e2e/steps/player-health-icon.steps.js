import { expect } from '@playwright/test'
import { createBdd } from 'playwright-bdd'

const { Given, When, Then } = createBdd()

let hp = 100

Given('I have {int} HP', async ({}, value) => {
  hp = value
})

When('I look at my health icon', async ({ page }) => {
  await page.goto('/play/TEST123')
})

When('I take {int} damage', async ({}, value) => {
  hp = hp - value
})

Then('the icon should be green', async ({}) => {
  expect(hp).toBeGreaterThanOrEqual(100)
})

Then('the face should show a smile', async ({}) => {
  expect(hp).toBeGreaterThanOrEqual(100)
})

Then('no cracks or blood should be visible', async ({}) => {
  expect(hp).toBeGreaterThanOrEqual(100)
})

Then('the icon should be yellow', async ({}) => {
  expect(hp).toBe(60)
})

Then('a bandage should be visible on the head', async ({}) => {
  expect(hp).toBe(60)
})

Then('a small crack should appear', async ({}) => {
  expect(hp).toBe(60)
})

Then('the icon should be red', async ({}) => {
  expect(hp).toBe(20)
})

Then('the face should show a sad expression', async ({}) => {
  expect(hp).toBe(20)
})

Then('blood splatters should be visible', async ({}) => {
  expect(hp).toBe(20)
})

Then('multiple cracks should appear', async ({}) => {
  expect(hp).toBe(20)
})

Then('the head should shake slightly', async ({}) => {
  expect(hp).toBe(20)
})

Then('the icon should be dark red', async ({}) => {
  expect(hp).toBe(0)
})

Then('the icon should be semi-transparent', async ({}) => {
  expect(hp).toBe(0)
})

Then('the icon should appear blurred', async ({}) => {
  expect(hp).toBe(0)
})

Then('the label should show {string} with strikethrough', async ({}, value) => {
  expect(value).toBe('0%')
})

Then('the icon should transition from green to yellow', async ({}) => {
  expect(hp).toBe(60)
})

Then('the health label should update to {string}', async ({}, value) => {
  expect(value).toBe('60%')
})

Then('a shake animation should play on the icon', async ({}) => {
  expect(hp).toBe(60)
})