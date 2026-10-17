# Implementation progress

Updated 2026-10-17. Primary specification: [implementation plan](docs/implementation-plan.md).

## Resume here

**Completion audit: the project does not meet the specification’s definition of done and is not production-ready as requested.** A deployed prototype, complete metadata catalogue and partial engineering foundation exist. See [the completion audit](docs/COMPLETION_AUDIT.md) for reproduced defects and verification limits. Do not mistake catalogue pages or unreviewed drafts for finished research.

- Repository: `/srv/openclaw/repos/willtheorangeguy/econ-nobel`
- Live site: https://williamvdg.me/econ-nobel/
- Deployed implementation: `6c5fc6cf0a88ccbf772614eb3957e0e27e33b724`
- Successful clean-checkout deployment: https://github.com/willtheorangeguy/econ-nobel/actions/runs/39065881822
- Live document checksums: https://williamvdg.me/econ-nobel/downloads/manifest.json
- Coverage: [machine report](data/reports/coverage.json), [year ledger](data/reports/coverage.md), and public `/coverage/`.

**Active task (user instruction after the audit):** all annual manuscripts are now authored; finish validation and deployment of the 58 annual drafts and three work drafts. Source editions, partial reading, claim/equation checks and remaining research are recorded in per-year dossiers. Keep all new text `needs-review`; writing is not independent editorial approval. Review-gate/original-document/browser-startup audit findings remain open and are not being silently marked fixed.

## Milestones

- [x] Read the entire 786-line plan before coding; inspect existing repository and runtime; record this checklist first.
- [x] Existing-solutions preflight: use Astro, Pagefind, Nobel API, Crossref and Pandoc rather than custom replacements.
- [x] Phase 1: Astro 7/TypeScript, canonical Markdown collections, KaTeX, bibliography rendering, local STIX typography, responsive academic reading layout and right rail, honest download/portrait states.
- [x] Phase 2: official API ingestion with pagination/retries, accepted raw snapshots, staged changes, all 58 annual award routes (1969–2026), all 101 laureates, year navigation, filters/sorting, topic groups, Pagefind, coverage auditing.
- [ ] Phase 3 — partial engineering: exact DOI/title/author/year discovery checks, evidence-backed work associations, version-specific access and rights fields, portrait permissions/checksums, work routes and bibliography. Three curated 2001 works. Original-document acquisition/conversion is not implemented end-to-end; the shared checksum and native-EPUB permission model need repair. Broader scholarly coverage remains unfinished.
- [ ] Phase 4 — draft export pipeline works; acceptance incomplete: PDF/EPUB automation from the same Markdown and bibliography; academic templates, pinned Pandoc/EPUBCheck installers with release SHA-256 checks, incremental source/tool/template hashes, atomic artifact replacement, diagnostics, export validation, public deployed manifest and real download integrity tests. Empty reviewed sections currently pass content validation; positive published-item fixtures and release-gate hardening remain outstanding.
- [ ] Phase 5: original research and independent review for every award and featured work. Precise gaps below; zero entries have been marked published.
- [ ] Phase 6 — deployment operational; quality/maintenance work incomplete: reusable CI, automated GitHub Pages deployment, manual catalogue-update proposal workflow, static base-safe paths, sitemap/metadata, sources/rights policies, maintenance docs, tests and verified live publication of the staged archive. External source checking is outside CI; fresh browser startup failed during audit; annual test assumptions require hardening.

## Actual editorial coverage

| Measure | Current state |
| --- | --- |
| Official award catalogue | 58/58 years, 1969–2026 |
| Official laureate records | 101/101 |
| Authored annual essays | 58: 1969–2026, all `needs-review` |
| Annual essays not yet written | 0; all remain unreviewed |
| Independently reviewed/published annual essays | **0** |
| Evidence-linked foundational works | 3, all associated with 2001 through academy background material |
| Authored work explanations | 3: Akerlof, Spence, Rothschild–Stiglitz, all `needs-review` |
| Metadata-only selected work explanations | 0; broader work selection is unfinished |
| Validated overview artifacts | 122: PDF + EPUB for all 58 annual drafts and three work drafts |
| Cleared portraits | 1: Akerlof, CC BY 3.0 with adjacent credit; 100 recipients use monograms |
| Hosted original research files | 0; external publisher access only, unknown hosting/conversion rights |

### Research and permissions still needed

