# Economics Prize Archive — Codex Implementation Plan

**Working title:** *Economics, Explained: A Prize-by-Prize Archive*  
**Version:** 1.0 — 17 October 2026  
**Audience:** Codex / implementing developer  
**Project type:** Personal, reading-first, static educational website  
**Primary objective:** An intellectually honest, visually elegant explanation of **every annual Sveriges Riksbank Prize in Economic Sciences in Memory of Alfred Nobel**, with original research links/downloads wherever rights permit, and downloadable explanations in **PDF and EPUB**.

> **Codex instruction:** Treat this document as the project specification. Build working software, not only a mockup. Implement the infrastructure, data ingestion, page templates, content schema, export pipeline, tests, and deployment automation. Do not invent scholarly citations, source files, copyright permissions, or prize-to-paper relationships. Produce an explicit coverage report of what is complete and what still requires research/editorial review.

---

## 1. Scope and non-negotiable requirements

1. **One canonical page per prize year**, starting with **1969** and covering all announced prizes through the latest year. As of this specification, **2026 has been announced**, so there should be **58 award pages (1969–2026 inclusive)**. The official Nobel Prize API, not a hardcoded list, is the authoritative source for future updates.
2. Each annual page covers **all laureates**, their individual contributions, the **shared or divided award**, why the work mattered, and the most important research works associated with the recognition.
3. Do **not** assume each prize has a single “winning paper.” Many awards recognize **a research program, multiple papers, a book, or decades of contributions**. Clearly distinguish (a) works explicitly highlighted by authoritative award materials, (b) landmark works with well-documented links to the achievement, and (c) contextual reading.
4. Write **original, citation-backed explanations** with a difficulty between accessible layperson writing and an introductory/intermediate undergraduate economics course. Explain intuition first, then give a modest amount of formal economics and limitations.
5. Each prize page has a **wide reading column on the left** and a **narrow right-hand sidebar** containing a short award summary, laureate portraits/bios, metadata, citations to official sources, and download controls.
6. Provide the website's own **award overview in PDF and EPUB** for every completed prize. For each featured work, also provide **its own explanation in PDF and EPUB**.
7. Offer **original research PDF and EPUB** access when a real source exists and the applicable rights permit the relevant access/conversion/distribution. Clearly label versions (published article, author manuscript, preprint, book, etc.). Never advertise a non-existent format or fabricate a substitute.
8. Make the site **fast, responsive, keyboard-accessible, usable offline after build**, and fully static at runtime. It should be maintainable from a Git repository and deployable on **GitHub Pages**, with an alternative for private hosting.
9. Use a **TeX/academic-journal-inspired visual identity**, not a generic dashboard or flashy SaaS landing page.
10. Include a **verifiable coverage and editorial status workflow**: every award must exist in the catalogue, and rich explanations cannot be marked `reviewed` without citations and review.

### Important 2026 baseline

The 2026 award went to **Robert E. Hall and Michael Woodford** for microeconomic foundations of macroeconomic stabilisation. Include it, but import the exact names, award motivation, identifiers, and links from the official API/award page rather than hand-transcribing secondary coverage. The first prize (1969) went to Ragnar Frisch and Jan Tinbergen. These make useful import tests.

### Explicit exclusions from v1

- No payments, advertisements, user accounts, social feed, or community comments.
- No claim of official affiliation or use of Nobel medal artwork/logotypes without permission.
- No redistribution of paywalled research or unauthorized conversion of copyrighted books.
- No requirement for a database, live LLM API calls, or a server-rendered backend.
- Do not implement a copyrighted-document mirror disguised as an educational site.

---

## 2. Recommended technology stack

**Recommendation: Astro with Markdown content and static generation.** This is a modest, maintainable site (approximately 58 annual pages plus work pages) and does not need a heavy backend.

| Area | Choice | Reason |
|---|---|---|
| Site framework | **Astro + TypeScript**, `output: 'static'` | SEO-friendly static pages; strongly typed data/content; straightforward GitHub Pages deployment |
| Content authoring | **Plain Markdown with YAML frontmatter**, Astro content collections | Same research content can feed HTML, PDF, and EPUB. Avoid making MDX/JSX the canonical article format. |
| Mathematics | `remark-math` + `rehype-katex` | Clear on-page LaTeX expressions without client-side rendering dependency |
| Styling | **Hand-written CSS**, CSS custom properties | Fine control over print-inspired typography, margins and layout; minimal dependencies |
| Font strategy | Licensed, locally served **Latin Modern Roman** or **STIX Two Text**, with KaTeX math fonts and a restrained sans-serif for small UI labels | Scholarly/TeX look; retain license/attribution; good performance |
| Search | **Pagefind** generated after static build | No hosted search service or database |
| Data acquisition | TypeScript scripts (or Python when justified) | Reproducible official data ingestion, scholarly matching, asset manifests |
| Bibliography | Typed JSON/YAML source records, CSL JSON where useful | Source provenance, DOI normalization, consistent footnotes |
| PDF explanations | **Pandoc + XeLaTeX** using a dedicated TeX template | Good print-quality typography and equations; deterministic command-line generation |
| EPUB explanations | **Pandoc EPUB3** from canonical Markdown | Reflowable, accessible ebooks with TOC and metadata |
| Original works | Rights-aware links and verified permitted local files | Avoid unreliable or unlawful bulk republishing |
| Testing | Vitest, Playwright, axe-core, link checker | Validate data, downloads, functionality and accessibility |
| CI/CD | GitHub Actions | Rebuild, test, audit and publish; optionally trigger a yearly data update |
| Deployment | GitHub Pages for public/static; private deployment via authenticated host (e.g., Cloudflare Access) if desired | Low maintenance; keep restricted materials out of public build |

