import fonts from '../../pageobjects/fonts.component.js';
import languagePage from '../../pageobjects/language.page.js';
import sw from '../../pageobjects/serviceworker.component.js';

const FONT_FILE = 'assets/fonts/Lobster-Regular.ttf';

describe('Custom fonts', () => {
  before(async () => {
    await browser.url('/');
    await languagePage.waitForPage();
  });

  describe('Font folder', () => {
    it('sets the font family on the document', async () => {
      expect(await fonts.getDocumentFontFamily()).toBe('Lobster, cursive');
    });

    it('applies the font family inside the components', async () => {
      expect(await fonts.getLanguageButtonFontFamily()).toBe('Lobster, cursive');
    });

    it('loads the font file copied from the font folder', async () => {
      expect(await fonts.isServed(FONT_FILE)).toBe(true);
      expect(await fonts.loadFont('Lobster')).toBe(true);
    });
  });

  describe('Google Fonts', () => {
    it('loads a font imported by the font stylesheet', async () => {
      expect(await fonts.loadFont('Pacifico')).toBe(true);
    });
  });

  describe('Offline', () => {
    before(async () => {
      await sw.waitForServiceWorkerActive(30000);
      await sw.freshReload();
      await languagePage.waitForPage();
      await fonts.loadFont('Pacifico');
      await browser.waitUntil(async () => (await sw.isCached('https://fonts.googleapis.com/')) && (await sw.isCached('https://fonts.gstatic.com/')), {
        timeout: 30000,
        timeoutMsg: 'Google Fonts were not cached by the service worker within 30s',
      });
    });

    afterEach(async () => {
      await sw.goOnline();
    });

    it('precaches the font file', async () => {
      expect(await sw.isCached(FONT_FILE, 'precache')).toBe(true);
    });

    it('loads both fonts from the cache when offline', async () => {
      await sw.goOffline();
      await sw.freshReload();
      await languagePage.waitForPage();
      expect(await fonts.getDocumentFontFamily()).toBe('Lobster, cursive');
      expect(await fonts.loadFont('Lobster')).toBe(true);
      expect(await fonts.loadFont('Pacifico')).toBe(true);
    });
  });
});
