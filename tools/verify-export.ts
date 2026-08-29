import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { ASSETS } from "../src/lib/assets/index.ts";
import { ALL_ROUTE_IDS } from "../src/lib/routes.ts";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const publicRoot = join(projectRoot, "public");
const outRoot = join(projectRoot, "out");
const errors: string[] = [];

function fileIsNonEmpty(path: string) {
  return existsSync(path) && statSync(path).isFile() && statSync(path).size > 0;
}

function verifyHtmlRoute(routeId: string) {
  const candidates = routeId === ""
    ? [join(outRoot, "index.html")]
    : [join(outRoot, `${routeId}.html`), join(outRoot, routeId, "index.html")];

  if (!candidates.some(fileIsNonEmpty)) {
    errors.push(`missing exported HTML for /${routeId}`);
  }
}

function verifyWebp(path: string, label: string) {
  if (!fileIsNonEmpty(path)) {
    errors.push(`missing or empty ${label}: ${path}`);
    return;
  }

  const bytes = readFileSync(path);
  if (bytes.length <= 12 || bytes.subarray(0, 4).toString("ascii") !== "RIFF" || bytes.subarray(8, 12).toString("ascii") !== "WEBP") {
    errors.push(`invalid WebP ${label}: ${path}`);
  }
}

verifyHtmlRoute("");
for (const routeId of ALL_ROUTE_IDS) verifyHtmlRoute(routeId);

let imageVariants = 0;
for (const [assetId, asset] of Object.entries(ASSETS)) {
  for (const [size, source] of Object.entries(asset.sources)) {
    imageVariants += 1;
    const relative = source.replace(/^\//, "");
    const sourcePath = join(publicRoot, relative);
    const exportedPath = join(outRoot, relative);

    verifyWebp(sourcePath, `${assetId}.${size} source`);
    verifyWebp(exportedPath, `${assetId}.${size} export`);

    if (fileIsNonEmpty(sourcePath) && fileIsNonEmpty(exportedPath) && statSync(sourcePath).size !== statSync(exportedPath).size) {
      errors.push(`exported image size differs from source for ${assetId}.${size}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Release integrity verification failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Release integrity verified: ${ALL_ROUTE_IDS.length + 1} HTML routes and ${imageVariants} registered WebP variants.`);
