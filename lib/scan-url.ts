import { chromium, errors } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

const NETWORK_IDLE_TIMEOUT_MS = 10_000;

export const scanUrl = async (url: string) => {
  const browser = await chromium.launch();

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    const response = await page.goto(url);

    if (response && !response.ok()) {
      throw new Error(
        `Could not scan ${url}: the page returned HTTP ${response.status()}.`,
      );
    }

    // Give client-rendered pages time to render before axe looks at them. Some
    // pages never go idle (polling, analytics), so scan anyway after the timeout.
    try {
      await page.waitForLoadState('networkidle', {
        timeout: NETWORK_IDLE_TIMEOUT_MS,
      });
    } catch (error) {
      if (!(error instanceof errors.TimeoutError)) throw error;
    }

    return await new AxeBuilder({ page }).analyze();
  } finally {
    await browser.close();
  }
};
