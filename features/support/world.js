const { setWorldConstructor } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:5000';

class CustomWorld {
  async launch() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      this.page = await this.browser.newPage();
    }
  }

  async openApp(hashPath) {
    const url = `${BASE_URL}/#${hashPath}`;
    if (this.page.url() === url) {
      // page.goto to the current URL (differing only by hash) would be a
      // same-document navigation and would not remount the app.
      await this.page.reload({ waitUntil: 'networkidle0' });
    } else {
      await this.page.goto(url, { waitUntil: 'networkidle0' });
    }
  }

  async ensureAppLoaded() {
    if (!this.page.url().startsWith(BASE_URL)) {
      await this.openApp('/');
    }
    await this.page.waitForFunction(() => window.__budgetDb);
  }

  // Insert a document directly into the app's PouchDB (test seeding).
  async seed(doc) {
    await this.ensureAppLoaded();
    await this.page.evaluate((d) => window.__budgetDb.put(d), doc);
  }

  // Buttons rendered by Button.svelte have ids like "button-next".
  async clickNamedButton(name) {
    await this.page.click(`#button-${name}`);
  }

  async clickByText(selector, text) {
    await this.page.waitForFunction(
      (sel, t) =>
        [...document.querySelectorAll(sel)].some(
          (el) => el.textContent.trim() === t
        ),
      {},
      selector,
      text
    );
    await this.page.evaluate(
      (sel, t) => {
        [...document.querySelectorAll(sel)]
          .find((el) => el.textContent.trim() === t)
          .click();
      },
      selector,
      text
    );
  }

  async waitForHeadingStartingWith(prefix) {
    await this.page.waitForFunction(
      (p) =>
        [...document.querySelectorAll('h2')].some((h) =>
          h.textContent.trim().startsWith(p)
        ),
      {},
      prefix
    );
  }

  // AmountInput builds the amount from typed digits: "50000" shows as 500.00.
  async typeIntoAmountInput(cents) {
    const input = await this.page.waitForSelector('input[type="tel"]');
    await input.click();
    await input.type(String(cents));
  }

  async readRemainingShownFor(categoryName) {
    return this.page.evaluate((name) => {
      const rows = [...document.querySelectorAll('.category-list tr')];
      for (const row of rows) {
        const link = row.querySelector('.category-name a');
        if (link && link.textContent.trim() === name) {
          return row
            .querySelector('.category-available')
            .textContent.replace(/\s+/g, '');
        }
      }
      return null;
    }, categoryName);
  }

  async waitForRemainingShown(categoryName, formattedDollars) {
    const expected = `$${formattedDollars}`;
    const rowMatches = () =>
      this.page
        .waitForFunction(
          (name, exp) => {
            const rows = [...document.querySelectorAll('.category-list tr')];
            return rows.some((row) => {
              const link = row.querySelector('.category-name a');
              return (
                link &&
                link.textContent.trim() === name &&
                row
                  .querySelector('.category-available')
                  .textContent.replace(/\s+/g, '') === exp
              );
            });
          },
          { timeout: 5000 },
          categoryName,
          expected
        )
        .then(
          () => true,
          () => false
        );

    if (await rowMatches()) return;

    // The monthly refill runs concurrently with the first render: Svelte
    // mounts BudgetOverview (a child of App) before running App's onMount,
    // so BudgetOverview's category fetch deterministically wins the race and
    // reads pre-refill values on every load. The refill still finishes
    // shortly after, in the background, so a second reload picks up what the
    // first one's refill wrote. One reload is not enough; retry twice.
    for (let i = 0; i < 2; i++) {
      await this.page.reload({ waitUntil: 'networkidle0' });
      if (await rowMatches()) return;
    }

    const actual = await this.readRemainingShownFor(categoryName);
    throw new Error(
      `Expected budget overview to show "${categoryName}" with ${expected} remaining, ` +
        (actual === null
          ? 'but that category is not shown'
          : `but it shows ${actual}`)
    );
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

setWorldConstructor(CustomWorld);
