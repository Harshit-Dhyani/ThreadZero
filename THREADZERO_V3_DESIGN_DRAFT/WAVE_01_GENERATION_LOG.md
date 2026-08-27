# ThreadZero V3 Proof Wave 01 Generation Log

- **Date:** 2026-08-28
- **Mode:** built-in `image_gen`
- **Intent:** new raster proof generation
- **Scope:** P01–P05 only
- **Approval:** none of these images is production-approved

## Shared prompt kernel

Every selected proof used this common direction:

> Clean two-dimensional Indian civic-editorial illustration with crisp vector-like raster finish, realistic adult proportions where people are present, consistent rounded navy outlines, flat fills, one restrained upper-left shadow plane, civic blue/navy/white palette, calm contemporary Indian context, no readable raster text, no logos or watermark, no government identity, no shield/lock/hacker imagery, no photography, 3D, anime, chibi, painterly edges, or decorative cyber theatre.

Preferred background instruction:

> Genuinely transparent alpha with clean antialiased edges and no checkerboard, matte, or halo. P03 used the permitted `#FBFCFF` fallback after its first generation produced a prohibited dark gradient.

## Selected prompt specifications

### P01 — Character A

- Six-view 4:3 model sheet.
- Same young adult Indian woman in near-front, 3/4, standing-phone, seated-laptop, receipt-and-notes, and concerned-expression views.
- S2 skin pair `#D99867` / `#B9714C`.
- Low navy ponytail, silver studs, no bindi, civic-blue kurta with navy piping.
- Transparent background; no panels, labels, logos, government marks, shields, or locks.

### P02 — Character B

- Six-view 4:3 model sheet.
- Same young adult Indian man in near-front, 3/4, standing-folder, paper-review, laptop, and focused-expression views.
- S3 skin pair `#AA6747` / `#824A35`.
- Clean-shaven, short side-swept navy hair, pale-blue rolled-sleeve shirt, navy trousers.
- Transparent background; blank papers; no tie, badge, uniform, labels, or official identity.

### P03 — Characters C/D

- Six-group 3:2 community-cast sheet.
- Character C: S4 skin, shoulder-length wavy navy hair, silver hoops, white kurta, civic-blue dupatta.
- Character D: S3 skin, navy turban, short full beard, off-white kurta with blue placket.
- Four identity portraits plus shared phone and printed-guidance poses.
- Selected second generation requested one flat `#FBFCFF` canvas and prohibited dark fields, gradients, ceremony, authority cues, and readable text.

### P04 — Character E

- Six-view 4:3 accessibility-character sheet plus wheelchair detail.
- Same young adult Indian man, S3 skin, short wavy navy hair, clean-shaven, civic-blue shirt, beige trousers.
- Consistent modern manual wheelchair, laptop task, keyboard task, and conversational pose.
- Active everyday representation; no medical, clinical, charitable, or inspirational framing.
- Transparent background.

### P05 — Object family

- Twelve-object 4:3 unlabeled sheet.
- Phone, laptop, message, browser/link, receipt, payment abstraction, document/folder, alert, timeline node, contact-lost state, keyboard/focus, and text-size/audio support.
- Shared navy outline, shallow perspective, flat fills, consistent radii, and transparent background.
- No brands, fake UI, government symbols, shields, locks, people, or readable raster text.

## Selected files and hashes

| Proof | Workspace file | SHA-256 |
|---|---|---|
| P01 | `proofs/wave-01/P01-character-a-model-sheet-draft-01.png` | `88C7AC9F4BE19AAA6CC5E69BE052D7A90F953A21E0D163C248AFB1E058E0663B` |
| P02 | `proofs/wave-01/P02-character-b-model-sheet-draft-01.png` | `3C96FBF941441FCDED9783F7F133285139E03600703F19B05D347C5D56C5EB2E` |
| P03 | `proofs/wave-01/P03-community-cast-cd-draft-02.png` | `B7BB3D04302067AB8850D0D96495E5721ABCE389148AB13EF80E8B7627BA73C5` |
| P04 | `proofs/wave-01/P04-character-e-accessibility-draft-01.png` | `2775F6B30C8D59E3ADAAFB92902A5F2BF36B6414253B3424B1C0EF32B0FC0E8C` |
| P05 | `proofs/wave-01/P05-object-family-draft-01.png` | `3A8A101D8BB467D14130EB7F33A80D47BC66C56E4F61513A33740D1009C4FE11` |

## Rejected attempts

- Two P01 reference-based refinements improved flatness but baked a checkerboard instead of real alpha; neither was copied into the workspace.
- The first P03 attempt produced a prohibited dark gradient backdrop; it was regenerated and not copied into the workspace.

## Technical background verification

- P01, P02, P04, and P05 are 32-bit PNGs with transparent corner samples.
- P03 is a 24-bit opaque PNG whose corner values vary near `#FBFCFF`; it therefore remains marked `REVISE`.