**Do not** scrape live websites in user browsers. The visitor-facing site must work without API keys and without network calls to scholarly services.

### Build tools/prerequisites

- Current maintained Node.js LTS; pin Node/package versions in lockfile and CI.
- Pandoc, TeX Live with XeLaTeX + required fonts, and an EPUB validator such as EPUBCheck installed in CI or a reproducible Docker image.
- `pnpm` preferred; provide npm equivalents if practical.
- Use fixed dependency versions for document generation and record versions in the build manifest.

---

## 3. Information architecture

### Routes

| Route | Purpose |
|---|---|
| `/` | Editorial introduction, search, chronological prize timeline, newest prize, topic exploration |
| `/awards/` | Full catalogue of all prize years, with year/topic/laureate filters and sorting |
| `/awards/2026/` | Annual award page, for example |
| `/works/{stable-work-id}/` | Accessible explanation and bibliography for an individual foundational paper/book |
| `/laureates/{stable-laureate-id}/` | Optional compact profile listing their awards and featured works |
| `/topics/{slug}/` | Optional curated topic grouping: econometrics, game theory, macroeconomics, etc. |
| `/about/` | Educational mission, methodology, what the award recognizes, editorial standards, non-affiliation disclaimer |
| `/sources-and-rights/` | Source/version/rights explanation and how downloads are provided |
| `/coverage/` | Public/internal factual catalogue coverage; optional rich editorial statuses |
| `/downloads/...` | Built, licensed downloadable files (site-authored PDFs/EPUBs and approved originals only) |

Use `base`-safe URL generation so the site works both on a custom domain and a GitHub Pages repository subpath. Provide canonical links, an XML sitemap and useful OpenGraph metadata.

### Home page

- Logo-free wordmark: **ECONOMICS / PRIZE ARCHIVE** or similar; no copied Nobel trademark treatment.
- One-sentence introduction: *Ideas that changed economics, explained without assuming a PhD.*
- Prominent search field for years, laureates, research topics, and works.
- A clean chronological index from newest to oldest (also allow oldest to newest).
- Topic chips for major areas of economics, all backed by real tagged content.
- Most recent prize spotlight; “Start with 1969” and “Browse all awards” links.
- Compact site statistics **derived at build time**, never hardcoded or misleading.

### Annual award page: layout

Desktop, at approximately >= 1024px:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ ECONOMICS / PRIZE ARCHIVE     Awards  Topics  Search       About           │
├─────────────────────────────────────────────────────────────────────────────┤
│ ← 2025                                      2026                       2027 →│
│                                                                             │
│  MAIN READING COLUMN (~68%)                 SIDEBAR (~28%)                 │
│  ───────────────────────────                 ─────────────────             │
│  2026 — Microfoundations                    The prize, at a glance        │
│  of macroeconomic stabilisation             2–3 sentence summary         │
│  Laureates / award motivation               Official motivation          │
│                                             ─────────────────             │
│  In plain English                           [Portrait] Robert E. Hall     │
│  The problem economists faced               [Portrait] Michael Woodford   │
│  Key insight and an example                  Image credits / bios         │
│  The models, without jargon                  ─────────────────             │
│  A little more rigor                         Download this explanation    │
│  Seminal papers / books                      [PDF] [EPUB]                  │
│  Criticism and limitations                   ─────────────────             │
│  Legacy and modern applications              Foundational works           │
│  Sources and further reading                 • Work 1 [View] [PDF] ...    │
│                                             • Work 2 [View] ...          │
│                                             Original copies if permitted │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Note:** “2027 →” only appears after 2027 has actually been awarded; never render links to unannounced years.

- Main article max width about **68–76 characters** or ~740–820px at typical desktop font sizing.
- Right rail width about **280–340px**; subtle left rule, not a colorful card stack. Sticky **only if** its content fits the viewport; otherwise scroll normally.
- Publication-style header: small uppercase year/discipline, large elegant serif title, thin horizontal rule, laureate names, genuine citation of official award motivation.
- Sidebar photos: uniform greyscale or naturally restrained photos, preserving licenses; **one panel per laureate**, not only the most famous.
- Highlight key terms or definitions with restrained margin notes or typographic callouts.
- DOI and footnote references should behave like academic bibliography references.
- Bibliography should link to primary sources and carry access dates for volatile links.
- Next and previous prize links at article bottom and top.

Tablet: proportionally narrower sidebar or content-first stacking as room allows.  
Mobile: **single column** with the summary/laureate/download rail moved directly after the heading or accessible as an expandable “Prize facts & downloads” section; no horizontal scrolling. Test real 320–390px widths.

### TeX-inspired design system

- Off-white “paper” (`#F9F8F4` or near equivalent); near-black text (`#242424`); fine charcoal separators; muted burgundy/ink accent only for hyperlinks/focus.
- **Book typography:** Latin Modern Roman / STIX Two Text; typographic scale with generous leading (~1.55–1.7 for body), hanging bibliography, well-kerned headings, real small caps where supported.
- `font-variant-numeric: oldstyle-nums` where practical; tabular numbers for dates/index columns.
- `h1` ~2.5–3rem desktop, responsive; body ~1.08–1.18rem; no tiny body text.
- Section rules, numbered footnotes, clean display equations, italicized variables, serif pull quotes.
- UI controls should remain recognizable buttons/links; **download affordances must be obvious** despite the minimalist aesthetic.
- Light mode first; optional dark “ink” mode respecting `prefers-color-scheme`, but don't sacrifice print aesthetics.
- Never load unlicensed fonts or photographs; keep font-license text/attribution in repo.
- Provide proper print CSS: hide navigation/download buttons/sidebar clutter, preserve footnotes/references, avoid broken equations across pages.

