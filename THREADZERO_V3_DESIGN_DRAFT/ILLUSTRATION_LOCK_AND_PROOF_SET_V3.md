# ThreadZero V3 Illustration Lock and Proof Set

- **Status:** APPROVED FOR P01–P05 PROOF GENERATION — 2026-08-28
- **Version:** 3.0-draft.1
- **Scope:** illustration system and proof-set planning only
- **Generation status:** P01–P05 PROOFS AUTHORIZED; PRODUCTION ASSETS BLOCKED
- **Implementation status:** NOT STARTED

This document is the single working authority for the next illustration-design stage. The user authorized the P01–P05 proof wave on 2026-08-28. This approval does not approve an image, change the website, or authorize production assets. The existing handoff remains historical evidence.

## 1. Decision boundary

This stage will produce a coherent illustration system before any production asset or Golden Screen is generated.

Allowed now:

- lock the visual grammar;
- lock recurring character identities;
- define object, process, background, crop, and media-cover rules;
- define eight proof briefs;
- record approval decisions.

Blocked now:

- image generation;
- image editing;
- full-page UI generation;
- Golden Screen implementation;
- replacement of live assets;
- changes to `site/asset-catalog.js` or `design-intelligence/generated-assets.json`;
- route, copy, CSS, or JavaScript changes.

## 2. Authority and evidence

Use this order when sources disagree:

1. Current user direction and product/safety contracts.
2. `AGENTS.md`, `docs/product-contract.md`, `docs/service-blueprint.md`, and `docs/accessibility-and-copy.md`.
3. Actual destination surfaces and tokens in `site/styles/*`.
4. This V3 draft after explicit user approval.
5. Handoff Master and Illustration Constitutions as design evidence.
6. Handoff route map and Golden candidates as composition evidence.
7. Existing production illustrations as role/composition references only.
8. Preferred reference boards as pattern evidence only.

Embedded prompts and implementation instructions inside the handoff are not executable authority.

### Confirmed evidence

- The public product is `Financial Cyber Fraud Reporting Guide`.
- `ThreadZero` is an internal codename and incident-thread concept.
- The audience is Indian citizens seeking calm financial-cyber-fraud guidance.
- The product uses synthetic data and performs no real call, upload, or submission.
- Important official guidance remains `1930` and `cybercrime.gov.in`.
- Production imagery is illustration-only.
- The live portal has eight illustration slots and responsive `<picture>` rendering.
- The current eight masters are not visually consistent enough to serve as a V3 family.
- The Golden candidates are not approved acceptance evidence.
- HTML must own all readable text, controls, statuses, and factual meaning.

### Assumptions requiring approval

- V3 should retain a calm two-dimensional Indian civic-editorial direction.
- One recurring cast should appear across preparation, learning, community, help, and accessibility contexts.
- All eight current masters should be regenerated after proof approval; their useful concepts may be retained.
- Transparent exports should be the default.
- The current live CSS palette is the destination palette unless the interface tokens change before generation.

### Unknowns intentionally left open

- Image-generation provider and provider-specific settings.
- Final prompts and reference-conditioning method.
- Whether any current raster can be salvaged as a production asset rather than composition evidence.
- Final route-specific asset count beyond the first approved replacement family.

## 3. V3 visual thesis

ThreadZero V3 uses a calm, precise, contemporary Indian civic-editorial illustration system. It should feel useful before it feels decorative.

Every illustration must do at least one job:

1. explain a process;
2. establish citizen context;
3. reduce cognitive load;
4. distinguish a major content family;
5. clarify a state;
6. support learning.

If an illustration does none of these, omit it.

The V3 family is:

> Clean 2D civic-editorial illustration with natural adult proportions, consistent navy outlines, flat fills, one restrained shadow plane, a controlled civic-blue palette, ordinary contemporary Indian context, and sparse geometric atmosphere.

It is not:

