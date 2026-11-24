import languagePage from '../pageobjects/language.page.js';

async function findAppRootChunk(): Promise<string> {
  const html = await (await fetch(browser.options.baseUrl as string)).text();
  const chunk = /rel="modulepreload" href="\/build\/(p-[\w-]+\.entry\.js)"/.exec(html)?.[1];
  if (!chunk) {
    throw new Error('index.html does not preload the app-root chunk');
  }
  return chunk;
}

describe('App chunk that fails to load', () => {
  let chunk: string;

  before(async () => {
    chunk = await findAppRootChunk();
  });

  it('is loaded again without a reload', async () => {
    const mock = await browser.mock(`**/build/${chunk}*`);
    mock.abortOnce();
    mock.abortOnce();
    await browser.url('/');
    await languagePage.waitForPage();
    await mock.restore();
    const requests = await browser.execute(() => performance.getEntriesByType('resource').map(entry => entry.name));
    expect(requests.some(url => url.includes(`${chunk}?s-retry=`))).toBe(true);
    expect(await languagePage.getLanguageCount()).toBe(3);
    expect(await $('#app-reload').isExisting()).toBe(false);
  });

  it('offers a reload when it keeps failing, which starts the app', async () => {
    const mock = await browser.mock(`**/build/${chunk}*`);
    mock.abort();
    await browser.url('/');
    await $('#app-reload').waitForDisplayed({ timeout: 15000 });
    await mock.restore();
    await $('#app-reload').click();
    await languagePage.waitForPage();
    expect(await $('#app-reload').isExisting()).toBe(false);
  });
});
