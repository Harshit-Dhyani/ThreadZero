# ThreadZero V4 — Whole-Site UI/UX Rescue Prompt

Use this prompt with Codex inside the existing `codex/threadzero-v3-whole-site` worktree.

---

## IMMEDIATE INSTRUCTION

You already have permission to refactor the complete ThreadZero visual layer. Execute this rescue pass end-to-end without asking for page-by-page styling approval. Preserve functionality, safety, accessibility, bilingual behavior, routes, and existing user work. Replace weak UI wherever necessary.

Do not stop after auditing, planning, generating mockups, or editing one page. Implement the working site, run it, inspect it in the real browser, correct the rendered defects, and verify the final result.

## ROLE

You are the principal frontend engineer, design-system owner, information architect, interaction designer, accessibility reviewer, and browser visual-QA engineer for ThreadZero.

## PROJECT

ThreadZero is an independent, bilingual Financial Cyber Fraud Reporting Guide built with semantic vanilla HTML, CSS, and JavaScript.

The current worktree is:

`codex/threadzero-v3-whole-site`

The repository currently contains uncommitted user work. Preserve it.

## PRIMARY OBJECTIVE

Rescue the complete 36-route public frontend so it feels like one coherent, professional civic product instead of a collection of oversized AI-generated templates.

The result must be:

- calm
- clear
- trustworthy
- efficient
- moderately dense
- easy to scan
- easy to use
- visually consistent without making every route identical
- responsive in English and Hindi
- specific to each citizen task

The result must not feel:

- oversized
- excessively bold
- empty
- repetitive
- card-heavy
- illustration-dependent
- generic
- congested
- unfinished
- like a marketing landing page was copied across operational routes

## CURRENT USER VERDICT — HIGHEST VISUAL AUTHORITY

The current UI still fails because:

- headings are too large
- too much text is bold
- route heroes consume too much space
- illustrations are too large, repeated, or weak
- many pages have excessive empty gaps
- several route bodies reuse the same anatomy
- source/provenance blocks consume too much space
- the Home Evidence Thread is visually scattered and inefficient
- operational pages do not feel like focused applications
- the footer is not good enough, especially on mobile
- navigation, typography, spacing, images, and bottom-of-page composition do not feel like one polished system

This current user direction supersedes older V3/V4 typography values where those values created giant headings, oversized heroes, or excessive boldness.

Preserve the approved palette, product identity, safety contract, route truth, semantic behavior, and useful shell composition. Do not preserve weak scale, density, or route-body decisions merely because they appeared in an older design document.

## SOURCE-OF-TRUTH ORDER

Resolve conflicts in this order:

1. Current user direction in this prompt
2. `AGENTS.md` product, safety, accessibility, and verification rules
3. Current working product behavior and route data
4. Approved palette, identity, and safe visual language
5. Existing semantic HTML/JS owners
6. Existing approved production assets
7. Historical V3/V4 prompts, boards, and design documents

Historical full-page boards are reference evidence, not implementation truth.

## NON-NEGOTIABLE PRODUCT AND SAFETY CONTRACT

Preserve all of the following:

- independent concept status
- synthetic data only
- no real upload
- no real call
- no real complaint submission
- no bank, police, payment-provider, or government integration
- no fake government affiliation
- no fake live case status
- no fake support hours
- no recovery or fund-freezing promise
- manual `1930` guidance for real financial cyber fraud
- official `cybercrime.gov.in` handoff
- every existing route ID
- deterministic fixtures
- guarded reporting flow
- tracker behavior
- browser history and reload behavior
- English/Hindi switching
- semantic landmarks
- exactly one visible H1 per route
- keyboard support
- visible focus
- reduced-motion behavior
- error recovery

Never add `tel:1930`.

## REPOSITORY SAFETY

Before broad edits:

1. Run and record:
   - `git status --short --branch`
   - `git diff --stat`
   - `git diff --check`
2. Do not reset, clean, delete, stash, overwrite, or discard current user work.
3. Do not use `git add -A`.
4. Do not commit, push, merge, or deploy unless separately requested.
5. Keep all changes inside the existing worktree.