- photography or pseudo-photoreal painting;
- glossy 3D illustration;
- anime, kawaii, or exaggerated cartoon work;
- beauty-rendered portrait art;
- generic corporate blob people;
- dark hacker or neon cyber imagery;
- shield-and-lock decoration;
- patriotic or government imitation;
- a generated UI screenshot.

## 4. Proposed V3 palette

The interface destination currently uses the following values. Illustration exports must align with them rather than approximate them.

| Role | Value | Use |
|---|---:|---|
| Deep outline | `#071D41` | primary outlines, hair, deepest details |
| Deep navy | `#06152F` | selective dark objects and clothing |
| Supporting navy | `#0A2B5E` | internal lines and secondary dark fills |
| Civic blue | `#084FC6` | primary clothing and object accents |
| Action blue | `#0964E8` | focal actions and process connectors |
| Pale blue | `#EAF2FF` | supporting fills |
| Blue wash | `#F4F8FF` | low-intensity atmosphere |
| Page canvas | `#FBFCFF` | fallback baked background only |
| Card surface | `#FFFFFF` | card-specific fallback only |
| Success | `#087A55` | verified/readiness accents only |
| Urgent | `#C9252D` | official urgent guidance only |
| Warning | `#9B6200` | caution/missing guidance only |

### Skin palette

Skin color is human context, not a brand accent. Use these proposed base/shadow pairs consistently:

| Code | Base | Shadow |
|---|---:|---:|
| S1 light warm | `#F2C3A1` | `#D99A77` |
| S2 medium warm | `#D99867` | `#B9714C` |
| S3 medium-deep warm | `#AA6747` | `#824A35` |
| S4 deep warm | `#714333` | `#503024` |

Rules:

- one base and one shadow tone per person;
- no pink or grey desaturation;
- no glossy highlights or skin texture;
- preserve the same skin pair whenever a recurring character returns.

## 5. Drawing grammar

### Anatomy

- standing adult proportion: approximately 1:7 to 1:7.5 head-to-body;
- seated figures retain believable torso and limb lengths;
- hands are readable, with restrained size and simplified fingers;
- natural shoulders and posture;
- no oversized eyes, heads, hands, or smiles.

### Faces

- medium almond or softly rounded eyes;
- simple dark pupils without glossy portrait highlights;
- clean eyebrow shapes;
- simplified nose bridge and nostril mark;
- small natural mouth;
- calm or attentive default expression;
- concern shown through brow and posture, not panic.

### Hair

- primary mass `#071D41`;
- at most one supporting highlight plane in `#0A2B5E`;
- no individual-strand rendering;
- no pure-black hair unless export constraints require it.

### Lines

- primary outline: visually equivalent to 3px on a 1600px-wide master;
- internal line: visually equivalent to 1.5–2px;
- rounded joins and caps;
- people and objects use the same outline philosophy;
- no black sketch lines, painterly edges, wobble, or comic-heavy contours.

### Shading

- flat base fill;
- one restrained shadow plane;
- optional small highlight only when needed for separation;
- consistent upper-left light direction;
- no gradients, bloom, metallic gloss, airbrushing, or multiple light sources.

## 6. Recurring character lock

These traits are proposed as exact V3 identities. Approval freezes them for the proof stage.

### Character A — preparation and learning

- young adult Indian woman;
- skin S2;
- oval face with a softly tapered chin;
- medium almond eyes and straight brows;
- dark navy hair with a side part and low ponytail;
- no bindi by default;
- small silver stud earrings;
- plain civic-blue kurta with narrow navy piping;
- calm, attentive expression;
- signature objects: phone, receipt, notes, laptop, book.

- May change: pose, crop, object, hand position, calm-to-concerned expression.
- May not change: face, age, skin pair, hair, earrings, core kurta language, rendering style.

### Character B — evidence and review

- young adult Indian man;
- skin S3;
- softly rectangular face;
- short navy hair with a restrained side sweep;
- clean-shaven;
- pale-blue button shirt with rolled sleeves and navy trousers;
- calm, task-focused expression;
- signature objects: transaction paper, ordered records, laptop, evidence folder.

