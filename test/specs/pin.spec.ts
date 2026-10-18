import languagePage from '../pageobjects/language.page.js';
import pinPage from '../pageobjects/pin.page.js';
import playerPage from '../pageobjects/player.page.js';

const DATA_URL = 'https://smartcompanion-app.github.io/data-format/animals/data.json';
const PIN = '1234';

describe('PIN-protected app', () => {
  before(async () => {
    // serve the sample data with a PIN, so the guide is locked until it is entered
    const data = await (await fetch(DATA_URL)).json();
    data.pins = [PIN];
    data.checksum = 'pin';
    const mock = await browser.mock(DATA_URL);
    mock.respond(data, { headers: { 'content-type': 'application/json' } });

    await browser.url('/');
  });

  it('asks for the language first', async () => {
    await languagePage.waitForPage();
  });

  it('goes to the PIN entry page after selecting a language', async () => {
    // the /pin route must not require a valid PIN itself, otherwise it redirects
    // back to the loading page, which forwards to /pin again
    await languagePage.selectLanguageByText('ENGLISH');
    await pinPage.waitForPage();
    await browser.waitUntil(async () => (await browser.getUrl()).endsWith('#/pin'), {
      timeout: 5000,
      timeoutMsg: 'Expected to stay on the PIN entry page',
    });
    expect(await playerPage.page.isExisting()).toBe(false);
  });

  it('rejects a wrong PIN', async () => {
    await pinPage.enterPin('0000');
    await browser.waitUntil(async () => (await pinPage.getError()) !== '', { timeout: 5000, timeoutMsg: 'Expected a PIN error message' });
    expect(await playerPage.page.isExisting()).toBe(false);
  });

  it('opens the guide after entering the right PIN', async () => {
    await pinPage.enterPin(PIN);
    await playerPage.waitForPage();
  });
});
