# Product contract

## Identity

This repository contains an independent citizen-service concept inspired by the public financial-fraud reporting journey.

- Public service label: **National Cyber Crime Reporting Portal**
- Required qualifier: **Independent concept redesign**
- Internal codename: ThreadZero; never use it as the public service identity.
- Required truth: all incident details, evidence, extraction, chronology, status, and report references are synthetic.
- Official guidance: for actual financial cyber fraud in India, call **1930** and use **cybercrime.gov.in**.

No prototype action may place a call, upload a file, create an official complaint, or write to NCRP, police, banks, payment providers, or government systems.

## Citizen and task

The primary user is a stressed citizen trying to preserve facts after suspected online financial fraud. The interface must help that person:

1. recognise urgent official action;
2. understand what information is useful;
3. record the transaction and contact facts;
4. distinguish ready, missing, and optional evidence;
5. connect evidence to an understandable chronology;
6. review a coherent record;
7. stop at an unmistakable simulation boundary;
8. understand the real next action.

The product mechanism is:

> evidence → confirmed fact → connected event → coherent incident → clear next action

## V1 boundary

V1 is semantic vanilla HTML, CSS, and JavaScript with deterministic local fixtures. It has no framework, package manager, backend, account, database, OCR, RAG, model call, analytics, or external write integration.

The active route contract is:

- `#home`
- `#act-now`
- `#incident`
- `#readiness`
- `#details`
- `#evidence`
- `#chronology`
- `#review`
- `#submit`
- `#next`

Reload starts a fresh synthetic report at Home. Current and completed steps are reachable; future steps are guarded. Draft edits commit only after validation.

## Current delivery gate

Three small Civic Evidence Ledger concepts compare the Evidence + Incident mechanism. They are temporary decision artifacts, not three production themes. Only a human-approved winner receives the complete route flow.

No source check, generated screenshot, or agent score may select the winner.