---

## 4. Explanation content standard

Each award page should read like an exceptionally clear long-form economics note. **Write for a curious adult who knows supply and demand but may not know econometrics**, and offer optional depth for someone who completed intro economics.

### Required sections per award

1. **One-paragraph abstract (70–120 words).** Who won, for what, and why the idea mattered.
2. **In plain English (150–250 words).** Analogy, question or concrete scenario; avoid jargon before defining it.
3. **The problem before this work.** What economists did not understand or could not measure. Cite at least one primary/credible historical source.
4. **What the laureates contributed.** Separate contributions when the prize is shared. Distinguish joint work from independent advances.
5. **A concrete worked example.** A household, market, central bank, firm or policy decision with correctly reasoned implications.
6. **The core economics.** Plain-language mechanisms, assumptions and, when appropriate, one or two equations with every symbol defined. Advanced math should be optional/collapsible on web while still available in PDFs/EPUBs.
7. **The foundational works.** Annotated list of 1–5 genuinely pertinent works where supportable. More if justified; do not force an arbitrary count.
8. **What changed as a result.** Later scholarship, empirical methods, policy practice, or debate. Avoid inventing definitive causal influence.
9. **Criticisms, caveats and unresolved questions.** Present serious scholarly limitations rather than promotional praise; cite documented criticisms.
10. **Key takeaways (3–5).** Short recap.
11. **Sources and further reading.** Official Nobel award materials, identified research publications, scholarly references, and dates; bibliography generated from structured metadata.

**Target editorial size:** ~1,200–2,000 words per award (flexible for unusually technical or wide-ranging prizes). Each featured paper/work explanation: ~500–1,000 words. Maintain readability over word-count targets.

### Separate work explanation template

- Full citation, contributor(s), publication year, venue, DOI/ISBN as relevant.
- **Why this belongs on this award page:** evidence for association, not an unsupported claim that it was “the Nobel-winning paper.”
- Research question and historical setting.
- Main claim, identification strategy/theoretical method, and results, *as supported by the original text*.
- Intuitive example or conceptual diagram (only if original or licensed).
- Equations/empirical results only when checked; do **not** invent coefficients, estimated impacts or tables.
- Assumptions, possible confounders, criticism, later developments.
- Link back to associated year(s) and laureate(s).
- Version-aware source access, download panel, and citations.

### Accuracy/editorial rules

- **Primary source required for every substantive discussion of a specific work** whenever accessible; if inaccessible, do not imply the paper was read. Base the commentary on properly cited reliable secondary work and mark the gap.
- Record which exact version of the work the explanation relies upon.
- Every nontrivial factual assertion should be traceable to references; use numbered citations/endnotes.
- Quote only brief, attributed excerpts; no lengthy copying of protected texts.
- Label interpretation versus the author’s claim; distinguish correlation from causality.
- Verify economic equations, variable definitions, date, paper authors, and the year/prize relationship.
- Avoid celebratory oversimplifications: if the evidence is mixed, say so.
- Do not generate invented DOIs, invented article titles, imagined PDFs, or made-up paper-to-prize mappings.
- Explicitly identify books, lectures, reports and chapters rather than pretending they are journal papers.
- **Every content item has a status:** `metadata-only`, `researched`, `draft`, `needs-review`, `reviewed`, `published`. `published` requires review and passing validations.

### Example of thoughtful writing style

> **In plain English:** A central bank cannot directly control every price in the economy. But households and firms make decisions partly based on what they expect to happen next. The laureates helped economists connect those individual decisions to economy-wide booms, slowdowns, and the effects of monetary policy.
>
> **A little more rigor:** Introduce the relevant model equation only after explaining the decisions it describes, what each variable means, and what assumptions make the result hold.

*The example is illustrative editorial style, not a substitute for researching the particular award.*

---

## 5. Prize catalogue and data acquisition

### Authoritative baseline

Use the **Nobel Prize API v2.1** to ingest official award metadata and laureate identities:

- Documentation: <https://www.nobelprize.org/organization/developer-zone-2/>
- API: <https://api.nobelprize.org/2.1/nobelPrizes>
- Laureate detail: <https://api.nobelprize.org/2.1/laureates>
- API docs: <https://nobelprize.readme.io/reference/getting-started>

Fetch **all economics-category awards**, handling documented pagination, limits and API errors. Inspect real response shapes and field names from the published documentation; **do not assume the illustrative parameter names below are valid until tested**. Prefer an officially documented category filter or safely filter returned records by official category code/identity.

### Ingestion algorithm

1. Download/refresh API award listing; store a dated raw snapshot under `data/raw/nobel/` for reproducibility.
2. Validate categories and select only the Economic Sciences award, not all six fields.
3. Resolve award year, official motivation, laureate IDs, official URLs, names and prize shares.
4. Retrieve laureate details as needed, with request retries/backoff and provenance timestamps.
5. Generate normalized prize metadata under `data/generated/prizes.json` and laureates under `data/generated/laureates.json`.
6. Keep researcher-authored mappings (`data/curated/...`) in separate files; **never overwrite curated research or prose** during an API refresh.
7. Match by stable Nobel ID and year; never join records by name alone.
8. Detect changes and emit a diff/review report instead of silently rewriting published content.
9. Rebuild all year routes. A new announced year can enter as **metadata-only**, but the UI should not falsely claim the explanation/downloads are complete.

