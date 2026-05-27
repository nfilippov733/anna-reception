#!/usr/bin/env node
import sharp from "sharp";
import { statSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);

// Parse positional and flag args
let input, output;
let width = null;
let quality = 80;
let colors = null;
let compressionLevel = 9;
let effort = 10;

const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--width" && args[i + 1]) {
    width = parseInt(args[++i], 10);
  } else if (args[i] === "--quality" && args[i + 1]) {
    quality = parseInt(args[++i], 10);
  } else if (args[i] === "--colors" && args[i + 1]) {
    colors = parseInt(args[++i], 10);
  } else {
    positional.push(args[i]);
  }
}

[input, output] = positional;

if (!input || !output) {
  console.error(
    "usage: node scripts/optimize-asset.mjs <input.png> <output.png> [--width N] [--quality N] [--colors N]"
  );
  process.exit(1);
}

const inputPath = resolve(input);
const outputPath = resolve(output);

const beforeBytes = statSync(inputPath).size;

const pngOptions = {
  quality,
  compressionLevel,
  effort,
  palette: true,
  ...(colors != null ? { colors } : {}),
};

let pipeline = sharp(inputPath);
if (width != null) {
  pipeline = pipeline.resize({ width });
}
await pipeline.png(pngOptions).toFile(outputPath);

const afterBytes = statSync(outputPath).size;
const meta = await sharp(outputPath).metadata();
console.log(
  `${input}: ${(beforeBytes / 1024).toFixed(1)} KB → ${output}: ${(afterBytes / 1024).toFixed(1)} KB (${meta.width}×${meta.height})`
);