## TECHNOLOGY BOUNDARY

Do not:

- migrate to React, Next.js, Vue, or another framework
- add a build framework
- add a backend
- add authentication
- add a database
- add AI/chatbot features in this pass
- add new package dependencies
- create a parallel design system
- create a second application
- rewrite working product logic
- add a large emergency override stylesheet

Work through the current owners:

- `site/styles/tokens-base.css`
- `site/styles/shell-navigation.css`
- `site/styles/home.css`
- `site/styles/route-archetypes.css`
- `site/styles/shared-components.css`
- `site/styles/footer.css`
- `site/styles/responsive-accessibility.css`
- `site/renderers/public.js`
- `site/renderers/flow.js`
- `site/renderers/helpers.js`
- `site/renderers/shell.js`
- `site/copy/en/*`
- `site/copy/hi/*`
- `core/portal-routes.mjs`
- existing tests

Use route-specific selectors only when the information architecture genuinely differs. Prefer reusable archetype and component classes.

## DISCOVERY LIMIT

Do not disappear into another long audit.

Maximum initial discovery:

1. Read `AGENTS.md`.
2. Read the current token, shell, Home, route-archetype, footer, responsive, renderer, and route-registry owners listed above.
3. Run the current tests.
4. Capture the current rendered state of the representative routes listed below.
5. Begin implementation.

Do not generate more design documents or full-page mockups.

## DESIGN CONSTITUTION

### Visual thesis

A calm civic evidence service: compact editorial hierarchy, clear task-focused surfaces, restrained illustration, visible process state, and trustworthy official boundaries.

### Hierarchy rule

The citizen’s next action gets the strongest emphasis. Supporting explanation, provenance, and disclaimers remain visible but subordinate.

### Layout rule

Route structure follows the task. Decision pages, guides, directories, forms, records, support pages, and legal documents must not share one generic page anatomy.

### Typography rule

Use weight, size, spacing, and line length to clarify hierarchy. Do not make every heading, label, link, metadata value, or card title bold.

### Surface rule

Use a bordered or tinted panel only when it groups related information, communicates state, or separates an action boundary. Do not place every content item in a card.

### Color rule

Civic blue identifies structure and concept actions. Red is reserved for urgent official guidance. Green, amber, and muted blue communicate truthful readiness states only.

### Imagery rule

Illustrations are optional supporting evidence. They never control page anatomy, replace useful information, or occupy large empty rectangles.

### Restraint rule

No gradients, glassmorphism, giant shadows, bento-card spam, decorative pills, generic cybersecurity imagery, or repeated character scenes.

## GLOBAL TYPOGRAPHY RESET

Fix the global type hierarchy before route-by-route styling.

Recommended desktop ranges:

- Home H1: `52–56px`, weight `640–680`
- Hub H1: `40–44px`, weight `620–660`
- Guide H1: `38–42px`, weight `620–650`
- Support H1: `36–40px`, weight `620–650`
- Utility/form H1: `32–36px`, weight `600–640`
- Legal H1: `30–34px`, weight `600–630`
- H2: `26–32px`, weight `600–640`
- H3: `17–20px`, weight `580–620`
- Body: `15.5–17px`, weight `400`
- Supporting copy: `14–15px`, weight `400`
- Metadata: `12–13px`, weight `400–500`
- Navigation: weight `500`
- Buttons: weight `550–600`
- Row/card titles: weight `560–610`

Rules:

- Remove unnecessary `700`, `740`, `800`, and `font-weight: bold` declarations.
- Do not bold normal descriptions, breadcrumbs, metadata, navigation descriptions, helper copy, source notes, or entire labels.
- Keep readable prose near `60–70ch`.
- Use line-height `1.05–1.12` for H1, `1.12–1.2` for H2, and `1.5–1.6` for body.
- Do not force English line breaks that break Hindi or smaller viewports.
- Mobile headings must scale down intentionally, not merely inherit desktop `clamp()` values.

## GLOBAL SPACING AND DENSITY RESET

Use one consistent spacing scale:

`4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80`

