class ServiceWorkerComponent {
  async waitForServiceWorkerActive(timeout = 15000): Promise<void> {
    await browser.waitUntil(
      async () => {
        const swState: string = await browser.execute(() => {
          return new Promise<string>((resolve) => {
            if (!('serviceWorker' in navigator)) {
              resolve('unsupported');
              return;
            }
            navigator.serviceWorker.getRegistration().then((reg) => {
              if (reg && reg.active) {
                resolve('activated');
              } else if (reg && reg.installing) {
                resolve('installing');
              } else if (reg && reg.waiting) {
                resolve('waiting');
              } else {
                resolve('none');
              }
            });
          });
        });
        return swState === 'activated';
      },
      { timeout, timeoutMsg: 'Service worker did not activate in time' },
    );
  }

  async isControllingPage(): Promise<boolean> {
    return browser.execute(() => {
      return navigator.serviceWorker?.controller !== null;
    });
  }

  async goOffline(): Promise<void> {
    await browser.call(async () => {
      const puppeteer = await browser.getPuppeteer();
      const pages = await puppeteer.pages();
      const cdpSession = await pages[0].createCDPSession();
      await cdpSession.send('Network.emulateNetworkConditions', {
        offline: true,
        latency: 0,
        downloadThroughput: 0,
        uploadThroughput: 0,
      });
    });
  }

  async goOnline(): Promise<void> {
    await browser.call(async () => {
      const puppeteer = await browser.getPuppeteer();
      const pages = await puppeteer.pages();
      const cdpSession = await pages[0].createCDPSession();
      await cdpSession.send('Network.emulateNetworkConditions', {
        offline: false,
        latency: 0,
        downloadThroughput: -1,
        uploadThroughput: -1,
      });
    });
  }

  async getCacheNames(): Promise<string[]> {
    return browser.execute(async () => {
      const names = await caches.keys();
      return names;
    });
  }

  async freshReload(): Promise<void> {
    await browser.execute(() => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.hash = '/';
    });
    await browser.pause(500);
    await browser.execute(() => {
      window.location.reload();
    });
  }

  async isCached(urlPattern: string): Promise<boolean> {
    return browser.execute(async (pattern: string) => {
      const names = await caches.keys();
      for (const name of names) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        for (const request of keys) {
          if (request.url.includes(pattern)) {
            return true;
          }
        }
      }
      return false;
    }, urlPattern);
  }
}

export default new ServiceWorkerComponent();