- May change: pose, crop, object, hand position.
- May not change: face, age, skin pair, hair silhouette, facial-hair state, shirt language, rendering style.

### Character C — community and help

- young-to-middle adult Indian woman;
- skin S4;
- softly rounded face;
- shoulder-length gently wavy navy hair with a side part;
- small silver hoop earrings;
- white kurta with a civic-blue dupatta;
- supportive, attentive expression;
- signature objects: phone, printed guide, community handoff material.

### Character D — Sikh community guidance

- young-to-middle adult Sikh man;
- skin S3;
- navy turban with one simple fold rhythm;
- short, neatly shaped full beard;
- off-white kurta with a narrow civic-blue placket;
- calm, approachable expression;
- signature objects: printed guide, phone, folder.

### Character E — accessibility user

- young adult Indian man;
- skin S3;
- short softly wavy navy hair;
- clean-shaven;
- civic-blue shirt and warm-beige trousers;
- modern dark-navy manual wheelchair with realistic wheel geometry;
- active, everyday posture using a laptop or keyboard;
- never framed as passive, inspirational, clinical, or charitable.

Accessibility must also be represented through objects and UI concepts: keyboard navigation, focus, screen-reader/audio support, contrast, text resizing, language, and reduced motion.

## 7. Object-family lock

The shared object family includes:

- smartphone;
- laptop;
- browser/window frame;
- message bubble;
- link/website symbol;
- receipt and payment record;
- neutral payment-card or UPI abstraction;
- document/report and folder;
- notification bell and alert symbol;
- calendar/time and location pin;
- user/contact state;
- book/manual and media tile;
- focus indicator, keyboard, audio/screen-reader, contrast, and text-size controls;
- evidence attachment and timeline node;
- phone/SIM abstraction.

Construction rules:

- the same navy outlines as people;
- 10px master-space corner radius for large rectangles and 6px for small ones;
- frontal or shallow 3/4 perspective only;
- flat fills plus one shadow plane;
- pale-blue support, civic-blue focus;
- semantic green, red, or amber only when necessary;
- no logos, branded payment apps, fake official interfaces, or readable generated text;
- abstract content lines may appear only as short bars or dots.

## 8. Evidence Thread lock

Canonical visible sequence:

`Message → Link / Website → Payment / Receipt → Contact Lost`

Canonical underlying product sequence:

`fact → evidence → event → incident → next action`

Visual rules:

- left-to-right on desktop;
- top-to-bottom or two-by-two reflow on narrow screens;
- four consistent nodes;
- action-blue connector;
- small circular connection points;
- one semantic object per node;
- white or pale-blue node surfaces with navy outlines;
- no raster labels; HTML supplies every label;
- contact loss uses a neutral interrupted connection, not a distressed face;
- no shield, lock, hacker, or fake browser screenshot.

## 9. Background and page-integration lock

Default export:

- transparent PNG master with clean alpha edges;
- transparent WebP derivatives when supported;
- no matte halo.

Fallback only when transparency is unsuitable:

- `#FBFCFF` for the current page canvas;
- `#FFFFFF` for a known white-card slot;
- document the destination surface with the asset.

Motif library:

1. pale full circle;
2. cropped arc;
3. quarter-circle block;
4. 4×4 dot matrix;
5. thin outlined circle;
6. short line motif;
7. restrained plant silhouette for human interior scenes;
8. rare action-blue diagonal plane for a major hero only.

Use no more than two motif types per ordinary asset and three in a large hero. Motifs remain 8–20% intensity. Never reduce opacity on the complete illustration.

Hard failures:

- visible accidental rectangle;
- approximate off-white canvas;
- gradient wash;
- random blob family;
- CSS opacity used to hide poor blending;
- art floating inside an arbitrary decorative frame.

## 10. Slot and crop rules

