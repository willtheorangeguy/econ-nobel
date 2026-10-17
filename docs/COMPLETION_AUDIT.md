# Completion audit — 17 October 2026

**Verdict: incomplete. The repository does not meet the implementation plan's definition of done and must not be described as the complete, production-ready research archive.**

Audited revision: `c75efc510a827e3cb6a2634623b0d22677c6808a`. This audit changes documentation and completion claims; it does not repair the engineering findings below or add research.

The earlier statement that phases 1–4 and 6 were completed was too broad. A deployed prototype, metadata catalogue, initial editorial workflow and working draft exports were delivered. Most of the research work remains, and some engineering paths are incomplete or insufficiently tested.

## What was verified again

- Fetched the official economics award API afresh. It returned 58 years (1969–2026). Every stored recipient ID/name/motivation/share matched that response; no mismatched award year was found.
- Counted actual Markdown bodies and statuses, not generated routes: 56 metadata-only award files with no essay, two needs-review award essays, zero reviewed/published award essays. The two drafts contain approximately 1,405 and 1,612 body words.
- Three work records exist, all associated with 2001. One work explanation has approximately 766 body words and needs review; two work pages contain no explanation. Zero work explanations are reviewed/published.
- One portrait has a permission record; the remaining 100 recipients have monogram fallbacks. Laureate profiles contain catalogue facts and links, not the plan's researched biographical notes.
- All six live draft PDF/EPUB downloads returned HTTP 200 and matched the public manifest's SHA-256 values. Their MIME types were correct. These are three explanations in two formats, not 58 award overviews or six separate researched subjects.
- Astro check passed with zero errors/warnings/hints; all 15 existing unit tests passed; content/rights validation and all six export checks passed, including EPUBCheck.
- Fresh browser-test startup failed once with `Process from config.webServer exited early`. Astro's preview server subsequently appeared as a background process. With preview explicitly running, all eight browser tests passed again. This startup behavior needs isolation and repair; the rerun must not be reported as an unconditional clean first-run success.
- GitHub Actions run [39043775440](https://github.com/willtheorangeguy/econ-nobel/actions/runs/39043775440) genuinely completed validation and deployment successfully for implementation revision `ec962d8`.
- The live metadata-only 1970 page and unreviewed 1969 page display their respective incomplete/draft notices. Public editorial counts correctly remain zero published essays.

## Requirement-by-requirement status

| Requirement | Status | Evidence / remaining work |
| --- | --- | --- |
| Astro, TypeScript, Markdown, KaTeX, academic layout | Implemented prototype | Real routes, locally bundled typography, equations, responsive right rail and print styles exist. |
| Every annual award and every laureate in the catalogue | Implemented metadata coverage | 58 annual records and 101 laureate profiles; fresh award API comparison passed. |
| Thorough, reviewed explanations for every award | **Not complete** | 56 essays unwritten, two unreviewed drafts, zero reviewed/published. |
| Each laureate's contribution and foundational research | **Partial** | Three evidence-linked works for 2001 only; 1969 original-publication selection unfinished; the rest of the archive lacks curated work coverage. |
| Relevant research context, intuition, equations, examples and caveats | **Partial** | Present in the two drafts; absent from the other 56 award pages and not independently reviewed. |
| Laureate biographies and photographs | **Partial** | Catalogue facts for 101 recipients; one cleared image; researched bios and 100 portraits unfinished. |
| Award/work overview PDF and EPUB | **Partial** | Three unreviewed explanations export to both formats. No completed/reviewed award or work exists to demonstrate full publication acceptance. |
| Original-research acquisition and format access | **Partial / not implemented end-to-end** | Three external DOI landing pages, no hosted originals, no authorized original EPUBs, no original-text conversion implementation. Version/rights modeling also has concrete defects below. |
| Reliable citation and research workflow | **Partial** | DOI/title/family-name/year matching for three manually queued works; structured evidence and manual records. No archive-wide publication discovery or substantive claim verification. |
| Search, browsing and responsive accessibility | Implemented with bounded QA | Search and filters work; only two awards have curated topic tags. Automated axe/overflow checks cover five representative routes at three widths. Manual screen-reader QA remains outstanding. |
| GitHub Pages and automated deployment | Implemented and deployed | Successful cloud workflow and live site verified. This proves deployment of the staged archive, not completion of its research. |
| Tests and release quality gates | **Partial** | Existing tests pass under the conditions stated above, but uncovered counterexamples and unexercised publication/original-document paths remain. |
| Maintenance documentation | Present, corrected by this audit | Progress, editorial workflow, setup and reports exist. Annual refresh tests and original-document model need further work. |

## Engineering findings reproduced or established from source

### 1. Reviewed-content validation accepts empty sections — high priority

Location: `scripts/validate-content.ts:39–46`.

The validator checks for heading strings, at least two bibliography IDs and a review record with boolean flags. It does not require substantive section bodies or independently verify the purported review.

In an isolated copy under `/tmp`, the 1969 essay was replaced with only the required headings and two existing citation keys; a clearly synthetic audit review record was supplied. `validate-content.ts` exited **0**. No real content or review record was modified or published.

A real reviewer remains essential, but empty reviewed sections should also fail mechanically. The current tests do not establish that apparently reviewed text is a complete scholarly explanation. No actual page is currently promoted to reviewed/published, so this finding concerns the release gate rather than a falsely published essay.

### 2. Original-document PDF and EPUB cannot have separate checksums — high priority

Locations: `src/lib/schema.ts` (`versionSchema`); `scripts/audit-rights.ts:10–12`.

One `checksum_sha256` field is compared to both `local_pdf_path` and `local_epub_path`. A real PDF and EPUB require separate hashes. A synthetic two-file fixture reproduced rejection of the second file after the PDF checksum passed.

This prevents the intended two-format original-document workflow for one version. Store artifact-specific integrity/provenance records before claiming that path is complete.

### 3. Native EPUBs are incorrectly treated as conversions — medium priority

Location: `scripts/audit-rights.ts:8`.

Any local EPUB requires `allows_format_conversion=true`, even a source-provided native EPUB with documented hosting permission that was never converted. An isolated permission fixture reproduced `EPUB conversion not cleared` before any file check.

The schema needs native-versus-converted provenance and separate hosting/conversion decisions. This is a modeling defect, not an instruction to infer permission from availability.

### 4. Research discovery and source availability remain limited — high priority

Locations: `scripts/discover-works.ts`, `data/curated/research-queue.json`, `.github/workflows/ci.yml`.

Discovery checks only explicitly queued Crossref DOIs. It does not read official research bibliographies, automatically locate vetted originals across the archive, or implement OpenAlex/repository discovery and lawful original-text conversion. Those tasks still require substantial work.

CI's `check:links` checks internal links/assets/anchors. The separate external `check:sources` command is not called by CI. The existing source-link report records three publisher redirects ending in HTTP 403; a valid DOI/metadata match does not demonstrate accessible full text. Those external source checks were not freshly rerun as part of this audit.

### 5. Publication acceptance is not demonstrated — medium priority

Locations: `scripts/validate-exports.ts:18`, existing tests.

All current exports are drafts and all reviewed/published article counts are zero. Consequently, checks iterating over published entries currently inspect no real published example. Existing unit tests cover some invalid review/rights inputs but do not prove a complete successful reviewed-publication lifecycle.

Math parsing proves valid TeX syntax, not the correctness of the economics. Checksums prove file integrity, not scholarly accuracy. EPUBCheck validates structure, not universally correct rendering. Prior visual/reader QA covered representative output and one browser-based EPUB reader; it was not repeated exhaustively in this audit.

### 6. Browser startup and annual test assumptions need hardening — medium priority

Locations: `playwright.config.ts`, `tests/e2e/archive.spec.ts:17–23`.

The fresh browser-test invocation failed during preview startup, while a rerun with preview already available passed. Astro preview running as a daemon may be relevant, but the cause has not yet been fully isolated.

The future-navigation assertion is fixed to 2027 on the 2026 page. Once an official 2027 award is imported, legitimate navigation would fail that assertion. Derive unannounced-year expectations from the accepted catalogue during future maintenance.

### 7. Reproducibility and bibliography presentation have limits — lower priority

- Pandoc and EPUBCheck are pinned, but TeX packages installed from distro repositories are not fully pinned. Cross-environment byte-identical output has not been established. The Docker file is a conversion-tool image, not a verified turnkey Node project builder.
- Web bibliography/citation formatting is implemented by custom helpers, while exports use a Chicago CSL style. Shared metadata is present, but identical formatting/disambiguation across formats has not been verified.
- Accessibility/performance evidence is representative and environment-specific. It does not certify every page or every assistive technology.

## Corrected milestone status

- Phase 1: working scaffold/design prototype delivered.
- Phase 2: complete official metadata catalogue delivered for the currently returned years.
- Phase 3: partial bibliography/discovery/rights implementation; original access paths and coverage incomplete.
- Phase 4: working draft exports; publication validation and end-to-end acceptance still need hardening.
- Phase 5: incomplete; zero reviewed annual explanations out of 58 required.
- Phase 6: deployment operational; remaining quality/maintenance gaps prevent a full production-readiness claim.

## Next work

1. Repair the concrete review-gate and original-document model defects; add positive and negative publication fixtures and a reliable fresh browser-test launch.
2. Expand and verify research/publication associations, preserving exact source editions and per-artifact permissions.
3. Complete the missing annual/work explanations one award at a time, then conduct actual citation/economics/equation review before promotion.
4. Clear remaining portraits, complete source accessibility checks, and broaden document/accessibility QA.

The speed of the first delivery is explained by what was produced: reusable templates and imported metadata generate many pages quickly. That did not accomplish the much larger research and review workload.

## Subsequent annual drafting milestone

The editorial counts above describe the audited revision, before the continuation. All 58 annual years now have unreviewed drafts, with three unreviewed work explanations. See [the drafting milestone](ESSAY_DRAFT_MILESTONE.md), current coverage and progress for later validation evidence. The latest-year navigation/download test now derives expectations from the accepted catalogue, article state and manifest. Zero texts have been promoted to reviewed or published.

## Subsequent engineering repairs

Findings 1–3 now have targeted implementation and regression tests. The reviewed-content validator parses actual Markdown, rejects empty/short required section bodies and enforces conservative overall prose floors; code, math, comments and citation padding do not count. An isolated synthetic review fixture proves both rejection of the original empty-section counterexample and acceptance of substantive manuscript content. This tests the mechanical gate, never the truth of a review record.

Original versions now have separate PDF/EPUB checksums and explicit native/converted EPUB provenance. Private two-file fixtures verify independent integrity failures, native hosting without conversion permission, converted-edition permission checks, missing provenance/evidence and unsafe paths. The retired shared field is rejected. No original document or synthetic approval was added to public content. End-to-end original acquisition/conversion and genuine scholarly publication remain unproven.

The installed Astro 7.4.0 CLI automatically backgrounds preview servers in detected agent environments. Playwright's preview command now supplies `--ignore-lock`, which the installed CLI explicitly handles as a foreground process. Fresh-startup/teardown verification is recorded in progress when complete; a source change alone does not close the finding. Broader research, reader, reproducibility and accessibility limits above remain applicable.