**Validation as of 17 October 2026:** 58 prize-year records, one each for 1969–2026; no duplicate years; laureate IDs attached to the correct awards. For later years, the expected count must be **derived from the official returned award-year set**, not permanently fixed at 58.

### Foundational-work research workflow

A prize year alone generally **does not come with a machine-readable exact list of all “winning papers.”** Build a researcher workflow, not an automatic “pick top three most cited papers” algorithm.

1. Read official prize summary, press release, scientific background and official recommended reading. Cite/link to the pages, **do not republish full Nobel essays or lectures** without clearance.
2. Compile candidate primary works from the official references and recognized university/publisher bibliographies.
3. Search scholarly metadata for stable identifiers and permitted full text:
   - **Crossref**: DOI, author, title, journal, year, publication metadata.
   - **OpenAlex**: work ID, versions, open-access locations, links, license hints.
   - Institutional repositories, NBER working papers, SSRN, RePEc, arXiv, publisher sites when relevant and lawful.
   - **Unpaywall DOI lookup** can be an optional verification path; use OpenAlex for general work search.
4. Verify candidate **title + authors + publication date + DOI** and the connection to the award with human-checkable evidence. Never accept fuzzy title matching alone.
5. Classify each candidate: `officially-discussed`, `central-landmark`, or `additional-reading`; document evidence and contribution to the prize.
6. Review and select the useful works per award, including **each laureate's important contribution**.
7. Document exact access/redistribution rights **for each version**, independently of whether it is freely readable.
8. Produce a research report listing unmatched citations, uncertain DOI associations, inaccessible sources and editorial review needs.

**Critically:** A Nobel lecture is not the same thing as the original research paper. It may be linked as a contextual source but not mislabeled as the original.

---

## 6. Structured data model

Use Zod (or comparable strict validation) with Astro content collections and typed catalog modules. Suggested entities:

### `Award`

```yaml
year: 2026
slug: '2026'
official_prize_id: 'from-nobel-api'
official_name: 'Sveriges Riksbank Prize in Economic Sciences in Memory of Alfred Nobel'
official_motivation: 'IMPORT VERBATIM FROM OFFICIAL API; do not hardcode this placeholder'
official_page_url: 'https://www.nobelprize.org/prizes/economic-sciences/2026/summary/'
laureate_ids: ['official-id-1', 'official-id-2']
topic_slugs: ['macroeconomics', 'monetary-economics']
featured_work_ids: []  # Filled through documented research; never auto-invent
research_sources: []   # Stable citation IDs / official URLs
editorial_status: metadata-only
editorial_reviewed_at: null
last_source_checked_at: null
```

The example is a schema illustration, **not a completed award record**. Replace IDs, motivation and linked works from verified sources.

### `Laureate`

```yaml
id: 'nobel-official-id'
display_name: 'Verified name'
known_as: null
official_profile_url: 'https://www.nobelprize.org/...'
portrait:
  local_path: null
  source_url: null
  credit: null
  license: null
  license_url: null
  permitted_public_display: false
bio_short: 'Original, sourced 50–90 word biography.'
```

### `Work`

```yaml
id: 'stable-readable-slug-or-doi-derived-id'
title: 'Verified original title'
authors: ['Verified author name']
year: 1978
work_type: journal-article  # journal-article | working-paper | book | chapter | lecture | report | other
doi: null
isbn: null
journal_or_publisher: null
award_links:
  - award_year: 2026
    classification: central-landmark  # officially-discussed | central-landmark | additional-reading
    why_linked: 'Evidence-based original explanation.'
    evidence_citation_ids: []
versions:
  - version_id: 'publisher-vor'
    version_label: 'Published version'
    landing_page_url: null
    pdf_url: null
    epub_url: null
    source_provider: null
    license_id: null
    license_evidence_url: null
    license_verified_at: null
    license_verified_by: null
    allows_hosting: false
    allows_format_conversion: false
    local_pdf_path: null
    local_epub_path: null
    checksum_sha256: null
explanation_status: metadata-only
source_citation_ids: []
```

### Other entities

- `Citation`: ID, CSL metadata, source URL/DOI/ISBN, publisher, source type, date accessed, page/section when available.
- `PortraitAsset`: source, photographer, license, attribution requirements, local file and use permission.
- `DownloadArtifact`: `award-or-work`, `original-or-explainer`, `pdf-or-epub`, filename, checksum, license, rights status, build timestamp, public URL, provenance.
- `Topic`: slug, display name and description.
- `EditorialReview`: reviewer, status, checked citations, checked math, checked version/rights, known limitations and date.

### Canonical vs. generated files

- Official API JSON: **generated/read-only**.
- Hand-verified associations, rights decisions and source lists: **curated and version controlled**.
- Main explanation text: **Markdown and version controlled**.
- PDFs/EPUBs: **build outputs**, never the canonical editing format.
- Raw third-party PDFs: **never committed into the public repository by default**.

---

## 7. Research download and licensing strategy

This part is essential. **Free to read does not necessarily mean free to redistribute or convert.** Public hosting, even of a personal project, is distinct from an individual keeping a private reading copy. OpenAlex specifically warns that its cached PDFs retain their underlying copyrights; a license must be checked for the **specific version**. Nobel's website likewise reserves significant rights, including to lectures, portraits and explanatory texts.

### Display four categories of controls clearly

**For every completed award:**

- **Download award explanation — PDF**: locally built original educational prose.
- **Download award explanation — EPUB**: locally built original educational prose.

**For each selected research work:**

