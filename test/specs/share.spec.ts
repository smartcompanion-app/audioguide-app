import languagePage from '../pageobjects/language.page.js';
import playerPage from '../pageobjects/player.page.js';
import menu from '../pageobjects/menu.component.js';
import shareStub from '../pageobjects/share.component.js';

describe('Share app', () => {
  before(async () => {
    await shareStub.installStub();
    await browser.url('/');
    await languagePage.waitForPage();
    await languagePage.selectLanguageByText('ENGLISH');
    await playerPage.waitForPage();
    await menu.waitForMenuVisible();
  });

  it('shows the localized share menu item', async () => {
    const label = await menu.getMenuItemLabel(3);
    expect(label).toBe('Recommend Audioguide');
  });

  it('closes the menu and invokes navigator.share with the configured URL', async () => {
    await shareStub.reset();
    await menu.clickShare();
    await browser.waitUntil(
      async () => (await shareStub.getCalls()).length === 1,
      { timeout: 5000, timeoutMsg: 'navigator.share was not called' },
    );
    const [call] = await shareStub.getCalls();
    expect(call.opts.url).toBe('https://smartcompanion-app.github.io/audioguide-app/animals/');
    expect(call.opts.title).toBe('Recommend Audioguide');
    expect(call.menuOpenAtCall).toBe(false);
  });
});
