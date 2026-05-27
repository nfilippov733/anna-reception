import { chromium } from "playwright";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const issues = { console: [], network: [], placeholders: [] };

page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") {
    issues.console.push(`[${msg.type()}] ${msg.text()}`);
  }
});

page.on("response", (resp) => {
  if (resp.status() >= 400) {
    issues.network.push(`${resp.status()} ${resp.url()}`);
  }
});

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

// Count visible placeholders / missing-asset blocks
const placeholderCount = await page.locator(":text('[MISSING ASSET]')").count();
const tbdCount = await page.locator(":text('[source: TBD]')").count();
const placeholderQuoteCount = await page.locator(":text-matches('Placeholder quote', 'i')").count();

issues.placeholders.push(`[MISSING ASSET] tiles visible: ${placeholderCount}`);
issues.placeholders.push(`[source: TBD] strings visible: ${tbdCount}`);
issues.placeholders.push(`"Placeholder quote N" visible: ${placeholderQuoteCount}`);

// Get all images that failed
const brokenImages = await page.$$eval("img", (imgs) =>
  imgs
    .filter((img) => !img.complete || img.naturalWidth === 0)
    .map((img) => ({ src: img.src, alt: img.alt }))
);
issues.placeholders.push(`Broken <img> elements: ${brokenImages.length}`);

console.log(JSON.stringify(issues, null, 2));
await browser.close();
