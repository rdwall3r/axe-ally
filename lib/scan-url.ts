import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';

export const scanUrl = async (url: string) => {
  const browser = await chromium.launch();

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url);

    return await new AxeBuilder({ page }).analyze();
  } finally {
    await browser.close();
  }
};
