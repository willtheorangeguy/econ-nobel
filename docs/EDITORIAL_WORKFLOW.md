# Research, editorial review and rights workflow

## Resume one award at a time

1. Check `data/reports/coverage.md` and `IMPLEMENTATION_PROGRESS.md`. Select one unfinished award. Read the official award summary and academy scientific background; do not assume an award has one winning paper.
2. Create a dossier under `data/curated/dossiers/` containing the official URLs, all recipient IDs and contributions, candidate publications, exact source editions consulted, open questions, and a checklist of claims/equations requiring verification. Do not save copyrighted full text in this public repository.
3. Add candidate DOI/title/author/year expectations to `data/curated/research-queue.json`, then run `npm run research:works`. Read `data/reports/scholarly-matches.json`: exact normalized titles, author families, date and DOI must all agree. A metadata match does NOT establish prize relevance or permission. Crossref sometimes has only the first page, so never invent the end page.
4. Add bibliography records to `data/curated/citations.json`, with version consulted, source URL and access date. Label metadata-only consultation explicitly; do not pretend the original was read.
5. Select works in `data/curated/works.json` manually. Each award link needs a classification and evidence citation. Preserve all coauthors, even when some did not receive the prize. Work versions default to external landing-page access, with hosting/conversion false.
6. Write canonical plain Markdown in `content/awards/{year}.md` and `content/works/{id}.md`. Use Pandoc citation keys `[@citation-id]`, `$inline$` / `$$display$$` mathematics, and native Markdown footnotes. The web citation plugin and Pandoc share the same structured bibliography. Use the required award headings from `src/lib/schema.ts`; explain symbols and distinguish illustrations from estimates.
7. Keep `status: draft` or `needs-review`. Draft text is excluded from Pagefind indexing, and exports carry an unreviewed banner. Never claim placeholder coverage as completed research.
8. A reviewer must verify citations, mathematics, contributions and rights, then supply `review` with `reviewer`, ISO `reviewed_at`, four true check fields (`citations_checked`, `math_checked`, `rights_checked`, `contributions_checked`) and `limitations: []` or an explicit list. Set `reviewed`, build/inspect exports, then `published` only when review and both artifacts are genuinely complete. Do not invent a reviewer or approval.
9. Run all checks, commit the award milestone, and update progress with remaining research, version and review gaps.

## Optional AI drafting

Manual source-led writing is the default. A local model may draft from a vetted dossier into ignored `.cache/editorial-drafts/`; it must cite only dossier IDs and must never write directly to published content. Never send restricted source texts to an external service without permission. No model or network service is required at build/runtime. A human checks the draft and imports it into the canonical Markdown workflow above.

## Portraits

Use `data/curated/portraits.json` for per-file source, credit, license link, display permission, verifier/date and SHA-256. Download only after inspecting specific terms. Indicate resizing/cropping/grayscale in the adjacent credit. Unverified people retain monograms. No guessed Nobel media URLs or hotlinked Nobel assets.

## Original documents

A URL or OA flag is not a redistribution license. Record permission for the exact version. Local original PDFs need `allows_hosting`, evidence URL, license, verifier/date and checksum. Conversions also need `allows_format_conversion`; NoDerivatives licenses are not treated as conversion authorization. Native EPUB versions and conversions must be separately inspected. Unknown permissions mean external links only. Do not fetch original files automatically from a title match.

The public original-asset audit rejects unregistered files. Private reading copies belong outside `public/`, `content/`, `data/` and Git. Authenticated private hosting is a separate deployment; public Pages cannot protect restricted documents.

## Catalogue refresh

`npm run sync:nobel` fetches all pages with retries and stages changed metadata in `data/reports/import-diff.json`. It does not silently alter accepted facts. Review the candidate, then `npm run sync:nobel -- --accept` to import. Existing Markdown and curated associations are preserved. New years receive `metadata-only` entries. `--offline` verifies/rebuilds from accepted snapshots. CI's manual update workflow uploads a candidate report and never publishes a new essay.
