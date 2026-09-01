# Onboarding guide host v2

- Status: superseded in production by the full-body v3 asset; retained as an approved upper-body archive
- Captured: 2026-09-01
- Source role: archived upper-body crop formerly used by the local assistant and contextual-tour host
- Generation tool: OpenAI ImageGen, followed by local checkerboard segmentation after two alpha-repair generations failed
- Selected master: `design-intelligence/assets/images/output/onboarding-guide-host-v2.png`
- Production derivatives: `public/assets/images/onboarding-guide-host-v2-640.webp`, `public/assets/images/onboarding-guide-host-v2-1200.webp`

## Generation direction

Revise the original 3D guide into a more charismatic adult Indian digital navigator with a confident warm expression, dynamic explaining pose, refined navy and civic-blue clothing, and three translucent blue orbit objects. Preserve an original identity and exclude readable text, logos, copied mascots, crowns, uniforms, seals, shields, locks, badges, national emblems, and fake official authority.

## User approval

The user explicitly described the new PFP as looking really good and asked for the blue objects to move at different speeds above the character. The orbit motion is implemented as separate decorative CSS layers so reduced-motion users can receive the still state.

## Technical proof

- Both ImageGen background-removal attempts returned opaque RGB files with raster checkerboards and were rejected as production files.
- The approved upper-body/PFP crop was segmented locally from the checkerboard source and checked on white and navy composites.
- Master dimensions: 1024 x 1024, RGBA PNG.
- Small derivative: 640 x 640, YUVA WebP.
- Large derivative: 1200 x 1200, YUVA WebP.
- Master SHA-256: `6E78F3406CDA3150D6FBEE22FCE5928C021F861611BEA7A50599C26DF07D1682`.
- Small SHA-256: `E5AC2AEF2623214312C82D688201645C89090E7C3DA389E02DFDC0857D88919D`.
- Large SHA-256: `2AF9DAC12BC0D14113E5C3613847855BFE925A76E03573A8C28F6F4DCCCDAD68`.
- The square crop deliberately excluded the technically unreliable shoe area from the earlier opaque full-body candidate. The v3 asset replaces it with a newly generated, verified full-body source after the user explicitly asked for the complete legs and shoes to remain visible everywhere.

## Product boundaries

- The character is decorative and never receives focus.
- HTML owns all headings, captions, progress, route answers, controls, warnings, and official guidance.
- Motion is CSS-only, supplemental, and disabled by `prefers-reduced-motion`.
- No runtime 3D engine, audio, speech synthesis, TTS, model call, external request, or network write is used.
