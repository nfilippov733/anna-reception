import { test, expect } from "@playwright/test";

test.describe("Segments tabs", () => {
  test("deep link to ?v=beauty lands on Beauty tab", async ({ page }) => {
    await page.goto("/?v=beauty");
    const beauty = page.getByRole("tab", { name: /Beauty salons/i });
    await expect(beauty).toHaveAttribute("aria-selected", "true");
    await expect(page.getByText("£62K booked covers")).toBeVisible();
  });

  test("clicking a tab updates URL", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: /Fitness studios/i }).click();
    await expect(page).toHaveURL(/[?&]v=fitness\b/);
    await expect(page.getByText("£29K class-fill recovered")).toBeVisible();
  });

  test("keyboard navigation cycles through tabs", async ({ page }) => {
    await page.goto("/?v=dental");
    const dental = page.getByRole("tab", { name: /Dental clinics/i });
    await dental.focus();
    await page.keyboard.press("End");
    await expect(page.getByRole("tab", { name: /Vet clinics/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await page.keyboard.press("Home");
    await expect(page.getByRole("tab", { name: /Dental clinics/i })).toHaveAttribute(
      "aria-selected",
      "true"
    );
  });

  for (const seg of ["dental", "beauty", "pubs", "construction", "fitness", "vet"] as const) {
    test(`visual baseline for ?v=${seg}`, async ({ browser }) => {
      const ctx = await browser.newContext({
        reducedMotion: "reduce",
        viewport: { width: 1440, height: 900 },
      });
      const page = await ctx.newPage();
      await page.goto(`/?v=${seg}`);
      await page.locator("#segments").scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await expect(page.locator("#segments")).toHaveScreenshot(`segments-${seg}.png`, {
        maxDiffPixelRatio: 0.02,
      });
      await ctx.close();
    });
  }
});
