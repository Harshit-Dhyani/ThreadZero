import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';

const registry = JSON.parse(await readFile('design-intelligence/reference-registry.json', 'utf8'));
const generated = JSON.parse(await readFile('design-intelligence/generated-assets.json', 'utf8'));
const boards = JSON.parse(await readFile('design-intelligence/board-manifest.json', 'utf8'));
const sketchesRequired = process.argv.includes('--sketches');

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

if (sketchesRequired) {
  assert.equal(generated.assets.length, 3, 'expected exactly three sketch assets');
  assert.equal(new Set(generated.assets.map((asset) => asset.direction)).size, 3, 'directions must be unique');
  for (const asset of generated.assets) {
    assert.equal(asset.status, 'candidate', asset.id + ' must remain a candidate');
    assert.equal(asset.approved, false, asset.id + ' must not be approved before human selection');
    assert.equal(asset.used_in_production, false, asset.id + ' must not ship before human selection');
    await stat(asset.production_path);
  }
}

console.log('design intelligence contract: pass');
