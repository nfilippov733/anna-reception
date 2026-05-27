import { test, expect } from "@playwright/test";

test("reduced motion: all reveal items are visible on initial load", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const section = page.locator("section").filter({ hasText: "Where your revenue is leaking" });
  const stanzas = section.locator("li");
  const count = await stanzas.count();
  expect(count).toBe(3);

  for (let i = 0; i < count; i++) {
    const opacity = await stanzas.nth(i).evaluate((el) => window.getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0.95);
  }
});
