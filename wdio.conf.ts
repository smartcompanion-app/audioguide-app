import { join } from 'node:path';
import type { Options } from '@wdio/types';

const chromeArgs = process.env.CI
  ? ['--headless', '--disable-gpu', '--disable-web-security', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800']
  : ['--auto-open-devtools-for-tabs', '--disable-web-security', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800'];

export const config: Options.Testrunner = {
  runner: 'local',
  specs: ['./test/specs/**/*.spec.ts'],
  exclude: [],
  tsConfigPath: './test/tsconfig.json',

  maxInstances: 1,
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: chromeArgs,
    },
  }],

  framework: 'mocha',
  mochaOpts: { ui: 'bdd', timeout: 60000 },

  reporters: ['spec'],
  logLevel: 'error',

  services: [[
    'static-server',
    {
      folders: [{ mount: '/', path: join(__dirname, 'www') }],
      port: 4567,
    },
  ]],

  baseUrl: 'http://localhost:4567',
  waitforTimeout: 30000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
};
