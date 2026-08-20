# Modernization Plan: Vite + Svelte 5 + PWA

Goal: get this app to a state where a real user can install it on their phone
and use it offline, running on a current version of Svelte, with cross-device
sync as a later, separable project.

Guiding constraints:

- Stay a static SPA — no backend of our own, no SSR (plain Vite Svelte
  template, **not** SvelteKit).
- The Cucumber/Puppeteer UI tests drive the built app in a real browser, so
  they are framework- and bundler-agnostic. They are the safety net for every
  phase; each phase ends with the suite green.
- Keep document shapes compatible with the budget-data 2.0.0 spec.

## Phase 0 — Build the safety net

Starting state: the suite was a single smoke test (the Budget heading
renders). That is not enough coverage to migrate against, so this phase
*adds* the scenarios that define "the app works".

**Status: complete.** All items below are done and the exit criteria are
met; Phase 1 is clear to start.

Decisions made:

- **Hybrid test-data strategy**: scenarios drive the UI for the behavior
  under test, but prerequisite data is seeded directly into PouchDB via a
  small helper (`page.evaluate` against a test hook the app exposes on
  `window`). Seeding is also the only way to test monthly refill, which
  requires a category with a past `refilled` month.
- Each scenario gets a fresh Puppeteer browser (empty IndexedDB), so
  scenarios are isolated and each creates/seeds its own data.

- [x] Verify `npm run test:ui` / `make test` passes as-is (baseline).
- [x] Add a tiny test hook in `src/data/database.js` exposing the PouchDB
  instance (`window.__budgetDb`) so the seeding helper can insert docs.
  Gated to `localhost`/`127.0.0.1` so it is not exposed by the deployed
  app. **Do not "improve" this into a build-time gate** (`NODE_ENV`, or
  `import.meta.env.DEV` after the Vite move): the suite builds and serves
  the *production* bundle, so a dev-only gate silently removes the hook
  and every seeded scenario fails.
- [x] Add scenarios:
  - [x] Create a category with a budgeted amount; it appears in the budget
    overview with the right remaining balance.
  - [x] Create an account; it appears in the accounts list.
  - [x] Record an expense through the full multi-step flow
    (who → account → amount → category → review → save); the transaction is
    listed and the category's remaining balance decreases.
  - [x] Monthly refill: a seeded category whose `refilled` month is in the
    past gains `budgeted` per elapsed month on app load.
  - [x] Detail views: open a category and an account by id from their lists —
    covers the `:id` route pattern (exactly what a router swap could break).
- [x] Step-definition/World improvements those scenarios need (navigation
  helpers, the seeding helper).

### Approved wording for the final three scenarios (implemented)

Matt approved the following Gherkin verbatim, and it is now in
`features/budget.feature` as written. Kept here as the record of that
approval — any change to this wording still needs Matt's approval first.
Note: "last refilled two months ago" is deliberately relative — the step
definition computes the actual year-month at runtime (see
`yearMonthMonthsAgo`), so the test never goes stale.

```gherkin
Scenario: Monthly budget refill on app load
  Given a budget category "Utilities" with $100.00 budgeted per month, $40.00 remaining, last refilled two months ago
  When I go to the home page
  Then the budget overview should show "Utilities" with $240.00 remaining

Scenario: View a category's details
  Given a budget category "Groceries" with $500.00 budgeted and remaining
  When I open "Groceries" from the budget overview
  Then I should see the category view for "Groceries"

Scenario: View an account's details
  Given an account named "Checking"
  When I open "Checking" from the accounts list
  Then I should see the account view for "Checking"
```
- Deferred (wanted later, not Phase 0 blockers): assert that a recorded
  transaction appears on the applicable account detail view, and similarly
  on the category detail view.
- [x] Replace the fixed 2-second server-start sleep in
  `features/support/hooks.js` with an actual readiness check (minor, but
  removes flakiness before we start leaning on the suite). Also fixed:
  Node 20.12+ on Windows requires `shell: true` to spawn `.cmd` files.

Known app quirk found during Phase 0 (fix properly in Phase 1, not in
tests): `refillBudgetCategories()` races the first render, and loses
deterministically — Svelte runs a child component's `onMount` before its
parent's, so `BudgetOverview` (a child of `App`) always queries categories
before `App`'s own `onMount` finishes `refillBudgetCategories()`. A single
reload retry still loses the same way, since the reload just repeats the
same mount order; the refill from the *previous* load has finished in the
background by then, though, so a second reload's `BudgetOverview` fetch
picks up the correct values. The overview assertion helper in `world.js`
tolerates this by retrying with up to two reloads.

Exit criteria: suite covers the flows above and passes reliably, twice in a
row, before any migration work starts. **Met** — 7 scenarios / 34 steps,
green on repeated consecutive runs.

## Phase 1 — Move to Vite + Svelte 5 in one hop

Scaffold fresh (`npm create vite@latest`, Svelte template) and move `src/`
into it, rather than upgrading Webpack 4 → 5 and Svelte 3 → 4 → 5 in place.
Svelte 5 runs Svelte 3/4 component syntax in legacy mode, so components move
over largely unchanged.

