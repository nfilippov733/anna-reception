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

  test("Path C: Pricing tier opens and links to demo with the plan", async ({ page }) => {
    await page.goto("/#pricing");
    const sole = page.getByRole("button", { name: /Sole Trader/i });
    await sole.click();
    const cta = page.getByRole("link", { name: /Start with Sole Trader/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/demo?plan=sole");
  });
});
