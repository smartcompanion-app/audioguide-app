#!/usr/bin/env node
// Prints one version's section of CHANGELOG.md, for use as a GitHub release
// body. Changesets tags private packages but does not create a GitHub release
// for them (changesets/changesets#1689), and the deploy triggers on
// `release: published` -- so the release has to be created by hand, with the
// notes changesets already wrote rather than a second, drifting copy.
//
// Sections run from `## <version>` to the next `## ` heading or end of file.

import { readFileSync } from 'node:fs';

const version = process.argv[2];

if (!version) {
  console.error('usage: changelog-section.mjs <version>');
  process.exit(1);
}

const lines = readFileSync('CHANGELOG.md', 'utf8').split('\n');
const start = lines.findIndex(line => line.trim() === `## ${version}`);

if (start === -1) {
  console.error(`No "## ${version}" heading in CHANGELOG.md`);
  process.exit(1);
}

const rest = lines.slice(start + 1);
const next = rest.findIndex(line => line.startsWith('## '));
const body = (next === -1 ? rest : rest.slice(0, next)).join('\n').trim();

if (!body) {
  console.error(`The "## ${version}" section of CHANGELOG.md is empty`);
  process.exit(1);
}

process.stdout.write(`${body}\n`);
