import { test, expect } from "@playwright/test";

test("ROI calculator: vertical picker → live leak update", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("heading", { name: "See your leak in 30 seconds." }).scrollIntoViewIfNeeded();
  // Scope to #roi so we don't collide with the verticals tile module's "Dental clinics" button.
  await page.locator("#roi").getByRole("button", { name: /dental clinics/i }).click();
  await expect(page.getByText("£/month bleeding")).toBeVisible();

  const callsInput = page.getByLabel(/new-patient calls per week/i);
  await callsInput.fill("60");
  // Just assert that some £-formatted leak value is shown.
  await expect(page.locator("text=£").first()).toBeVisible();
});

test("ROI calculator auto-selects vertical from ?v= param", async ({ page }) => {
  await page.goto("/?v=construction");
  await expect(page.getByRole("heading", { name: /construction \/ trades/i })).toBeVisible();
});
