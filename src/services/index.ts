import { Env } from '@stencil/core';
import { ServiceFacade } from "@smartcompanion/services";

const isServiceWorkerActive = () => new Promise<void>(resolve => {
  navigator.serviceWorker.getRegistration().then(registration => {
    if (registration && registration.active) {
      resolve();
    } else if (!registration) {
      console.warn("No service worker registration found.");
      resolve();
    } else {
      setTimeout(() => {        
        isServiceWorkerActive().then(resolve);
      }, 500);
    }
  });
});

const serviceFacade = new ServiceFacade();

serviceFacade.registerDefaultServices();
serviceFacade.registerCollectibleAudioPlayerService(Env.TITLE);


if (Env.OFFLINE_SUPPORT === "enabled") {
  serviceFacade.registerOfflineLoadService(
    () => fetch(Env.DATA_URL, {
      cache: "no-store",
    }).then(response => response.json()),
    (url: string) => isServiceWorkerActive().then(() => fetch(url).then(response => response.text())),
    (_: string) => Promise.resolve(),
    (_1: string, _2: string) => Promise.resolve(),
    () => Promise.resolve([]),
  )
} else {
  serviceFacade.registerOnlineLoadService(() => 
    fetch(Env.DATA_URL, {
      cache: "no-store",
    }).then(response => response.json())
  );
}

export { serviceFacade };