| Slot | Preferred family | Art prominence | Crop rule |
|---|---|---:|---|
| Home preparation | Character A editorial scene | 34–44% hero | subject safe in right 42%; clear text zone left |
| Evidence Thread | process/object | 45–60% section | all four nodes survive 16:9 and stacked reflow |
| Review/transaction | Character B editorial scene | 22–34% | subject and records separable for responsive crop |
| Learning | Character A editorial scene | 30–40% | distinct pose from Home; no exact scene reuse |
| Safety/advisory | object/still life | 16–28% | compact silhouette; no large human |
| Awareness/community | Characters C/D, optionally A or B | 30–40% | group remains readable without tiny faces |
| Accessibility | Character E plus access objects | 22–34% | wheelchair and active task remain fully visible |
| Help/footer | C/D compact guidance scene | compact freeform | transparent bounding box; no large background field |

Usually use no large illustration on identifier, website, appeal, mobile-connections, tracker-entry, privacy, disclaimer, or dense directory surfaces.

## 11. Media-cover family

Media covers must look publisher-made, not independently generated.

Shared anatomy:

- one focal subject using approximately 60% of the frame;
- one recurring corner crop;
- maximum two motif types;
- consistent line, shading, and palette;
- no baked title, metadata, duration, or play icon;
- HTML owns labels and interaction cues;
- subject remains inside a central 70% crop-safe region.

Content variants:

- **Video, 16:9:** darker navy/civic-blue field with one clear action.
- **Infographic, 4:3:** pale canvas and structured object/process arrangement.
- **Campaign, 4:5:** bolder human/community composition with a text-free calm area.
- **Guide, 4:3:** document/book/manual still life on a pale or transparent field.

Do not generate each cover from an open-ended standalone direction. Topic variables may change; the family grammar may not.

## 12. India, safety, and truth rules

Approved context:

- Indian facial and skin-tone diversity;
- ordinary contemporary clothing;
- common phone, receipt, payment, and home/study/work contexts;
- Hindi/English capability represented in HTML, not generated raster text;
- diverse ages and access needs when relevant.

Prohibited:

- flags, Ashoka emblem, ministry seals, official marks, or government buildings;
- police or military uniforms;
- monument skylines or tricolor decoration;
- fake support agents or official-looking portals;
- crying victims, threatening hackers, shattered screens, panic, or horror lighting;
- claims of fund freezing, recovery, official processing, or guaranteed action;
- factual guidance that exists only inside an image.

## 13. Current-master disposition

Every current asset may inform composition, but none is V3-approved.

| Existing master | Decision | What may be retained | Why it fails V3 |
|---|---|---|---|
| `hero-report-preparation-illustration-v1` | REGENERATE | preparation action and right-weighted composition | painterly face/hair, detailed shading, opaque canvas, incompatible warning object |
| `evidence-thread-illustration-v1` | REGENERATE | four-stage sequence | separate flat-icon language, opaque canvas, inconsistent object depth |
| `transaction-review-illustration-v1` | REGENERATE | review action and records | different human style, moustached identity conflicts with proposed B, opaque canvas |
| `guides-learning-illustration-v1` | REGENERATE | learning action and books | different Character A identity, detailed clothing/hair, opaque canvas |
| `safety-advisory-illustration-v1` | REGENERATE | compact device-and-alert concept | glossy/semi-3D object language, inconsistent strokes, opaque canvas |
| `awareness-community-illustration-v1` | REGENERATE | three-person community context | unapproved cast identities, different facial construction, opaque canvas |
| `accessibility-illustration-v1` | REGENERATE | active wheelchair-and-laptop context | different line/shading system and opaque canvas |
| `help-footer-illustration-v1` | REGENERATE | collaborative help concept | gradient field, unapproved cast identities, excessive background canvas |

## 14. Eight proof-set briefs

These are art-direction briefs, not generation prompts. Provider-specific prompt writing remains blocked until this document is approved.

