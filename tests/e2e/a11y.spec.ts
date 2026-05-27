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
  // Tab through; assert focus lands on an interactive element by checking tagName or role
  for (let i = 0; i < 10; i++) await page.keyboard.press("Tab");
  const { tag, role } = await page.evaluate(() => ({
    tag: document.activeElement?.tagName.toLowerCase() ?? "",
    role: document.activeElement?.getAttribute("role") ?? "",
  }));
  const isFocusable =
    ["a", "button", "input", "select", "textarea"].includes(tag) ||
    ["button", "tab", "link", "checkbox", "radio", "combobox", "tabpanel"].includes(role);
  expect(isFocusable, `expected focusable element, got <${tag}> role="${role}"`).toBe(true);
});

test("respects prefers-reduced-motion (hero bob animation neutralized)", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const reducedPage = await ctx.newPage();
  await reducedPage.goto("/");
  // The hero illustration carries motion-safe:animate-bob, so under reduced-motion
  // the variant should not apply and the computed animation-name should be 'none'.
  const heroImg = reducedPage.locator('img[src*="hero-illustration"]').first();
  await heroImg.waitFor({ state: "attached" });
  const animName = await heroImg.evaluate((el) => getComputedStyle(el).animationName);
  expect(animName).toBe("none");
  await ctx.close();
});
