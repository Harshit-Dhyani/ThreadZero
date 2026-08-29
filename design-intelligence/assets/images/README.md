# Visual input and output library

This folder is the durable handoff for later image-generation goals.

- `input/` preserves the eight user-supplied visual references exactly as received. They define hierarchy and component grammar only; none ships in production.
- `output/` preserves the eight selected ImageGen PNG masters. Identical production masters live under `site/assets/images/masters`, with responsive WebP derivatives beside them.
- `output/home-preparation-illustration-v3.png` and `output/home-evidence-thread-illustration-v3.png` are preserved rejected exploration from the first V3 Home slice.
- `output/home-preparation-illustration-v5.png`, `output/home-evidence-thread-illustration-v5.png`, and `output/faq-support-illustration-v5.png` are the RESET-01 page proofs integrated for browser review. ImageGen exported opaque PNGs despite transparency prompts, so these use verified uniform-white canvases and must remain on white page regions until native-alpha replacements are produced.
- `output/qa-2026-08-27/` preserves the final Home, public-route, tracker, and reporting-flow captures plus the Contact and FAQ reference comparisons used for visual QA.
- `output/legacy-photography-v1/` preserves the ten retired photographic masters and 22 responsive derivatives. They are archival only and must never be referenced by production renderers or catalogs.
- `../../generated-assets.json` records prompts, roles, dimensions, hashes, production paths, and input-reference mappings.

Do not overwrite an existing master. Create a new versioned ID, retain the prior file and provenance, then update the catalog only after visual review.
