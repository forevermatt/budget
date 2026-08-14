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
