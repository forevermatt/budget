const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

Given('the app is built and running', async function () {
  // Launch browser for the test session
  await this.launch();
});

When('I go to the home page', async function () {
  const baseUrl = 'http://localhost:5000';
  await this.goto(baseUrl + '/#/');
});

Then('I should see a heading {string}', async function (expected) {
  // The home route redirects to /budget where an <h2>Budget</h2> is rendered
  // Wait for any router navigation/rendering
  await this.page.waitForSelector('h2');
  const heading = await this.page.$eval('h2', el => el.textContent.trim());
  assert.strictEqual(heading, expected);
});
