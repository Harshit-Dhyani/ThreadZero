# Accessibility and copy contract

> **Historical V1/V2 baseline.** Preserve this record for provenance; its old route names and evidence labels are not current product copy. Use [THREADZERO_CURRENT_STATE_V5.md](../THREADZERO_CURRENT_STATE_V5.md) and [AGENTS.md](../AGENTS.md) for the active V5.3 accessibility and plain-language contract.

## Semantic structure

Every active screen must provide:

- one visible `h1`;
- a `main` landmark and meaningful navigation label;
- native buttons, links, labels, selects, textareas, fieldsets, legends, and dialogs;
- a polite live region for state changes;
- a focusable error summary linked to invalid fields;
- visible focus and logical keyboard order;
- programmatic status text that does not depend on color.

Interactive targets are at least 44×44 CSS pixels. Content must reflow without horizontal page scrolling at 320px and at 200% zoom.

## Focus behavior

- Route changes focus the new `h1`.
- Invalid submission focuses the error summary.
- Dialog close returns focus to its trigger.
- Confirming evidence keeps focus in the current task.
- Attaching evidence moves focus to the destination event and announces the relationship.
- Disabled future routes cannot receive focus.

Reduced-motion mode must show the final state immediately and may not leave content hidden.

Illustrations are supplemental: meaningful images require concise localized alternative text, while decorative route and tracker illustrations use empty alternatives. Generated art may never carry required copy, controls, status, or navigation.

## Citizen language

Use concrete verbs: **check**, **confirm**, **attach**, **edit**, **review**, and **continue**.

Use the citizen term first and a formal term only as supporting explanation. Keep instructions close to the control they explain. Say what is required and why.

Required state language:

- **Ready** — available now.
- **Missing** — useful guidance, not failure.
- **Optional** — may help but never blocks progress.

Avoid hype, AI language, technical implementation language, legal certainty, blame, or promises of freezing funds, recovery, police action, or government approval.

## Required truth copy

Public concepts must visibly contain:

- `National Cyber Crime Reporting Portal`
- `Independent concept redesign`
- synthetic-data and no-real-submission disclosure
- actual-incident guidance for 1930 and cybercrime.gov.in
- an explicit statement that the concept does not upload evidence or submit externally
