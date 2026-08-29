# ThreadZero V3 Wave 02 — P01 Character A Review

- **Generated:** 2026-08-28
- **Mode:** built-in `image_gen`
- **Scope:** normalized P01 only
- **Style authority:** Illustration Style Master v1.0
- **Identity authority:** Wave 01 P01 Character A sheet
- **Decision:** APPROVED — P01 Character A Master v1.0
- **Production status:** blocked

## Selected proof

![P01 Character A Master v1.0](proofs/approved/P01-character-a-master-v1.png)

| Field | Value |
|---|---|
| Authoritative file | `proofs/approved/P01-character-a-master-v1.png` |
| Dimensions | 1448×1086 — exact 4:3 |
| Pixel format | 32-bit ARGB |
| Background verification | genuine alpha; sampled background pixels are `A=0` |
| Page-canvas check | clean on `#FBFCFF`; no visible rectangle or matte halo |
| SHA-256 | `9B0C18EDAEC8D5698B2E3018F8B5D6564F8862CA2DC9C783525D87B17F4BF1E2` |

## Prompt specification

Generation request:

> Preserve Character A from the Wave 01 identity sheet while applying the exact facial simplification, calm 2D civic-editorial rendering, dark-navy contours, flat civic-blue fills, restrained shadow plane, and minimal hair detail of Illustration Style Master v1.0. Produce six separated views: near-front, three-quarter, standing with a generic phone, seated at a laptop, organizing a blank receipt and notes, and calm thoughtful concern. Keep one identical adult Indian woman with S2 skin, low ponytail, silver studs, civic-blue kurta, and white trousers. Use genuine transparent alpha with no labels, panels, checkerboard, canvas, skyline, decoration, logos, official cues, or extra props.

Background-extraction request:

> Remove only the baked checkerboard from the generated sheet and replace it with genuine transparent alpha. Preserve all six views, identity, pose, objects, layout, colors, outlines, shadows, and crop. Add no background, decoration, text, or new object.

## Attempt history

### Attempt 1 — rejected export

- Dimensions: 1448×1086.
- Pixel format: opaque 24-bit RGB.
- SHA-256: `074EFBD7F06C6E378FD827AFE70547BB8836AB04D9C5F9E03910A05DDB7E2662`.
- Result: rendering direction improved substantially, but the visible checkerboard was baked into the raster.
- Workspace disposition: not copied; reference-generation output only.

### Attempt 2 — intermediate proof

- The background-only extraction produced real alpha.
- Transparent pixels retain hidden RGB data, which some raw previewers display as a dark field; compositing on `#FBFCFF` proves those pixels are fully transparent.
- The edit changed the canvas from 4:3 to 3:2, so it was retained as draft 01 but not selected for the current review.

### Attempt 3 — targeted composition and identity revision

- Dimensions: 1448×1086 — exact 4:3.
- Pixel format: opaque 24-bit RGB.
- SHA-256: `85C57B6C7ABF16668CDD5450F2524A303CB5B99EF46F0FB3C02A2C385B4B2973`.
- Result: restored the required canvas and retained the simplified family direction, but baked another checkerboard and did not fully correct the thoughtful face.
- Workspace disposition: not copied; reference-generation output only.

### Attempt 4 — selected draft 02

- Background extraction preserved the 1448×1086 4:3 canvas.
- Pixel format: 32-bit ARGB with fully transparent sampled background pixels.
- SHA-256: `9B0C18EDAEC8D5698B2E3018F8B5D6564F8862CA2DC9C783525D87B17F4BF1E2`.
- Result: technical export gates pass; thoughtful-pose identity remains the only blocking visual defect.

### Attempt 5 — rejected identity-only correction

- Dimensions: 1448×1086.
- Pixel format: opaque 24-bit RGB.
- SHA-256: `DA6D01243EDE94C20704EB557CA1E225933A6F0BA261EE6B71E23190398A542F`.
- Result: did not materially improve the thoughtful face and reintroduced a baked checkerboard.
- Workspace disposition: not copied; draft 02 remains the stronger proof.

## What passes

- much closer to Style Master v1.0 than Wave 01;
- simplified eyes, face, hair, and shading;
- stable low-ponytail, earrings, kurta, and skin identity in most views;
- calm ordinary-citizen posture;
- six required actions are present;
- exact 4:3 review canvas;
- no tote bag, government cue, shield, lock, readable text, or decorative background;
- true alpha blends cleanly on the destination canvas.

## Accepted tolerance

- The thoughtful pose has a small facial-proportion variation, but it remains within the approved character-model tolerance.
- Later generation must condition only on the approved master file, not the opaque checkerboard attempts or superseded draft 01.
- Character A identity, clothing, simplified rendering, 4:3 layout logic, and verified alpha are frozen for later work.

## Gate

P01 is `APPROVED`. Generate P02–P05 as one controlled proof wave, then stop and review P01–P05 side-by-side before P06–P08 or any website implementation.
