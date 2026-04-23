// PlayerHealthIcon visual tests have been moved to Vitest unit tests.
// See: src/test/PlayerHealthIcon.test.tsx
//
// These Playwright steps previously only checked a local JS variable (not the DOM),
// which gave false confidence. The component is now properly tested in isolation
// using React Testing Library in the Vitest suite.

import { createBdd } from 'playwright-bdd'

const { Given, When, Then } = createBdd()

let hp = 100

Given('I have {int} HP', async ({}, value) => {
  hp = value
})

When('I look at my health icon', async ({}) => {
  // Intentionally skipped: requires live game session.
  // Component logic is covered in src/test/PlayerHealthIcon.test.tsx
})

When('I take {int} damage', async ({}, value) => {
  hp = hp - value
})

Then('the icon should be green', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('the face should show a smile', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('no cracks or blood should be visible', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('the icon should be yellow', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('a bandage should be visible on the head', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('a small crack should appear', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('the icon should be red', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('the face should show a sad expression', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('blood splatters should be visible', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('multiple cracks should appear', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('the head should shake slightly', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('the icon should be dark red', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('the icon should be semi-transparent', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('the icon should appear blurred', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('the label should show {string} with strikethrough', async ({}, _value) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('the icon should transition from green to yellow', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('the health label should update to {string}', async ({}, _value) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})

Then('a shake animation should play on the icon', async ({}) => {
  // Covered in Vitest: PlayerHealthIcon.test.tsx
})
