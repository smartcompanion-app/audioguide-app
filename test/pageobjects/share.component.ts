type ShareCall = {
  opts: { title?: string; text?: string; url?: string };
  menuOpenAtCall: boolean;
};

class ShareComponent {
  async installStub(): Promise<void> {
    await browser.call(async () => {
      const puppeteer = await browser.getPuppeteer();
      const pages = await puppeteer.pages();
      await pages[0].evaluateOnNewDocument(() => {
        (window as any).__shareCalls = [];
        try {
          Object.defineProperty(navigator, 'share', {
            configurable: true,
            value: async (opts: { title?: string; text?: string; url?: string }) => {
              const menu = document.querySelector('ion-menu') as any;
              let menuOpenAtCall = false;
              if (menu && typeof menu.isOpen === 'function') {
                try {
                  menuOpenAtCall = await menu.isOpen();
                } catch {
                  menuOpenAtCall = false;
                }
              }
              (window as any).__shareCalls.push({ opts, menuOpenAtCall });
            },
          });
          Object.defineProperty(navigator, 'canShare', {
            configurable: true,
            value: () => true,
          });
        } catch {
          // navigator.share already defined as non-configurable; ignore.
        }
      });
    });
  }

  async getCalls(): Promise<ShareCall[]> {
    return browser.execute(() => (window as any).__shareCalls || []);
  }

  async reset(): Promise<void> {
    await browser.execute(() => {
      (window as any).__shareCalls = [];
    });
  }
}

export default new ShareComponent();
