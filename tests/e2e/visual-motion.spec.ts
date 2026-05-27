import { test } from "@playwright/test";

// Captures 3 hero bob keyframes (0% / 50% / 100%) for PR review.
// These are exported as raw artifacts, NOT diff-gated snapshots.
// Desktop-only: the hero illustration is `hidden md:block`.
const BOB_SELECTOR = 'img[class*="animate-bob"]';

test("hero bob keyframes — 0%, 50%, 100%", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "chromium-desktop", "desktop-only capture");

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForLoadState("load");

  const hero = page.locator(BOB_SELECTOR).first();
  await hero.waitFor({ state: "visible" });

  // Pause the animation BEFORE any locator action that requires stability.
  await page.evaluate((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      (el as HTMLElement).style.animationPlayState = "paused";
    });
  }, BOB_SELECTOR);
  await page.waitForTimeout(60);

  const captureAt = async (label: string, delay: string) => {
    await page.evaluate(
      ({ sel, d }) => {
        document.querySelectorAll(sel).forEach((el) => {
          const e = el as HTMLElement;
          // Reset then re-apply so the engine recomputes from the new delay.
          e.style.animationPlayState = "running";
          e.style.animationDelay = d;
          // Force a reflow before pausing again.
          void e.offsetWidth;
          e.style.animationPlayState = "paused";
        });
      },
      { sel: BOB_SELECTOR, d: delay }
    );
    await page.waitForTimeout(120);
    // `animations: "allow"` is required here: the default "disabled" mode
    // rewinds CSS animations to their initial state, which would defeat
    // the negative-delay trick we use to land on a specific keyframe.
    await hero.screenshot({
      path: `tests/e2e/visual-motion.spec.ts-snapshots/hero-bob-${label}.png`,
      animations: "allow",
    });
  };

  await captureAt("0", "0s");
  await captureAt("50", "-3.5s");
  await captureAt("100", "-7s");
});
