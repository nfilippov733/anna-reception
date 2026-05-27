import { test, expect } from "@playwright/test";

test("fast scroll past multiple sections: all items end at final visibility", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  await page.evaluate(() => window.scrollTo({ top: 5000, behavior: "auto" }));
  await page.waitForTimeout(800);

  const feature = page.locator("section").filter({ has: page.locator("text=24/7 answer") });
  await feature.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const items = feature.locator("li");
  const count = await items.count();
  expect(count).toBeGreaterThanOrEqual(6);

  // Ensure every item has crossed the IntersectionObserver threshold by
  // scrolling each into view (necessary on narrow viewports where the
  // 6-item stack does not fit in a single screen).
  for (let i = 0; i < count; i++) {
    await items.nth(i).scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(700);

  for (let i = 0; i < count; i++) {
    const opacity = await items.nth(i).evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0.95);
  }
});
