import { Env } from '@stencil/core';
import { ServiceFacade } from '@smartcompanion/services';

const isServiceWorkerReady = () =>
  new Promise<void>((resolve) => {
    if (!('serviceWorker' in navigator)) {
      resolve();
      return;
    }

    navigator.serviceWorker
      .getRegistration()
      .then((registration) => {
        if (!registration) {
          console.warn('No service worker registration found.');
          resolve();
          return;
        }

        if (navigator.serviceWorker.controller) {
          resolve();
          return;
        }

        // Fallback timeout to avoid hanging indefinitely
        const timerId = setTimeout(() => {
          console.warn('Service worker controller timed out, proceeding anyway.');
          resolve();
        }, 10000);

        // Wait for the SW to take control (fires after activate + clients.claim())
        navigator.serviceWorker.addEventListener(
          'controllerchange',
          () => {
            clearTimeout(timerId);
            resolve();
          },
          { once: true },
        );
      })
      .catch(() => {
        console.warn('Service worker registration check failed, proceeding anyway.');
        resolve();
      });
  });

const serviceFacade = new ServiceFacade();

serviceFacade.registerDefaultServices();
serviceFacade.registerCollectibleAudioPlayerService(Env.TITLE);

if (Env.MESSAGING_SUPPORT === 'enabled') {
  globalThis.addEventListener('message', (event) => {  
    if (
      event?.data?.type === 'UPDATE_CSS_VARIABLES' &&
      typeof event?.data?.payload === 'object'
    ) {
      const payload = event.data.payload;

      for (const [variable, value] of Object.entries(payload)) {
        if (typeof value === 'string') {
          document.documentElement.style.setProperty(variable, value);
        }
      }
    } else if (
      event?.data?.type === 'UPDATE_MENU_IMAGE' &&
      typeof event?.data?.payload === 'string'
    ) {
      const menuImage = document.querySelector('#main-menu-image') as HTMLImageElement;
      menuImage.src = event.data.payload;
    }  
  });
}

if (Env.OFFLINE_SUPPORT === 'enabled') {
  serviceFacade.registerOfflineLoadService(
    () =>
      fetch(Env.DATA_URL)
        .then((response) => {
          if (!response.ok) throw new Error(`Data fetch failed: ${response.status}`);
          return response.json();
        })
        .catch((error) => {
          console.error('Failed to load data:', error);
          throw error;
        }),
    (url: string) =>
      isServiceWorkerReady().then(() =>
        fetch(url).then((response) => {
          if (!response.ok) throw new Error(`Asset fetch failed: ${response.status}`);
          return response.text();
        }),
      ),
    (_: string) => Promise.resolve(),
    (_1: string, _2: string) => Promise.resolve(),
    () => Promise.resolve([]),
  );
} else {
  serviceFacade.registerOnlineLoadService(() =>
    fetch(Env.DATA_URL, {
      cache: 'no-store',
    }).then((response) => response.json()),
  );
}

export { serviceFacade };
