import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

const TITLE = "Animals";
const DATA_URL = "https://smartcompanion-app.github.io/data-format/animals/data.json";
const OFFLINE_SUPPORT = process.env.OFFLINE_SUPPORT === 'true' || false;
const MESSAGING_SUPPORT = true;

// DATA_URL is either an absolute URL to data hosted elsewhere, or a path to data committed
// in this repo. In the second case the folder holding that data.json is copied into the
// build as its top-level data/ folder, and the app addresses it as "data/data.json" --
// relative to the page rather than rooted at /, so it still resolves when the app is served
// from a subpath. That is why asset URLs inside such a data.json read "data/..." as well.
const IS_LOCAL_DATA = !/^https?:\/\//i.test(DATA_URL);
const LOCAL_DATA_DIR = IS_LOCAL_DATA ? DATA_URL.replace(/\/[^/]*$/, '') : null;
const SERVED_DATA_URL = IS_LOCAL_DATA ? DATA_URL.replace(/^.*\//, 'data/') : DATA_URL;

if (IS_LOCAL_DATA) {
  // The path becomes the copy task's source, so one that is absolute or climbs out of the
  // repo would pull unrelated files into a published build -- a single typo away, and
  // invisible once deployed.
  if (/^([/\\]|[a-z]:)/i.test(DATA_URL) || DATA_URL.includes('\\') || /(^|\/)\.\.(\/|$)/.test(DATA_URL)) {
    throw new Error(`A repo-relative DATA_URL has to stay inside the repo and use forward slashes -- got "${DATA_URL}".`);
  }

  if (!LOCAL_DATA_DIR || LOCAL_DATA_DIR === DATA_URL) {
    throw new Error(`A repo-relative DATA_URL has to sit inside a folder, e.g. "customization/leon/data/data.json" -- got "${DATA_URL}".`);
  }
}

export const config: Config = {
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  env: {
    TITLE: TITLE,
    DATA_URL: SERVED_DATA_URL,
    OFFLINE_SUPPORT: OFFLINE_SUPPORT ? "enabled" : "disabled",
    MESSAGING_SUPPORT: MESSAGING_SUPPORT ? "enabled" : "disabled",
  },
  outputTargets: [
    {
      type: 'www',
      copy: LOCAL_DATA_DIR ? [{ src: `../${LOCAL_DATA_DIR}`, dest: 'data' }] : [],
      serviceWorker: OFFLINE_SUPPORT ? {
        swSrc: 'src/sw.js',
        globPatterns: [
          '**/*.{js,css,json,html,ico,png}',
          '**/list.svg',
          '**/keypad.svg',
          '**/chatbubbles.svg',
          '**/menu-outline.svg',
          '**/pause.svg',
          '**/play.svg',
          '**/play-skip-back.svg',
          '**/play-skip-forward.svg',
          '**/radio-outline.svg',
          '**/refresh-circle.svg',
          '**/backspace-outline.svg',
          '**/send-outline.svg',
        ]
      } : null,
      baseUrl: '/',
    },
  ],
  plugins: [    
    sass(),
  ],
};
