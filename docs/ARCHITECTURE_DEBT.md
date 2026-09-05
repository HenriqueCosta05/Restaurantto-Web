# Architecture Debt

Items intentionally **not** fixed while extracting the infra layer (see
`.superpowers/sdd/valiant-foraging-flamingo/task-2-brief.md`). Tracked here so
they aren't lost, and so future work can pick them up deliberately rather than
by accident.

## Presentation-layer business logic

- `src/app/presentation/view/pages/admin/dashboard/dashboard.component.ts` —
  god component: fetches from 4 use cases directly, computes
  week-over-week percentage deltas and role-label mapping (business logic)
  in the component, and holds hardcoded fake chart data. Should move to a
  dedicated use case/service so the component is purely presentational.
- `src/app/presentation/view/pages/admin/stock-control/ingredientes/ingredientes.component.ts`
  — `checkIfIngredientExists()` implements duplicate-name validation
  in the component. That's a domain rule and belongs in a use case, not the
  view layer.
- `src/app/presentation/view/pages/admin/cash-flow/cash-flow.component.ts` —
  chart data is entirely hardcoded/mocked in the component despite
  `CashFlowUseCase` already existing and being wired elsewhere in the app.

## Security

- `src/app/security/token.service.ts` `isTokenExpired()` — always returns
  `false` whenever a token exists; it never actually checks token expiry.
  `isTokenValid()`/`HttpSessionGateway.isLoggedIn()` therefore only really
  check *presence* of a token today, not validity.
- `src/app/infra/http/http-auth.gateway.ts` `sendCredentials()` (formerly
  `AuthenticateUseCase.sendCredentials`) — its `catchError` reshapes any
  HTTP failure into a success-shaped observable (`of({ statusCode, message })`)
  rather than surfacing a distinguishable domain error. Callers can't tell
  a transport/network failure from an authentication failure. Preserved
  as-is per the task brief; not fixed in this pass.

## Naming / structure inconsistency

- File naming is inconsistent across `domain/usecases`: some files use
  `*.use-case.ts` (e.g. `authenticate.use-case.ts`,
  `forgot-password.use-case.ts`, `send-prospection-form.use-case.ts`)
  while most admin use cases use `*.usecase.ts` (e.g.
  `collaborator.usecase.ts`, `ingredients.usecase.ts`).
- DTOs under `domain/dtos` are frequently named after the use case that
  consumes them (`*.usecase.dto.ts`) rather than the entity they represent,
  used inconsistently.

## Endpoint literals

- `src/app/infra/http/endpoints.ts` currently only extracts
  `COLLABORATOR_ENDPOINTS` for `collaborator.usecase.ts` (this task's scope).
  Every other use case still bakes literal REST path strings inline in the
  method bodies, e.g.:
  - `src/app/domain/usecases/admin/finances.usecase/cash-flow.usecase.ts`
  - `src/app/domain/usecases/admin/finances.usecase/expenses.usecase.ts`
  - `src/app/domain/usecases/admin/finances.usecase/revenues.usecase.ts`
  - `src/app/domain/usecases/admin/finances.usecase/finance.group.usecase.ts`
  - `src/app/domain/usecases/admin/ingredients.usecase/ingredients.usecase.ts`
  - `src/app/domain/usecases/admin/suppliers.usecase/suppliers.usecase.ts`
  - `src/app/domain/usecases/admin/datasheet.usecase/datasheet.usecase.ts`
  - `src/app/domain/usecases/admin/datasheet.usecase/datasheet.group.usecase.ts`

  Same pattern as `collaborator.usecase.ts` before this task; only that one
  file was fixed here.

## Tooling / lint

- `eslint.config.mjs` — `@angular-eslint/prefer-inject` was disabled during
  the Task 1 dependency upgrade rather than migrating ~125 constructor
  injection call sites (mostly in `domain/`) to `inject()`. Flagged by that
  task's review as a lint-coverage regression that needs a tracked
  follow-up (either migrate the call sites, or make a deliberate call to
  keep constructor injection and re-enable a narrower rule).
- `angular.json` initial bundle budget has been raised twice: 500kb/1mb
  baseline -> 1.5mb/2mb (pre-existing-debt fix) -> 2mb/2.5mb (after the
  Angular 22 + apexcharts 7 upgrade in Task 1). Each raise was honestly
  reported and reflects the real bundle size (currently ~2.05mb, still over
  the 2mb warning threshold — see Task 2's build output), i.e. it isn't
  masking a regression. But a budget that keeps growing to match whatever
  the bundle happens to be is a trend someone should own (e.g. lazy-loading
  admin routes, auditing chart-library weight) rather than keep bumping.

## Pre-existing test breakage (not introduced by this task)

- `src/app/domain/usecases/shared/authenticate.use-case.spec.ts` references
  a class named `AuthenticateService` that does not exist —
  `authenticate.use-case.ts` exports `AuthenticateUseCase`. This spec was
  already broken/non-compiling on the Task 1 baseline before this task
  started and was left as-is per the Task 2 brief.
