import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  env: {
    TITLE: "Animals",
    DATA_URL: "https://smartcompanion-app.github.io/sample-data/animals/data.json",
  },
  outputTargets: [
    {
      type: 'www',
      serviceWorker: {        
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
      },
      baseUrl: 'https://myapp.local/',
    },
  ],
  plugins: [    
    sass(),
  ],
};