- Complete original-text research and factual evaluation of all 58 annual drafts; their source-led first manuscripts are now written.
- Independently review all 58 annual drafts and three work drafts: factual claims, economics, equations, source editions, caveats and rights. Never invent reviewer approval.
- Complete original-text analysis and dedicated work selection for 1969. Checked Frisch/Tinbergen bibliographic entry points are now present; the Frisch excerpt and Tinbergen retrospective are not mislabeled as full original consultation.
- Finish Spence and Rothschild–Stiglitz reading beyond the selected original sections consulted for their new work drafts; independent review remains outstanding.
- Expand work selection and evidence associations to the remaining awards; featured-work coverage is separate from annual coverage.
- Verify individual portrait permissions for the remaining 100 recipients. Do not hotlink Nobel media or infer a universal image license.
- Establish rights for any original file/version before hosting. No native original EPUB or authorized conversion has been verified for the three selected articles.
- DOI metadata matched in Crossref, but this environment gets HTTP 403 after the three publisher DOI redirects. Five official/academy citation URLs returned HTTP 200. Preserve the source-access caveat; see `data/reports/source-links.json`.

## Verification evidence and limits

- Fresh Astro check: **52 files, zero errors/warnings/hints**.
- Vitest: **17 tests passed**, including importer staging and real Crossref-title markup regressions. The separate metadata recheck found 67 matches among 68 candidates; the known Sargent–Wallace coauthor omission is corroborated by the publisher and stays flagged, not silently waived.
- Playwright: **9 tests passed** after replacing the obsolete latest-year “no downloads” assumption with catalogue/status/manifest checks and real file-byte verification. Future-year navigation derives from the latest accepted year. Preview was already running; the older intermittent fresh-startup finding is not claimed fixed.
- Accumulated authoring-milestone axe/overflow checks cover all **58 annual routes** at **320, 390 and 1280px**, plus the two new work routes: **180 page/viewport combinations**, zero automated violations/viewport overflow. Dates and report hashes are retained in `data/reports/essay-browser-qa-summary.json`; this is accumulated evidence, not a simultaneous final-revision audit.
- Final-batch checks cover nine changed routes at all three widths and 18 actual PDF/EPUB download bodies matching the local manifest (`data/reports/essay-browser-qa-final-batch.json`).
- Full build: **189 static HTML pages**, plus the public JSON document manifest; **5,179 internal links/assets/anchors** passed validation. Draft body text remains excluded from Pagefind under the existing editorial policy; metadata is searchable.
- All **122 overview files** passed checksums/signatures/length checks, PDF selectable-text validation and EPUBCheck with warnings treated as failures. This is 61 explanations in two formats, all unreviewed.
- Inspected representative 2016, 2023 and 2026 PDF equation/citation layouts. Four new EPUBs were opened in the existing EPUB.js reader, with TOC navigation, bibliography and visible native MathML checks; no reader errors (`data/reports/essay-epub-reader-qa.json`). Typography depends on the reader; other applications and screen readers remain untested.
- Earlier Lighthouse, original EPUB-reader and live-verification reports retain their prototype revision/scope. They are not new performance certification for all current essays. The final live-file check will use the deployed manifest and toolchain rather than assuming local PDF bytes are identical across environments.
- The last independently observed cloud deployment is linked at the top. The final 58-year draft set is locally validated and awaiting its push/deployment/live integrity check.

Automated checks do not establish scholarly accuracy, independent review, rights for originals or universal assistive-technology compatibility. The review-gate/original-document/fresh-startup findings remain open. TeX package variation can change PDF bytes; compare live files with the deployed manifest.

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
- A title/DOI match never automatically selects a prize work or grants redistribution/conversion permission. Existing flags and presence checks do not independently establish scholarly accuracy or legal permission.
- Use `[@citation-id]`, native Markdown footnotes and TeX mathematics. HTML, PDF and EPUB use the same source and bibliography.
- Publication requires a real review record and both validated formats. Draft status is explicit on web and in exports, and coverage is derived from content records.
- Commit completed research/review milestones and update this file with concrete findings and remaining gaps. Read `docs/EDITORIAL_WORKFLOW.md` before promoting any content.

## Completion audit correction