- [ ] New Vite scaffold; copy `src/`, `index.html`, `assets/global.css`,
  bootstrap CSS into it.
- [ ] Entry point: `new App({...})` in `src/main.js` becomes
  `mount(App, {...})` (class components are gone in Svelte 5).
- [ ] Replace `fa-svelte` (Svelte-3-era, expected to break): small in-house
  `Icon.svelte` rendering the SVG path data that
  `@fortawesome/free-solid-svg-icons` already exports.
- [ ] `svelte-spa-router`: try it under Svelte 5 legacy mode first. Fallback
  if it misbehaves: hand-rolled hash router (~40 lines; routes are simple —
  one `:id` param pattern). Keep hash routing either way (avoids GitHub
  Pages 404-on-refresh).
- [ ] Drop `uuid` for built-in `crypto.randomUUID()`.
- [ ] PouchDB + Vite: may need a Node-globals shim (e.g. `define: { global:
  'window' }`) — known issue, small fix.
- [ ] Vite config: `base: '/budget/'` for the GitHub Pages deploy.
- [ ] Update `features/support/hooks.js` to build with Vite and serve the
  Vite output.
- [ ] Update Makefile / Docker bits (or see Phase 3 for shrinking them).

Exit criteria: `npm run dev` and `npm run build` work; full Phase 0 suite
passes against the Vite build; manual smoke test of sync setup screen —
reach it at `#/settings` directly, since its button is hidden (see Phase 5).

## Phase 2 — PWA

PouchDB already keeps all data on-device; this phase adds offline delivery
of the app shell.

- [ ] Add `vite-plugin-pwa`: service worker precaching the built assets,
  `registerType: 'autoUpdate'`.
- [ ] Web app manifest: name, colors, icons (192/512 px, maskable, plus
  Apple touch icon for iOS Add-to-Home-Screen).
- [ ] Verify Lighthouse "installable" checks pass.
- [ ] Real-device test: install to home screen, enable airplane mode, record
  an expense, relaunch, go back online.

Exit criteria: installable on a phone and fully usable offline.

## Phase 3 — Deployment & tooling cleanup (optional, recommended)

- [ ] GitHub Actions workflow that builds and deploys to GitHub Pages;
  gitignore build output; retire the committed `assets/` bundles and the
  pre-push rebuild hook. (Alternative: keep committing the build — point
  Vite's `outDir` at `assets/` and keep the hook.)

  Motivation, found during Phase 0: the committed bundles had silently gone
  **nine commits stale** — last rebuilt 2025-09-19 while `src/` kept changing
  through 2025-09-27 — so the live site was serving older code than `main`,
  and the whole sync/Settings feature had never actually been deployed. The
  pre-push hook only catches this if it is installed, and it is opt-in. Until
  this item is done, treat "did `assets/` get rebuilt?" as part of review.
  Note also that any branch touching `src/` conflicts on `assets/bundle.js`;
  resolve by rebuilding from the merged source, never by hand.
- [ ] Shrink Docker to just the CouchDB container (only needed for local
  sync testing); dev/build/test run on local Node.

## Phase 4 — Adopt Svelte 5 idioms (optional, no deadline)

- [ ] `npx sv migrate svelte-5` (or convert by hand as files are touched):
  runes (`$state`, `$props`, `$derived`), event attribute syntax, etc.
  Pure modernization; can trail indefinitely.

## Phase 5 — Cross-device sync via Couchbase (later, separate project)

Decision: target **Couchbase** (Capella free tier) rather than
self-administering CouchDB.

**Known risk, so this phase starts with a feasibility spike:** PouchDB's
replication protocol is CouchDB's. Couchbase's sync layer (Sync Gateway /
Capella App Services) dropped its CouchDB-compatible replication API in
recent major versions, and Couchbase Lite has no browser edition. So
"PouchDB syncs to Couchbase" must be proven, not assumed.

The sync UI is written but unfinished, so its entry point is deliberately
hidden: the gear button on the Budget view is commented out in
`src/views/Budget.svelte`, leaving `#/settings` reachable only by typing the
URL. Restore that button as part of finishing this phase — otherwise the
feature ships invisible.

- [ ] Spike: can a browser PWA sync with Capella App Services at all today?
  Investigate current Sync Gateway REST capabilities, any web client SDK,
  or community bridges. Time-boxed; produces a go/no-go.
- [ ] If **go**: design auth flow + per-user data partitioning on Couchbase;
  replace/adapt `configureSync` in `src/data/database.js`.
- [ ] If **no-go**: revisit options with the same criteria (managed, free
  tier, no server admin) — e.g. hosted CouchDB (Cloudant) — or a custom thin
  sync endpoint. Everything above the local PouchDB is unaffected either
  way, which is why this phase is safely last.

## Sequencing

Phases 0 → 1 → 2 are the critical path to "installable, offline-usable on a
phone." Phase 1 carries the only real unknowns (router and `fa-svelte`).
Phases 3–5 are independent follow-ons.
