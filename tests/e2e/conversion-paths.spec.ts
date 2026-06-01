import { test, expect } from "@playwright/test";

test.describe("Conversion paths", () => {
  test("Path A: Book a demo CTA in hero", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: "Book a demo" }).first();
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/demo/);
  });

  test("Path B: Free revenue audit ghost button in hero", async ({ page }) => {
    await page.goto("/");
    const audit = page.getByRole("link", { name: /get my free revenue audit/i }).first();
    await expect(audit).toBeVisible();
    await audit.click();
    await expect(page).toHaveURL(/\/audit/);
  });

  test("Path C: Pricing tier opens and links to demo with the plan", async ({ page }) => {
    await page.goto("/#pricing");
    const solo = page.getByRole("button", { name: /Solo/i });
    await solo.click();
    const cta = page.getByRole("link", { name: /Start with Solo/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/demo?plan=solo");
  });
});
