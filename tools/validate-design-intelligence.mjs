import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';

const registry = JSON.parse(await readFile('design-intelligence/reference-registry.json', 'utf8'));
const generated = JSON.parse(await readFile('design-intelligence/generated-assets.json', 'utf8'));
const boards = JSON.parse(await readFile('design-intelligence/board-manifest.json', 'utf8'));

assert.equal(registry.candidates.length, 36, 'expected 36 candidates');
assert.ok(registry.statistics.inspected_deep >= 18, 'expected at least 18 deep inspections');
assert.equal(registry.references.filter((reference) => ['core', 'retained'].includes(reference.status)).length, 12, 'expected 12 retained references');
assert.equal(registry.references.filter((reference) => reference.core_reference).length, 8, 'expected 8 core references');
assert.equal(registry.user_supplied_rejected.length, 12, 'expected 12 rejected user originals');
assert.equal(registry.user_supplied_selected.length, 2, 'expected the earlier selected reference and approved board set');
assert.equal(boards.boards.length, 10, 'expected ten approved visual boards');
assert.equal(registry.statistics.landing_raster_assets_visually_inspected, 56, 'expected all 56 landing rasters inspected');
await stat('design-intelligence/image-audit.md');

for (const reference of registry.references.filter((item) => ['core', 'retained'].includes(item.status))) {
  assert.ok(reference.url.startsWith('https://'), reference.id + ' must have an exact HTTPS URL');
  assert.ok(reference.confirmed_observations.length, reference.id + ' needs confirmed observations');
  assert.ok(reference.inferred_principles.length, reference.id + ' needs inferred principles');
  assert.ok(reference.unknowns.length, reference.id + ' needs unknowns');
  assert.ok(reference.permitted_influence.length, reference.id + ' needs permitted influence');
  assert.ok(reference.prohibited_copying.length, reference.id + ' needs copying restrictions');
  for (const evidencePath of reference.evidence_paths) await stat(evidencePath);
}

for (const reference of registry.user_supplied_rejected) {
  const bytes = await readFile(reference.evidence_path);
  const actualHash = createHash('sha256').update(bytes).digest('hex');
  assert.equal(actualHash, reference.sha256, reference.id + ' hash mismatch');
}

for (const reference of registry.user_supplied_selected.filter((item) => item.sha256)) {
  const bytes = await readFile(reference.evidence_path);
  const actualHash = createHash('sha256').update(bytes).digest('hex');
  assert.equal(actualHash, reference.sha256, reference.id + ' hash mismatch');
}

for (const board of boards.boards) {
  const bytes = await readFile(boards.evidence_root + board.file);
  const actualHash = createHash('sha256').update(bytes).digest('hex');
  assert.equal(actualHash, board.sha256, board.id + ' hash mismatch');
}

const shipped = generated.assets.filter((asset) => asset.used_in_production);
assert.equal(generated.schema_version, 3, 'expected illustration manifest schema v3');
assert.equal(generated.assets.length, 8, 'expected eight coordinated illustration masters');
assert.equal(shipped.length, 8, 'expected all eight illustrations in production');
assert.match(generated.prompt_contract, /no .*photography/i, 'prompt contract must prohibit photography');
assert.equal((await readdir(generated.input_reference_archive)).filter((name) => name.endsWith('.png')).length, 8, 'expected eight archived user references');
assert.equal((await readdir(generated.output_master_archive)).filter((name) => name.endsWith('.png')).length, 8, 'expected eight archived generated masters');
for (const asset of shipped) {
  assert.match(asset.status, /^approved-illustration/, asset.id + ' must be an approved illustration');
  assert.match(asset.id, /-illustration-v1$/, asset.id + ' must use the illustration id contract');
  const bytes = await readFile(asset.production_path);
  const actualHash = createHash('sha256').update(bytes).digest('hex');
  assert.equal(actualHash, asset.sha256, asset.id + ' production hash mismatch');
  const archiveHash = createHash('sha256').update(await readFile(asset.archive_path)).digest('hex');
  assert.equal(archiveHash, asset.sha256, asset.id + ' archive hash mismatch');
  for (const responsivePath of asset.responsive_paths) await stat(responsivePath);
}

console.log('design intelligence contract: pass');
