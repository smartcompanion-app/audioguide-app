import languagePage from '../pageobjects/language.page.js';
import playerPage from '../pageobjects/player.page.js';

const DATA_URL = 'https://smartcompanion-app.github.io/data-format/animals/data.json';

async function seedOtherApp(checksum: string): Promise<Record<string, string>> {
  const content: Record<string, string> = {
    'checksum': `strg:${checksum}`,
    'language': 'strg:de',
    'languages': `json:${JSON.stringify([{ language: 'de', title: 'Deutsch' }])}`,
    'stations-de': 'json:[]',
    'pins': 'json:["1234"]',
  };
  const entries = Object.fromEntries(Object.entries(content).flatMap(([key, value]) => ['', 'sc-00000000:'].map(prefix => [prefix + key, value])));
  await browser.execute(items => Object.entries(items).forEach(([key, value]) => localStorage.setItem(key, value)), entries);
  return entries;
}

async function readStorage(): Promise<Record<string, string>> {
  return browser.execute(() => ({ ...localStorage }) as unknown as Record<string, string>);
}

async function expectTitles(titles: string[]) {
  await playerPage.waitForPage();
  await browser.waitUntil(async () => JSON.stringify(await playerPage.getItemTitles()) === JSON.stringify(titles), { timeout: 10000 }).catch(() => undefined);
  expect(await playerPage.getItemTitles()).toEqual(titles);
}

describe('Another app on the same origin', () => {
  let otherApp: Record<string, string>;

  before(async () => {
    const { checksum } = await (await fetch(DATA_URL)).json();
    await browser.url('/');
    await browser.execute(() => localStorage.clear());
    otherApp = await seedOtherApp(checksum);
    await browser.url('about:blank');
    await browser.url('/');
  });

  it('does not choose the language of the app', async () => {
    await languagePage.waitForPage();
    expect(await languagePage.getLanguageCount()).toBe(3);
    await languagePage.selectLanguageByText('ENGLISH');
    await expectTitles(['Bear', 'Elephant', 'Lion']);
  });

  it('keeps its own data', async () => {
    const storage = await readStorage();
    expect(storage).toEqual(expect.objectContaining(otherApp));
    const ownKeys = Object.keys(storage).filter(key => !(key in otherApp));
    expect(ownKeys.length).toBeGreaterThan(0);
    const prefixes = new Set(ownKeys.map(key => /^sc-[0-9a-f]{8}:/.exec(key)?.[0]));
    expect(prefixes.size).toBe(1);
    expect(prefixes.has(undefined)).toBe(false);
  });

  it('does not change the language when it is used in between', async () => {
    await seedOtherApp('changed');
    await browser.url('about:blank');
    await browser.url('/');
    await expectTitles(['Bear', 'Elephant', 'Lion']);
  });
});
