// G8: CI fails any build whose compiled output contains forbidden placeholder tokens.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const FORBIDDEN = ["[source: TBD]", "[MISSING ASSET]"];
const SCAN_ROOTS = [".next/server", ".next/static"];

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const stat = statSync(p);
    if (stat.isDirectory()) walk(p, files);
    else if (/\.(html|js|css|json|txt)$/.test(entry)) files.push(p);
  }
  return files;
}

const hits = [];
for (const root of SCAN_ROOTS) {
  try {
    for (const file of walk(root)) {
      const content = readFileSync(file, "utf8");
      for (const token of FORBIDDEN) {
        if (content.includes(token)) hits.push(`${file} contains "${token}"`);
      }
    }
  } catch {
    /* directory may not exist yet — ignore */
  }
}

if (hits.length > 0) {
  console.error("\n❌ Placeholder guard failed:\n");
  for (const h of hits) console.error("  " + h);
  console.error("\nResolve placeholder tokens before deploying.\n");
  process.exit(1);
}
console.log("✓ Placeholder guard passed");
