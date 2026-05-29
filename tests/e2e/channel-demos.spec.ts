import { test, expect } from "@playwright/test";

test.describe("Channel demos — functional", () => {
  test("Phone tab is selected by default on plain /", async ({ page }) => {
    await page.goto("/");
    const phoneTab = page.getByRole("tab", { name: /Phone/i });
    await expect(phoneTab).toHaveAttribute("aria-selected", "true");
  });

  test("Phone tab shows the voice call card", async ({ page }) => {
    await page.goto("/?v=beauty");
    const channelPanel = page.locator("[id^='channel-panel-']");
    await expect(channelPanel.getByText(/Live sample call/i)).toBeVisible();
  });

  test("clicking Chat shows the WhatsApp conversation; URL ?v= unchanged", async ({ page }) => {
    await page.goto("/?v=beauty");
    await page.getByRole("tablist", { name: /Channel selector/i }).getByRole("tab", { name: /Chat/i }).click();
    await expect(page).toHaveURL(/[?&]v=beauty\b/);
    const channelPanel = page.locator("[id^='channel-panel-']");
    // Beauty WhatsApp turn 1
    await expect(channelPanel.getByText(/can I push it/i)).toBeVisible();
  });

  test("change segment via URL re-renders the chat for the new segment", async ({ page }) => {
    await page.goto("/?v=beauty");
    await page.getByRole("tablist", { name: /Channel selector/i }).getByRole("tab", { name: /Chat/i }).click();
    const channelPanel = page.locator("[id^='channel-panel-']");
    await expect(channelPanel.getByText(/can I push it/i)).toBeVisible();
    await page.goto("/?v=construction");
    await page.getByRole("tablist", { name: /Channel selector/i }).getByRole("tab", { name: /Chat/i }).click();
    // Construction WhatsApp turn 1
    await expect(channelPanel.getByText(/do you cover Camden/i)).toBeVisible();
  });

  test("clicking a segment tab in SegmentsShowcase updates ChannelDemos chat without reload", async ({ page }) => {
    await page.goto("/?v=dental");
    await page.getByRole("tablist", { name: /Channel selector/i }).getByRole("tab", { name: /Chat/i }).click();
    const channelPanel = page.locator("[id^='channel-panel-']");
    // Dental WhatsApp turn 1
    await expect(channelPanel.getByText(/Any NHS spaces/i)).toBeVisible();

    const segmentsList = page.getByRole("tablist", { name: /Segment selector/i });
    await segmentsList.getByRole("tab", { name: /Fitness studios/i }).click();

    // Chat panel should now show fitness WhatsApp turn 1 — without a page reload.
    await expect(channelPanel.getByText(/How much are classes/i)).toBeVisible();
  });

  test("ArrowRight cycles from Phone to Chat", async ({ page }) => {
    await page.goto("/?v=dental");
    const phoneTab = page.getByRole("tab", { name: /Phone/i });
    await phoneTab.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: /Chat/i })).toHaveAttribute("aria-selected", "true");
  });

  test("Home and End jump tabs", async ({ page }) => {
    await page.goto("/?v=dental");
    await page.getByRole("tab", { name: /Chat/i }).focus();
    await page.keyboard.press("Home");
    await expect(page.getByRole("tab", { name: /Phone/i })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("End");
    await expect(page.getByRole("tab", { name: /Chat/i })).toHaveAttribute("aria-selected", "true");
  });
});

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 375, height: 800 };

const CHANNEL_TABS = [
  { key: "phone", label: /Phone/i },
  { key: "chat", label: /Chat/i },
] as const;

async function snapPanel(page: import("@playwright/test").Page, name: string) {
  const section = page.locator('section[aria-labelledby="channel-demos-heading"]');
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await expect(section).toHaveScreenshot(`${name}.png`, { maxDiffPixelRatio: 0.02 });
}

test.describe("Channel demos — visual baselines", () => {
  for (const tab of CHANNEL_TABS) {
    test(`desktop 1440 · ?v=beauty · ${tab.key}`, async ({ browser }) => {
      const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: DESKTOP });
      const page = await ctx.newPage();
      await page.goto("/?v=beauty");
      await page.locator('section[aria-labelledby="channel-demos-heading"]').getByRole("tab", { name: tab.label }).click();
      await snapPanel(page, `channel-demos-desktop-beauty-${tab.key}`);
      await ctx.close();
    });
  }

  for (const tab of CHANNEL_TABS) {
    test(`mobile 375 · ?v=beauty · ${tab.key}`, async ({ browser }) => {
      const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: MOBILE });
      const page = await ctx.newPage();
      await page.goto("/?v=beauty");
      await page.locator('section[aria-labelledby="channel-demos-heading"]').getByRole("tab", { name: tab.label }).click();
      await snapPanel(page, `channel-demos-mobile-beauty-${tab.key}`);
      await ctx.close();
    });
  }

  test("desktop 1440 · ?v=vet · chat (longest thread)", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: DESKTOP });
    const page = await ctx.newPage();
    await page.goto("/?v=vet");
    await page.locator('section[aria-labelledby="channel-demos-heading"]').getByRole("tab", { name: /Chat/i }).click();
    await snapPanel(page, "channel-demos-desktop-vet-chat");
    await ctx.close();
  });
});
