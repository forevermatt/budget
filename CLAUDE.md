# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A budget-tracking web app (categories, accounts, transactions) built with Svelte 3 + svelte-spa-router, bundled with Webpack 4, and persisted client-side via PouchDB (with optional live sync to a CouchDB server). No backend of its own — it's a static SPA (see `index.html` / `assets/`).

## Commands

All commands normally run inside Docker via `make` targets (see `Makefile`), but the underlying `npm` scripts work directly too if dependencies are installed locally.

```bash
make install   # docker compose run --rm app bash -c "npm install"
make dev       # starts the app container (webpack-dev-server) on port 8080
make build     # production build -> writes to assets/ (bundle.js, bundle.css)
make test      # runs npm run test:ui (builds the app, serves it, runs Cucumber/Puppeteer UI tests)
make bash      # shell into the app container
make db        # starts just the CouchDB container (for sync testing), on port 5984
make update    # npm update inside the container, then regenerates installed-versions.json
make list-deps # regenerates installed-versions.json from package-lock.json
```

Direct npm equivalents (if not using Docker):
```bash
npm run build    # cross-env NODE_ENV=production webpack
npm run dev      # webpack-dev-server --host 0.0.0.0 --content-base .
npm run test:ui  # cucumber-js --require features/steps --require features/support
```

There is only one Cucumber feature file (`features/budget.feature`); there's no way to target a single scenario by name via an npm script — pass Cucumber's own `--name` flag to `cucumber-js` directly if needed. The test run rebuilds the app and serves it statically on port 5000 before Puppeteer drives it (see `features/support/hooks.js`).

There is no lint script configured. `.prettierrc` sets single quotes + bracket spacing, but there's no `format` script — formatting is manual/editor-driven.

## Architecture

**Data layer (`src/data/`)** is the source of truth for app behavior; views are mostly thin wrappers around it.

- `database.js` wraps a single `PouchDB('budget')` instance and exposes generic CRUD (`insert`, `get`, `update`, `deleteItem`, `list`). Every stored document has an `_id` of the form `<prefix>-<uuid>`, where prefix identifies the type: `a` = account, `c` = category, `t` = transaction. `list(prefix)` uses a PouchDB `allDocs` range query (`startkey`/`endkey`) over that prefix — this convention (not separate PouchDB databases or a `type` field) is how document types are distinguished.
- `accounts.js`, `categories.js`, `transactions.js` are thin, near-identical CRUD modules over `database.js`, each scoped to one item-type prefix. Follow this same pattern when adding a new entity type.
- `budget.js` contains the monthly refill logic: each category has `budgeted`, `remaining`, and `refilled` (a year-month string). `refillBudgetCategories()` runs on every app mount (see `App.svelte`) and, for each category, advances `refilled` month-by-month (capped at 100 iterations) adding `budgeted` to `remaining` for every month that has passed. Recording a transaction subtracts its `categoryAmounts` from the relevant categories' `remaining` via `subtractAmountFromBudgetCategory`.
- `transactions.js` also holds a Svelte store, `transactionInProgress`, used to accumulate state across the multi-step "record an expense" flow (`/expense/new` → `/expense/who/` → `/expense/account/` → `/expense/amount/` → `/expense/category/` → `/expense/review/`) before a single `savePendingTransaction()` call persists it and updates category balances.
- `errors.js` holds a global `errorMessage` writable store rendered by `ErrorMessage.svelte` in `App.svelte`, plus a `window.onunhandledrejection` handler that pushes any uncaught promise rejection's message into it — this is the app's de facto global error-handling mechanism.
- `migration.js` only checks for and warns about leftover data from a pre-PouchDB (localStorage-based) version of the app; not part of normal data flow.
- Sync (`database.js`'s `configureSync`) targets a per-user CouchDB database named `userdb-<hex(username)>`, matching CouchDB's `couch_peruser` naming convention, with Basic Auth injected via a custom `fetch`. Auto-connect-from-saved-credentials is currently disabled (commented out in `App.svelte`) — sync must be started explicitly (see `views/Settings.svelte`).

**Routing (`src/views/routes.js`)** maps hash paths to top-level Svelte view components in `src/views/`; `App.svelte` mounts `<Router>` from `svelte-spa-router` plus the global `ErrorMessage`. Reusable presentational pieces live in `src/components/`.

**Data structure spec**: this app targets version 2.0.0 of the schema documented in a separate repo, `forevermatt/budget-data`. Keep document shapes compatible with that spec when changing what gets stored.

**Build output**: Webpack (`webpack.config.js`) bundles `src/main.js` into `assets/bundle.js` / `assets/bundle.css`, aliasing `svelte` to the installed package and preferring `svelte`/`browser`/`module` resolution fields (required for Svelte 3 + Webpack 4 to dedupe correctly). `assets/` is committed to version control (not gitignored except for `*.map`) — `git-hooks/pre-push.sh` (opt-in, copy into `.git/hooks/`) runs `make build` and blocks the push if that changes anything under `assets/` that isn't already committed, since the GitHub Pages deploy at https://forevermatt.github.io/budget/ serves those built files directly.

## Dependency versions

`installed-versions.json` is a generated snapshot (via `make list-deps`) of exact resolved versions from `package-lock.json`, used to track what's actually installed vs. the semver ranges in `package.json`. Regenerate it with `make update` or `make list-deps` after changing dependencies — don't hand-edit it.