- **Original research — PDF**: a real, verified hosted file **only if** the site is allowed to distribute it; otherwise show **“Read original at source”** or **“Open PDF at provider”** as an external link, based on provider policies.
- **Original research — EPUB**: only if a verified, authorized EPUB exists **or** the license explicitly permits creating and distributing a conversion from a suitable text source and the conversion has been QA-tested.
- **Work explanation — PDF** and **Work explanation — EPUB**: available once that original site-written explanation is completed and successfully built.

Do not simply render four active buttons per work when only one artifact exists. A disabled/missing state should explain *why* (no authorized full text; EPUB conversion not permitted; source is a book; conversion quality failed; work pending research). Do not label an externally linked article “downloaded from this site.”

### Rights rules to implement as code

1. Store **rights and allowed actions for each version**, not just each title. Published version, accepted manuscript and preprint may differ.
2. A URL that happens to download a PDF is **not proof of distribution rights**.
3. “Open access”/“bronze OA”/`implied-oa` and a null or vague license are not sufficient authorization for mirroring or EPUB transformation.
4. Explicit permissive licenses or documented publisher authorization may enable self-hosting. For **NoDerivatives** licenses, format conversion/republication requires legal care; do not assume it is permitted.
5. The pipeline shall default to `allows_hosting=false`, `allows_format_conversion=false` until independently verified.
6. Respect publisher/repository terms, robots restrictions, rate limits, and source attribution. Avoid unauthorized bulk download and never bypass a paywall, DRM or technical access restrictions.
7. **No scanned-OCR EPUB** without confirmed rights, review of text accuracy, notes, figures, equations and reading order.
8. Prefer an **official direct-access landing page** if publisher rules prevent hotlinking to a PDF. Nobel site content should be linked through its complete HTML pages, not hotlinked media assets.
9. In the private/local-only mode, any manually imported personal copies live outside the public repository/build and behind access controls; don't assume “personal use” grants rights to publicly share them.
10. Add a rights audit that **fails a public release** if a hosted original artifact lacks permission evidence.

### Original EPUB acquisition/conversion

Priority order:

1. Verify and serve a rights-cleared **native EPUB** from the source.
2. Where a suitable license authorizes derivative redistribution, convert scholarly source files such as licensed HTML/TEI/LaTeX/XML or accessible structured text to EPUB3.
3. Quality-check equations (MathML/fallback images), citations, tables, figures, footnotes, TOC and author attribution; compare content with the source.
4. If only a scanned PDF or paywalled PDF is available, **do not manufacture a misleading EPUB**. Provide the legal source link and explanatory text instead.

### Portraits and official Nobel material

- Obtain portraits individually from demonstrably licensed Wikimedia Commons images, permitted institutional materials or authorized Nobel portraits with **specific terms** checked.
- Nobel's portrait permissions and image rights vary by year and photographer; do not infer one global license. Keep proper credit and source link adjacent to image or in image credits.
- Use neutral monogram/silhouette placeholders where images cannot be cleared; **never hotlink Nobel-hosted images out of page context**.
- Cite/link official explanations; paraphrase in **new writing**, do not copy full official scientific background, lectures, books or press materials into the site.
- Make a footer disclaimer: *Independent educational project; not affiliated with, endorsed by, or an official publication of the Nobel Foundation or the Royal Swedish Academy of Sciences.*

---

## 8. Document generation system

### Single source of truth

Canonical explanatory content lives in UTF-8 Markdown with YAML frontmatter. Both the site and PDF/EPUB exporters consume this **same file and same structured bibliography**. Avoid separately maintained versions that can diverge.

### Award and work exports

For each `published` award, generate:

```text
public/downloads/awards/2026/2026-award-overview.pdf
public/downloads/awards/2026/2026-award-overview.epub
```

For each `published` work explanation, generate:

```text
public/downloads/works/{work-id}/{work-id}-overview.pdf
public/downloads/works/{work-id}/{work-id}-overview.epub
```

For rights-cleared original papers (when authorized), store original/version-aware assets in paths such as:

```text
public/downloads/originals/{work-id}/{version-id}.pdf
public/downloads/originals/{work-id}/{version-id}.epub
```

**Naming must not imply a paper is the version of record if it is a preprint.** The user-visible label should always show title, version type, year and source provider.

### Export behavior

- Pandoc converts Markdown, metadata, math, citations and references to EPUB3 and LaTeX/PDF.
- LaTeX template: academic essay/article appearance, elegant title page, citation list, page numbers, running year/title, 11–12pt body, generous but economical margins.
- EPUB: semantic headings, cover/title metadata, linked table of contents, CSS, embedded fonts only when licensing allows, functional footnotes, accessible equations.
- All exports include **author credit for site-written explanation**, “independent explanatory overview,” award year/title, generation date, bibliography, source URL and non-affiliation note.
- Use a single consistent bibliography style (Chicago author-date or APA; choose one) and stable citation IDs.
- All buttons link to the exact files verified by a generated artifact manifest. If conversion fails, **build must not claim the file exists**.
- Publicly served files should use correct MIME types (`application/pdf`, `application/epub+zip`) and `<a download>` when same-origin.
- For externally hosted PDFs, use link semantics (`target="_blank"`, `rel="noopener noreferrer"`) rather than promising a force-download.
- Surface generation failures as structured diagnostics, without breaking unrelated awards.

### Programmatic acceptance checks

- PDF exists, is nonempty, has `%PDF` signature, has plausible page count and selectable text; inspect representative output for clipping, bibliography, mathematical glyphs and page breaks.
- EPUB is a valid ZIP-based EPUB3, passes EPUBCheck, displays a correct TOC/title/author, and passes spot-checks in at least one ebook reader.
- Every embedded math expression displays on web, PDF and EPUB; record limitations where EPUB reader rendering varies.
- All internal links, footnotes and bibliography links remain valid in the appropriate format.
- Verify expected manifest coverage: **every published award has both downloadable explanation formats**.

