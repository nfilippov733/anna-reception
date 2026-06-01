import { test, expect } from "@playwright/test";

test.describe("Conversion paths", () => {
  test("Path A: Book a demo CTA in hero", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: "Book a demo" }).first();
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(/\/demo/);
  });

  test("Path B: 'See your revenue leak' in hero scrolls to the calculator", async ({ page }) => {
    await page.goto("/");
    const leak = page.getByRole("link", { name: /see your revenue leak/i }).first();
    await expect(leak).toBeVisible();
    await leak.click();
    await expect(page).toHaveURL(/#roi$/);
    await expect(page.getByRole("heading", { name: /see your leak in 30 seconds/i })).toBeVisible();
  });

  test("Path C: every pricing tier has a trial CTA linking to its plan", async ({ page }) => {
    await page.goto("/#pricing");
    // A trial CTA per tier, always visible.
    await expect(page.locator('a[href="/demo?plan=sole"]')).toHaveText(/Book a demo and start a trial/i);
    await expect(page.locator('a[href="/demo?plan=business"]')).toBeVisible();
    await expect(page.locator('a[href="/demo?plan=big"]')).toBeVisible();
    // Expanding a tier reveals its features.
    await page.getByRole("button", { name: /Sole Trader/i }).click();
    await expect(page.getByText(/SMS confirmations/i)).toBeVisible();
  });
});
