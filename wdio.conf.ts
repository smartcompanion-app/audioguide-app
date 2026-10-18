import { join } from 'node:path';

const isOffline = process.env.TEST_OFFLINE === 'true';
const isFonts = process.env.TEST_FONTS === 'true';
const port = isOffline ? 4568 : isFonts ? 4569 : 4567;

const baseChromeArgs = process.env.CI
  ? ['--headless', '--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800']
  : ['--auto-open-devtools-for-tabs', '--no-sandbox', '--disable-dev-shm-usage', '--window-size=1280,800'];

const chromeArgs = isOffline || isFonts
  ? baseChromeArgs
  : [...baseChromeArgs, '--disable-web-security'];

export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: isOffline
    ? ['./test/specs/offline/**/*.spec.ts']
    : isFonts
      ? ['./test/specs/fonts/**/*.spec.ts']
      : ['./test/specs/**/*.spec.ts'],
  exclude: isOffline || isFonts ? [] : ['./test/specs/offline/**', './test/specs/fonts/**'],
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
      folders: [{ mount: '/', path: isFonts ? join(__dirname, '.variants', 'fonts', 'www') : join(__dirname, 'www') }],
      port,
    },
  ]],

  baseUrl: `http://localhost:${port}`,
  waitforTimeout: 30000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
};
