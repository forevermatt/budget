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

Current state: the suite is a single smoke test (the Budget heading renders).
That is not enough coverage to migrate against, so this phase *adds* the
scenarios that define "the app works".

Decisions made:

- **Hybrid test-data strategy**: scenarios drive the UI for the behavior
  under test, but prerequisite data is seeded directly into PouchDB via a
  small helper (`page.evaluate` against a test hook the app exposes on
  `window`). Seeding is also the only way to test monthly refill, which
  requires a category with a past `refilled` month.
- Each scenario gets a fresh Puppeteer browser (empty IndexedDB), so
  scenarios are isolated and each creates/seeds its own data.
- Note: the actual expense flow order is
  who → account → amount → category → review (CLAUDE.md's description is
  stale).

- [ ] Verify `npm run test:ui` / `make test` passes as-is (baseline).
- [ ] Add a tiny test hook in `src/data/database.js` exposing the PouchDB
  instance (e.g. `window.__budgetDb`) so the seeding helper can insert docs.
- [ ] Add scenarios:
  - Create a category with a budgeted amount; it appears in the budget
    overview with the right remaining balance.
  - Create an account; it appears in the accounts list.
  - Record an expense through the full multi-step flow
    (who → account → amount → category → review → save); the transaction is
    listed and the category's remaining balance decreases.
  - Monthly refill: a seeded category whose `refilled` month is in the past
    gains `budgeted` per elapsed month on app load.
  - Detail views: open a category and an account by id from their lists —
    covers the `:id` route pattern (exactly what a router swap could break).
- [ ] Step-definition/World improvements those scenarios need (navigation
  helpers, the seeding helper).
- Deferred (wanted later, not Phase 0 blockers): assert that a recorded
  transaction appears on the applicable account detail view, and similarly
  on the category detail view.
- [ ] Replace the fixed 2-second server-start sleep in
  `features/support/hooks.js` with an actual readiness check (minor, but
  removes flakiness before we start leaning on the suite).

Exit criteria: suite covers the flows above and passes reliably, twice in a
row, before any migration work starts.

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
passes against the Vite build; manual smoke test of sync setup screen.

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
