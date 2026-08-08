type ShareCall = {
  opts: { title?: string; text?: string; url?: string };
  menuOpenAtCall: boolean;
};

class ShareComponent {
  // Installed through WebdriverIO rather than Puppeteer's `pages[0]`. That index
  // is not reliably the page the test drives -- when it resolved to a different
  // target the stub landed in a document nobody visited, `navigator.share` stayed
  // the real one, and the spec failed with "navigator.share was not called".
  async installStub(): Promise<void> {
    await browser.addInitScript(() => {
      (window as any).__shareCalls = [];
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
    });
  }

  // Fail loudly when the stub is missing. Without this the spec reports
  // "navigator.share was not called", which reads as an app bug rather than as
  // the harness never having stubbed anything.
  async assertInstalled(): Promise<void> {
    const installed = await browser.execute(() => Array.isArray((window as any).__shareCalls));
    if (!installed) {
      throw new Error('share stub is not installed in the current document - navigator.share is the real implementation, so this run proves nothing');
    }
  }

  async getCalls(): Promise<ShareCall[]> {
    const calls = await browser.execute(() => (window as any).__shareCalls);
    if (!Array.isArray(calls)) {
      throw new Error('share stub is not installed in the current document');
    }
    return calls;
  }

  async reset(): Promise<void> {
    await browser.execute(() => {
      (window as any).__shareCalls = [];
    });
  }
}

export default new ShareComponent();
