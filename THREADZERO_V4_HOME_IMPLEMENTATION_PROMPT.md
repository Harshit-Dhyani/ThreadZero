# ThreadZero V4 Home implementation prompt

## Role

Act as ThreadZero's senior frontend implementation engineer, design-system owner, and visual QA engineer. Translate the approved Home reference into the existing semantic vanilla HTML/CSS/JavaScript application. Do not rebuild product logic and do not redesign any route beyond the shared shell and Home vertical slice.

## Primary authority

- Visual target: `C:\Users\user\AppData\Local\Temp\codex-clipboard-e031bb7e-3fab-4457-a6be-2d1507d64d9d.png`
- Native target size: `1672 x 941` pixels.
- The target controls composition, hierarchy, density, spacing, geometry, color character, typography, and illustration placement.
- Existing product and safety contracts override any misleading literal claim in the raster reference.
- Existing Home styling is baseline evidence only. Do not average it with the target.

## Product contract

Preserve these facts and behaviors:

- Public identity order: `ThreadZero` → `Financial Cyber Fraud Reporting Guide` → `Independent concept · Not a government service`.
- This is a synthetic independent concept. It does not submit a complaint, contact police, freeze funds, recover money, call a helpline, or integrate with government systems.
- For real financial cyber fraud in India, instruct the user to call `1930` manually and use `cybercrime.gov.in` where applicable.
- Preserve every route ID, deterministic fixture, guarded flow, browser-history behavior, English/Hindi behavior, skip link, landmarks, visible focus, error handling, and mobile navigation.
- Use truthful equivalents for unsupported reference phrases. In particular, use `clear handoff`, `Official handoff`, and `Concept guidance` instead of implying a secure live submission or staffed ThreadZero support.

## Repository owners already identified

- Global tokens and base type: `site/styles/tokens-base.css`
- Shared identity/header/navigation: `site/index.html`, `site/renderers/shell.js`, `site/styles/shell-navigation.css`
- Home composition: `site/renderers/public.js`
- Home copy: `site/copy/en/home.js`, `site/copy/hi/home.js`
- Home styling: `site/styles/home.css`
- Responsive and accessibility rules: `site/styles/responsive-accessibility.css`
- Icons and renderer helpers: `site/renderers/helpers.js`
- Approved asset metadata and delivery: `site/asset-catalog.js`
- Approved Home-family illustration candidate: `THREADZERO_V3_DESIGN_DRAFT/proofs/approved/P07-editorial-help-scene-v1.png`, delivered through the existing P07 master/WebP catalog entries.
- Route/shell copy: `site/copy/en/shell.js`, `site/copy/hi/shell.js`
- Regression contracts: `site/site-contract.test.mjs`, `site/*.test.mjs`, `core/*.test.mjs`

Do not create a second stylesheet, a new component framework, a new icon dependency, or a parallel token system. Change the existing owners.

## Measured desktop composition at 1672 x 941

Use these measured boundaries as the first implementation values, then tune against a current browser screenshot:

| Region | Target boundary |
| --- | --- |
| Identity row | `y=0..103`, 104px |
| Primary navigation | `y=104..174`, 71px |
| Main canvas begins | `y=175` |
| Master horizontal gutter | approximately 53px left/right |
| Master content width | approximately 1566px |
| Hero | `y=175..605`, approximately 430px |
| Hero divider | approximately `y=605` |
| Process strip | approximately `y=606..786`, 180px |
| Emergency strip | approximately `x=53, y=787, w=1566, h=129` |
| Left hero column | approximately 40% |
| Right hero column | approximately 60% |
| Hero content top | approximately `y=232`, 57px below canvas start |
| H1 | approximately 60–64px, line-height near 1.0, three fixed visual lines |
| Process icon fields | approximately 104px circles |

Major region boundaries should normally finish within 4–8 CSS pixels of the reference at the native viewport without absolute-positioning the page.

## V4 token intent

Consolidate values in the existing token owner. Sample and tune from the target rather than blindly keeping proposed values.

- Deep navy identity surface: near `#061a36`.
- Civic-blue navigation and primary CTA: near `#0649ad` / `#0d5bd4`.
- Ink: near `#081f45`.
- Canvas: cool white near `#fbfcff`.
- Soft icon field: near `#edf4ff`.
- Rules: cool thin blue-grey near `#d6e1f1`.
- Muted text: cool navy-grey near `#40577a`.
- Urgent red is reserved for real 1930 guidance.
- Desktop page width: `min(1560px, calc(100% - 112px))`, with narrower responsive gutters.
- English: existing Inter stack; Hindi: existing Noto Sans Devanagari stack.
- Controls: 7–9px radius. Emergency panel: 10–12px radius. No broad shadows, glass, gradients, or card grids.

## Shared shell

### Identity row

- 104px target height on reference desktop.
- Deep navy full width.
- Left group: bold `ThreadZero`, vertical divider, descriptor, disclosure.
- Right group: outline phone icon + `Call 1930 (24x7)`, divider, help icon + `Help & Support` + chevron.
- Keep language behavior available without breaking this hierarchy. On desktop it may remain a compact control within the utility group; on mobile it may move into the menu.
- Never use a `tel:` link for 1930.

### Navigation row

- 71px target height, civic-blue full width, aligned to the same 1560px master grid.
- Six visual groups: `Home`, `Report / Check`, `Evidence`, `Guides & Learning`, `Support`, `Get Started`.
- Reuse the existing dropdown and route machinery; regroup existing route links rather than deleting routes.
- Use the existing local outline icon renderer.
- Use thin separators, generous spacing, and one square-cornered 7–9px outline CTA.
- Home is visibly current on Home. Dropdowns retain accessible names and `aria-expanded` behavior.

