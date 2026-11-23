import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WWW = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'www');
const INDEX = path.join(WWW, 'index.html');

const chunks = readdirSync(path.join(WWW, 'build')).filter(name => name.endsWith('.entry.js') && /\bas app_root\b/.test(readFileSync(path.join(WWW, 'build', name), 'utf8')));
if (chunks.length !== 1) {
  throw new Error(`Expected exactly one chunk exporting app-root, found ${chunks.length}: ${chunks.join(', ')}`);
}

const link = `<link rel="modulepreload" href="/build/${chunks[0]}">`;
const html = readFileSync(INDEX, 'utf8');
if (!html.includes(link)) {
  if (!html.includes('<script type="module"')) {
    throw new Error('No module script in www/index.html to preload the app-root chunk before');
  }
  writeFileSync(INDEX, html.replace('<script type="module"', `${link}<script type="module"`));
}
