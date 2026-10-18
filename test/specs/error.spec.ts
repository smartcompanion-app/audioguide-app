import errorPage from '../pageobjects/error.page.js';
import languagePage from '../pageobjects/language.page.js';

const DATA_URL = 'https://smartcompanion-app.github.io/data-format/animals/data.json';

describe('No internet connection', () => {
  let mock: WebdriverIO.Mock;

  before(async () => {
    mock = await browser.mock(DATA_URL);
    mock.abort('InternetDisconnected');

    await browser.url('/');
  });

  it('shows the error page when the data cannot be loaded', async () => {
    await errorPage.waitForPage();
    await browser.waitUntil(async () => (await browser.getUrl()).endsWith('#/error'), { timeout: 5000, timeoutMsg: 'Expected the error route' });
    expect(await errorPage.hasNoInternetIcon()).toBe(true);
  });

  it('loads the app after trying again with the connection back', async () => {
    await mock.restore();
    await errorPage.clickTryAgain();
    await languagePage.waitForPage();
    expect(await languagePage.getLanguageCount()).toBe(3);
  });
});
