import { test, expect } from "@playwright/test";

test("Vertical tile expands and collapses with keyboard", async ({ page }) => {
  await page.goto("/");
  // Scope to the verticals tile module: each tile is an accordion button containing the vertical label
  const dentalTrigger = page.locator("#verticals").getByRole("button").filter({ hasText: "Dental clinics" }).first();
  await dentalTrigger.scrollIntoViewIfNeeded();
  await dentalTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(dentalTrigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(dentalTrigger).toHaveAttribute("aria-expanded", "false");
});
