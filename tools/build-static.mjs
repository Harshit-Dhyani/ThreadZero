import { execFile } from "node:child_process";
import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "site");
const dist = path.join(root, "dist");
const tests = [
  "core/flow-core.test.mjs",
  "core/incident-intelligence.test.mjs",
  "core/service-form-core.test.mjs",
  "site/portal-manifest.test.mjs",
  "site/site-contract.test.mjs"
];

const { stdout, stderr } = await run(process.execPath, ["--test", ...tests], { cwd: root });
process.stdout.write(stdout);
process.stderr.write(stderr);

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const entry of await readdir(site, { withFileTypes: true })) {
  if (entry.name.endsWith(".test.mjs")) continue;
  await cp(path.join(site, entry.name), path.join(dist, entry.name), { recursive: true });
}

await cp(path.join(root, "core"), path.join(dist, "core"), {
  recursive: true,
  filter: (source) => !source.endsWith(".test.mjs")
});

async function inventory(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await inventory(target));
    else files.push(target);
  }
  return files;
}

const files = await inventory(dist);
const bytes = (await Promise.all(files.map((file) => stat(file)))).reduce((total, file) => total + file.size, 0);
console.log(`Built ${files.length} runtime files (${(bytes / 1024 / 1024).toFixed(1)} MiB) in dist/`);
