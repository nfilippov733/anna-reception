import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

mkdirSync("./screenshots", { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

await page.screenshot({ path: "./screenshots/01-full.png", fullPage: true });

// Expand all four vertical tiles to capture the expanded state too
await page.locator("#verticals").getByRole("button").nth(0).click();
await page.locator("#verticals").getByRole("button").nth(1).click();
await page.locator("#verticals").getByRole("button").nth(2).click();
await page.locator("#verticals").getByRole("button").nth(3).click();
await page.waitForTimeout(500);
await page.screenshot({ path: "./screenshots/02-verticals-expanded.png", fullPage: true });

// Trigger ROI calculator: pick dental
await page.locator("#roi").getByRole("button", { name: /dental clinics/i }).click();
await page.waitForTimeout(400);
await page.locator("#roi").scrollIntoViewIfNeeded();
await page.screenshot({ path: "./screenshots/03-roi-dental.png" });

// Mobile screenshot
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
const mPage = await mobile.newPage();
await mPage.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await mPage.screenshot({ path: "./screenshots/04-mobile-full.png", fullPage: true });

await browser.close();
console.log("Saved screenshots/01-full.png, 02-verticals-expanded.png, 03-roi-dental.png, 04-mobile-full.png");
