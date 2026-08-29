# ThreadZero V5 Current State

Verified on 29 August 2026 from `.w/v5`.

## Scope of this checkpoint

This checkpoint closes only Phases 0–2: truth lock, typed V5 migration closure, and architecture validation. Media production QA, illustration generation, the full browser matrix, release commits, push, and deployment remain separate gates.

## Git

- Branch: `codex/threadzero-v5-next-tailwind`
- HEAD: `0b2d46e4eff2fb861df7d14f94f86d94df4b68b2`
- Upstream: none configured
- Dirty state: `.gitignore` is modified; the V5 Next.js tree (`app`, `components`, `content`, `data`, `domains`, `features`, `lib`, `public`, `tests`, and build configuration) remains untracked user work.
- Commit/push/deployment: not performed for V5.

## Product catalog

- Public routes: 36
- Reporting flow routes: 9
- Catalog route IDs: 45, all unique
- Home: separate App Router entry
- English/Hindi route and official-source parity: covered by the route tests

## Automated evidence

- Legacy-to-typed temporary parity suite: 3/3 passed before legacy removal.
  - Route records, workflow copy, official sources, and presentation metadata matched.
  - Initial report state, validation, evidence, and service record behavior matched.
  - Representative incident extraction and Guide search results matched.
- Permanent tests: 9/9 passed.
- Typecheck: passed (`tsc --noEmit`).
- `git diff --check`: passed; Git reports only the existing LF-to-CRLF warning for `.gitignore`.
- Fresh production build after this checkpoint: not run; the uploaded work log records an older 48-page build, which does not certify this tree.

## Migration closure

| Gate | Result |
| --- | ---: |
| Legacy HTML runtime imports | 0 |
| Legacy JS renderer runtime imports | 0 |
| Legacy CSS imports | 0 |
| Active `lib/v3` runtime imports | 0 |
| Remaining `lib/v3` modules | 0 |
| JavaScript/MJS modules under `lib` | 0 |

The permanent `tests/architecture.test.ts` gate scans all active runtime roots and fails if a legacy frontend path or `lib/v3` directory returns.

Duplicate V5 product owners were also closed: Home and Track now read from `content/workflow`, Guide tests and runtime behavior use `features/guide`, and the superseded `lib/content.ts` and `lib/guide.ts` files were removed. The architecture test prevents those duplicate owners from returning.

## Legacy replacement map

| Removed legacy owner | Typed V5 owner | Active consumers before removal | Parity evidence |
| --- | --- | ---: | --- |
| `core/portal-routes.mjs` and seven route-family modules | `content/routes/*` | 0 | Exact route-record equality |
| `site/copy.js` and English/Hindi copy modules | `content/workflow/*` | 0 | Exact catalog equality and bilingual route tests |
| `core/demo-data.mjs` | `data/demo.ts` | 0 | Exact steps/fixture equality |
| `core/flow-core.mjs` | `domains/report`, `domains/evidence`, `domains/chronology` | 0 | Initial state and representative validation equality |
| `core/incident-intelligence.mjs` | `domains/incident` | 0 | Representative extraction equality |
| `core/service-form-core.mjs` | `domains/report/service-form.ts` | 0 | Service record parity; null-prototype maps preserved |
| `site/guide-core.js` | `features/guide` | 0 | Representative ranked-search equality |
| `site/route-presentation.js` | `lib/routing/presentation.ts` | 0 | Exact metadata equality |
| `site/official-sources.js` | `data/official-sources.ts` | 0 | Exact registry equality |
| `site/asset-catalog.js` | `lib/assets/index.ts` | 0 | Runtime asset owner present; final visual asset QA remains open |

## Assets and Media

- Typed runtime assets: 14 records.
- Reference manifest: present at `design-intelligence/reference-image-manifest-v5.md`.
- Media records: 4 typed records.
- Media Library feature: present.
- Final asset crop/loading audit and full Media search/filter/keyboard/browser acceptance: not verified in this checkpoint.

Knip was run after the TypeScript changes. Its remaining findings are the intentionally retained tracked V3 `site/`, `core/`, and static-build tool sources plus typed public contracts; no duplicate active V5 content or Guide owner remains.

## Browser and accessibility status

- Latest focused browser evidence: `/complaints` renders one visible H1, has zero horizontal overflow, and produced zero console errors after the nullable-copy repair and legacy-module removal.
- Home renders one H1 with zero horizontal overflow after moving to the canonical workflow copy.
- Track renders one H1, an empty initial reference, no result by default, zero horizontal overflow, and no console errors after the same consolidation.
- Full post-migration English/Hindi six-viewport matrix: not yet run.
- Golden-reference comparison and final keyboard/accessibility pass: not yet run.

## Next gate

Freeze the architecture. Continue with product behavior and visual acceptance without recreating migration adapters or adding another framework layer.