Recommended rules:

- desktop page gutter: `44–56px`
- tablet gutter: `28–32px`
- mobile gutter: `18–20px`
- breadcrumbs to heading: `16–24px`
- compact hero vertical padding: `28–44px`
- normal section gap: `32–48px`
- Home major section gap: `48–64px`
- normal panel padding: `16–24px`
- feature panel padding: `24–32px`
- no unexplained blank area larger than `80px`
- no normal route hero with a default `min-height: 340px`
- no one-sentence panel occupying hundreds of pixels

Target moderately dense civic UI. A desktop viewport should show meaningful task content, not only a title and illustration.

## ICON, BORDER, RADIUS, AND SHADOW RULES

- normal UI icon: `18–22px`
- feature icon: `24–30px`
- process icon: `28–38px`
- controls: `6–8px` radius
- panels: `8–10px` radius
- major bands: `10–12px` radius
- border: one cool blue-grey pixel
- shadows: almost none
- do not use circles, pills, or giant icon fields as decoration
- keep all interactive targets at least `44px`

## SHARED PRIMITIVES TO FIX FIRST

Refactor the existing shared owners for:

- breadcrumb
- route eyebrow
- compact route header
- primary and secondary actions
- action row
- directory row
- compact guide step
- compact decision panel
- context rail
- status summary
- timeline
- readiness state
- urgent 1930 band
- official handoff
- compact provenance strip
- accordion
- tabs/filter/search row
- form field and validation
- footer group

Do not create a generic Card component and use it everywhere.

## COMPACT SOURCE / PROVENANCE STRIP

The current `sourcePanel()` owner in `site/renderers/helpers.js` produces a large source panel on many routes. Replace it globally with a compact, subordinate source strip.

Normal desktop target:

- `48–64px` high for one source
- label `Source`
- official source title
- small external-link icon
- small checked-date or official-boundary metadata when supported

Multiple sources become two or three compact rows, not a giant pale card.

Do not repeat the full independent-concept disclaimer inside the provenance strip.

## DISCLAIMER DEDUPLICATION

Keep safety truth visible without repeating it five times per page.

Use this hierarchy:

- shell: concise independent-concept disclosure
- relevant form/action boundary: short synthetic/no-submission notice
- official handoff: clear external boundary
- footer: concise project boundary

Remove repeated full disclaimers from unrelated panels.

## IMAGE AND ILLUSTRATION RESCUE

Do not generate new illustrations during the first rescue pass.

First use the approved current library intelligently:

- keep an image only when it improves orientation or explanation
- remove it when it only fills space
- never show a large generic illustration on every route
- do not reuse the same scene across unrelated pages
- do not put an image inside a giant pale rectangle
- do not reduce opacity globally
- do not fake transparency
- do not crop a character awkwardly
- keep route illustrations around `280–420px` on desktop
- Home may use up to approximately `500px` only when balanced
- guides, utility pages, legal pages, and directories may use no hero illustration
- media covers may use approved P08 assets where they represent real content categories

If an approved image still looks poor in context, remove it from that route. Record the missing scene as deferred; do not block this time-critical UI rescue on image generation.

## ROUTE ARCHITECTURE

The application has 36 public routes plus Home and the guarded reporting flow. Do not build 36 unrelated templates, but do not force all pages through six visually identical bodies.

Use product-specific route families:

1. Gateway/Home
2. Decision hubs
3. Editorial guides
4. Directories and listings
5. Utilities/forms
6. Status and records
7. Support/help
8. Legal documents
9. Guarded reporting workspace

Within a family, vary composition only when the task requires it. Across families, the anatomy must be visibly different.

## HOME RESCUE

Preserve the selected two-row shell, four-step process idea, and 1930 band, but reduce scale and weight.

Change:

- Home H1 to approximately `52–56px`, not 64px
- lighter H1 weight
- smaller process icons
- smaller numbered markers
- tighter process copy
- reduced process-row height
- cleaner CTA density
- less repeated disclaimer text
- no giant below-fold gaps

### Replace the current Evidence Thread section

Use:

