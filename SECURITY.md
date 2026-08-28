# Security Policy

## Supported versions

This is a deployed application with a single line of releases, not a published library. Security fixes land in the **next release from `main`** and are not backported — there are no maintenance branches, and the release workflow only accepts tags from the current calendar year.

If you run a fork or your own deployment, upgrading is the fix, and keeping that deployment current is yours to do. The hosted example apps are redeployed from every release.

## Reporting a vulnerability

Please do not open a public issue for security problems.

Report them through [GitHub's private vulnerability reporting](https://github.com/smartcompanion-app/audioguide-app/security/advisories/new), or by email to <hello@smartcompanion.app>.

Include enough detail to reproduce the issue, plus which deployment you saw it on and the version it reports:

```js
document.querySelector('meta[name="version"]').content; // "2026.1.0", or "dev" for a local build
```

You can expect an initial response within a week.

Vulnerabilities in the underlying packages belong in [smartcompanion-library](https://github.com/smartcompanion-app/smartcompanion-library/security/advisories/new). If you are not sure which side a problem sits on, report it here and we will move it.
