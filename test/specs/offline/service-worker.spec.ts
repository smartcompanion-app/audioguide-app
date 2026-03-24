import languagePage from '../../pageobjects/language.page.js';
import playerPage from '../../pageobjects/player.page.js';
import sw from '../../pageobjects/serviceworker.component.js';

describe('Service Worker Offline Support', () => {
  afterEach(async () => {
    await sw.goOnline();
  });

  describe('Registration and activation', () => {
    it('registers and activates the service worker on first load', async () => {
      await browser.url('/');
      await languagePage.waitForPage();
      await sw.waitForServiceWorkerActive(30000);
      const isControlling = await sw.isControllingPage();
      expect(isControlling).toBe(true);
    });

    it('creates precache', async () => {
      const cacheNames = await sw.getCacheNames();
      expect(cacheNames.length).toBeGreaterThan(0);

      const hasPrecache = cacheNames.some((n: string) => n.includes('precache'));
      expect(hasPrecache).toBe(true);
    });
  });

  describe('Online mode with SW enabled', () => {
    it('loads app and shows language page', async () => {
      await browser.url('/');
      await languagePage.waitForPage();
      const count = await languagePage.getLanguageCount();
      expect(count).toBe(3);
    });

    it('navigates through the app normally', async () => {
      await languagePage.selectLanguageByIndex(0);
      await playerPage.waitForPage();
    });
  });

  describe('Offline mode', () => {
    before(async () => {
      // Reset hash router state and reload so the SW intercepts all requests
      await sw.freshReload();
      await languagePage.waitForPage();
      await browser.pause(2000);
    });

    it('caches data.json after SW-controlled load', async () => {
      const isCached = await sw.isCached('data.json');
      expect(isCached).toBe(true);
    });

    it('loads app from cache when offline', async () => {
      await sw.goOffline();

      await sw.freshReload();
      await languagePage.waitForPage();

      const count = await languagePage.getLanguageCount();
      expect(count).toBe(3);
    });

    it('navigates through cached app while offline', async () => {
      await sw.goOffline();

      await sw.freshReload();
      await languagePage.waitForPage();
      await languagePage.selectLanguageByIndex(0);
      await playerPage.waitForPage();
    });
  });
});