Eyebrow: `YOUR INCIDENT TIMELINE`

H2: `See how the incident fits together.`

Description: `Connect messages, payments, links, and evidence to the moment they belong to.`

Remove the current large P06 image container if it does not add clear value.

Build the mechanism with semantic HTML/CSS:

1. Suspicious message
2. Link opened
3. ₹25,000 payment
4. Contact disappeared

Associate compact evidence:

- WhatsApp screenshot → supports event 1
- Suspicious URL → supports event 2
- Transaction receipt → supports event 3
- Phone identifier → missing

Then one compact readiness row:

- Ready — Transaction screenshot
- Missing — Phone/account identifier
- Optional — Profile or website URL

Target total section height: approximately `420–520px` desktop, driven by content rather than fixed blank space.

## COMPLAINT HUB AND WOMEN & CHILDREN

Create a compact decision page, not a giant route hero.

- route header around `220–280px` maximum when media exists
- two primary choices side by side on desktop:
  - anonymous complaint
  - registered complaint
- immediate-safety guidance becomes a separate urgent/info row
- add a compact `Before you continue` checklist using existing supported content
- compact provenance strip

## GUARDED REPORTING FLOW / ACT NOW

Make it feel like a focused application workspace.

Desktop:

- compact shell
- left phase rail around `200–220px`
- flexible task pane
- route/task H1 around `32–38px`
- compact urgent 1930 notice
- concise `What ThreadZero can do` boundary
- connected acknowledgement and Continue action
- useful task content visible within approximately `650–760px` after the header

Remove giant pink panels, oversized empty regions, and disconnected controls.

Preserve the complete guarded flow, editing, validation, evidence states, chronology, review, synthetic submission, and next actions.

## TRACK

Initial state:

- compact header
- reference input
- one short explanatory note

Valid synthetic reference state:

- current status
- key facts
- vertical timeline
- evidence readiness
- next action
- official handoff

Do not add fake analytics, charts, metrics, or government-processing claims.

## GUIDES

`guides`, `safety`, `awareness`, `volunteer-terms`, `unlawful-content`, and `accessibility` must not look like the same numbered list.

### Prepare before you report

Use an editorial guide layout:

- main reading column
- optional context rail
- What to collect
- Preserve originals
- Build a timeline
- Before opening the official portal

### Online safety

Use a compact practice matrix or open rows:

- Verify independently
- Protect recovery channels
- Use MFA
- Secure payments
- Keep devices updated
- Act quickly after fraud

Add one small `If something feels wrong` urgent panel.

### Accessibility

Use compact capability rows:

- Keyboard navigation
- Screen readers
- Contrast
- Text sizing
- Language
- Reduced motion

Do not make the page primarily a character illustration.

## REPORT ABUSE

Keep three stages, but remove giant cards:

1. Preserve
2. Use platform tools
3. Prepare complaint

Each stage should have:

- small number
- small icon
- title
- two or three short bullets or concise supporting copy

Then one compact official handoff band and provenance strip.

## ADVISORIES

Build a dense advisory directory using only supported current content.

- compact header
- category filter row where supported
- compact advisory records
- severity/category/date only when real current data supports them
- title, one-line summary, metadata, arrow

Do not invent five extra official advisories merely to fill the page. If current route data has only three entries, improve their presentation and make expansion data-driven.

No giant human illustration required.

## LEARNING CORNER

Do not use a numbered list or nine identical cards.

Use:

- one featured learning item
- category navigation for Guides, Safety, Awareness, Training, Media, FAQ, Accessibility
- compact latest/featured rows
- varied but coherent editorial rhythm

## MEDIA

Use:

- compact header
- real filter/tabs only when implemented truthfully
- one featured item
- compact media grid/list
- approved P08 covers where relevant

Do not bake interface copy into raster images.

## CONTACT

Keep three clear paths:

- financial fraud
- portal feedback
- grievance guidance

Cards/tiles should remain approximately `190–230px` maximum where cards are justified.

Then show:

- official reporting handoff
- urgent 1930 row
- compact provenance strip

## FAQ

Desktop:

