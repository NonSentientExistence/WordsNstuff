# CI/CD Pipeline

This project uses GitHub Actions to automatically build, test and validate all code changes before they can be merged into the main branch.

## Pipeline overview

Every pull request triggers a full pipeline run consisting of four stages that must all pass before merging is allowed.

**Backend Tests (xUnit)**
Runs all C# unit tests using xUnit. This covers the core game logic including word value calculation, letter pool generation, player state, game state, game engine and game service. All tests are required to pass.

**Unit Tests (Vitest)**
Runs the frontend React component tests using Vitest and React Testing Library. Verifies that key UI components render correctly.

**E2E & API Tests**
Runs two types of integration tests. The API tests use post-they and Newman to run a full game flow against the live backend — creating a lobby, joining, starting a game, fetching state and submitting a word. The E2E tests use Playwright with BDD-style Gherkin feature files to verify the application works end to end in a real browser.

**Lint**
Runs ESLint across the entire codebase to enforce consistent code style and catch common React mistakes such as incorrect hook usage.

## Branch protection

The `dev` and `main` branches are protected. All four pipeline stages must pass and at least one team member must approve the pull request before merging is allowed.

## Diagram

```
Pull request opened
        |
   _____|_____________________________
   |         |         |             |
Backend   Unit      E2E & API     Lint
tests     tests     tests         (ESLint)
(xUnit)  (Vitest)  (Playwright
                   + Newman)
   |         |         |             |
   |_________|_________|_____________|
                   |
      All stages pass + 1 review
                   |
          Merge to dev / main
```
