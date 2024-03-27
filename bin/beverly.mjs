#! /usr/bin/env node
import path from 'node:path';
import url from 'node:url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const rootDir = path.join(__dirname, '..');
process.chdir(rootDir);
process.env.AUTO_OPEN = '1';
await import(path.join(rootDir, 'dist', 'api', 'main.js'));
