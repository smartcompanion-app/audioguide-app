import languagePage from '../pageobjects/language.page.js';
import playerPage from '../pageobjects/player.page.js';
import menu from '../pageobjects/menu.component.js';
import selectionPage from '../pageobjects/selection.page.js';

describe('Station selection via numpad', () => {

  before(async () => {
    await browser.url('/');
    await languagePage.waitForPage();
    await languagePage.selectLanguageByIndex(0);
    await playerPage.waitForPage();
    await menu.waitForMenuVisible();
  });

  it('navigates to selection page via menu', async () => {
    await menu.clickSelection();
    await selectionPage.waitForPage();
  });

  it('enters station number and confirms', async () => {
    await selectionPage.pressNumber(2);
    await selectionPage.pressConfirm();
    await playerPage.waitForPage();
    await browser.waitUntil(
      async () => await playerPage.isItemActive(1),
      {
        timeout: 5000,
        timeoutMsg: 'Expected station 1 to become active after confirmation',
      },
    );
    const isActive = await playerPage.isItemActive(1);
    expect(isActive).toBe(true);
  });

});
