const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

When('I go to the accounts page', async function () {
  const baseUrl = 'http://localhost:5000';
  await this.goto(baseUrl + '/#/accounts');
});

Then('I should see the {string} heading', async function (expectedHeading) {
  // Wait for page to load and find the heading
  await this.page.waitForSelector('h2');
  const heading = await this.page.$eval('h2', el => el.textContent.trim());
  assert.strictEqual(heading, expectedHeading);
});

Then('I should see an {string} link', async function (linkText) {
  await this.page.waitForSelector('a');
  const link = await this.page.$eval(`a[href*="account/new"]`, el => el.textContent.trim());
  assert.strictEqual(link, linkText);
});

When('I click on {string}', async function (linkText) {
  await this.page.waitForSelector('a');
  await this.page.click(`a[href*="account/new"]`);
  // Wait for navigation
  await this.page.waitForSelector('h2');
});

When('I enter {string} as the account name', async function (accountName) {
  await this.page.waitForSelector('input.form-control');
  await this.page.type('input.form-control', accountName);
});

When('I click the done button', async function () {
  // The done button has an id="button-done"
  await this.page.waitForSelector('#button-done');
  await this.page.click('#button-done');
  // Wait for navigation back to accounts page by waiting for the accounts heading
  await this.page.waitForFunction(() => {
    const heading = document.querySelector('h2');
    return heading && heading.textContent.trim() === 'Accounts';
  }, { timeout: 5000 });
});

Then('I should be redirected to the accounts page', async function () {
  // Wait for the accounts page to load
  await this.page.waitForSelector('h2');
  const heading = await this.page.$eval('h2', el => el.textContent.trim());
  assert.strictEqual(heading, 'Accounts');
});

Then('I should see {string} in the accounts list', async function (accountName) {
  // Wait for the accounts to be listed (there should be at least one button now)
  await this.page.waitForSelector('.btn.btn-outline-secondary', { timeout: 5000 });
  
  // Get all account buttons and check if our account is there
  const accountButtons = await this.page.$$eval('.btn.btn-outline-secondary', 
    buttons => buttons.map(btn => btn.textContent.trim())
  );
  
  const accountExists = accountButtons.some(name => name === accountName);
  assert.strictEqual(accountExists, true, `Account "${accountName}" not found in accounts list. Found: ${accountButtons.join(', ')}`);
});

Then('I should not see any existing accounts initially', async function () {
  // Check that there are no account buttons (no .btn.btn-outline-secondary elements)
  const accountButtons = await this.page.$$('.btn.btn-outline-secondary');
  assert.strictEqual(accountButtons.length, 0, 'Expected no accounts initially, but found some');
});