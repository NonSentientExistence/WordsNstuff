# Technical Debt Report (Updated 2026-03-29)

This report reflects the current codebase status after recent UI test stabilization and storage migration work.

## Recently Addressed

- UI BDD flake for missing letters in word tiles was fixed by waiting for expected rendered tile text in Playwright page-object helpers.
- Rejoin UI scenario was aligned with current storage behavior by reading and restoring sessionStorage (with localStorage fallback).
- Full UI feature "Full end-to-end game completion flow" is currently green after step-definition fixes for token lookup and endgame loop behavior.

## Backend (C#)

### High Priority

- Raw SQL with manual mapping in GamesService increases fragility and maintenance cost.
  - Many queries map columns by index and rely on stringly-typed status values.
  - Consider introducing Dapper or typed row mappers as an incremental step before any ORM migration.

- Unsafe enum parsing still exists.
  - Enum.Parse<GameStatus>(...) can throw on invalid database values.
  - Replace with Enum.TryParse(..., out var status) and return a controlled ApiException on failure.

- Always-on developer exception page.
  - app.UseDeveloperExceptionPage() is enabled without environment guard.
  - Should be limited to development only.

- Authentication model is still weak.
  - Player identity is a GUID token in X-Player-Token without auth/session proof.
  - Tokens are bearer-like and not bound to user identity or expiration.

### Medium Priority

- Repeated transaction boilerplate in service methods.
  - Similar try/catch/commit/rollback blocks repeated throughout GamesService.
  - Introduce a transaction helper wrapper to reduce duplication and rollback mistakes.

- Hardcoded gameplay constants are still scattered.
  - Move tunables (for example minimum claim length and starting action counts) to configuration.

- No structured logging for core game transitions.
  - Limited observability for debugging production incidents.

## Frontend (React)

### High Priority

- Credentials are stored in web storage.
  - Current implementation prefers sessionStorage and migrates legacy localStorage values.
  - This is better than localStorage-only persistence for tab scoping, but still vulnerable to XSS token theft.

- Polling model remains fixed interval.
  - Game state polling uses a hardcoded 1000ms interval.
  - Should be centralized in a constant or configuration and ideally move toward server push when feasible.

### Medium Priority

- Frontend remains JavaScript-only.
  - No TypeScript type safety for API contracts or component props.

- Error UX can still be improved.
  - Some API failures are surfaced, but there is no robust retry/backoff strategy for transient fetch failures.

## Testing and QA

### High Priority

- No unit test layer for game rules.
  - Rule logic (turn ownership, claim/dispute scoring, endgame conditions) is primarily validated through API/UI scenarios.
  - Add deterministic unit tests around gameplay definition and scoring calculations.

- CI enforcement is not documented.
  - API/UI Playwright tests exist and are valuable, but no documented always-on CI gate is visible in this repository.

### Medium Priority

- Some BDD naming is now misleading.
  - The scenario name "Rejoin from saved localStorage data" still references localStorage although implementation now uses sessionStorage-first behavior.

## Database and Infrastructure

### High Priority

- Schema lifecycle management is minimal.
  - Database setup appears to rely on initialization SQL plus startup seeding.
  - Introduce explicit migration tooling and versioned migration history.

- Missing explicit API hardening middleware.
  - Rate limiting is not configured.
  - Security headers/CORS policy are not explicitly configured in Program.cs.

### Medium Priority

- Operational diagnostics are sparse.
  - No audit trail for key gameplay events (claim, accept, dispute, game-finished).

## Prioritized Next Steps

1. Guard developer exception page by environment and add baseline security middleware (rate limiting, security headers, explicit CORS policy).
2. Replace enum parsing with safe parsing plus explicit error handling.
3. Add unit tests for scoring and state transitions in gameplay definition.
4. Introduce migration tooling for database schema evolution.
5. Move polling interval and gameplay tunables into config.
6. Rename misleading BDD scenario titles to reflect sessionStorage-first persistence.
