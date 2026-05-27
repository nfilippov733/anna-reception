import { test, expect } from "@playwright/test";

test("scroll-reveal: grid items become visible as user scrolls", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const section = page.locator("section").filter({ hasText: "Where your revenue is leaking" });
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);

  const stanzas = section.locator("li");
  await expect(stanzas).toHaveCount(3);
  for (let i = 0; i < 3; i++) {
    const opacity = await stanzas.nth(i).evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0.95);
  }
});
