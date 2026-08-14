const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

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
