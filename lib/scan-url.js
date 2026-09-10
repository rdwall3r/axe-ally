import { chromium } from 'playwright';

export const scanUrl = async (url) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' });

  const results = await page.evaluate(() => axe.run());

  await browser.close();

  return results;
};
