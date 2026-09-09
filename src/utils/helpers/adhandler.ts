//Remove ads backend only
import { Page } from '@playwright/test';

export async function setupAdBlocker(page: Page): Promise<void> {
  await page.route('**/*', (route) => {
    const url = route.request().url();
    const adDomains = [
      'googlesyndication.com',
      'doubleclick.net',
      'adnxs.com',
      'adsafeprotected.com',
      'pagead2'
    ];
    
    const isAd = adDomains.some(domain => url.includes(domain));
    return isAd ? route.abort() : route.continue();
  });

  const adCloseSelectors = [
    '#close-ad-button',
    '.ad-close-icon',
    '[aria-label="Close Ad"]',
    'button.dismiss-button'
  ];

  for (const selector of adCloseSelectors) {
    await page.addLocatorHandler(page.locator(selector), async () => {
      // This block runs automatically whenever the ad selector becomes visible
      try {
        await page.locator(selector).click();
      } catch (error) {
        console.warn(`Failed to auto-close ad with selector: ${selector}`, error);
      }
    });
  }
}
