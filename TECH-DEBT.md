# Technical Debt Report (Updated 2026-03-29)

This document reflects the current state of the repository, runtime behavior, and folder structure.

## Current Architecture Snapshot

- Backend API: `Server/` (.NET 8 Minimal API).
- Gameplay engines/contracts: `Server/Gameplay/EverySecondLetter/`.
- Backend services and DB abstraction: `Server/Services/` and `Server/Services/Database/`.
- Frontend SPA: `Frontend/` (React + Vite), built to `Server/wwwroot/`.
- System tests: `Testing/SystemTests/` (Postman/Newman + Playwright).
- Unit tests: `Testing/UnitTests/EverySecondLetter.UnitTests/` (xUnit).

## Recently Resolved or Improved

- UI test stability has improved (word tile rendering waits and end-to-end flow fixes).
- Rejoin persistence behavior is now sessionStorage-first with localStorage fallback migration in the frontend context.
- The previous debt item "no unit test layer" is no longer accurate; gameplay/service unit tests exist.

## Backend Debt (C#)

### High Priority

- Raw SQL with manual mapping in `GamesService` remains a maintainability risk.
  - SQL queries and `DbDataReader` index-based mapping are tightly coupled.
  - String status values are converted manually across read/write paths.

- Unsafe enum parsing is still present.
  - `Enum.Parse<GameStatus>(...)` can throw on malformed persisted data.
  - Replace with guarded parsing (`Enum.TryParse`) and controlled domain/API errors.

- Developer exception page is enabled unconditionally.
  - `app.UseDeveloperExceptionPage()` should be development-only.

- Authentication/identity model is intentionally lightweight but weak.
  - `X-Player-Token` is effectively a bearer token without expiry, refresh, or account binding.

### Medium Priority

- Repeated transaction patterns in service methods.
  - Multiple methods duplicate begin/commit/rollback and error handling boilerplate.

- Runtime tunables are not centralized.
  - Gameplay constants and polling-sensitive values are mostly code-defined, not config-driven.

- Observability/logging is minimal for key game transitions.
  - Limited structured telemetry around claim, accept/dispute, and game completion events.

## Frontend Debt (React)

### High Priority

- Token and game identity persistence in browser storage still carries XSS risk.
  - sessionStorage-first is an improvement over localStorage-only behavior.
  - Sensitive token material is still accessible to injected scripts.

- Fixed 1000ms polling interval in `GamePage`.
  - Interval is hardcoded and not centrally configured.
  - No adaptive polling/backoff under errors or idle states.

### Medium Priority

- Frontend codebase is JavaScript-only.
  - No TypeScript safety for API payloads, game state shape, or component props.

- Error-handling UX can be more resilient.
  - Retry/backoff patterns are not consistently implemented for transient API failures.

## Testing and Quality Debt

### High Priority

- CI gating is not represented in repository config.
  - System and unit tests exist, but no explicit always-on CI workflow is visible in this repo.

- BDD naming and intent drift.
  - Some UI scenario names still reference localStorage semantics while behavior is now sessionStorage-first.

### Medium Priority

- Test organization mismatch risk across docs.
  - Keep references aligned to `Testing/UnitTests/...` to avoid stale command paths.

## Database and Infrastructure Debt

### High Priority

- Schema evolution is initialization-driven rather than migration-driven.
  - Current startup initialization/seeding flow works, but versioned migrations are not explicit.

- Baseline API hardening middleware is limited.
  - No explicit rate limiting.
  - No explicit CORS/security-header policy configuration in the main pipeline.

### Medium Priority

- Production diagnostics are sparse.
  - No explicit audit/event trail for core gameplay actions.

## Prioritized Next Steps

1. Guard developer exception page by environment and add baseline API hardening (explicit CORS policy, rate limiting, security headers).
2. Replace unsafe enum parsing with safe parse paths and controlled failure handling.
3. Introduce a transaction helper abstraction in `GamesService` to reduce boilerplate and rollback risk.
4. Move polling interval and gameplay tunables to centralized configuration.
5. Add or document CI workflows that run unit + system tests on every PR.
6. Align BDD scenario naming and README paths with current sessionStorage-first behavior and actual test folder layout.
