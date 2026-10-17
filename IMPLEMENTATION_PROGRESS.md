# Implementation progress

Updated 2026-10-17. Primary specification: [implementation plan](docs/implementation-plan.md).

## Resume here

The engineering foundation is implemented, tested, committed and deployed. **The full editorial archive is not complete.** Do not mistake catalogue pages or unreviewed drafts for finished research.

- Repository: `/srv/openclaw/repos/willtheorangeguy/econ-nobel`
- Live site: https://williamvdg.me/econ-nobel/
- Deployed implementation: `ec962d8da8a683cad304c167e895d48bacd93539`
- Successful clean-checkout deployment: https://github.com/willtheorangeguy/econ-nobel/actions/runs/39043775440
- Live document checksums: https://williamvdg.me/econ-nobel/downloads/manifest.json
- Coverage: [machine report](data/reports/coverage.json), [year ledger](data/reports/coverage.md), and public `/coverage/`.

**Next useful task:** finish original-publication research for 1969, and read the original Spence (1973) and Rothschild–Stiglitz (1976) articles before writing their work explanations. Then obtain independent editorial review of the existing drafts. Work on one award at a time and checkpoint after each source/review milestone.

## Milestones

- [x] Read the entire 786-line plan before coding; inspect existing repository and runtime; record this checklist first.
- [x] Existing-solutions preflight: use Astro, Pagefind, Nobel API, Crossref and Pandoc rather than custom replacements.
- [x] Phase 1: Astro 7/TypeScript, canonical Markdown collections, KaTeX, bibliography rendering, local STIX typography, responsive academic reading layout and right rail, honest download/portrait states.
- [x] Phase 2: official API ingestion with pagination/retries, accepted raw snapshots, staged changes, all 58 annual award routes (1969–2026), all 101 laureates, year navigation, filters/sorting, topic groups, Pagefind, coverage auditing.
- [x] Phase 3 engineering: exact DOI/title/author/year discovery checks, evidence-backed work associations, version-specific access and rights fields, portrait permissions/checksums, work routes and bibliography. Three curated 2001 works; broader scholarly coverage remains Phase 5 work.
- [x] Phase 4: PDF/EPUB automation from the same Markdown and bibliography; academic templates, pinned Pandoc/EPUBCheck installers with release SHA-256 checks, incremental source/tool/template hashes, atomic artifact replacement, diagnostics, export validation, public deployed manifest and real download integrity tests.
- [ ] Phase 5: original research and independent review for every award and featured work. Precise gaps below; zero entries have been marked published.
- [x] Phase 6: reusable CI, automated GitHub Pages deployment, manual catalogue-update proposal workflow, static base-safe paths, sitemap/metadata, sources/rights policies, maintenance docs, tests and verified live publication.

## Actual editorial coverage

| Measure | Current state |
| --- | --- |
| Official award catalogue | 58/58 years, 1969–2026 |
| Official laureate records | 101/101 |
| Authored annual essays | 2: 1969 and 2001, both `needs-review` |
| Annual essays not yet written | 56, explicitly `metadata-only` |
| Independently reviewed/published annual essays | **0** |
| Evidence-linked foundational works | 3, all associated with 2001 through academy background material |
| Authored work explanations | 1: Akerlof (1970), `needs-review` |
| Metadata-only work explanations | 2: Spence (1973), Rothschild–Stiglitz (1976) |
| Validated overview artifacts | 6: PDF + EPUB for each of the three authored drafts |
| Cleared portraits | 1: Akerlof, CC BY 3.0 with adjacent credit; 100 recipients use monograms |
| Hosted original research files | 0; external publisher access only, unknown hosting/conversion rights |

### Research and permissions still needed

- Write 56 annual essays from authoritative sources; verify the distinct contributions of every shared-prize recipient.
- Independently review the two annual drafts and Akerlof work draft: factual claims, economics, equations, source editions, caveats and rights. Never invent reviewer approval.
- Complete the 1969 original-work selection. The current essay uses the official award record, presentation speech and Tinbergen's retrospective lecture; the lecture is explicitly contextual, not mislabeled as the original research.
- Read Spence and Rothschild–Stiglitz primary texts. Their current records disclose metadata-only consultation; award-level descriptions rely on the academy background.
- Expand work selection and evidence associations to the remaining awards; featured-work coverage is separate from annual coverage.
- Verify individual portrait permissions for the remaining 100 recipients. Do not hotlink Nobel media or infer a universal image license.
- Establish rights for any original file/version before hosting. No native original EPUB or authorized conversion has been verified for the three selected articles.
- DOI metadata matched in Crossref, but this environment gets HTTP 403 after the three publisher DOI redirects. Five official/academy citation URLs returned HTTP 200. Preserve the source-access caveat; see `data/reports/source-links.json`.

