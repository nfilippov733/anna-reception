import { test, expect } from "@playwright/test";

const BREAKPOINTS = [375, 768, 1024, 1440, 1920];

// Visual regression: only run on the desktop chromium project to keep
// the snapshot set deterministic across CI runners. The mobile project
// would otherwise generate a duplicate set keyed by device.
test.describe("Landing page visual regression", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "chromium-desktop", "desktop-only snapshots");
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  for (const width of BREAKPOINTS) {
    test(`landing page renders at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.waitForLoadState("load");
      await expect(page).toHaveScreenshot(`landing-${width}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});
