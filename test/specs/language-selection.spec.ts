import languagePage from '../pageobjects/language.page.js';
import playerPage from '../pageobjects/player.page.js';
import menu from '../pageobjects/menu.component.js';

describe('Language selection', () => {

  before(async () => {
    await browser.url('/');
    await languagePage.waitForPage();
  });

  it('shows 3 language options', async () => {
    const count = await languagePage.getLanguageCount();
    expect(count).toBe(3);
  });

  it('selects Deutsch and navigates to player page', async () => {
    await languagePage.selectLanguageByIndex(0);
    await playerPage.waitForPage();
    await menu.waitForMenuVisible();
  });

  it('shows German menu labels after selecting Deutsch', async () => {
    const label = await menu.getMenuItemLabel(0);
    expect(label).toBe('Übersicht');
  });

  it('navigates back to language page via menu', async () => {
    await menu.clickLanguage();
    await languagePage.waitForPage();
  });

  it('selects English and shows English menu labels', async () => {
    await languagePage.selectLanguageByIndex(1);
    await playerPage.waitForPage();
    await menu.waitForMenuVisible();
    const label = await menu.getMenuItemLabel(0);
    expect(label).toBe('Overview');
  });

});