## Verification completed

- Astro check: **0 errors, 0 warnings, 0 hints**.
- Vitest: **15 tests passed**, including an offline importer regression that proves changed laureate details are staged without overwriting accepted records or creating articles.
- Playwright: **8 tests passed**, including live search/base paths, filters/sorting, all shared-prize recipients, real download bytes/checksums, active section navigation, keyboard skip link and JavaScript-disabled reading.
- Axe WCAG AA checks and viewport overflow checks passed on five representative routes at **320, 390 and 1280px**.
- Static site: **174 HTML pages**, plus a static JSON manifest endpoint; **3,205** internal links/assets/anchors validated. Pagefind indexes 162 award/laureate/work metadata pages; unreviewed body text is excluded.
- Six overview artifacts passed SHA-256/length/signature checks; PDF selectable text/page count checks; **all EPUBs passed EPUBCheck with zero warnings/errors**. PDFs are 7, 7 and 5 pages.
- Rendered representative PDF cover, math, footnote and bibliography pages through PDFium; no clipping observed. Corrected heading levels and Pandoc 3.12 citeproc template macros.
- Loaded the actual 2001 EPUB in an EPUB.js browser reader: title and TOC present, chapter navigation works, all 13 inline/display MathML elements in the economics chapter render, no reader script errors. Screenshot inspected.
- Local production Lighthouse mobile runs: home **100/100/100/100**, sample award **99/100/100/100** for Performance/Accessibility/Best Practices/SEO. Single-run local measurements, recorded with revision and scope in `data/reports/lighthouse.json`; production network conditions can differ.
- Full npm audit: **0 vulnerabilities**.
- GitHub Actions clean-checkout validation and Pages deployment succeeded at the linked run. Live HTTPS homepage, mobile rendering, KaTeX and full-text search verified.
- All **six live** PDF/EPUB files matched the **deployed** manifest; MIME types are `application/pdf` and `application/epub+zip`. See `data/reports/live-verification.json`. The public manifest is authoritative for live checksums; the committed generated manifest reflects the local toolchain.

Automated accessibility checks do not replace manual screen-reader testing. Other EPUB applications remain untested. Pandoc 3.12.1 and EPUBCheck 5.4.0 are pinned with release checksums; distro TeX security updates are permitted and the actual engine version is recorded. Bit-identical PDF bytes across different toolchains are not promised.

## Environment and commands

The system Node/npm symlinks point into an inaccessible root directory. This was handled locally without changing system configuration. In this workspace:

```sh
export PATH="$PWD/.tools/node-v24.22.0-linux-x64/bin:$PATH"
npm run check
npm test
npm run build
npm run test:e2e
```

Ignored `.tools/` contains Node 24.22.0, Pandoc, extracted Debian XeLaTeX, Java and EPUBCheck. `.tools/bin/xelatex` sets local TeX paths. Normal clean installations/CI use system XeLaTeX; see README and `scripts/setup-exports.sh`. The attempted Tectonic bundle host was unreachable; the working export pipeline uses XeLaTeX as planned. Preview/reader QA servers were stopped after testing.

Research copies are outside the repository under `/tmp`, never committed or mirrored. Keep secrets and restricted reading copies outside Git and `public/`.

## Maintaining integrity

- Official snapshots/normalized metadata are generated; curated associations/rights and Markdown are maintained separately.
- `npm run sync:nobel` stages changes to **both awards and laureate details**; `--accept` imports reviewed changes. Existing prose and associations are preserved. New years begin as metadata-only.
- A title/DOI match never automatically selects a prize work or grants redistribution/conversion permission.
- Use `[@citation-id]`, native Markdown footnotes and TeX mathematics. HTML, PDF and EPUB use the same source and bibliography.
- Publication requires a real review record and both validated formats. Draft status is explicit on web and in exports, and coverage is derived from content records.
- Commit completed research/review milestones and update this file with concrete findings and remaining gaps. Read `docs/EDITORIAL_WORKFLOW.md` before promoting any content.
