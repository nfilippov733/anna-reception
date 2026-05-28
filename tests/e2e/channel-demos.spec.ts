import { test, expect } from "@playwright/test";

test.describe("Channel demos — functional", () => {
  test("Phone tab is selected by default on plain /", async ({ page }) => {
    await page.goto("/");
    const phoneTab = page.getByRole("tab", { name: /Phone/i });
    await expect(phoneTab).toHaveAttribute("aria-selected", "true");
  });

  test("visiting /?v=beauty shows beauty phone transcript", async ({ page }) => {
    await page.goto("/?v=beauty");
    // Scope to the ChannelDemos tabpanel (id starts with "channel-panel-") to avoid
    // strict-mode collision with SegmentsShowcase's "Sample call" paragraph.
    const channelPanel = page.locator("[id^='channel-panel-']");
    await expect(channelPanel.getByText(/balayage with Jess/i)).toBeVisible();
  });

  test("clicking WhatsApp tab swaps panel; URL ?v= unchanged", async ({ page }) => {
    await page.goto("/?v=beauty");
    await page.getByRole("tablist", { name: /Channel selector/i }).getByRole("tab", { name: /WhatsApp/i }).click();
    await expect(page).toHaveURL(/[?&]v=beauty\b/);
    // Beauty WhatsApp turn 1
    const channelPanel = page.locator("[id^='channel-panel-']");
    await expect(channelPanel.getByText(/can I book a balayage/i)).toBeVisible();
  });

  test("change segment via URL re-renders panel for current channel", async ({ page }) => {
    await page.goto("/?v=beauty");
    await page.getByRole("tablist", { name: /Channel selector/i }).getByRole("tab", { name: /WhatsApp/i }).click();
    const channelPanel = page.locator("[id^='channel-panel-']");
    await expect(channelPanel.getByText(/can I book a balayage/i)).toBeVisible();
    await page.goto("/?v=construction");
    await page.getByRole("tablist", { name: /Channel selector/i }).getByRole("tab", { name: /WhatsApp/i }).click();
    // Construction WhatsApp turn 1
    await expect(channelPanel.getByText(/Boiler leaking, water everywhere/i)).toBeVisible();
  });

  test("clicking a segment tab in SegmentsShowcase updates ChannelDemos panel without reload", async ({ page }) => {
    await page.goto("/?v=dental");
    await page.getByRole("tablist", { name: /Channel selector/i }).getByRole("tab", { name: /WhatsApp/i }).click();
    // Dental WhatsApp turn 1
    const channelPanel = page.locator("[id^='channel-panel-']");
    await expect(channelPanel.getByText(/Hi, my crown fell out/i)).toBeVisible();

    // Click the Fitness segment tab in SegmentsShowcase (above ChannelDemos).
    // SegmentsShowcase tablist is labelled "Segment selector"; ChannelDemos tablist is "Channel selector".
    const segmentsList = page.getByRole("tablist", { name: /Segment selector/i });
    await segmentsList.getByRole("tab", { name: /Fitness studios/i }).click();

    // ChannelDemos panel should now show fitness WhatsApp turn 1 — without a page reload.
    await expect(channelPanel.getByText(/Do you have a 6pm spin class tonight/i)).toBeVisible();
  });

  test("ArrowRight cycles channel tabs", async ({ page }) => {
    await page.goto("/?v=dental");
    const phoneTab = page.getByRole("tab", { name: /Phone/i });
    await phoneTab.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: /WhatsApp/i })).toHaveAttribute("aria-selected", "true");
  });

  test("Home and End jump tabs", async ({ page }) => {
    await page.goto("/?v=dental");
    await page.getByRole("tab", { name: /Instagram/i }).focus();
    await page.keyboard.press("End");
    await expect(page.getByRole("tab", { name: /Web chat/i })).toHaveAttribute("aria-selected", "true");
    await page.keyboard.press("Home");
    await expect(page.getByRole("tab", { name: /Phone/i })).toHaveAttribute("aria-selected", "true");
  });
});

const DESKTOP = { width: 1440, height: 900 };
const MOBILE = { width: 375, height: 800 };

const CHANNEL_TABS = [
  { key: "phone", label: /Phone/i },
  { key: "whatsapp", label: /WhatsApp/i },
  { key: "instagram", label: /Instagram/i },
  { key: "web", label: /Web chat/i },
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

  test("desktop 1440 · ?v=vet · whatsapp (longest WA thread)", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: DESKTOP });
    const page = await ctx.newPage();
    await page.goto("/?v=vet");
    await page.locator('section[aria-labelledby="channel-demos-heading"]').getByRole("tab", { name: /WhatsApp/i }).click();
    await snapPanel(page, "channel-demos-desktop-vet-whatsapp");
    await ctx.close();
  });

  test("desktop 1440 · ?v=construction · web (longest Web thread)", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: DESKTOP });
    const page = await ctx.newPage();
    await page.goto("/?v=construction");
    await page.locator('section[aria-labelledby="channel-demos-heading"]').getByRole("tab", { name: /Web chat/i }).click();
    await snapPanel(page, "channel-demos-desktop-construction-web");
    await ctx.close();
  });
});
