import languagePage from '../pageobjects/language.page.js';
import playerPage from '../pageobjects/player.page.js';

describe('Player controls', () => {

  before(async () => {
    await browser.url('/');
    await languagePage.waitForPage();
    await languagePage.selectLanguageByIndex(0);
    await playerPage.waitForPage();
  });

  it('has first item active by default', async () => {
    const isActive = await playerPage.isItemActive(0);
    expect(isActive).toBe(true);
  });

  it('activates second item after clicking next', async () => {
    await playerPage.clickNext();
    await browser.waitUntil(
      async () => await playerPage.isItemActive(1),
      {
        timeout: 5000,
        timeoutMsg: 'Expected second item to become active after clicking next',
      }
    );
    const isActive = await playerPage.isItemActive(1);
    expect(isActive).toBe(true);
  });

  it('activates first item again after clicking prev', async () => {
    await playerPage.clickPrev();
    await browser.waitUntil(
      async () => await playerPage.isItemActive(0),
      {
        timeout: 5000,
        timeoutMsg: 'Expected first item to become active again after clicking prev',
      }
    );
    const isActive = await playerPage.isItemActive(0);
    expect(isActive).toBe(true);
  });

});
