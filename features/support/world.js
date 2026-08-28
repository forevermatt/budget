const { setWorldConstructor } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:5000';

class CustomWorld {
  async launch() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      this.page = await this.browser.newPage();

      // Chrome fires this once, early, on any page it judges installable, so
      // the listener has to be in place before the first navigation rather
      // than added by the step that asserts on it.
      await this.page.evaluateOnNewDocument(() => {
        window.__installPromptFired = false;
        window.addEventListener('beforeinstallprompt', () => {
          window.__installPromptFired = true;
        });
      });
    }
  }

  // Resolves once the service worker is not just registered but activated and
  // in charge of the page. A worker only becomes a client's controller after
  // it activates, which happens after its install step has finished
  // precaching, so by this point the app shell is on disk and the network can
  // be taken away.
  async waitForServiceWorkerControl() {
    // Poll on a timer rather than waitForFunction's default animation frames,
    // which Chrome throttles heavily on a page that is never visible.
    const controlled = () =>
      this.page.waitForFunction(
        () => navigator.serviceWorker.controller !== null,
        { timeout: 15000, polling: 100 }
      );

    try {
      await controlled();
    } catch (e) {
      // Activated is not the same as in charge: a worker takes over a page
      // that was already open only once it claims clients, and whether that
      // has happened yet is a race. A reload settles it, since an activated
      // worker controls the page it serves.
      await this.page.reload({ waitUntil: 'networkidle0' });
      try {
        await controlled();
      } catch (e2) {
        throw new Error(
          'No service worker took control of the page, even after a reload, ' +
            'so there is nothing to serve the app once the network goes away.'
        );
      }
    }
  }

  async openApp(hashPath) {
    // Changing only the hash is a same-document navigation, so page.goto on
    // its own would leave the already-running app mounted. Every step that
    // opens a path starts a flow there, so always load the app afresh.
    const wasOnApp = this.page.url().startsWith(BASE_URL);
    await this.page.goto(`${BASE_URL}/#${hashPath}`, {
      waitUntil: 'networkidle0',
    });
    if (wasOnApp) {
      await this.page.reload({ waitUntil: 'networkidle0' });
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

  // The budget overview is headed by the current month rather than by a
  // fixed word, so "we are back on it" is a question about the envelope
  // list rather than about the heading.
  async waitForBudgetOverview() {
    await this.page.waitForSelector('.category-list');
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
      const rows = [...document.querySelectorAll('.category-list .category-row')];
      for (const row of rows) {
        const link = row.querySelector('.category-name');
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
    try {
      await this.page.waitForFunction(
        (name, exp) => {
          const rows = [...document.querySelectorAll('.category-list .category-row')];
          return rows.some((row) => {
            const link = row.querySelector('.category-name');
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
      );
    } catch (e) {
      const actual = await this.readRemainingShownFor(categoryName);
      throw new Error(
        `Expected budget overview to show "${categoryName}" with ${expected} remaining, ` +
          (actual === null
            ? 'but that category is not shown'
            : `but it shows ${actual}`)
      );
    }
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
