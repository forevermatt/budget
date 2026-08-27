const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const { randomUUID } = require('crypto');

// Category refill months are "yyyy-mm" strings (see src/helpers/dates.js).
const yearMonthMonthsAgo = (monthsAgo) => {
  const now = new Date();
  const then = new Date(now.getFullYear(), now.getMonth() - monthsAgo);
  const month = String(then.getMonth() + 1).padStart(2, '0');
  return `${then.getFullYear()}-${month}`;
};

Given('the app is running', async function () {
  await this.launch();
});

When('I go to the home page', async function () {
  await this.openApp('/');
});

Then('I should see a heading {string}', async function (expected) {
  await this.page.waitForSelector('h2');
  const heading = await this.page.$eval('h2', (el) => el.textContent.trim());
  assert.strictEqual(heading, expected);
});

const dollarsToCents = (dollars) => Math.round(Number(dollars) * 100);

When('I go to the new category page', async function () {
  await this.openApp('/category/new');
  await this.page.waitForSelector('#new-category-name');
});

When('I name the category {string}', async function (name) {
  await this.page.type('#new-category-name', name);
  await this.clickNamedButton('next');
  await this.waitForHeadingStartingWith('Monthly amount for');
});

When(/^I set its monthly amount to \$([0-9.]+)$/, async function (dollars) {
  await this.typeIntoAmountInput(dollarsToCents(dollars));
  await this.clickNamedButton('save');
  await this.waitForHeadingStartingWith('Budget');
});

Then(
  /^the budget overview should show "([^"]*)" with \$([0-9.]+) remaining$/,
  async function (name, dollars) {
    await this.waitForHeadingStartingWith('Budget');
    await this.waitForRemainingShown(name, Number(dollars).toFixed(2));
  }
);

When('I go to the new account page', async function () {
  await this.openApp('/account/new');
  await this.page.waitForSelector('input[placeholder="New account name"]');
});

When('I name the account {string}', async function (name) {
  await this.page.type('input[placeholder="New account name"]', name);
  await this.clickNamedButton('done');
  await this.waitForHeadingStartingWith('Accounts');
});

Then('the accounts list should show {string}', async function (name) {
  await this.page.waitForFunction(
    (n) =>
      [...document.querySelectorAll('a[href^="#/account/"]')].some(
        (a) => a.textContent.trim() === n
      ),
    {},
    name
  );
});

Given(
  /^a budget category "([^"]*)" with \$([0-9.]+) budgeted and remaining$/,
  async function (name, dollars) {
    const cents = dollarsToCents(dollars);
    await this.seed({
      _id: `c-${randomUUID()}`,
      name,
      budgeted: cents,
      remaining: cents,
      refilled: yearMonthMonthsAgo(0),
    });
  }
);

Given('an account named {string}', async function (name) {
  await this.seed({ _id: `a-${randomUUID()}`, name });
});

const monthsWordToNumber = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
};

Given(
  /^a budget category "([^"]*)" with \$([0-9.]+) budgeted per month, \$([0-9.]+) remaining, last refilled (\w+) months? ago$/,
  async function (name, budgetedDollars, remainingDollars, monthsAgoWord) {
    const monthsAgo = monthsWordToNumber[monthsAgoWord] ?? Number(monthsAgoWord);
    await this.seed({
      _id: `c-${randomUUID()}`,
      name,
      budgeted: dollarsToCents(budgetedDollars),
      remaining: dollarsToCents(remainingDollars),
      refilled: yearMonthMonthsAgo(monthsAgo),
    });
  }
);

// One function per screen of the expense flow, so the scenario that walks it
// a step at a time and the one that records an expense in a single step drive
// the app through exactly the same sequence.
const startExpense = async (world) => {
  await world.openApp('/expense/new');
  await world.page.waitForSelector('#who');
};

const sayItWasPaidTo = async (world, who) => {
  await world.page.type('#who', who);
  await world.clickNamedButton('next');
  await world.waitForHeadingStartingWith('Paid using');
};

const chooseAccount = async (world, name) => {
  await world.clickByText('button.btn-outline-secondary', name);
  await world.waitForHeadingStartingWith('Amount paid to');
};

const enterAmount = async (world, cents) => {
  await world.typeIntoAmountInput(cents);
  await world.clickNamedButton('next');
  await world.waitForHeadingStartingWith('Category');
};

const putFullAmountInCategory = async (world, name) => {
  await world.clickByText('button.btn-outline-secondary', name);
  await world.waitForHeadingStartingWith('Review Expense');
};

const completeReview = async (world) => {
  await world.clickNamedButton('done');
  await world.waitForHeadingStartingWith('Budget');
};

When('I start a new expense', async function () {
  await startExpense(this);
});

When('I say it was paid to {string}', async function (who) {
  await sayItWasPaidTo(this, who);
});

When('I choose the {string} account', async function (name) {
  await chooseAccount(this, name);
});

When(/^I enter \$([0-9.]+) as the amount$/, async function (dollars) {
  await enterAmount(this, dollarsToCents(dollars));
});

When(
  'I put the full amount in the {string} category',
  async function (name) {
    await putFullAmountInCategory(this, name);
  }
);

When('I complete the review step', async function () {
  await completeReview(this);
});

When(
  /^I record a \$([0-9.]+) "([^"]*)" expense at "([^"]*)" from "([^"]*)"$/,
  async function (dollars, category, who, account) {
    await startExpense(this);
    await sayItWasPaidTo(this, who);
    await chooseAccount(this, account);
    await enterAmount(this, dollarsToCents(dollars));
    await putFullAmountInCategory(this, category);
    await completeReview(this);
  }
);

When('I open {string} from the budget overview', async function (name) {
  await this.openApp('/budget');
  await this.waitForHeadingStartingWith('Budget');
  await this.clickByText('.category-name a', name);
});

Then('I should see the category view for {string}', async function (name) {
  await this.waitForHeadingStartingWith(name);
});

When('I open {string} from the accounts list', async function (name) {
  await this.openApp('/accounts');
  await this.waitForHeadingStartingWith('Accounts');
  await this.clickByText('a[href^="#/account/"]', name);
});

Then('I should see the account view for {string}', async function (name) {
  await this.waitForHeadingStartingWith(name);
});

Given('I have already visited the app once', async function () {
  await this.openApp('/');
  await this.waitForServiceWorkerControl();
});

When('I lose my network connection', async function () {
  await this.page.setOfflineMode(true);
});

Then('the browser should consider the app installable', async function () {
  try {
    await this.page.waitForFunction(() => window.__installPromptFired, {
      timeout: 10000,
    });
  } catch (e) {
    throw new Error(
      'The browser never offered to install the app. It only offers once the ' +
        'manifest, an icon of at least 192px and an active service worker are ' +
        'all in place, so one of those is missing or broken.'
    );
  }
});
