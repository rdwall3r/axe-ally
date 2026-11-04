#!/usr/bin/env node
import 'dotenv/config';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { scanUrl } from '../lib/scan-url.js';
import { normalizeUrl } from '../lib/helpers.js';

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

const fail = (message: string): never => {
  console.error(message);
  process.exit(1);
};

// Ask everything up front and close readline before scanning, so Ctrl+C can
// stop a scan that's in progress. Reading through the line iterator instead of
// rl.question keeps answers that are piped in together from being dropped.
const rl = createInterface({ input, output });
const lines = rl[Symbol.asyncIterator]();

const ask = async (question: string): Promise<string> => {
  rl.setPrompt(question);
  rl.prompt();

  const { value, done } = await lines.next();
  if (done) {
    // Ctrl+C, Ctrl+D or the end of piped input before an answer.
    output.write('\n');
    process.exit(1);
  }

  return value;
};

const userUrlInput = await ask('Which URL would you like to scan? ');

let url = '';
try {
  url = normalizeUrl(userUrlInput.trim());
} catch (error) {
  fail(errorMessage(error));
}

const doesUserWantModel = await ask(
  'Would you like to use an LLM to analyze the results? (y/n) ',
);
rl.close();

console.log(`Scanning ${url} ...`);
const urlScanResult = await scanUrl(url).catch((error: unknown) =>
  fail(errorMessage(error)),
);

if (urlScanResult.url !== url) {
  console.log(`Redirected to ${urlScanResult.url}`);
}

if (['y', 'yes'].includes(doesUserWantModel.trim().toLowerCase())) {
  console.log('Analyzing results ...');
  try {
    const { analyzeScanResults } = await import('../lib/screen-reader-lens.js');
    console.log(await analyzeScanResults(urlScanResult));
  } catch (error) {
    // Don't lose a finished scan because the analysis failed.
    console.dir(urlScanResult, { colors: true });
    fail(
      `Analysis failed: ${errorMessage(error)}\nThe raw scan results are above. If this is a credentials problem, check that ANTHROPIC_API_KEY is set (see .env.example).`,
    );
  }
} else {
  console.dir(urlScanResult, { colors: true });
}
