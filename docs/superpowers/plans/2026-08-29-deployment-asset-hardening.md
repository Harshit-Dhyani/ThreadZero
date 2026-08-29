# ThreadZero Deployment and Asset Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent ThreadZero from publishing a successful build that is missing the root page, critical static routes, or any production image registered in the central asset catalog.

**Architecture:** Preserve the existing Bun 1.3.14 + Next.js static-export runtime and `out/` release contract. Add a build-time release verifier that treats `src/lib/assets/index.ts` as the image source of truth, validates source and exported WebP files, and checks critical HTML output. Add CI so typecheck, tests, and the verified production build run on pull requests and `main`.

**Tech Stack:** Bun 1.3.14, Next.js 16 static export, TypeScript, Node test runner, GitHub Actions.

**Spec:** `AGENTS.md`

## Global Constraints

- Preserve `output: "export"`; static export is an explicit project requirement.
- Preserve Bun 1.3.14.
- Preserve the repository root as the active Next.js runtime; `site/` and `core/` stay historical only.
- Do not add a backend, network dependency, image optimizer, or alternate asset registry.
- Do not delete historical/provenance assets as part of this reliability fix.
- Verification must cover `/`, representative critical routes, and every current production image variant.

---

### Task 1: Lock the release contract with a failing test

**Files:**
- Create: `src/tests/release-integrity.test.ts`
- Create: `.github/workflows/verify.yml`

**Interfaces:**
- Consumes: root `package.json`, `next.config.ts`, `src/lib/assets/index.ts`, `public/assets/images/`.
- Produces: an automated contract that requires a pinned Bun package manager and a build-time export verifier.

- [ ] **Step 1: Write the failing test**

Assert that:
- `package.json.packageManager === "bun@1.3.14"`.
- `package.json.scripts.build` invokes `verify:export` after `next build`.
- `package.json.scripts["verify:export"]` runs `tools/verify-export.ts`.
- `tools/verify-export.ts` exists.
- `next.config.ts` still contains `output: "export"`.
- every `small`/`large` asset in `ASSETS` exists in `public/`, is non-empty, and has a valid RIFF/WEBP signature.

- [ ] **Step 2: Run CI and verify RED**

Expected: the release-integrity test fails because the package manager pin and export verifier are not implemented yet.

### Task 2: Add the minimum build-time export verifier

**Files:**
- Create: `tools/verify-export.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `ASSETS`, `public/`, `out/`.
- Produces: process exit code 0 only when the static release contains required HTML and all registered production images.

- [ ] **Step 1: Implement `verify-export.ts`**

Verify:
- `out/index.html` exists and is non-empty.
- critical routes exist as either `out/<route>.html` or `out/<route>/index.html`: `incident`, `details`, `evidence`, `track`, `learning-corner`, `contact`.
- every registered asset has both source (`public`) and exported (`out`) variants.
- every asset file is non-empty and begins with RIFF bytes plus the `WEBP` marker.

- [ ] **Step 2: Pin Bun and wire the verifier into build**

Set `packageManager` to `bun@1.3.14`, add `verify:export`, and change build to `next build && bun run verify:export`.

- [ ] **Step 3: Run CI and verify GREEN**

Expected: typecheck, tests, Next static export, and release verification all pass.

### Task 3: Verify the deployment boundary

**Files:**
- No production code changes unless evidence requires them.

- [ ] **Step 1: Verify the Vercel preview deployment**

Check HTTP 200 for `/`, `/incident`, `/details`, `/evidence`, `/track`, `/learning-corner`, and `/contact`.

- [ ] **Step 2: Verify representative image delivery**

Check HTTP 200 and `image/webp` for at least the training and footer assets plus one media asset.

- [ ] **Step 3: Merge only after evidence is green**

Do not alter Next routing, remove static export, or rewrite image rendering when the current production behavior is healthy.