---

## 9. Repository layout

```text
economics-prize-archive/
├── README.md
├── LICENSE                        # Site code/content licenses tracked separately
├── CONTRIBUTING.md
├── package.json
├── pnpm-lock.yaml
├── astro.config.mjs
├── tsconfig.json
├── .github/workflows/
│   ├── ci.yml
│   └── deploy.yml
├── content/
│   ├── awards/
│   │   ├── 1969.md
│   │   ├── ...
│   │   └── 2026.md
│   └── works/
│       └── {work-id}.md
├── data/
│   ├── raw/nobel/                # Lightweight JSON snapshots; respect source terms
│   ├── generated/
│   │   ├── prizes.json
│   │   └── laureates.json
│   ├── curated/
│   │   ├── awards/
│   │   ├── works/
│   │   ├── sources/
│   │   └── portraits/
│   └── reports/
│       ├── coverage.json
│       ├── scholarly-matches.json
│       └── rights-audit.json
├── src/
│   ├── components/
│   │   ├── SiteHeader.astro
│   │   ├── PrizeSidebar.astro
│   │   ├── LaureatePortrait.astro
│   │   ├── DownloadPanel.astro
│   │   ├── Bibliography.astro
│   │   ├── WorkCard.astro
│   │   ├── Footnotes.astro
│   │   └── Equation.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── AwardLayout.astro
│   │   └── WorkLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── awards/index.astro
│   │   ├── awards/[year].astro
│   │   ├── works/[id].astro
│   │   ├── about.astro
│   │   ├── sources-and-rights.astro
│   │   └── coverage.astro
│   ├── content.config.ts
│   ├── lib/
│   │   ├── schema.ts
│   │   ├── nobel.ts
│   │   ├── bibliography.ts
│   │   ├── downloads.ts
│   │   ├── links.ts
│   │   └── search.ts
│   └── styles/
│       ├── tokens.css
│       ├── typography.css
│       ├── layout.css
│       └── print.css
├── scripts/
│   ├── sync-nobel.ts
│   ├── discover-works.ts
│   ├── validate-content.ts
│   ├── build-exports.ts
│   ├── validate-exports.ts
│   ├── audit-rights.ts
│   ├── audit-coverage.ts
│   └── check-links.ts
├── templates/
│   ├── award-latex.tex
│   ├── work-latex.tex
│   └── epub.css
├── public/
│   ├── fonts/                    # Only properly licensed font assets
│   ├── portraits/                # Only authorized photo assets
│   └── downloads/                # Generated/authorized outputs only
├── tests/
│   ├── data/
│   ├── unit/
│   ├── e2e/
│   ├── accessibility/
│   └── fixtures/
└── Dockerfile.exports            # Reproducible Pandoc/LaTeX tooling
```

The proposed paths are guidelines; adjust only to fit idiomatic Astro conventions, and document any differences.

---

## 10. Search, navigation and reading features

**Must-have:**

- Search across year, laureates, topics, official motivation, explanations, work titles and authors; Pagefind indexing only published editorial text plus metadata.
- Chronological browse, filter by topic, and laureate index.
- Related award/work links where the conceptual connection is supported.
- Year pagination (previous/next *existing* award).
- Inline glossary terms for unavoidable jargon, backed by editorial definitions.
- Table of contents for long articles, with active section styling and keyboard-friendly anchors.
- Copyable DOIs and clear external publication links.
- Text-selection friendly interface and high-quality print CSS.
- Document/source state badges in **subtle typography**, not colorful noisy UI.

**Nice-to-have after complete coverage:**

- Reading time; local-only “read” bookmarks using browser storage.
- “Beginner / More rigor” toggle for some equations/technical explanations.
- An all-award overview collection EPUB/PDF or ZIP, generated from the site's own content only.
- Cross-topic “reading paths” such as game theory, monetary policy and development economics.
- Dark appearance and offline/PWA caching (must not accidentally cache restricted original files).

---

## 11. Optional local AI-assisted editorial workflow

Since this is a large bibliography/research project, offer **optional** local-model drafting support (for example, an OpenAI-compatible endpoint or **Ollama**). It must not be a runtime dependency and should never silently publish generated prose.

1. Use only source documents whose text can legally be processed under the chosen workflow.
2. Prepare a per-award research dossier: official award facts, verified work citations, accessible source text where permitted, and short bibliographic annotations.
3. Draft into `content/drafts/`, never directly to published pages.
4. Prompt for careful plain-language explanation, optional math, documented caveats, and **citation IDs from the dossier only**.
5. Reject references not present in the vetted source manifest. Never let a model invent bibliographic metadata.
6. Run a fact checklist: award facts, what each laureate did, work linkage, titles/years, math, claims, copyright.
7. Record review results and only promote to `published` following editorial checks.
8. Process awards **one at a time**, persist checkpoint after each award/work, honor rate limits/timeouts, and allow resume after interruption.
9. Optionally configure model URL/name via `.env`; do not commit keys or local service addresses. Documentation should describe both no-AI/manual and AI-assisted paths.

AI can accelerate first drafts but **does not substitute for primary-source reading or verification**. For awards whose critical original work is not accessible, draft a carefully qualified prize-level explanation from legitimate scholarly and official sources; do not manufacture an original-paper summary.

---

## 12. Build pipeline and commands

Implement real commands (names may be adapted, but document them):