The earlier claim that phases 1–4 and 6 were completed was too broad. Phases 3, 4 and 6 are now marked partial; Phase 5 remains incomplete. The 15 existing unit tests and six export validations passed again, and a fresh official award API comparison found zero recipient/motivation/share mismatches. All six live files matched the public manifest again. Isolated synthetic fixtures reproduced acceptance of empty reviewed sections, rejection of native EPUBs without conversion permission, and failure of a shared PDF/EPUB checksum. No synthetic review, content or original document was published. The findings are not fixed by this documentation update.

## Essay continuation — first decade

- Authored ten source-led annual drafts for 1970–1979, 1,259–1,361 whitespace-delimited body words each. All required sections, original worked examples, defined mathematical notation, caveats and citation keys are present. All remain `needs-review` with `review: null`.
- Added ten per-year research dossiers with recipient records, claim/source maps, consulted-edition declarations, source receipts, arithmetic checks and concrete remaining original-text/review tasks. No source full text is committed.
- Preserved Stolper/Solow, Debreu, Phelps, Schwartz and Heckscher credit. Corrected the 1972 speech's overstatement: the original 1954 Arrow–Debreu paper explicitly does not investigate uniqueness or stability. Recorded Myrdal's lecture as delivered in 1975 for his 1974 award.
- New topic assignments cover the actual prose. Bibliographic verification remains distinct from reading an original; article/book records disclose metadata-only consultation. None of the new annual drafts yet has completed dedicated foundational-work pages.
- Fresh Astro check: zero diagnostics. Existing 15 unit tests passed. Full build: 26 artifacts validated with PDF text/checksum checks and EPUBCheck, plus 180 static endpoints and 3,602 internal links/assets.
- Next chronological manuscript is 1980 (Klein); 1980s academy speeches and selected lectures have been fetched into private `/tmp/econ-essay-sources/` for reading. Do not count fetched material as an authored essay. Existing engineering audit findings and independent review are still open.
- Browser QA for every new 1970–1979 page passed at 320, 390 and 1280 px: zero automated axe violations, no viewport overflow, both download links and all 20 new download byte hashes checked. See `data/reports/essay-browser-qa.json`.
- New prose exposed a keyboard-access issue in horizontally scrolling KaTeX blocks. Added a post-KaTeX HTML transform, focus styling and a no-JavaScript keyboard-scroll regression. All **9 browser tests** passed using an explicitly started preview; this does not claim the previously audited fresh-startup issue was repaired.

## Essay continuation — 1980s

- Authored ten additional annual drafts for 1980–1989, 1,240–1,315 whitespace-delimited body words each, with all required sections, source-led attribution, original examples and defined equations. Added ten per-year dossiers; all remain unreviewed, with original-publication reading and independent checking explicitly outstanding.
- Fresh Astro check and the 15 existing unit tests passed. Full build validated **46** PDF/EPUB artifacts; 183 static endpoints and 3,941 internal links/assets passed. All ten new pages passed axe/overflow checks at 320/390/1280 px and all 20 new download bodies matched local hashes (`data/reports/essay-browser-qa-1980s.json`).
- Browser suite exposed a historical one-award topic-count assumption after adding Stigler. Replaced the hardcoded count with a comparison against tagged catalogue records; rerun recorded separately below. No behavior or tags were changed to satisfy the old assertion.
- 1970s commit `8e6dd83` passed clean-checkout CI and Pages deployment: https://github.com/willtheorangeguy/econ-nobel/actions/runs/39049760711. The 1980s batch is ahead of that deployment until its commit is built.
- Six 1990–1995 essays have been drafted privately in `.cache/editorial-drafts/`; they do not count toward the table above until canonical import, source registration, dossier recording and validation are completed.
- After correcting the topic-count assumption, all **9 browser tests passed**. Preview was explicitly started, so this does not establish a fix for the older intermittent fresh-startup finding.

## Essay continuation — 1990–1995

- Added six annual drafts and research dossiers, covering all recipients of the finance, Coase, Becker, economic-history, game-theory and Lucas awards. Body lengths: 1,209–1,297 whitespace-delimited words. All remain `needs-review`; original full-text reading and independent review are incomplete.
- Preserved Markowitz/Miller/Sharpe and Harsanyi/Nash/Selten as distinct contributions; retained Modigliani credit. Qualified the game-theory speech's informal stability wording and the economic-history speech's slavery language; no profitability/productivity claim is presented as social-welfare or moral approval.
- Fresh check and 15 unit tests passed. Build validated 58 PDF/EPUB artifacts and 185 endpoints/4,147 internal links. All six new pages passed 320/390/1280px axe/overflow checks and 12 download checksum requests; all nine browser regressions passed. See `data/reports/essay-browser-qa-1990-1995.json`.
- 1980s commit `227063c` passed clean-checkout CI and deployment: https://github.com/willtheorangeguy/econ-nobel/actions/runs/39063150392.
- Next canonical import: 1996–2000, five substantive drafts already staged privately with source research. Metadata-only years remain unfinished until that import and verification.

