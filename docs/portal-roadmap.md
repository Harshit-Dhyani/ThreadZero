# Portal shell and capability roadmap

## Decision status

**Proposed visual base:** the editorial evidence-path direction represented by visual study 03.

It is the strongest foundation because it combines a humane question, a visible evidence-to-incident mechanism, restrained institutional color, and a layout that can recompose on mobile. The implementation may borrow the compact service rows and familiar navigation structure from visual study 02. It must not copy generated logos, security promises, government-approval signals, or guaranteed-action language.

This proposal is not human approval. Desktop and mobile golden screens still require review before the design contract is frozen.

## Product architecture

The complete concept is a public-service portal with one deeply implemented journey, not a single landing page.

### Global header

1. Text-led service identity: `National Cyber Crime Reporting Portal`.
2. Persistent qualifier: `Independent concept redesign`.
3. Utility controls: language, accessibility/help, and link to the official portal.
4. Primary navigation:
   - Report cybercrime
   - Check something suspicious
   - Track demo case
   - Learn and stay safe
   - Help and resources
5. Mobile navigation uses one menu button and a vertical list. It must not become a horizontal scroller.

### Urgent-action strip

- `Lost money through financial cyber fraud? Call 1930 now.`
- Provide `cybercrime.gov.in` as the official online destination.
- Keep the concept boundary adjacent to the guidance.
- In the prototype these are guidance links only; no telephone call or external submission is initiated.

### Homepage order

1. **Urgent help** — 1930 and official reporting destination.
2. **Citizen task router** — start with what happened, not government taxonomy.
3. **Evidence path** — message/contact → payment → one reviewable incident.
4. **Prepare a financial-fraud report** — primary V1 entry.
5. **Check something suspicious** — URL/website, UPI ID, or phone-number demo checker.
6. **Track a demo case** — explain a synthetic lifecycle without implying NCRP access.
7. **Scam simulator** — practice identifying red flags in deterministic scenarios.
8. **Scam patterns and safety guidance** — sourced, dated content; never a fake live feed.
9. **Evidence readiness** — what is Ready, Missing, or Optional.
10. **Help and official resources**.
11. **Full footer**.

The first viewport must show urgent guidance, the primary reporting action, and enough of the evidence mechanism to explain the redesign. Secondary tools continue below the fold.

## Capability contracts

### Financial-fraud report — primary V1

Implement the Home plus nine-step journey in `service-blueprint.md`. This remains the only end-to-end reporting flow and the submission remains explicitly simulated.

### Scam Radar — deterministic checker

Inputs:

- URL or website;
- UPI ID;
- Indian phone number.

Rules:

- Use native input validation and a small synthetic fixture list.
- Return `Known synthetic match`, `No match in this demo`, or `Check the format`.
- Never label an unknown identifier `Safe`.
- Explain that absence from the demo list does not establish legitimacy.
- Provide practical next checks and official reporting guidance.
- No network lookup, reputation API, AI, analytics, or user-data persistence.

### Track demo case

- Accept only documented synthetic references such as `DEMO-2026-08421`.
- Show an illustrative lifecycle: Prepared → Ready for official reporting → Keep records available.
- Do not claim police, court, bank, or NCRP status access.
- Unknown references receive a clear demo-boundary explanation rather than a fabricated result.

### Scam simulator

- Use three to five deterministic scenarios: phishing message, fake job offer, digital-arrest call, investment promise, and parcel/customs demand.
- Ask the citizen to identify red flags, then reveal the reasoning and safe next action.
- Use real controls, keyboard operation, progress text, and a results summary.
- Do not call it AI and do not award fake money, reputation, or certification.

### Scam patterns library

- Replace `live threat feed` claims with a dated educational library unless a real authoritative feed is integrated later.
- Every pattern needs a source, observed date, plain-language signs, and an official next action.
- No fabricated locations, report counts, maps, or `real-time` labels.

### Bounty and volunteer programs

A bounty portal is excluded from this prototype. It requires identity, moderation, secure evidence handling, legal terms, payout operations, and backend review. The portal may link to a verified official Cyber Volunteers or related program if the destination and wording are current.

## Footer

### Get urgent help

- Financial cyber fraud: 1930
- Official portal: cybercrime.gov.in
- State/UT contact directory when linked to a verified official source

### Report and track

- Prepare a financial-fraud report
- Track demo case
- Report another cybercrime on the official portal

### Check and learn

- Scam Radar
- Scam simulator
- Scam patterns
- Safety tips
- Citizen manual / FAQ when backed by verified links

### About and policies

- Independent concept redesign
- Synthetic-data and no-submission statement
- Accessibility statement
- Privacy statement for the local-only demo
- Disclaimer
- Source and last-reviewed date

Do not include fake ministry ownership, support email addresses, social accounts, copyright claims, or policy pages that do not exist.

## Visual system

- Base composition: editorial question on the left, evidence path on the right, task router immediately below.
- Typography: expressive but highly readable serif for major citizen questions; Noto Sans/Noto Sans Devanagari for navigation, controls, instructions, and forms.
- Palette: warm white, deep peacock/navy, institutional cobalt, restrained saffron, and urgent red.
- Geometry: rules, aligned rows, open whitespace, and one continuity line. Avoid card grids and literal architecture.
- Identity: text-led and visibly independent. No generated shield, emblem, seal, government artwork, or faux official crest.
- Motion: short evidence-to-event continuity only; reduced motion resolves instantly.

## Responsive structure

### Desktop

- Compact utility header and primary navigation.
- Two-column opening: citizen question/action and evidence explanation.
- Full-width task rows and secondary service sections.
- Multi-column footer with a separate disclosure band.

### Mobile

- Identity, disclosure, language/help, then menu.
- Urgent guidance before all other content.
- Single-column action followed by evidence steps.
- Service rows become stacked links with full-width targets.
- Footer groups use headings and ordinary vertical links; no hidden essential guidance.

## Implementation sequence

### Phase 0 — approve the system

1. Create one refined desktop golden screen based on visual study 03.
2. Create its 390×844 mobile counterpart.
3. Include real header, urgent strip, first-viewport content, one secondary section, and footer treatment.
4. Correct every generated claim and remove generated identity marks.
5. Obtain human approval.

### Phase 1 — shell and homepage

1. Implement the semantic global header, mobile navigation, urgent strip, homepage sections, and footer.
2. Use real content from the active contracts and verified source context.
3. Keep unfinished secondary tools clearly labelled as concept previews until their interactions exist.

### Phase 2 — primary reporting journey

Implement and verify Home plus the nine guarded report routes. This is the hackathon-critical path.

### Phase 3 — small utility demos

Add Scam Radar, Track demo case, and Scam simulator one at a time. Each receives its own deterministic fixture, static check, browser interaction proof, and accessibility pass.

### Phase 4 — sourced information surfaces

Add scam patterns, safety resources, FAQ/help, and verified official links. Do not add a fake live threat feed or bounty system.

### Phase 5 — final verification

Run the full viewport, keyboard, zoom, reduced-motion, language-wrapping, route, validation, console, and package checks in `verification.md`.

## Acceptance gate

The portal is not complete because a landing page looks good. Completion requires:

- approved desktop and mobile visual direction;
- complete semantic shell and footer;
- working primary report journey;
- truthful boundaries on every secondary tool;
- zero invented government capabilities;
- browser and accessibility evidence at all required viewports.