```bash
pnpm install
pnpm sync:nobel             # Refresh official prize-year/people metadata safely
pnpm research:works         # Produce candidates + provenance report, not automatic claims
pnpm validate:content       # Citation, schema, prize-year and editorial validation
pnpm audit:rights           # Fail if a public original lacks clearance
pnpm export:docs            # Generate overview PDFs/EPUBs and artifact manifest
pnpm validate:exports       # Files exist, integrity, epub checks, PDF checks
pnpm build                  # Build static site + Pagefind search
pnpm test                   # Unit, integration and E2E tests
pnpm audit:coverage         # Human-readable/JSON per-year completion report
pnpm preview                # Local build preview
```

Make `pnpm build` either invoke required export/validation steps or explicitly fail if artifacts are stale, with actionable instructions. Prevent broken buttons from reaching published pages.

### Reproducibility and resilience

- Store a lockfile and pin document-conversion tooling in `Dockerfile.exports` or CI.
- Implement retry/backoff and cached metadata for APIs; do not hammer upstream services.
- Record SHA-256 and provenance in `download-manifest.json`.
- Incomplete/non-reviewed editorial content must not be represented as finalized.
- Build can produce a browsable **metadata-only** page for incomplete years, with a clear “Detailed explanation in progress” message; coverage audit keeps this separate from genuinely finished articles.
- Exports should be incremental (source hash check) and recoverable from partial failure.
- No downloads should be fetched from a remote provider at visitor request via unvetted server proxy.

---

## 13. Tests and quality gates

### Catalogue correctness

- Every economics prize year returned by the official source has exactly one `/awards/{year}/` page.
- 1969 and 2026 fixtures match the correct official laureates and prize motivation.
- All laureates for a shared prize appear. No duplicate prize year.
- No 2027 page before an official 2027 announcement.
- The award-to-work relationship has an evidence reference and classification.
- `work_type` matches the actual document type; books aren't mislabeled as papers.

### Editorial integrity

- `published` page has required sections, bibliography and at least one verified official award source.
- Checked primary-work explanations cite the version actually consulted.
- Equations parse; technical definitions are provided.
- No placeholder text, fictitious DOI, stale/unreviewed status or `TODO` exposed as finished research.
- All claims describing laureate contributions are reviewable; preserve a human checklist per prize.

### Downloads and rights

- Every published award has **PDF + EPUB overview** and valid active links.
- Every published work explanation has **PDF + EPUB overview**.
- Buttons for originals are derived from verified asset/source manifest, not guessed paths.
- No permission record -> no publicly hosted third-party document.
- EPUB only when available and authorized; never hide conversion errors.
- Files open in at least one real PDF reader and EPUB reader; run EPUBCheck.
- Spot-check images, equations, citations, Unicode names and bibliographies across formats.

### UX and accessibility

- At 320px and desktop widths, sidebar does not overlap text; no horizontal scrolling.
- Keyboard navigation, visible focus states, correct heading hierarchy, skip link, descriptive alt text and meaningful link names.
- WCAG 2.2 AA-oriented checks: contrast, controls, responsive zoom, semantic labels.
- Performance target: Lighthouse >= 90 for Performance/Accessibility/Best Practices on representative pages, barring documented environment limitations.
- No intrusive animation; respect reduced motion.
- Search works without a server/backend; math and article text work with JavaScript disabled where feasible.

---

## 14. Implementation milestones and ordering

**Do not attempt to mass-generate 58 unverified research essays in a single uncontrolled AI step.** Separate reliable software scaffolding, bibliographic research, and reviewed editorial coverage.

### Phase 1 — Project scaffold + design prototype

- [ ] Create Astro/TypeScript repo with Markdown, KaTeX, bibliography helper and CSS foundations.
- [ ] Implement responsive award-page template and right rail exactly as specified.
- [ ] Build initial home/catalogue, search shell, pages and routing.
- [ ] Use **1969**, **a multi-laureate later award**, and **2026** as real metadata/layout test cases.
- [ ] Ensure typography, equations, portrait fallback, source links and mobile sidebar work.

**Acceptance:** navigable, visually coherent layout; metadata sourced or labeled fixtures; no pretend downloads.

### Phase 2 — Entire catalogue ingestion

- [ ] Implement Nobel API importer, raw snapshot, validation and change-safe updates.
- [ ] Generate catalogue records for **all 58 announced annual prizes as of 2026**.
- [ ] Populate all award-year routes with correct year, motivation, all laureates, links and an honest editorial state.
- [ ] Add year navigation, filters and Pagefind.
- [ ] Export a coverage report and fail CI for a missing award year.

**Acceptance:** 1969–2026 inclusive is represented exactly once and matches official award metadata.

### Phase 3 — Bibliographic discovery + rights tracking

- [ ] Implement verified work/DOI matching, manual selection files and evidence fields.
- [ ] Add version-aware PDF/EPUB source discovery and rights decisions.
- [ ] Implement portrait provenance/license checks and placeholder fallback.
- [ ] Add per-work pages, rights-aware download states and citations.
- [ ] Produce research reports identifying uncertain associations and absent content.

**Acceptance:** no automatically fabricated “winning papers” or unsupported rights claims; each candidate is auditable.

### Phase 4 — Overview export pipeline

- [ ] Build PDF and EPUB converters from the same Markdown sources.
- [ ] Make document templates reflect academic/TeX design.
- [ ] Generate download manifest, hashes and tests.
- [ ] Enable prize- and work-specific buttons only after files validate.
- [ ] Test equations, citations, cover pages and EPUB readers.

**Acceptance:** sample prizes and works download accurate, readable PDF/EPUB overviews.

### Phase 5 — Editorial production for every award