## Essay continuation — 1996–2000

- Added five annual drafts and research dossiers. The annual manuscript sequence is now continuous from 1969 through 2001: **33 unreviewed essays**, 25 remaining metadata-only years. New body lengths are 1,215–1,278 whitespace-delimited words. Original-text consultation and independent review are still not completed research.
- Registered checked metadata for Mirrlees/Vickrey, Black–Scholes/Merton, Sen, Mundell and Heckman. Retained Black's contribution without adding him as a laureate; distinguished a conventional poverty-gap illustration from Sen's actual index; qualified textbook open-economy results and the assumptions behind selection/logit examples.
- Fresh check and all 15 unit tests passed. Full build validated **68 artifacts** (PDF text/checksums and EPUBCheck) plus 185 endpoints/4,296 internal links. All five pages passed 320/390/1280px axe/overflow checks and ten download hash requests; all nine browser regressions passed. See `data/reports/essay-browser-qa-1996-2000.json`.
- Next import is 2002–2006: five substantive manuscripts have been staged privately and official speeches read. 2007–2011 source material is fetched privately for the following batch; fetching is not counted as writing or completed research.

## Essay continuation — 2002–2006

- Added five annual drafts and research dossiers covering Kahneman/Smith, Engle/Granger, Kydland/Prescott, Aumann/Schelling and Phelps. Preserved Tversky and other non-laureate coauthor credit; separated laboratory results from universal behavioral claims, conditional time-series concepts from causation, and model calibration from empirical identification. All new manuscripts remain `needs-review` with no invented approval.
- Fresh Astro check and 15 unit tests passed. Full build validated **78 PDF/EPUB artifacts**, 186 endpoints and 4,448 internal links/assets. All five new pages passed automated accessibility and overflow checks at 320/390/1280px; all ten new download bodies matched manifest hashes. All nine browser regressions passed with the existing preview available. See `data/reports/essay-browser-qa-2002-2006.json`.
- The 1996–2000 commit `89b0f36` passed clean-checkout CI and Pages deployment: https://github.com/willtheorangeguy/econ-nobel/actions/runs/39064108225.
- Next canonical batch: 2007–2011, five substantive drafts staged privately. Original-text reading, work-level explanations, independent review, portrait rights and the previously recorded engineering audit gaps remain unfinished.

## Essay continuation — 2007–2011

- Added five annual drafts and research dossiers, extending the canonical sequence through 2011. Mechanism design distinguishes an attainable equilibrium from full implementation; geography keeps scale, variety and location assumptions explicit; governance distinguishes commons from open access; search uses flows rather than treating unemployment as voluntary; macroeconometrics separates innovations from identified shocks. All remain `needs-review`.
- Verified metadata for ten original papers. Rejected an unrelated Maskin DOI candidate and registered the correct title/DOI. Crossref omitted Wallace from the Sargent–Wallace article; publisher author-interview corroboration preserves both authors, and the blocked original is disclosed as unread. Read opening academy search background and Pissarides lecture passages without representing them as full original-paper reading.
- Fresh check and 15 unit tests passed. Build validated **88 artifacts**, 188 endpoints and 4,619 links/assets. All five new pages passed automated accessibility/overflow checks at 320/390/1280px and ten download hash requests; all nine browser regressions passed. See `data/reports/essay-browser-qa-2007-2011.json`.
- The prior `7934e84` milestone passed clean-checkout CI and Pages deployment: https://github.com/willtheorangeguy/econ-nobel/actions/runs/39064659209.
- Next canonical batch is 2012–2016. The following 2017–2021 manuscripts are also staged privately; 2022–2026 official texts have been fetched for reading. None of those private files counts toward canonical coverage. Independent review and all previously recorded broader gaps remain open.

## Essay continuation — 2012–2016

