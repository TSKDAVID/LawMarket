/**
 * Copies the default-locale (ka) tree to the site root after static export,
 * so GitHub Pages serves Georgian at `/` while `/ka` and `/en` remain available.
 * Also writes `.nojekyll` so GitHub does not ignore `_next`.
 */
import { cpSync, mkdirSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "out");
const kaDir = join(outDir, "ka");

if (!existsSync(kaDir)) {
  console.error("postbuild: out/ka not found — run next build first");
  process.exit(1);
}

for (const name of readdirSync(kaDir)) {
  const src = join(kaDir, name);
  const dest = join(outDir, name);
  cpSync(src, dest, { recursive: true });
}

writeFileSync(join(outDir, ".nojekyll"), "");
console.log("postbuild: hoisted ka → root, wrote .nojekyll");
