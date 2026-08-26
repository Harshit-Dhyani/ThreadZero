# Civic Evidence Ledger design system

## Visual thesis

The interface should feel like a carefully typeset public-service record: calm, legible, accountable, and visibly independent. Its identity comes from the evidence-to-event relationship, not from decoration.

Use aligned rows, rules, chronology, and typographic hierarchy. Avoid the generic SaaS vocabulary of hero blocks, card mosaics, sidebars, pills, gradients, glowing accents, and oversized empty space.

## Foundation

| Token | Value |
|---|---|
| Canvas | `#F4F6F9` |
| Surface | `#FFFFFF` |
| Ink | `#172033` |
| Muted | `#526075` |
| Rule | `#CBD3DF` |
| Action | `#174EA6` |
| Action dark | `#103D82` |
| Focus | `#FFBF47` |

- Typeface: Noto Sans / Noto Sans Devanagari, with Nirmala UI, Segoe UI, Arial, and sans-serif fallbacks.
- Body: 17–18px desktop and 16–17px mobile.
- Supporting text: never below 14px.
- Reading width: approximately 68 characters.
- Spacing: an 8px rhythm with deliberate 4px exceptions.
- Radius: 4px controls and at most 8px for a bounded surface.
- Shadow: dialogs only; ordinary content uses rules and spacing.
- Controls: at least 44px high.
- Motion: one 220ms evidence-to-event continuity transition; instant state change under reduced motion.

Ready, Missing, and Optional are visible text states with a supporting color marker. Color never carries the state alone.

## Golden concepts

1. **Parallel Ledger** keeps the evidence register and incident record visible together.
2. **Guided Verification** turns confirmation and placement into a calm sequence.
3. **Continuous Thread** makes chronology the primary record and attaches evidence inline.

All concepts use the same fixture, public identity, action order, and truth boundaries. They differ in composition, hierarchy, density, and responsive adaptation.

## Hard prohibitions

Do not introduce:

- a public ThreadZero wordmark or `tz` emblem;
- official government marks or fabricated approval;
- dark cyber styling, neon, hacker imagery, shields, locks, or AI orbs;
- generic fintech gradients or glass effects;
- a giant hero before the citizen task;
- bento grids, repeated rounded containers, decorative status pills, or overline spam;
- desktop sidebars squeezed into mobile;
- horizontal page scrolling or horizontal mobile progress rails;
- paper, folder, police-dossier, or forensic-investigation styling;
- factual guidance rendered into screenshots or generated imagery.

## Approval contract

Inspect every concept at 1440×900 and 390×844 before selection. The winner must make the evidence relationship understandable within five seconds, preserve a clear primary action, recompose intentionally on mobile, and pass the anti-slop quality gate.
