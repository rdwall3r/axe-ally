#!/usr/bin/env node
import 'dotenv/config';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { scanUrl } from '../lib/scan-url.js';
import { normalizeUrl } from '../lib/helpers.js';

const rl = createInterface({ input, output });
const userInput = await rl.question('Which URL would you like to scan? ');
rl.close();

const url = normalizeUrl(userInput);

console.log(`Scanning ${url} ...`);
const result = await scanUrl(url);

console.dir(result, { colors: true });
