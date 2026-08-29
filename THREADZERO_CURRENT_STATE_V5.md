# ThreadZero V5.3 Current State

Verified on 29 August 2026 from the main repository root.

## Release identity

- Branch: `codex/threadzero-v5-next-tailwind`
- Public prototype: [https://unrivaled-douhua-e65bf3.netlify.app/](https://unrivaled-douhua-e65bf3.netlify.app/)
- Public title: **Financial Cyber Fraud Reporting Guide**
- Internal codename: **ThreadZero**
- Runtime: Next.js 16 static export, React 19, TypeScript, Tailwind CSS, Bun 1.3.14
- Deploy output: `out/`
- Safety boundary: demo only; no government, police, bank, payment-provider, or other external submission

## Product

The active application has six citizen-facing workspaces:

- Home → `/`
- Report → `/complaints`
- Check → `/official-tools`
- Track → `/track`
- Learn → `/learning-corner`
- Help → `/contact`

The canonical report journey has five stages:

| Stage | Route |
| --- | --- |
| What happened? | `/incident` |
| Details | `/details` |
| Evidence | `/evidence` |
| Timeline | `/chronology` |
| Review & next | `/review` |

Legacy report URLs remain available through static-export-compatible client redirects. The shared complaint workspace preserves existing complaint URLs and uses demo-only session state.

## Evidence V2

- Availability: `have`, `missing`, or `unsure`
- Citizen labels: “I have it”, “I don’t have it”, and “Not sure”
- Fixed bilingual evidence inventory; no uploads or custom evidence creation
- `relatedEventIds` is the only Evidence–Timeline relationship source
- Missing or uncertain evidence never blocks continuation
- The payment-fact confirmation is required only when the matching payment evidence is marked available
- Saved Demo Access accepts and migrates version 1 state to version 2
- Documented demo reference: `DEMO-2026-08421`

## Active and historical ownership

The production application is owned by `src/`, `public/`, `next.config.ts`, `package.json`, `bun.lock`, and `netlify.toml`.

The tracked `site/`, `core/`, V3/V4 design records, provenance, and `tools/build-static.mjs` are retained history. Netlify does not build or publish them.

## Verification evidence

- Frozen Bun 1.3.14 install: passed
- Typecheck: passed
- Permanent tests: 22 passed
- Next production build: 48 static pages generated
- Netlify offline build: passed and published from `out/`
- Release contract: rejects `dist/`, the retired builder, incompatible hydration CSP, and missing Next static caching
- Draft HTTP verification: all 46 citizen routes returned 200
- Draft CSP: hydration-safe inline scripts only, `connect-src 'none'`, `form-action 'none'`, and frame denial retained
- `/_next/static/*`: immutable one-year cache verified
- Draft browser: hydration and Hindi switching passed with zero browser warnings/errors
- Draft browser matrix: 288 route/language/viewport states completed with zero failures before the browser harness time limit; the unchanged UI had already passed the complete 552-state local matrix
- `git diff --check`: passed

The browser harness timeout was a proof-transport limit, not an application error. Production still requires a final cold critical-path check after promotion.

## Submission boundary

The repository may be private because the public prototype URL is the reviewer surface. Video recording/upload, personal submission fields, and final form submission remain user-owned.
