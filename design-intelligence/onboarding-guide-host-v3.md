# Onboarding guide host v3

- Status: approved full-body production asset
- Captured: 2026-09-01
- Source role: floating local assistant, assistant-dialog avatar, and contextual-tour host
- Generation tool: OpenAI ImageGen edit using the approved full-body guide as the visual reference, followed by deterministic local chroma-key removal and responsive WebP export
- Selected master: `design-intelligence/assets/images/output/onboarding-guide-host-v3.png`
- Production derivatives: `public/assets/images/onboarding-guide-host-v3-640.webp`, `public/assets/images/onboarding-guide-host-v3-1200.webp`

## Generation direction

Preserve the approved ThreadZero guide's face, hair, moustache, expression, navy and civic-blue clothing, open-hand explaining pose, shoes, and three translucent blue orbit objects. Keep the complete body visible from hair to both shoe soles with clear padding. Generate no text, logo, badge, uniform, seal, shield, lock, government identity, or copied mascot.

## User approval and correction

The user had already approved this guide's appearance and explicitly said the legs looked good and must be shown everywhere. Version 3 preserves that approved appearance while replacing the square upper-body crop with the complete full-body composition.

## Technical proof

- ImageGen source: `C:/Users/user/.codex/generated_images/01a05b6e-e381-7f12-a15b-b0f5f1076b28/exec-85e6bf0e-1390-4b72-a699-f019ccda6912.png`.
- ImageGen prompt used the approved guide as a reference and requested a complete 2:3 full-body composition on a chroma-key background.
- The chroma-key background was removed locally; no background pixels or checkerboard raster are shipped.
- Master dimensions: 1024 x 1536, RGBA PNG.
- Small derivative: 640 x 960, alpha WebP.
- Large derivative: 1200 x 1800, alpha WebP.
- Master SHA-256: `B4B9332E23225B020993A5A34CE95A82249B1AEEF8AC87B766BCB4EECD152360`.
- Small SHA-256: `59346FBA96D4B03EE0702504871B89D742E5F2777CD5CDF39DEDFF915D0F2C23`.
- Large SHA-256: `1101957FF547A01B3EFBB640F9CE90B30CA929E3B1F117616D82460E13BEF2FD`.
- Transparent master and both composites on navy and canvas backgrounds were visually checked; the full legs, ankles, and both shoes remain intact without green spill.

## Product boundaries

- The character is decorative and never receives focus.
- HTML owns every heading, caption, progress label, answer, warning, and control.
- Motion is CSS-only and disabled by `prefers-reduced-motion`.
- No runtime 3D engine, audio, speech synthesis, TTS, model call, external request, or network write is used.