- left `60–65%`: compact accordion
- right `35–40%`: quick access

Quick access:

- official tools
- nodal/grievance contacts
- policies
- volunteers

Keep multiple useful questions visible without giant cards.

## UTILITIES AND FORMS

Do not make all form routes identical.

- Identifier Check: compact verification form and result
- Website Check: URL task plus `what to inspect` guidance
- Mobile Connections: phone-related task plus explanatory rail
- Appeal: form plus before-you-appeal checklist
- Feedback: feedback form with a concise concept boundary
- Volunteer Register/Login: programme context appropriate to the route

Reuse field and validation primitives while varying information architecture.

## LEGAL

`policies`, `privacy`, `disclaimer`, `notices`, `grievance`, and `about` must be the quietest pages.

- no giant illustration
- no giant H1
- maximum prose width around `70ch`
- document navigation or compact disclosure sections
- clear heading hierarchy
- minimal surfaces

## FOOTER — P1 FIX

The mobile footer must not remain approximately 1,400px tall.

Desktop target:

- approximately `210–260px`
- ThreadZero text identity
- concise disclosure
- four route groups
- compact approved help illustration panel
- navy lower safety strip

Mobile order:

1. identity
2. help panel
3. social visual marks
4. collapsed route groups
5. compact lower strip

At `<=600px`, route groups must use accessible `<details>` accordions or an equivalent compact disclosure pattern. Do not permanently stack all 16 links.

Social marks remain non-linked unless genuine profile URLs exist.

## RESPONSIVE CONTRACT

Verify these exact viewports:

- `1672×941`
- `1440×900`
- `1024×768`
- `390×844`
- `320×568`
- `720×450`

Rules:

- no horizontal page scrolling
- no clipped menu/control/text
- no image rectangle
- no hidden task action
- side rails move below main content
- grids collapse intentionally
- mobile is reordered by task priority, not squeezed desktop layout
- footer groups collapse on mobile
- tables or dense records reflow without losing labels
- 720×450 behaves as a reflow stress test

## HINDI CONTRACT

Every changed structure must work in Hindi.

- do not shrink Hindi text to mimic English height
- allow vertical growth
- prevent clipped labels and buttons
- verify navigation, forms, source strips, route headings, footer disclosures, errors, and dialogs
- verify at minimum `1024×768`, `390×844`, and `320×568`, then include Hindi in the final automated matrix

## ACCESSIBILITY CONTRACT

Preserve and verify:

- skip link
- semantic header/nav/main/footer
- exactly one visible H1
- logical heading order
- real buttons and links
- associated form labels
- fieldsets/legends when grouping choices
- error-summary focus
- `aria-expanded` on disclosure/navigation controls
- live-region behavior
- keyboard-only operation
- visible focus
- 44px targets
- reduced motion
- 200% reflow
- readable contrast

## EXECUTION WAVES

Execute continuously. Do not stop for low-risk styling approval between waves.

### Wave 1 — Global system

- typography
- spacing
- density
- icons
- radii/borders/shadows
- compact route header
- shared rows/panels/forms
- source strip
- disclaimer deduplication
- mobile footer

Run tests and browser-check Home, one guide, one form, one legal route, and the footer.

### Wave 2 — Critical flows

- Home final polish
- Home Evidence Thread
- complaint hub
- women/children decision route
- Act Now/reporting workspace
- Track initial, invalid, and found states

Run the complete guarded flow and tracker verification.

### Wave 3 — High-visibility routes

- report abuse
- advisories
- learning corner
- guides
- safety
- awareness
- media
- FAQ
- contact
- accessibility

### Wave 4 — Remaining routes

- suspect hub
- identifier check
- website check
- report suspect
- mobile connections
- appeal
- volunteer routes
- training
- daily digest
- feedback
- grievance
- policies/privacy/disclaimer/notices/about

### Wave 5 — Whole-site QA and cleanup

- responsive matrix
- Hindi matrix
- keyboard/focus checks
- console checks
- remove obsolete selectors after replacements are proven
- consolidate duplicated CSS
- final route inventory and defect report