### P01 — Character A model sheet

- **Purpose:** prove one stable preparation/learning identity.
- **Review surface:** 4:3 transparent board; provider may use its nearest supported resolution; long edge at least 1600px.
- **Required views:** near-front, 3/4, seated, standing, phone interaction, laptop/notes interaction, neutral expression, attentive expression.
- **Must prove:** identical face, skin, hair, earrings, kurta language, line weight, and shading across every view.
- **Reject if:** the board contains multiple look-alike people rather than one character, inconsistent hands, beauty rendering, labels, or a baked background.

### P02 — Character B model sheet

- **Purpose:** prove one stable evidence/review identity.
- **Review surface:** 4:3 transparent board; long edge at least 1600px.
- **Required views:** near-front, 3/4, seated, standing, paper review, laptop/folder interaction, neutral expression, focused expression.
- **Must prove:** clean-shaven identity, stable hair silhouette, S3 skin pair, pale-blue rolled-sleeve shirt, shared family grammar with P01.
- **Reject if:** facial hair appears, age changes, the shirt becomes formal authority wear, or rendering differs from P01.

### P03 — Community cast C/D sheet

- **Purpose:** prove two distinct recurring characters that still belong to the same world.
- **Review surface:** 3:2 transparent board; long edge at least 1600px.
- **Required views:** separate 3/4 portraits, standing interaction, shared phone/guide scene, calm expressions.
- **Must prove:** stable C and D identities, respectful Sikh representation, no authority cues, matching anatomy/line/shading with P01/P02.
- **Reject if:** the turban/beard changes between views, C becomes a generic variation of A, or the pair looks ceremonial.

### P04 — Character E accessibility sheet

- **Purpose:** prove respectful recurring accessibility representation.
- **Review surface:** 4:3 transparent board; long edge at least 1600px.
- **Required views:** front/3/4 seated identity, laptop task, keyboard task, conversational pose, wheelchair detail.
- **Must prove:** consistent person, realistic manual wheelchair, active everyday posture, shared family grammar.
- **Reject if:** wheelchair geometry is broken, the chair obscures anatomy, the framing becomes clinical/charitable, or disability is treated as inspiration.

### P05 — Object-family sample

- **Purpose:** lock one object construction language before route scenes.
- **Review surface:** transparent grid without baked labels.
- **Required objects:** phone, laptop, message, browser/link, receipt, payment abstraction, document/folder, alert, timeline node, contact-lost state, keyboard/focus, text-size/audio support.
- **Must prove:** common outline, radii, perspective, fill, and shadow system.
- **Reject if:** objects mix flat icons with glossy 3D assets, contain readable text/logos, or rely on shields/locks.

### P06 — Evidence Thread diagram

- **Purpose:** prove the signature mechanism using the approved P05 objects.
- **Review surface:** transparent 16:9 master with a documented stacked/mobile arrangement.
- **Required sequence:** message, link/website, payment/receipt, contact lost.
- **Must prove:** four equal nodes, connector grammar, calm semantic accents, legibility without raster labels, responsive separability.
- **Reject if:** it resembles a fake UI, infographic poster, security shield sequence, or cannot reflow without losing meaning.

### P07 — Character A preparation scene

- **Purpose:** prove that an approved model sheet survives a real editorial composition.
- **Review surface:** transparent 16:9 master; subject weighted to the right with a left text-safe zone.
- **Scene:** Character A calmly organising a phone, receipt, and notes at a simple desk.
- **Must prove:** exact P01 identity, exact P05 objects, restrained motifs, flat shading, clean page integration, task clarity.
- **Reject if:** Character A drifts, the desk becomes a fake interface, the image uses an opaque canvas, or the scene becomes painterly.

### P08 — Media-cover family sample

