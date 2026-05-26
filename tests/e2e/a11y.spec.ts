import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page has no critical a11y violations (axe)", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  // Allow non-critical findings during development; fail on critical+serious only.
  const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
  if (critical.length > 0) {
    console.log(JSON.stringify(critical, null, 2));
  }
  expect(critical, "no critical or serious WCAG violations").toEqual([]);
});

test("home page is operable with keyboard only", async ({ page }) => {
  await page.goto("/");
  // Tab through; assert focus is visible somewhere meaningful by checking active element role
  for (let i = 0; i < 10; i++) await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.tagName.toLowerCase());
  expect(["a", "button", "input"]).toContain(focused);
});

test("respects prefers-reduced-motion (no marquee animation class active)", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const reducedPage = await ctx.newPage();
  await reducedPage.goto("/");
  const marquee = reducedPage.locator(".animate-marquee").first();
  await marquee.scrollIntoViewIfNeeded();
  const animName = await marquee.evaluate((el) => getComputedStyle(el).animationName);
  expect(animName).toBe("none");
  await ctx.close();
});