## REQUIRED AUTOMATED VERIFICATION

Run:

- `node --test core/*.test.mjs site/*.test.mjs`
- `git diff --check`
- the repository design validator if its required provenance inputs are available

If a validator is blocked by a missing ignored reference file, report that exact blocker separately. Do not misreport it as a product failure or fabricate a pass.

Create or extend one small browser-matrix script only if the current repository lacks a practical way to validate all routes. Do not add a framework.

For every public route, verify programmatically:

- route renders
- expected route remains active
- exactly one visible H1
- no document-level horizontal overflow
- no broken image
- no unexpected console error
- footer present except where intentionally omitted
- no missing renderer/composition

## REQUIRED FUNCTIONAL VERIFICATION

Exercise:

- Home navigation
- desktop navigation/dropdowns
- tablet/mobile menu
- language switching
- complaint decision routes
- Act Now acknowledgement
- incident selection
- evidence Ready/Missing/Optional states
- chronology editing and reordering
- review
- simulated submission
- valid tracker
- invalid tracker
- tracker reset
- browser back/forward
- reload/state behavior
- form validation and recovery
- footer internal links

## VISUAL QA PRIORITY

Fix in this order:

1. incorrect hierarchy or next action
2. broken responsive layout
3. oversized typography and hero space
4. repetitive route anatomy
5. excessive card/surface use
6. weak illustration usage
7. spacing and density
8. minor decorative polish

Rendered browser evidence is mandatory. Source code alone does not prove visual quality.

## FAILURE CONDITIONS

Do not call the rescue complete if any P0 or P1 remains.

### P0

- broken route
- broken reporting flow
- safety-boundary regression
- unusable mobile route
- major accessibility failure
- missing bilingual route content

### P1

- giant headings remain
- excessive bold text remains
- large unexplained gaps remain
- large source panels remain
- Home Evidence Thread remains scattered or image-dominated
- route families still look like one generic template
- form routes remain visually identical
- mobile footer remains extremely tall
- illustration reuse still feels generic
- route body looks unfinished
- horizontal overflow
- clipped menu or action
- important content hidden below decorative space

### P2

- minor spacing variation
- minor icon alignment
- small decorative differences

## STOP / ASK RULES

Do not ask about reversible visual decisions.

Stop and ask only if:

- a destructive repository action would be required
- a safety/product boundary is genuinely ambiguous
- a required credential or external authorization appears
- the current code cannot be preserved without losing work
- the user must approve a real external side effect

Otherwise choose the smallest safe, coherent solution and continue.

## FINAL OUTPUT CONTRACT

Return exactly these sections:

### RESULT

### EVIDENCE

### GLOBAL SYSTEM CHANGES

### TYPOGRAPHY CHANGES

### SPACING AND DENSITY CHANGES

### IMAGE/ILLUSTRATION CHANGES

### HOME EVIDENCE THREAD CHANGES

### ROUTE-FAMILY CHANGES

### ROUTES FIXED

### ROUTES VERIFIED

### REPORTING FLOW STATUS

### TRACKER STATUS

### RESPONSIVE STATUS

### HINDI STATUS

### ACCESSIBILITY STATUS

### AUTOMATED TEST OUTPUT

### PARTIALLY VERIFIED

### BLOCKED

### NOT ATTEMPTED

### REMAINING RISKS

### CHANGED FILES

### BEST NEXT MOVE

Use only evidence-backed statuses:

- Implemented
- Verified
- Partially verified
- Blocked
- Not attempted

Do not claim `pixel-perfect`, `100% accurate`, `production-ready`, `complete`, `responsive`, `accessible`, or `regression-free` unless current-run evidence proves the claim.

## CORE RULE

Do not merely make the current pages prettier.

Fix the underlying system:

- less bold
- smaller headings
- shorter route heroes
- less empty space
- smaller and fewer illustrations
- better information density
- task-specific compositions
- fewer generic cards
- compact provenance
- compact mobile footer
- a useful incident timeline
- clear actions
- preserved safety and functionality

The final website must feel like one professionally designed civic evidence service, not a collection of AI-generated templates.
