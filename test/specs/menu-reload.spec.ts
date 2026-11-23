import languagePage from '../pageobjects/language.page.js';
import playerPage from '../pageobjects/player.page.js';
import selectionPage from '../pageobjects/selection.page.js';
import menu from '../pageobjects/menu.component.js';
import shareStub from '../pageobjects/share.component.js';

const ENGLISH_MENU = ['Overview', 'Selection', 'Change language', 'Recommend Audioguide'];

describe('Menu after a reload', () => {
  before(async () => {
    await shareStub.installStub();
    await browser.url('/');
    await shareStub.assertInstalled();
    await languagePage.waitForPage();
    await languagePage.selectLanguageByText('ENGLISH');
    await playerPage.waitForPage();
    await menu.expectLabels(ENGLISH_MENU);
  });

  it('keeps all items when reloading on the stations page', async () => {
    await browser.refresh();
    await playerPage.waitForPage();
    await menu.expectLabels(ENGLISH_MENU);
  });

  it('keeps all items when reloading on the selection page', async () => {
    await browser.url('/#/selection');
    await browser.refresh();
    await selectionPage.waitForPage();
    await menu.expectLabels(ENGLISH_MENU);
  });

  it('keeps all items when starting at the root again', async () => {
    await browser.url('about:blank');
    await browser.url('/');
    await playerPage.waitForPage();
    await menu.expectLabels(ENGLISH_MENU);
  });
});
