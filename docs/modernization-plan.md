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

**Status: complete.** All items below are done and the exit criteria are met.

Decisions made:

- **Hybrid test-data strategy**: scenarios drive the UI for the behavior
  under test, but prerequisite data is seeded directly into PouchDB via a
  small helper (`page.evaluate` against a test hook the app exposes on
  `window`). Seeding is also the only way to test monthly refill, which
  requires a category with a past `refilled` month.
- Each scenario gets a fresh Puppeteer browser (empty IndexedDB), so
  scenarios are isolated and each creates/seeds its own data.
- Seeded refill months are expressed relatively ("last refilled two months
  ago") and resolved at runtime by `yearMonthMonthsAgo` in the step
  definitions, so the tests never go stale as real time passes.

- [x] Verify `npm run test:ui` / `make test` passes as-is (baseline).
- [x] Add a tiny test hook in `src/data/database.js` exposing the PouchDB
  instance (`window.__budgetDb`) so the seeding helper can insert docs.
  Gated to `localhost`/`127.0.0.1` so it is not exposed by the deployed
  app. **Do not "improve" this into a build-time gate** (`NODE_ENV`, or
  `import.meta.env.DEV`): the suite builds and serves the *production*
  bundle, so a dev-only gate silently removes the hook and every seeded
  scenario fails.
- [x] Add scenarios covering category creation, account creation, the
  multi-step expense flow, monthly refill, and the two `:id` detail views.
- [x] Step-definition/World improvements those scenarios need (navigation
  helpers, the seeding helper).
- [x] Replace the fixed 2-second server-start sleep in
  `features/support/hooks.js` with an actual readiness check. Also fixed:
  Node 20.12+ on Windows requires `shell: true` to spawn `.cmd` files.

The scenarios themselves live in `features/budget.feature`; that file is the
single source of truth for their wording. Changing an existing scenario's
wording needs Matt's approval first.

Deferred (wanted later, not a blocker): assert that a recorded transaction
appears on the applicable account detail view, and similarly on the category
detail view.

Exit criteria: suite covers the flows above and passes reliably, twice in a
row, before any migration work starts. **Met** — 7 scenarios / 34 steps,
green on repeated consecutive runs.

## Phase 1 — Move to Vite + Svelte 5 in one hop

**Status: complete.** Svelte 5 runs the Svelte 3 components in legacy mode,
so this was a build swap rather than a rewrite — no component was changed for
syntax reasons.

- [x] Vite scaffold, applied in place rather than into a fresh directory
  (same end state, less churn): `vite.config.mjs`, an `index.html` that loads
  `/src/main.js` as a module, and the bootstrap/global stylesheets moved to
  `src/styles/` so they are bundled instead of hand-linked.
- [x] Entry point: `new App({...})` in `src/main.js` became `mount(App, ...)`.
- [x] Replaced `fa-svelte` with `src/components/Icon.svelte`, which draws the
  path data `@fortawesome/free-solid-svg-icons` already exports.
- [x] `svelte-spa-router` 5 works under Svelte 5; the hand-rolled fallback
  router was not needed. Routing stays hash-based.
- [x] Dropped `uuid` for `crypto.randomUUID()`.
- [x] PouchDB under Vite: it wants Node's `EventEmitter`, which Vite leaves
  out of browser builds. Fixed by aliasing `events` to the npm package of
  that name — the `global` shim this plan anticipated was not needed.
- [x] Vite `base`: `'./'` rather than `'/budget/'`. Relative works both under
  the GitHub Pages path and at the root of the static server the UI tests
  use, and hash routing needs no path prefix either way.
- [x] `features/support/hooks.js` builds with Vite and serves `dist/`.
- [x] Docker image moved from node:18 to node:20, which Vite requires. The
  Makefile needed no changes.

Exit criteria: `npm run dev` and `npm run build` work; the full Phase 0 suite
passes against the Vite build; manual smoke test of the sync setup screen at
`#/settings` (its button is hidden — see the sync phase). **Met.**

## Phase 2 — Deploy from CI

Pulled forward from what used to be a later tooling phase: Phase 1 changes
the shape of the build output, so it has to be paired with a change to how
the site is published.

Motivation, found during Phase 0: the committed bundles had silently gone
**nine commits stale** — last rebuilt 2025-09-19 while `src/` kept changing
through 2025-09-27 — so the live site was serving older code than `main`, and
the whole sync/Settings feature had never actually been deployed. The
pre-push hook only caught that if it was installed, and it was opt-in.

- [x] `.github/workflows/ci.yml` runs the UI suite on every push and pull
  request; on `main`, and only if that suite passed, it builds and deploys
  `dist/` to GitHub Pages. The suite builds the app itself before serving it,
  so a broken build fails the test job too.
- [x] Build output gitignored; the committed `assets/` bundles and the
  opt-in pre-push rebuild hook are gone.
- [ ] Set the repository's Pages source to "GitHub Actions" (Settings →
  Pages). Nothing deploys until this is done — it is a repo setting, not
  something that lives in the codebase.

Exit criteria: a push to `main` publishes the current source to
https://forevermatt.github.io/budget/ with no manual build step.

## Phase 3 — Refill before the first render

A quirk found during Phase 0, worth its own small phase because it is an app
behavior fix rather than migration work.

`refillBudgetCategories()` raced the first render and lost deterministically:
Svelte runs a child component's `onMount` before its parent's, so
`BudgetOverview` always read category balances before `App`'s `onMount` had
finished refilling them, and the overview showed pre-refill amounts until
something reloaded the page.

- [x] Start the refill during `App`'s initialisation and hold the router
  until it resolves, so the first render is the correct one.
- [x] Drop the reload-and-retry tolerance the overview assertion in
  `features/support/world.js` needed to work around it.

Exit criteria: the refill scenario passes with no reload tolerance in the
test helper. **Met.**

## Phase 4 — PWA

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

## Phase 5 — Tooling cleanup (optional, recommended)

- [ ] Shrink Docker to just the CouchDB container (only needed for local
  sync testing); dev/build/test run on local Node.
- [ ] Bump node:20 to node:22 in the Dockerfile and the deploy workflow.
  Node 20 is Vite's floor, not somewhere to settle.

## Phase 6 — Adopt Svelte 5 idioms (optional, no deadline)

- [ ] `npx sv migrate svelte-5` (or convert by hand as files are touched):
  runes (`$state`, `$props`, `$derived`), event attribute syntax, etc.
  Pure modernization; can trail indefinitely.

## Phase 7 — Cross-device sync via Couchbase (later, separate project)

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

Phases 0 → 1 → 2 → 4 are the critical path to "installable, offline-usable on
a phone." Phases 5–7 are independent follow-ons.