- Added five annual drafts and dossiers for Roth/Shapley, Fama/Hansen/Shiller, Tirole, Deaton and Hart/Holmström. Preserved Gale, Laffont, Muellbauer and Grossman credit; distinguished stable matching from fairness, return predictability from riskless profit, and payment incentives from unmeasured quality. All remain `needs-review`.
- Original-publication metadata and consulted versions are explicit. Shiller’s checked1980workingpaper is not mislabeled as the1981journaledition; Deaton/Muellbauer uses an author-maintained publication record without a guessed DOI. Original full texts and independent evaluation remain outstanding.
- Fresh check and 15 unit tests passed; the new inventory script ran against all58records. Full build validated **98 artifacts**, 188 endpoints and 4,784 links/assets. All five new pages passed 320/390/1280px automated accessibility and overflow checks, with ten download bodies matching manifest hashes. All nine browser regressions passed. Contract-theory PDF equation and citation layout inspected. See `data/reports/essay-browser-qa-2012-2016.json`.
- Added retrospective dossiers for the preexisting1969/2001drafts, explicitly labeling inherited source declarations rather than claiming a new full-text consultation. All48canonical manuscripts now have dossiers. Added `npm run audit:manuscripts` to builds so hashes/counts/dossier citation presence are reproducible; this does not certify factual accuracy.
- The final ten annual manuscripts are written privately and await canonical import, export validation and browser checks. No private staged file is counted as a canonical essay. All broader original-reading/work-selection/review/rights/engineering gaps remain open.

## Essay continuation — 2017–2021

- Added five annual drafts and dossiers for Thaler, Nordhaus/Romer, Banerjee/Duflo/Kremer, Milgrom/Wilson and Card/Angrist/Imbens. Preserve Benartzi, Cole, Linden, Miguel, Weber and Krueger credit. Self-control and fairness are distinct mechanisms; climate and innovation examples state assumptions; causal examples distinguish offers, participation, spillovers and local effects. All remain `needs-review`.
- Fresh check and all 15 unit tests passed. Build validated **108 artifacts**, 189 endpoints and 4,972 internal links/assets. All five new pages passed automated accessibility and overflow checks at 320/390/1280px; ten download bodies matched manifest hashes. All nine browser regressions passed. See `data/reports/essay-browser-qa-2017-2021.json`.
- All five final2022–2026annual drafts are staged privately. Two new work explanations are also written privately after selected originalSpence/Rothschild–Stiglitz passages were read. These do not yet count toward canonical coverage. A final1969bibliographic improvement rejects a mislabeled search-result PDF and distinguishes a laterFrisch excerpt from the1933original.
- `33f7be2` passed clean-checkout CI and Pages deployment: https://github.com/willtheorangeguy/econ-nobel/actions/runs/39065333697. All broader review/rights/engineering gaps remain open.

- The prior `6c5fc6c` milestone passed clean-checkout CI and Pages deployment: https://github.com/willtheorangeguy/econ-nobel/actions/runs/39065881822. The 2017–2021 milestone will be pushed with the final batch after local validation.

## Final annual draft milestone — local validation complete

All 58 annual manuscripts and three work explanations are canonical locally. All 122 overview files passed export validation; the final nine changed routes passed three-width browser checks and all nine browser regressions passed. Push, cloud deployment and live integrity checks remain pending. The 2017–2021 milestone is committed locally as `7977eec`; it will be pushed with the final validated batch. See `docs/ESSAY_DRAFT_MILESTONE.md` for the research scope and explicit limits.

- The final batch adds 2022–2026, two standalone work drafts, checked 1969 bibliography entry points and refreshed 2001 consultation statements. All remain `needs-review`, with no review record. Current annual body lengths are 1,202–1,638 words (73,765 total); 187 structured citations and all 58 dossiers are present. Source size/presence never implies research completion.
- Expanded the curated publication recheck queue from 3 to 68 candidates. Fixed presentation-HTML normalization using Nash’s actual Crossref title, retaining exact normalized title/author/year/DOI comparisons. The Sargent–Wallace provider omission remains visible. Dedicated work coverage still comprises only three 2001 papers.

- Reproducible QA commands are now committed project scripts: `npm run check:essay-pages` (optional route arguments; preview must already be running) and `npm run check:live-documents -- SHA RUN_URL`. The final 27 checks were repeated through the project page-check command; live integrity will be checked after deployment.
