#!/usr/bin/env node
import sharp from "sharp";
import { statSync } from "node:fs";
import { resolve } from "node:path";

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error("usage: node scripts/optimize-asset.mjs <input.png> <output.png>");
  process.exit(1);
}

const inputPath = resolve(input);
const outputPath = resolve(output);

const beforeBytes = statSync(inputPath).size;

await sharp(inputPath)
  .png({
    quality: 80,
    compressionLevel: 9,
    effort: 10,
    palette: true,
  })
  .toFile(outputPath);

const afterBytes = statSync(outputPath).size;
console.log(`${input}: ${(beforeBytes / 1024).toFixed(1)} KB → ${output}: ${(afterBytes / 1024).toFixed(1)} KB`);
