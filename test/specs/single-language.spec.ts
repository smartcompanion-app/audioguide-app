import playerPage from '../pageobjects/player.page.js';
import selectionPage from '../pageobjects/selection.page.js';
import menu from '../pageobjects/menu.component.js';
import shareStub from '../pageobjects/share.component.js';

const DATA_URL = 'https://smartcompanion-app.github.io/data-format/animals/data.json';

const MENU_WITHOUT_LANGUAGE = ['Overview', 'Selection', 'Recommend Audioguide'];

describe('Single-language app', () => {
  before(async () => {
    // serve the sample data with only one language, like an app such as leon
    const data = await (await fetch(DATA_URL)).json();
    data.languages = data.languages.filter((l: { language: string }) => l.language === 'en');
    data.checksum = 'single-language';
    const mock = await browser.mock(DATA_URL);
    mock.respond(data, { headers: { 'content-type': 'application/json' } });

    await shareStub.installStub();
    await browser.url('/');
    await shareStub.assertInstalled();
    await playerPage.waitForPage();
    await menu.waitForMenuVisible();
  });

  it('hides the language menu item', async () => {
    await menu.expectLabels(MENU_WITHOUT_LANGUAGE);
  });

  it('keeps it hidden when reloading on a route other than /stations/default', async () => {
    await browser.url('/#/selection');
    await browser.refresh();
    await selectionPage.waitForPage();
    await menu.expectLabels(MENU_WITHOUT_LANGUAGE);
  });
});
