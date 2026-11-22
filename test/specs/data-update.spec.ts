import languagePage from '../pageobjects/language.page.js';
import playerPage from '../pageobjects/player.page.js';

const DATA_URL = 'https://smartcompanion-app.github.io/data-format/animals/data.json';

type Station = { id: string; language: string; audios: string[]; images: string[] };
type Data = { checksum: string; stations: Station[]; assets: { id: string }[] };

function withoutStations(data: Data, checksum: string, remove: (station: Station) => boolean): Data {
  const stations = data.stations.filter(station => !remove(station));
  const referenced = new Set(stations.flatMap(station => [...station.audios, ...station.images]));
  return { ...data, checksum, stations, assets: data.assets.filter(asset => referenced.has(asset.id)) };
}

async function expectTitles(titles: string[]) {
  await playerPage.waitForPage();
  await browser.waitUntil(async () => JSON.stringify(await playerPage.getItemTitles()) === JSON.stringify(titles), {
    timeout: 10000,
    timeoutMsg: `Expected the stations ${JSON.stringify(titles)}, got ${JSON.stringify(await playerPage.getItemTitles())}`,
  });
}

describe('Data updated on the server', () => {
  let original: Data;
  let served: Data;

  before(async () => {
    original = await (await fetch(DATA_URL)).json();
    const mock = await browser.mock(DATA_URL);
    mock.respond(() => served, { headers: { 'content-type': 'application/json' } });
  });

  beforeEach(async () => {
    served = { ...original, checksum: `initial-${Date.now()}` };
    await browser.url('/');
    await browser.execute(() => localStorage.clear());
    await browser.refresh();
    await languagePage.waitForPage();
    await languagePage.selectLanguageByText('ENGLISH');
    await expectTitles(['Bear', 'Elephant', 'Lion']);
  });

  it('no longer lists a deleted station', async () => {
    served = withoutStations(original, 'deleted-station', station => station.id === 's2');
    await browser.url('/');
    await expectTitles(['Bear', 'Lion']);
  });

  it('opens the first station for a link to a deleted station', async () => {
    served = withoutStations(original, 'deleted-station', station => station.id === 's2');
    await browser.url('/');
    await expectTitles(['Bear', 'Lion']);
    await browser.url('/#/stations/s2');
    await browser.waitUntil(async () => (await browser.getUrl()).endsWith('#/stations/s2'), { timeout: 5000, timeoutMsg: 'Expected the station route' });
    await expectTitles(['Bear', 'Lion']);
    expect(await playerPage.isItemActive(0)).toBe(true);
  });

  it('lists no stations of a language whose stations were all deleted', async () => {
    served = withoutStations(original, 'deleted-language-stations', station => station.language === 'en');
    await browser.url('/');
    await expectTitles([]);
  });
});
