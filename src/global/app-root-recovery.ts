import { setErrorHandler } from '@stencil/core';

const MAX_RETRIES = 2;
const RETRY_DELAY = 500;

const showReloadButton = () => {
  const button = document.createElement('button');
  button.id = 'app-reload';
  button.type = 'button';
  button.textContent = '↻';
  button.setAttribute('aria-label', 'Reload');
  button.addEventListener('click', () => window.location.reload());
  document.body.append(button);
};

export const recoverAppRoot = () => {
  let retries = 0;
  let pending = false;

  setErrorHandler((error, element) => {
    console.error(error, element);

    if (pending || element?.localName !== 'app-root' || element.childElementCount > 0) {
      return;
    }

    pending = true;
    setTimeout(() => {
      pending = false;

      if (retries < MAX_RETRIES) {
        retries++;
        document.body.append(element);
      } else {
        showReloadButton();
      }
    }, RETRY_DELAY);
  });
};
