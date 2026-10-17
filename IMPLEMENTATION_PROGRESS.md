# Implementation progress

Last updated: 2026-10-17. Canonical specification: [implementation plan](docs/implementation-plan.md).

## Resume here

Repository: `/srv/openclaw/repos/willtheorangeguy/econ-nobel`. Existing public repository and Pages site are configured. Read this file, inspect `git status`, then run the documented validation commands before extending work. Keep original research, curated records and generated snapshots separate. Commit completed milestones. Never promote unreviewed prose to published content.

## Phase checklist

- [x] Read the entire 786-line specification and inspect repository and runtime.
- [x] Existing-solutions preflight: use Astro, Pagefind, Nobel API, Crossref and Pandoc rather than building replacements.
- [x] Phase 1: Astro/TypeScript, Markdown/KaTeX, academic design, award/sidebar prototype, honest download states.
- [x] Phase 2: reproducible official catalogue import, every annual route, search/filter/navigation, coverage report.
- [x] Phase 3: bibliography discovery, evidence-backed work associations, version-specific rights, portraits policy and work pages.
- [x] Phase 4: incremental PDF/EPUB exports, artifact manifest, validation and academic templates.
- [ ] Phase 5: sourced exemplar essays; independent review; complete editorial coverage for every year.
- [ ] Phase 6: automated GitHub Pages deployment, CI, accessibility/link/data checks and maintenance documentation.

## Findings and decisions

- Official API fetched at `https://api.nobelprize.org/2.1/nobelPrizes?nobelPrizeCategory=eco&limit=100&sort=desc` returns 58 records, 1969–2026. Exact laureates and motivations will be imported rather than copied from plan examples.
- API response includes per-laureate motivations/shares and a `topMotivation` for some split prizes; preserve these distinctions.
- Plain Markdown is canonical for explanations. Official metadata may appear immediately; research drafts remain explicitly unfinished and excluded from finalized research counts.
- Existing site inherits the account domain: `https://williamvdg.me/econ-nobel/`; preserve repository base `/econ-nobel/`.
- No third-party text or portrait will be mirrored without a specific permission record. Portrait monograms are valid fallbacks.
- Sites skill read for design/preview guidance; explicit Astro/GitHub Pages specification takes precedence over Sites hosting defaults.

## Blockers / limitations

- System Node/npm symlinks point into an inaccessible root directory. Install a checksum-verified Node distribution under ignored `.tools/`; do not change system settings.
- Initial tooling gaps resolved locally: Node 24.22.0, Pandoc 3.12.1, XeLaTeX (TeX Live 2025 Debian packages), EPUBCheck 5.4.0, Java 21 and Playwright Chromium. Ignored `.tools/bin/xelatex` sets paths for the extracted TeX distribution; normal CI uses system XeLaTeX.
- Full archive research requires source-by-source scholarship and editorial review. No human review exists yet; do not mark any essay published on that basis.

## Upcoming

1. Finish Phase 1 and validate build/type checks.
2. Import complete catalogue with source snapshots; add schema/integrity tests.
3. Implement evidence/rights and exports, research exemplar pages, then validate and deploy completed engineering.
4. Record exact coverage and unfinished review/rights tasks here and in public coverage report.

## Engineering checkpoint — Phases 1–2

- Imported 58 awards and 101 laureates with pagination, share validation and change staging; snapshots committed for offline rebuilds. Fixed an upstream pagination trap: sorting the first page differently from API next links duplicates/omits people. Importer now uses consistent query order and verifies counts and identities.
- Built 168 static pages with local fonts, KaTeX support, base-safe links, responsive right rail, chronological filtering, laureate index, search and public coverage.
- Checks passed: Astro type check (0 errors), static build, Pagefind indexing (159 records), 3,033 internal link/asset checks. Production dependency audit: 0 vulnerabilities after replacing an outdated frontmatter dependency and overriding nested KaTeX to the patched version.
- Phase 3/4 infrastructure in progress; no essays yet approved or counted as published.

## Research and export checkpoint — Phases 3–4

- Three 2001 work records matched to Crossref by exact normalized title, author families, date and DOI. Academy scientific-background sections 1–3 explicitly support the associations. Discovery reports candidate full-text locations without approving access/rights.
- Eight structured citations with consulted-version disclosures. Two award essays (1969 ~1,400 words, 2001 ~1,600 words) and one Akerlof work essay (~800 words) are `needs-review`, with original worked examples and checked TeX syntax. Zero published/reviewed essays. Spence and Rothschild–Stiglitz work texts remain unread and are metadata-only.
- One CC BY 3.0 portrait (Akerlof) verified against Commons file page/VRT record. Remaining 100 recipients use monograms. No original research files redistributed; all three work versions link externally.
- Six PDF/EPUB draft overview files generated from canonical Markdown and bibliography. PDFs contain selectable text and 7/7/5 pages; EPUBCheck sample passed with zero warnings/errors. Manifest includes source/tool/template hashes, exact public paths and SHA-256. Draft status is embedded in exports.
- Resolved PDF blockers: unreachable Tectonic bundle host → use XeLaTeX; extracted Debian runtime needed local paper configuration and filename databases; custom template updated for Pandoc 3.12 citation macros.
- Source link check: five official/academy URLs HTTP 200; three DOI redirects end at publisher HTTP 403 in this environment. Crossref metadata verified, but provider full-text access must be manually rechecked. Recorded in `data/reports/source-links.json`.
- Phase 5 remains incomplete: all 58 essays still need independent review; 56 annual essays have not been written; 1969 original-work selection is unfinished; original EPUB permissions are unestablished.
- Phase 6 in progress: workflows, docs and tests written. Await final full validation, representative visual document QA and live Actions deployment verification.

## Local commands for this workspace

The system Node symlink is inaccessible. For commands here use:

```sh
export PATH="$PWD/.tools/node-v24.22.0-linux-x64/bin:$PATH"
npm run check
npm test
npm run build
npm run test:e2e
```

Do not change global shell configuration. The exporter detects ignored local Pandoc/XeLaTeX/Java/EPUBCheck automatically. Research copies remain outside the repository under `/tmp`; they must not be committed.

## Release validation checkpoint

- Full check: Astro 0 errors/warnings/hints; 12 Vitest tests passed; all 8 Chromium E2E tests passed, including axe WCAG AA checks on five representative routes at 320/390/1280px.
- Static build: 174 routes; Pagefind indexes 162 award/laureate/work metadata records (draft body excluded); 3,198 internal link/asset/anchor checks passed. Six PDF/EPUB artifacts passed full integrity validation; all EPUBs passed EPUBCheck with warnings treated as errors.
- PDF pages rendered through PDFium and visually inspected: cover, equations, footnote and bibliography; no clipped math or references observed. Corrected LaTeX heading level so section numbering starts at 1 rather than 0.1.
- Actual 2001 EPUB loaded in an EPUB.js browser reader: title/TOC present, chapter navigation successful, all 13 inline/display MathML elements in the economics chapter rendered, no reader script errors. Screenshot inspected. Other ebook applications have not been tested.
- Production npm dependency audit was clean. No Lighthouse score is claimed; manual screen-reader user testing and additional ebook applications remain future QA.
- Remaining release task: commit finalized milestones, switch existing Pages source from legacy branch builds to Actions, push, inspect CI/deployment and verify public pages/downloads.
