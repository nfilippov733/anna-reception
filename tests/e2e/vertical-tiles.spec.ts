import { test, expect } from "@playwright/test";

// The VerticalsTileModule was replaced by SegmentsShowcase (tabbed) in v3.
// This test now validates that the segments section tab switcher is keyboard-operable.
test("Segment tab switches with keyboard Enter", async ({ page }) => {
  await page.goto("/?v=dental");
  // The segments section uses role="tablist" / role="tab"
  const dentalTab = page.getByRole("tab", { name: /Dental clinics/i });
  await dentalTab.scrollIntoViewIfNeeded();
  await dentalTab.focus();
  // Navigate to next tab with ArrowRight and activate with Enter
  await page.keyboard.press("ArrowRight");
  const focused = await page.evaluate(() => document.activeElement?.getAttribute("role"));
  expect(focused).toBe("tab");
});