- [ ] Research each prize and its laureates against official materials.
- [ ] Link and annotate the crucial papers/books without implying a single paper caused every award.
- [ ] Draft original readable explanations and per-work analyses, one award at a time.
- [ ] Conduct citation, economics, equation and rights review.
- [ ] Mark as `published` only after approval and both overview formats build.
- [ ] Continue until **all 58 years** have fully reviewed award-level overviews. Report featured-work analysis coverage separately.

**Acceptance:** all annual prize pages have actual, reviewed educational essays and their own PDF/EPUB downloads. For original third-party texts, the presence or absence of a legal PDF/EPUB is accurately described; unavailable formats are **not** a failure of integrity.

### Phase 6 — Deployment and upkeep

- [ ] Configure GitHub Pages (custom domain optional), base path, sitemap, metadata and redirects if needed.
- [ ] Add CI schema, link, export, rights and accessibility tests.
- [ ] Add manually triggered yearly import/update; do **not** auto-publish an unreviewed new award article.
- [ ] Provide source attribution, photo credits, rights policy, disclaimer and clear README.
- [ ] Document optional private deployment and handling of personally imported restricted files.

**Acceptance:** repeatable deployment from clean checkout; a fully functional static archive with no production secrets.

---

## 15. Definition of done

The site is **feature-complete** when all these hold:

- [ ] A visitor can browse **every announced Economics prize since 1969**, including **2026**.
- [ ] Every prize page shows **every laureate**, the official motivation, a concise sidebar, portraits **only if licensed**, and a clearly readable article left of the sidebar on desktop.
- [ ] All **58 award-level explanations** are original, substantively researched, reviewed and supported by references, not placeholder text.
- [ ] Papers/books associated with each prize are explicitly supported by sources; all key laureate contributions are considered.
- [ ] Every completed award and every completed standalone work explanation has **functioning PDF and EPUB** downloads.
- [ ] Every original source control describes a **genuine, verified version**: available on-site under valid rights, linked at an appropriate provider, or transparently unavailable.
- [ ] No original EPUB is fabricated from unauthorized or unusable input; no stolen/uncleared source files are published.
- [ ] Search, topic filtering, timeline and responsive layout work without a backend.
- [ ] Rights, content, file-generation and coverage audits pass in CI.
- [ ] The repository includes setup/build/deploy docs, a source methodology and instructions for incorporating future prizes.

**A staged delivery is expected:** Codex should complete the engineering foundation and report editorial gaps. It must **not** claim final site completeness while 58 evidence-reviewed essays or verified paper references remain outstanding.

---

## 16. Recommended initial Codex execution prompt

Copy the following as the task instruction when supplying this Markdown plan to Codex:

> Implement the attached `economics_prize_archive_codex_plan.md` as a working Astro static website in this repository. Use plain Markdown as the canonical content source; design a print/TeX-inspired layout with the main explanatory article on the left and a compact laureate/summary/download sidebar on the right. Use the official Nobel API to populate every economics prize year from 1969 through the latest announced award (2026 in the plan), with all laureates, correct motivations, stable source links and metadata validation. Create source-verified bibliographic mapping rather than inventing one Nobel-winning paper per prize. Build proper per-award and per-work pages, mathematical typography, citation handling, static search, rights-aware original-research links, reproducible PDF/EPUB **overview** exports, automated tests, a rights audit, a coverage report, and GitHub Pages deployment. Start by finishing the software and a few fully researched exemplar pages, then progress through all years with checkpointed editorial status. Never pretend an original document is licensed or a summary is researched if it has not been verified. Continue implementing as much as possible, and conclude with reproducible commands, what passed, and an itemized list of any editorial/source gaps still remaining.

---

## 17. Reference sources and verification notes

These were checked while scoping this plan (17 October 2026). Sources can change; recheck current terms and API docs before implementation:

1. **Nobel Prize developer zone / API v2.1:** <https://www.nobelprize.org/organization/developer-zone-2/> — official, regularly updated structured prize/laureate metadata.
2. **Official 2026 award summary:** <https://www.nobelprize.org/prizes/economic-sciences/2026/summary/> — verify latest motivation and laureate details.
3. **Official 2026 press release:** <https://www.nobelprize.org/prizes/economic-sciences/2026/press-release/> — award contribution description.
4. **Nobel Prize copyright guidance:** <https://www.nobelprize.org/about/copyright-information> — portraits, lectures, scientific-background material and media restrictions.
5. **Nobel Prize terms of use:** <https://www.nobelprize.org/about/terms-of-use> — restrictions on reproduction, media hotlinking, trademarks and educational exceptions.
6. **OpenAlex: Open access and work locations:** <https://help.openalex.org/data/works/open-access/> and <https://help.openalex.org/data/locations/> — versions, `pdf_url`, access status and licenses.
7. **OpenAlex: Full text and licensing:** <https://help.openalex.org/access/fulltext/> — cached PDFs still retain their original copyright.
8. **Unpaywall API:** <https://data.unpaywall.org/products/api> — optional DOI OA checks; general search was retired in September 2026, so use OpenAlex for discovery.
9. **Crossref REST API docs:** <https://www.crossref.org/documentation/retrieve-metadata/rest-api/> — reference verification, DOIs, bibliographic metadata.
10. **Pandoc documentation:** <https://pandoc.org/MANUAL.html> — PDF/EPUB generation and citations.
11. **Astro documentation:** <https://docs.astro.build/> — static generation and typed collections.
12. **Pagefind:** <https://pagefind.app/> — local full-text search for static sites.

**Practical caveat:** The source material is heterogeneous. The goal is comprehensive **award coverage**, deeply researched summaries, and transparent source access—not a false guarantee that every historical article/book has freely redistributable PDF and EPUB originals.