- **Purpose:** prove one publisher family across different content formats.
- **Review surface:** four coordinated cover samples shown together: video 16:9, infographic 4:3, campaign 4:5, guide 4:3.
- **Topics:** phishing link, evidence sequence, community safety, evidence guide.
- **Must prove:** shared corner crop, density, motif, object/human grammar, and crop-safe subject placement.
- **Reject if:** any cover looks independently branded, contains title/play/duration text, or uses a different illustration style.

## 15. Side-by-side approval protocol

Do not approve proofs individually while hiding the rest.

Review all eight together at:

- full-size desktop;
- 50% scale;
- approximate 320px thumbnail scale;
- light page canvas `#FBFCFF`;
- white card surface `#FFFFFF` where applicable.

For every proof, record exactly one status:

- `APPROVED` — safe to use as a locked reference;
- `REVISE` — concept is valid but specific defects require another pass;
- `REGENERATE` — composition or family identity is fundamentally wrong;
- `NOT GENERATED` — no proof exists yet.

### Approval matrix

| Proof | Artifact | Status | Reviewer notes |
|---|---|---|---|
| P01 | Character A model sheet | REVISE | Agent preflight: identity/expression drift, over-detailed hair, alpha-edge artifacts; user review pending |
| P02 | Character B model sheet | REVISE | Agent preflight: expression drift, over-detailed hair, alpha-edge artifacts; user review pending |
| P03 | Community cast C/D | REVISE | Agent preflight: selected second draft uses a non-uniform baked light canvas and slightly different rendering weight; user review pending |
| P04 | Character E accessibility sheet | REVISE | Agent preflight: wheelchair construction and rendering depth vary by pose; user review pending |
| P05 | Object-family sample | REVISE | Agent preflight: excessive gloss/depth and prohibited raster letters in accessibility controls; user review pending |
| P06 | Evidence Thread diagram | NOT GENERATED | — |
| P07 | Character A preparation scene | NOT GENERATED | — |
| P08 | Media-cover family | NOT GENERATED | — |

## 16. Pass/fail rubric

Any failed criterion blocks approval.

| Criterion | Pass requirement |
|---|---|
| Family resemblance | All proofs unmistakably share one human/object system |
| Character identity | Face, age, skin, hair, clothing, and accessories remain stable |
| Anatomy | Adult proportions and readable hands/limbs |
| Line system | Common navy outline and internal-line treatment |
| Palette | Only approved brand, skin, and semantic colors |
| Shading | Flat base plus one shadow plane; no gradients or gloss |
| Object grammar | Common radii, perspective, outline, and depth |
| Motifs | Only approved motifs within quantity limits |
| Page integration | Transparent or exact destination surface; no rectangle/halo |
| Indian context | Ordinary, contemporary, diverse, and non-tokenizing |
| Accessibility | Active and respectful; not clinical or inspirational |
| Government safety | No identity, emblem, uniform, or official implication |
| Generated text | No readable raster text or UI |
| Repetition | Recurring identity without duplicate scene composition |
| Task relevance | Visual explains or orients instead of filling space |
| Responsive use | Subject survives the documented crop/reflow |

## 17. Gate after approval

Only after this written lock is approved:

1. select the generation provider and reference-conditioning method;
2. write the immutable generation kernel;
3. write P01–P08 provider-specific prompts;
4. generate only the proof set;
5. review all proofs side-by-side;
6. revise until every proof has an explicit user decision;
7. generate route-specific replacement masters from approved proofs;
8. update provenance and `IMAGE_DIMENSIONS` only for approved assets;
9. build browser-native Golden routes;
10. capture viewport, language, and interaction-state evidence from the real browser.

Full-page generated UI imagery is never implementation or acceptance evidence.

## 18. V3 completion definition

This illustration-design stage is complete only when:

- this lock is explicitly approved;
- P01–P08 exist;
- every proof has an explicit status;
- all approved proofs pass the rubric side-by-side;
- recurring identities and object grammar are reproducible;
- transparent/page-integration behavior is proven;
- no prompt, asset, or source claims government identity or real service behavior.

Until then, production generation remains blocked.
