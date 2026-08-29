# V5.3 visual contract

Status: active implementation contract. Historical visual records remain unchanged.

## Identity and type

- Public title: Financial Cyber Fraud Reporting Guide; never imply government ownership.
- Identity mark: the existing Lucide Waypoints concept mark. Shields, locks, logos, uniforms, and fake official marks are prohibited.
- Type: self-hosted Geist with Noto Sans Devanagari fallback.
- Palette: the existing civic blue, navy, canvas, urgent, success, and warning tokens in `src/app/globals.css`.

## Route anatomy

- Preserve six workspaces and the five-stage Report journey.
- Home is a gateway; Check is one utility workspace; Track is a status record; Learn is situation-first; Help is support; Legal is a narrow reading surface.
- Dense Guide, Evidence, and abuse workspaces use task content rather than decorative illustration.
- Every public route keeps one visible H1, the demo boundary, 44px targets, visible focus, and reduced-motion support.

## Assets

- `src/lib/assets/index.ts` is the only production illustration registry.
- Only approved responsive derivatives with recorded dimensions and required alpha proof may ship.
- Decorative assets have empty alt text; meaningful covers require English and Hindi alt text.
- HTML and CSS own all readable labels, controls, claims, and status text.

## Interaction

- Retain the 160ms CSS interaction system; do not add an animation library.
- Entered Check values remain in component memory only and never enter URLs, browser storage, or network requests.
- Child Check URLs redirect to `/official-tools?mode=...`; only the mode is encoded.
