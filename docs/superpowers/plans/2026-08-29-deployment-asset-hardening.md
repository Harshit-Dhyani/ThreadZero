# ThreadZero Deployment and Asset Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent ThreadZero from publishing a successful build that is missing the root page, any registered static route, or any production image registered in the central asset catalog.

**Architecture:** Preserve the existing Bun 1.3.14 + Next.js static-export runtime and `out/` release contract. Make the deployment build itself the gate: run the repository test suite first, then build the static export, then verify every generated route and registered WebP asset. Vercel and Netlify both invoke `bun run build`, so the same contract applies to both hosts without introducing a second deployment architecture.

**Tech Stack:** Bun 1.3.14, Next.js 16 static export, TypeScript, Node test runner, Vercel/Netlify build pipelines.

**Spec:** `AGENTS.md`

## Global Constraints

- Preserve `output: "export"`; static export is an explicit project requirement.
- Preserve Bun 1.3.14.
- Preserve the repository root as the active Next.js runtime; `site/` and `core/` stay historical only.
- Do not add a backend, network dependency, image optimizer, or alternate asset registry.
- Do not delete historical/provenance assets as part of this reliability fix.
- Verification must cover `/`, every registered route, and every current production image variant.
- Hosted GitHub Actions was attempted but no runner ever started; do not treat that account-level runner failure as product evidence. The release gate therefore lives in `bun run build` and is exercised by the actual deployment providers.

---

### Task 1: Lock the release contract with tests

**Files:**
- Create: `src/tests/release-integrity.test.ts`

**Interfaces:**
- Consumes: root `package.json`, `next.config.ts`, `src/lib/assets/index.ts`, `public/assets/images/`.
- Produces: an automated contract that requires a pinned Bun package manager, tests in the deployment build path, and a build-time export verifier.

- [x] **Step 1: Add the release-integrity test**

Assert that:
- `package.json.packageManager === "bun@1.3.14"`.
- `package.json.scripts.build` runs tests before `next build`, then runs `verify:export`.
- `package.json.scripts["verify:export"]` runs `tools/verify-export.ts`.
- `tools/verify-export.ts` exists.
- `next.config.ts` still contains `output: "export"`.
- every asset in `ASSETS` exists in `public/`, is non-empty, and has a valid RIFF/WEBP signature.

### Task 2: Add the build-time export verifier

**Files:**
- Create: `tools/verify-export.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `ASSETS`, `ALL_ROUTE_IDS`, `public/`, `out/`.
- Produces: process exit code 0 only when the static release contains all expected HTML and all registered production images.

- [x] **Step 1: Implement `verify-export.ts`**

Verify:
- `out/index.html` exists and is non-empty.
- every route in `ALL_ROUTE_IDS` exists as either `out/<route>.html` or `out/<route>/index.html`.
- every registered asset has both source (`public`) and exported (`out`) variants.
- every asset file is non-empty and begins with RIFF bytes plus the `WEBP` marker.
- exported image size matches the source image size.

- [x] **Step 2: Pin Bun and wire tests + verifier into build**

Set `packageManager` to `bun@1.3.14`, add `verify:export`, and change build to `bun run test && next build && bun run verify:export`.

### Task 3: Verify the deployment boundary

**Files:**
- No product code changes unless evidence requires them.

- [x] **Step 1: Verify the Vercel preview artifact**

The preview build reached READY and the verifier reported 46 HTML routes and 26 registered WebP variants before deployment completion.

- [ ] **Step 2: Verify live critical routes and representative images**

Check HTTP 200 for `/`, `/incident`, `/track`, `/learning-corner`, and `/contact`, plus representative 1200px and 640px WebP assets.

- [ ] **Step 3: Merge only after fresh post-change deployment evidence is green**

Do not alter Next routing, remove static export, or rewrite image rendering while the current runtime is healthy.
