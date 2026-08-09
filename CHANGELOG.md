# smartcompanion-audioguide-app

## 2026.1.0

### Minor Changes

- [#43](https://github.com/smartcompanion-app/audioguide-app/pull/43) [`303d190`](https://github.com/smartcompanion-app/audioguide-app/commit/303d19015a7a20182bf2f17f6ee4eae2d617ae52) Thanks [@stefanhuber](https://github.com/stefanhuber)! - Release through changesets, with CalVer versions that keep the year.

  Versions are `YYYY.MINOR.MICRO` — the [CalVer scheme](https://calver.org/) PyCharm and Unity use, and valid semver, which is what lets changesets drive it without any custom scripting. The year is the only calendar claim; the trailing two components are plain sequences, so nothing can drift out of step with the date the way a month component would.

  `major` now means "new year" rather than "breaking", so breaking changes are described in the changelog prose instead of being signalled by a number. That is the more useful half of the signal anyway: a forker cannot act on an incremented integer, but can act on "the engraft variable `x` was renamed to `y`".

  Each build now carries the version in a `version` meta tag, so a running app can say which build it is:

  ```js
  document.querySelector('meta[name="version"]').content; // "2026.1.0"
  ```

  The release workflow also takes a `workflow_dispatch` ref, so a bad release can be rolled back by redeploying a known-good tag rather than only by cutting a new one.
