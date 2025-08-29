const { setWorldConstructor } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');

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

  async goto(url) {
    await this.page.goto(url, { waitUntil: 'networkidle0' });
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