Verify shell geometry in the browser before proceeding to the Home content.

## Home hero

- Full master width and approximately 430px high at the reference viewport.
- CSS Grid: left 40%, right 60%; no card around either side.
- Left padding/top position must align with the 53px master gutter and measured hero top.
- Eyebrow: `INDEPENDENT CONCEPT`, 13–14px, uppercase, tracked civic blue.
- Exact English visual wrap:

  `Report financial`  
  `cyber fraud with`  
  `confidence`

- H1 approximately 62px, weight 700–750, line-height about 1.02, dark navy.
- Body: `Clear guidance, practical tools, and a clear handoff to the official reporting portal.`
- CTA row: 46px high; primary `Report an Incident →`; secondary outline `How it works →`.
- Primary routes into the existing guarded start route. Secondary routes to existing guidance/process content.
- Do not place the synthetic-data disclaimer under the CTAs in this first viewport; retain disclosure elsewhere in the existing product.

### Illustration

- Use the approved P07 transparent editorial scene already present in the repository. Do not generate or register a random replacement.
- Render it without a frame, global opacity, matte rectangle, or card.
- Use `object-fit: contain`; scale and align its desk baseline to the hero divider.
- A pale atmosphere and a small decorative CSS question bubble may be added behind/near it, but no raster UI text or unsupported claim may be added.
- Preserve genuine alpha and the existing approved asset/catalog path.

Verify hero geometry before implementing the strips.

## Four-step process strip

- One open horizontal process surface, not four cards.
- Four equal columns with vertical separators.
- Each step contains a 96–110px pale circular icon field, a small numbered blue circle, title, short blue rule, body, and restrained arrow affordance.
- Truthful English content:
  1. `Choose your incident` — `Find the right category for your situation and start your report.`
  2. `Prepare your evidence` — `Collect and organise important details to support your report.`
  3. `Understand the process` — `Know what to expect before the official handoff.`
  4. `Official handoff` — `Continue to the official reporting portal yourself.`
- Reuse the current local outline icon system.
- Target region is approximately 180px high immediately after the hero divider.

## 1930 emergency strip

- One master-width horizontal panel immediately after the process strip.
- Target at desktop: about 129px high, 10–12px radius, thin cool border, no large shadow.
- Left: soft-red circular phone icon, `Need immediate help?`, large red `Call 1930`, outlined `24x7 Helpline` badge.
- Middle: truthful copy explaining this is the official helpline for financial cyber-fraud victims and that ThreadZero does not place the call.
- Right: three compact facts separated by rules: `24x7 availability`, `Official handoff`, `Concept guidance`.
- No `tel:` link and no claim that ThreadZero supplies human support, secure submission, recovery, or government service.

## Responsive adaptation

- `1440x900`: retain both shell rows, two-column hero, and four process columns with reduced gaps/type.
- `1024x768`: retain a usable two-column hero where it fits; process may become 2x2; emergency panel may wrap.
- `390x844` and `320x568`: compact identity row with ThreadZero, manual 1930 guidance, and a 44px menu button. Stack hero text then illustration. Use near-full-width CTAs. Convert process to a vertical sequence. Stack emergency content. No horizontal overflow or tiny text.
- `720x450`: test 200%-zoom-equivalent reflow. Preserve controls, one H1, and document-level horizontal containment.
- Hindi may be taller; do not shrink it below readable sizes to mimic English height.

## Accessibility and behavior

- Keep semantic `header`, `nav`, `main`, skip link, exactly one visible H1, logical headings, real links/buttons, visible focus, dropdown `aria-expanded`, and reduced-motion support.
- Every interactive target must be at least 44px.
- Decorative illustration gets empty alt; meaningful illustration gets localized concise alt.
- Validate keyboard navigation, mobile menu bounds, language switching, browser back/forward, guarded start route, and all shell destinations.
- No unexpected console error, broken image request, page-level horizontal overflow, clipping, or image rectangle.

## Required execution order

1. Capture baseline and current dimensions before product edits.
2. Run current tests and syntax/provenance checks.
3. Update existing V4 token values.
4. Implement and visually check identity row.
5. Implement and visually check navigation row.
6. Implement hero geometry and type without changing illustration delivery.
7. Integrate and visually check approved P07 illustration.
8. Implement CTAs.
9. Implement process strip.
10. Implement emergency strip.
11. Tune type, spacing, boundaries, colors, and borders at 1672x941.
12. Adapt responsive rules.
13. Run regressions and browser matrix in English and Hindi.
14. Stop. Do not redesign other route bodies.

## Evidence gate

Capture current-run evidence for:

- Before at 1672x941.
- After at 1672x941.
- Visual overlay/diff against the target.
- 1440x900.
- 1024x768.
- 390x844.
- 320x568.
- 720x450 reflow.

At every required viewport record: viewport size, scroll width vs client width, visible H1 count, broken images, console errors/warnings, and shell/menu state. Check both English and Hindi where wrapping differs.

Run the repository's existing `core/*.test.mjs` and `site/*.test.mjs` suites plus `git diff --check`. Do not add a framework or speculative abstraction.

## Completion language

Use only evidence-backed statuses: `Implemented`, `Verified`, `Partially verified`, `Blocked`, `Not attempted`.

Do not claim pixel-perfect, exact, responsive, accessible, complete, or regression-free unless current-run evidence proves it. A generated or supplied full-page image is a visual specification, not implementation evidence.

## Stop rule

Stop after the shared shell and Home V4 first viewport are implemented and verified. Existing below-fold content may inherit shared tokens but must not be route-specifically redesigned. Learning, Advisories, Media, FAQ, Track, complaint flows, and other route bodies are explicitly not attempted in this wave.
