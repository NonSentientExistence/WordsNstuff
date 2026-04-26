# Test Plan — WordsNstuff

## Purpose
This test plan describes how testing is carried out in the project and ensures the system works correctly at all levels. Testing is a natural part of the development process and happens continuously alongside implementation following TDD and BDD principles.

---

## Test Levels

### Unit Testing (xUnit) — 80 tests
Tests individual classes and methods in isolation. Written before implementation following TDD.

| Test File | Count | What is tested |
|---|---|---|
| `WordValueTests` | 4 | Damage calculation per letter, uppercase, empty strings |
| `LetterPoolTests` | 4 | Pool size, valid letters, vowels, randomness |
| `PlayerTests` | 6 | Starts with full HP, TakeDamage, clamp to 0, IsDefeated |
| `GameStateTests` | 5 | Starting status, players assigned, pool generated, no words submitted |
| `GameEngineTests` | 28 | SubmitWord, SkipWord, ResolveRound, pool validation, round number, last word/damage |
| `WordValidatorTests` | 5 | Valid/invalid words, empty string, single letter words, uppercase |
| `GameServiceTests` | 8 | StartGame, GetGame, SubmitWord, SkipWord, handling non-existent games |
| `GreeterTest` | 6 | Greeting function with different names, error handling for empty name |
| `LobbyServiceTest` | 14 | Create/join/start/reset lobby, player names, tokens |

**GameEngineTests covers among other things:**
- Submission and storage of words per player
- Round resolution when both players have submitted
- Damage calculation and HP reduction
- Storage of last word and damage per round
- Validation against word list and letter pool
- Skip functionality — no damage, round still resolves
- Round counter increments every round
- Game status set to Finished when a player is defeated

---

### API Testing (Newman/Postman) — 9 requests, 17 assertions
Tests HTTP endpoints end-to-end against a running backend. Verifies that the parts of the system work together.

| Request | What is tested |
|---|---|
| GET /api/hello | Returns 200 with correct message |
| GET /api/greet/{name} | Returns greeting with correct name |
| POST /api/lobbies | Creates lobby, returns 6-character code |
| POST /api/lobbies/{code}/join | Player can join lobby |
| POST /api/lobbies/{code}/start | Game starts when two players are ready |
| GET /api/games/{code} | Returns game status, pool, HP and round info |
| POST /api/games/{code}/set-pool-test | Sets known pool for testing purposes |
| POST /api/games/{code}/submit (valid word) | Accepts word, returns damage as number |
| POST /api/games/{code}/submit (invalid word) | Returns 400 Bad Request |

---

### E2E and BDD Testing (Playwright + Gherkin) — 3 tests
Tests user flows in the browser with BDD scenarios written in Gherkin. Focuses on the user's perspective.

| Feature File | Scenario |
|---|---|
| `smoke.feature` | Home page opens and shows a heading |
| `smoke.feature` | API responds via proxy with correct message |
| `lobby.feature` | Create a lobby — button shown and lobby code returned |

---

### Component Testing (Vitest) — 41 tests
Tests React components and hooks in isolation with mocked API calls.

| Test File | Count | What is tested |
|---|---|---|
| `App.test.tsx` | 2 | Routing works correctly |
| `Home.test.tsx` | 5 | Create lobby button, code input, navigation, API call, empty code ignored |
| `Lobby.test.tsx` | 9 | Lobby code shown, waiting message, name popup, confirm name, start button, error handling on API failure |
| `Game.test.tsx` | 6 | Game renders, last word labels shown, timer displayed, skip on timeout, submit shows Waiting, error message on invalid word |
| `Finished.test.tsx` | 5 | You Win/Lose displayed correctly, player name, rounds played, total damage, Play Again triggers callback |
| `PlayerHealthIcon.test.tsx` | 14 | Status at different HP levels (healthy/damaged/critical/defeated), bandage, blood, cracks, segments, percentage label |

---

## Mutation Testing (Stryker)
Runs automatically in the CI pipeline to measure test quality. Stryker mutates production code and verifies that tests catch the changes. Results are published as artifacts in GitHub Actions.

---

## CI/CD Pipeline (GitHub Actions)
All tests run automatically on push and pull request to `dev` and `main` in the following order:

1. **Lint** — ESLint checks code quality
2. **Build** — Application is built
3. **xUnit** — Backend unit tests run
4. **Vitest** — Frontend component tests run
5. **E2E + API** — Playwright and Newman run against a live backend and frontend
6. **Stryker** — Mutation testing runs and report is published

---

## Test Environment

| Part | Technology |
|---|---|
| Backend | .NET 10, ASP.NET Core, SQLite |
| Frontend | React, TypeScript, Vite |
| Backend unit testing | xUnit |
| Frontend component testing | Vitest, React Testing Library |
| E2E and BDD | Playwright, playwright-bdd, Gherkin |
| API testing | Newman (Postman CLI), post-they |
| Mutation testing | Stryker.NET |
| CI/CD | GitHub Actions |

---

## Current Test Results
- 80/80 xUnit backend tests 
- 17/17 API assertions 
- 3/3 E2E tests 
- 41/41 Vitest frontend tests 

**Total: 141 tests passing**
