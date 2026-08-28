# Contributing

This guide covers working on the SmartCompanion Audioguide App — the shell application that ties the [`@smartcompanion/*` packages](https://github.com/smartcompanion-app/smartcompanion-library) together into a deployable PWA.

Taking part in this project — issues, discussions, pull requests — means following our [Code of Conduct](CODE_OF_CONDUCT.md).

## Where a change belongs

This repository is the shell: one Stencil component (`src/components/app-root`), the routing and menu wiring, the global styles, the service worker, and the engraft customization template. Almost everything a visitor sees — the pages, the player controls, the station list, the data layer — lives in [smartcompanion-library](https://github.com/smartcompanion-app/smartcompanion-library) and arrives here as a dependency.

If your change is to a page or a service, it belongs there. If it is to the app shell, the build, the customization surface or the deployment, it belongs here.

## Developing

### Local setup

1. Fork and clone the repo.
1. Install the dependencies.

    ```shell
    npm install
    ```

1. Start the dev server.

    ```shell
    npm start
    ```

    Stencil serves the app at <http://localhost:3333> and rebuilds on save.

`npm install` also sets up a [husky](https://typicode.github.io/husky/) pre-commit hook that runs Prettier over staged files under `src` and `test`, so formatting is fixed before it can reach CI.

### Scripts

#### `npm start`

Stencil dev server with hot reload (`stencil build --dev --watch --serve`).

#### `npm run build` / `npm run build:offline`

Production build into `www/`. The `:offline` variant sets `OFFLINE_SUPPORT=true`, which is what makes [`stencil.config.ts`](stencil.config.ts) attach the Workbox `serviceWorker` config to the `www` output target. Without it no service worker is generated at all, so an offline bug can only ever reproduce against the offline build.

#### `npm test` / `npm run test:offline`

Both build first, then run WebdriverIO — see [Testing](#testing).

#### `npm run test:dev`

Runs the same specs against an already-running `npm start` (`--baseUrl=http://localhost:3333`), which skips the build and is the fast loop while iterating on a spec. It is not a watch mode; each invocation runs once.

#### `npm run lint` / `npm run format` / `npm run format:check`

ESLint over `src` and `test`, and Prettier in write or check mode. CI runs `lint` and `format:check`; `format` is the one that rewrites files.

## Testing

The suite is WebdriverIO with Mocha, driving Chrome through `puppeteer-core`. The configuration is [`wdio.conf.ts`](wdio.conf.ts); specs live in `test/specs` and the page objects they drive in `test/pageobjects`.

There are two modes, and they do not overlap:

| Command | Specs | Server | Build |
| --- | --- | --- | --- |
| `npm test` | `test/specs/**` except `offline/` | static server on `:4567` | `npm run build` |
| `npm run test:offline` | `test/specs/offline/**` only | static server on `:4568` | `npm run build:offline` |

`TEST_OFFLINE=true` is what flips `wdio.conf.ts` between them. The offline specs run **only** under `test:offline` — a plain `npm test` never touches `test/specs/offline/service-worker.spec.ts`. CI runs both, so run both before pushing.

The non-offline run passes `--disable-web-security` to Chrome; the offline run deliberately does not, because the service worker needs a normal origin to register against.

## Customization and variants

Customization goes through [engraft](https://github.com/smartcompanion-app/engraft). [`engraft.template.yml`](engraft.template.yml) declares every variable a fork can set, and a values file fills them in:

```shell
npx engraft apply --template engraft.template.yml --values customization/leon/engraft.variables.yml
```

The variables are documented in the [README](README.md#customization).

Two things follow from this that are easy to miss:

- The release workflow builds **two** variants — the default *animals* app and *leon* from [`customization/leon/`](customization/leon/) — and deploys both. A change that only works for the default app breaks the deploy.
- engraft rewrites `src/index.html` through an HTML parser. If you add markup there, check it survives an engraft pass; the release workflow re-verifies the `version` meta tag afterwards for exactly this reason.

## Releasing

Releases run on [changesets](https://github.com/changesets/changesets). Versions are CalVer (`YYYY.MINOR.MICRO`) — see [Versioning](README.md#versioning) in the README for what the bump levels mean.

1. **Add a changeset with your change.** Anything that alters behaviour needs one:

    ```shell
    npx changeset
    ```

    Pick the bump level and describe the change for the people who will read the release notes — the text lands verbatim in `CHANGELOG.md`. Commit the generated file in `.changeset/` with your pull request.

    Changes that ship nothing — CI config, docs, tooling — do not need one.

    Once a year the first release of the new year needs a `major` changeset. The `release` workflow refuses to deploy a tag whose year does not match the current one, so forgetting fails loudly rather than quietly shipping `2026.x` into 2027.

2. **Merge to `main`.** The [`changesets`](.github/workflows/changesets.yml) workflow collects all pending changesets into a `chore: release` pull request that applies the version bump and writes the changelog.

3. **Merge the `chore: release` pull request.** That tags the release and creates the GitHub release, which triggers [`release.yml`](.github/workflows/release.yml): it re-runs both test suites, stamps the version into the `version` meta tag, builds the *animals* and *leon* variants and deploys them to GitHub Pages.

   Nothing is published to npm — the package is private.

   > The workflow needs the organization's `RELEASE_TOKEN` secret. A release created with the default `GITHUB_TOKEN` does not trigger other workflows, so the deploy never fires; the workflow prints a warning when the token is missing. If that happens, deploy by hand from **Actions → release → Run workflow**.

### Rolling back

Run the `release` workflow manually (**Actions → release → Run workflow**) and give it the tag to redeploy. This rebuilds from that ref rather than re-serving a stored artifact, and browsers holding a cached service worker pick the change up on their next activation — so it is a fix-forward lever, not an instant kill switch.

## Pull requests

Run the full gate before pushing:

```shell
npm run lint && npm run format:check && npm test && npm run test:offline
```

The pull request template lists the same checks plus the changeset. CI runs them on every pull request.
