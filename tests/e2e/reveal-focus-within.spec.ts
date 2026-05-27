import { test, expect } from "@playwright/test";

test("Tab navigation: focused element inside a Reveal is fully visible", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("load");

  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
  }
  // Allow Reveal transition (480ms) to finish after focus-induced scroll.
  await page.waitForTimeout(700);

  const focused = page.locator(":focus");
  await expect(focused).toBeVisible();

  const ancestorOpacity = await focused.evaluate((el) => {
    let cur: Element | null = el;
    while (cur && cur !== document.body) {
      const cs = window.getComputedStyle(cur);
      if ((cs.transitionProperty || "").includes("opacity") &&
          (cs.transitionProperty || "").includes("transform")) {
        return cs.opacity;
      }
      cur = cur.parentElement;
    }
    return "1";
  });
  expect(parseFloat(ancestorOpacity)).toBeGreaterThan(0.95);
});
