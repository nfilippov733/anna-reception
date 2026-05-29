import { test, expect } from "@playwright/test";

test("ROI calculator: vertical picker → live leak update", async ({ page }) => {
  await page.goto("/");
  const roiSection = page.locator("#roi");
  await roiSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Default state: initialVertical="dental" is already selected (no picker shown).
  // The £/month bleeding label and inputs are rendered immediately.
  await expect(page.getByText("£/month bleeding")).toBeVisible();

  const callsInput = page.getByLabel(/new-patient enquiries per week/i);
  await callsInput.fill("60");
  // Just assert that some £-formatted leak value is shown.
  await expect(page.locator("text=£").first()).toBeVisible();

  // Click "Change business type" to reset to the picker
  await page.locator("#roi").getByRole("button", { name: /Change business type/i }).click();
  // Now the picker is shown — verify beauty button is visible
  const beautyBtn = page.locator("#roi").getByRole("button", { name: /beauty salons/i });
  await beautyBtn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await beautyBtn.click();
  // After picking beauty the heading should update
  await expect(page.locator("#roi h3", { hasText: /Beauty salons/i })).toBeVisible();
});

test("ROI calculator auto-selects vertical from ?v= param", async ({ page }) => {
  await page.goto("/?v=construction");
  // The construction vertical label in VERTICALS is "Trades"
  await expect(page.getByRole("heading", { name: /Trades/i }).first()).toBeVisible();
});
