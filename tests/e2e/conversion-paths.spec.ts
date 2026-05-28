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

  test("Path C: Test-call phone chip in header", async ({ page }) => {
    await page.goto("/");
    const chip = page.getByRole("link", { name: /test call anna reception/i }).first();
    await expect(chip).toBeVisible();
    await expect(chip).toHaveAttribute("href", /^tel:/);
  });
});
