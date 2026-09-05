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

## Domain still inherits from infra (Dependency Rule only half-fixed)

- Extracting `HttpClient` out of the domain layer satisfies the "no
  `HttpClient` in domain" grep gate, but the import arrow between domain and
  infra still points the wrong way: it now runs through inheritance instead
  of a raw `HttpClient` field. `grep -rn "@infra" src/app/domain` shows ~10
  use case files still `import { HttpUseCaseGateway } from
  '@infra/http/http-usecase-gateway'` and `extends
  HttpUseCaseGateway<T>`:
  - `src/app/domain/usecases/admin/collaborator.usecase/collaborator.usecase.ts`
  - `src/app/domain/usecases/admin/datasheet.usecase/datasheet.usecase.ts`
  - `src/app/domain/usecases/admin/datasheet.usecase/datasheet.group.usecase.ts`
  - `src/app/domain/usecases/admin/finances.usecase/cash-flow.usecase.ts`
  - `src/app/domain/usecases/admin/finances.usecase/expenses.usecase.ts`
  - `src/app/domain/usecases/admin/finances.usecase/revenues.usecase.ts`
  - `src/app/domain/usecases/admin/finances.usecase/finance.group.usecase.ts`
  - `src/app/domain/usecases/admin/ingredients.usecase/ingredients.usecase.ts`
  - `src/app/domain/usecases/admin/suppliers.usecase/suppliers.usecase.ts`
  - `src/app/domain/usecases/prospection/send-prospection-form/send-prospection-form.use-case.ts`

  Each of these compiles today only because they still `import` a concrete
  infra class directly into `domain/`. Under the Dependency Rule, domain
  should depend only on an abstraction it owns. The correct end state is
  already demonstrated elsewhere in this same branch by
  `AUTH_GATEWAY`/`SESSION_GATEWAY`: define an injection-token-based port for
  `BaseUseCaseRepository<T>` in `domain`, have each use case above inject
  that port instead of extending a concrete infra class, and bind
  `{ provide: <TOKEN>, useClass: HttpUseCaseGateway }` per entity type at
  the composition root (`src/app/app.config.ts`). This is a plan defect,
  not an implementation defect — the task brief's own literal instruction
  was "extend HttpUseCaseGateway" — so flag it as the next architecture
  task rather than a regression introduced during implementation.

## `tsconfig.json` / `tsconfig.app.json` diagnostics silenced during the upgrade

- `tsconfig.json`'s `"skipLibCheck": true` was added during the Angular
  19->22 upgrade to work around `apexcharts`' legacy `declare module` type
  definitions. Defensible — it's `ng new`'s current default — but it
  silences lib type-checking repo-wide instead of scoping the workaround to
  just the apexcharts import site. Worth narrowing later, e.g. a local
  `.d.ts` shim for apexcharts instead of a global skip.
- `tsconfig.app.json`'s `angularCompilerOptions.extendedDiagnostics` now
  suppresses `nullishCoalescingNotNullable` and `optionalChainNotNullable`,
  added by an automated codemod during the same upgrade. Low-stakes, but it
  permanently disables two real Angular template correctness diagnostics
  repo-wide rather than fixing whatever template(s) triggered them. Worth
  revisiting: find what triggered the suppression, fix the template, then
  re-enable both checks.

## Non-functional search boxes (wiring now correct, behavior still stubbed)

- The searchbar wiring bug fix in this branch means every `Searchbar`
  configured with an `onSearch` callback now actually fires it — but 8
  pages still configure `onSearch: (value) => { console.log(value); }`
  instead of doing real filtering, so those search boxes are now reachable
  but still do nothing when used:
  - `src/app/presentation/view/pages/admin/dashboard/dashboard.component.ts`
  - `src/app/presentation/view/pages/admin/dashboard/colaborador/colaborador.component.ts`
  - `src/app/presentation/view/pages/admin/cash-flow/financas/grupo-financas/grupo-financas.component.ts`
  - `src/app/presentation/view/pages/admin/cash-flow/ultimas-transacoes/ultimas-transacoes.component.ts`
  - `src/app/presentation/view/pages/admin/orders/delivery/delivery.component.ts`
  - `src/app/presentation/view/pages/admin/orders/ultimos-pedidos/ultimos-pedidos.component.ts`
  - `src/app/presentation/view/pages/admin/stock-control/fornecedor/dash-fornecedores/dash-fornecedores.component.ts`
  - `src/app/presentation/view/pages/admin/stock-control/ingredientes/dash-ingredientes/dash-ingredientes.component.ts`

  Follow-up: apply the same client-side-filter pattern used for the 3
  search features fixed in this branch to these 8 remaining pages.

## Pre-existing test breakage (not introduced by this task)

- `src/app/domain/usecases/shared/authenticate.use-case.spec.ts` references
  a class named `AuthenticateService` that does not exist —
  `authenticate.use-case.ts` exports `AuthenticateUseCase`. This spec was
  already broken/non-compiling on the Task 1 baseline before this task
  started and was left as-is per the Task 2 brief.
