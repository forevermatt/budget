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

When('I start a new expense', async function () {
  await this.openApp('/expense/new');
  await this.page.waitForSelector('#who');
});

When('I say it was paid to {string}', async function (who) {
  await this.page.type('#who', who);
  await this.clickNamedButton('next');
  await this.waitForHeadingStartingWith('Paid using');
});

When('I choose the {string} account', async function (name) {
  await this.clickByText('button.btn-outline-secondary', name);
  await this.waitForHeadingStartingWith('Amount paid to');
});

When(/^I enter \$([0-9.]+) as the amount$/, async function (dollars) {
  await this.typeIntoAmountInput(dollarsToCents(dollars));
  await this.clickNamedButton('next');
  await this.waitForHeadingStartingWith('Category');
});

When(
  'I put the full amount in the {string} category',
  async function (name) {
    await this.clickByText('button.btn-outline-secondary', name);
    await this.waitForHeadingStartingWith('Review Expense');
  }
);

When('I complete the review step', async function () {
  await this.clickNamedButton('done');
  await this.waitForHeadingStartingWith('Budget');
});

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
