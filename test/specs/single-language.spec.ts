import playerPage from '../pageobjects/player.page.js';
import selectionPage from '../pageobjects/selection.page.js';
import menu from '../pageobjects/menu.component.js';

const DATA_URL = 'https://smartcompanion-app.github.io/data-format/animals/data.json';

async function hasLanguageMenuItem(): Promise<boolean> {
  await menu.open();
  // let a pending menu update render before looking
  await browser.pause(500);
  return $('ion-menu ion-icon[name="chatbubbles"]').isExisting();
}

describe('Single-language app', () => {
  before(async () => {
    // serve the sample data with only one language, like an app such as leon
    const data = await (await fetch(DATA_URL)).json();
    data.languages = data.languages.filter((l: { language: string }) => l.language === 'en');
    data.checksum = 'single-language';
    const mock = await browser.mock(DATA_URL);
    mock.respond(data, { headers: { 'content-type': 'application/json' } });

    await browser.url('/');
    await playerPage.waitForPage();
    await menu.waitForMenuVisible();
  });

  it('hides the language menu item', async () => {
    expect(await hasLanguageMenuItem()).toBe(false);
  });

  it('keeps it hidden when reloading on a route other than /stations/default', async () => {
    // a reload goes through the loading page, which forwards to the pending
    // route instead of /stations/default
    await browser.url('/#/selection');
    await browser.refresh();
    await selectionPage.waitForPage();
    await menu.waitForMenuVisible();
    expect(await hasLanguageMenuItem()).toBe(false);
  });
});
