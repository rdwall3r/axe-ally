#!/usr/bin/env node
import 'dotenv/config';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { scanUrl } from '../lib/scan-url.js';
import { normalizeUrl } from '../lib/helpers.js';

const rl = createInterface({ input, output });
const userUrlInput = await rl.question('Which URL would you like to scan? ');

const url = normalizeUrl(userUrlInput);

console.log(`Scanning ${url} ...`);
const urlScanResult = await scanUrl(url);
const doesUserWantModel = await rl.question(
  'The scan is complete. Would you like to use an LLM to analyze the results? (y/n) ',
);
rl.close();

if (['y', 'yes'].includes(doesUserWantModel.trim().toLowerCase())) {
  const { analyzeScanResults } = await import('../lib/screen-reader-lens.js');
  const analysis = await analyzeScanResults(urlScanResult);
  console.log(analysis);
} else {
  console.dir(urlScanResult, { colors: true });
}
