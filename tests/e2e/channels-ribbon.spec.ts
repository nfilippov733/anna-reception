import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile-375", width: 375, height: 800 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1024", width: 1024, height: 900 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
];

for (const v of VIEWPORTS) {
  test(`ChannelsRibbon visual baseline ${v.name}`, async ({ browser }) => {
    const ctx = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: v.width, height: v.height },
    });
    const page = await ctx.newPage();
    await page.goto("/");
    const ribbon = page.locator("section[aria-labelledby='channels-heading']");
    await ribbon.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await expect(ribbon).toHaveScreenshot(`channels-${v.name}.png`, {
      maxDiffPixelRatio: 0.02,
    });
    await ctx.close();
  });
}
