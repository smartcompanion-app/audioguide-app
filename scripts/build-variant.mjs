// Builds the app as customized by a values file, without touching the repo: the repo is
// copied to .variants/<name>/, the values are applied there with engraft, and the copy is
// built with offline support. Used by the e2e specs of customizations that only a build
// can show, such as fonts.
//
//   node scripts/build-variant.mjs test/fixtures/fonts

import { execFileSync } from 'node:child_process';
import { cpSync, readdirSync, rmSync, symlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIPPED = new Set(['node_modules', 'www', '.git', '.variants', '.stencil', '.pwa-assets']);

const fixture = process.argv[2];
if (!fixture) {
  throw new Error('Usage: node scripts/build-variant.mjs <folder holding an engraft.variables.yml>');
}

const target = path.join(ROOT, '.variants', path.basename(fixture));
rmSync(target, { recursive: true, force: true });
for (const entry of readdirSync(ROOT)) {
  if (!SKIPPED.has(entry)) {
    cpSync(path.join(ROOT, entry), path.join(target, entry), { recursive: true });
  }
}
symlinkSync(path.join(ROOT, 'node_modules'), path.join(target, 'node_modules'), 'dir');

const run = (command, args) => execFileSync(command, args, { cwd: target, stdio: 'inherit' });
run('npx', ['engraft', 'apply', '--template', 'engraft.template.yml', '--values', path.join(fixture, 'engraft.variables.yml')]);
run('npm', ['run', 'build:offline']);
