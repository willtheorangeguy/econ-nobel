# Economics Prize Archive

A static, academic reading room for every announced Sveriges Riksbank Prize in Economic Sciences in Memory of Alfred Nobel. Built with Astro 7, TypeScript, Markdown, KaTeX, Pagefind, and Pandoc + XeLaTeX / EPUB3.

Live: https://williamvdg.me/econ-nobel/

Repository: https://github.com/willtheorangeguy/econ-nobel

**Current editorial state:** 58 official annual records (1969–2026), 101 laureates, 12 unreviewed award essays (1969–1979 and 2001), three verified work associations, one unreviewed work explanation, and one permission-verified portrait. No essay has been independently reviewed or marked published. This is a working staged archive, not a claim of complete scholarly coverage. See [progress](IMPLEMENTATION_PROGRESS.md) and [coverage](data/reports/coverage.md).

**Completion audit:** this is not the completed, production-ready archive requested in the specification. [The audit](docs/COMPLETION_AUDIT.md) records missing research, reproduced engineering defects, and the limits of the passing checks.

## Quick start

Requirements: Node **24.22.0**, npm (bundled with Node), Python 3 + `pypdf`, Java 17+, and XeLaTeX. The lockfile is canonical; npm is used in place of the plan’s preferred pnpm to keep a single reproducible lockfile.

On Debian/Ubuntu, inspect your existing installation first, then install the document runtime if needed:

```sh
sudo apt-get install texlive-xetex texlive-latex-extra texlive-fonts-recommended lmodern default-jre-headless python3-pypdf
npm ci
bash scripts/setup-exports.sh
npm run check
npm test
npm run build
npm run test:e2e       # first run: npx playwright install --with-deps chromium
npm run preview
```

`setup-exports.sh` installs pinned **Pandoc 3.12.1** and **EPUBCheck 5.4.0** into ignored `.tools/`; XeLaTeX and Java use your existing installation. On other platforms set `PANDOC_BIN`, `PDF_ENGINE` (an xelatex executable), `JAVA_BIN`, `EPUBCHECK_JAR`, and optionally `PYTHON_BIN`. `Dockerfile.exports` provides a fixed-distro conversion environment. No credentials or live scholarly APIs are needed for a normal build.

Development: `npm run dev` renders Markdown locally. Search and generated downloads need `npm run build` and preview. All fonts, math styling and search assets are served locally. A static HTTP server is needed for Pagefind’s browser modules; opening `index.html` with `file://` does not provide browser module serving.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run sync:nobel` | Fetch official API pages; stage a metadata change report for review |
| `npm run sync:nobel -- --accept` | Import a reviewed API refresh; preserve existing Markdown and curated research |
| `npm run sync:nobel -- --offline` | Recreate accepted metadata from saved snapshots without network access |
| `npm run research:dossier -- 1969` | Create a source dossier for an imported year without overwriting an existing dossier |
| `npm run check:sources` | Check external citation URLs and record provider blocking/access gaps |
| `npm run research:works` | Check manually queued DOI/title/author/year candidates against Crossref |
| `npm run validate:content` | Validate schemas, official facts, bibliography references, math and editorial gates |
| `npm run audit:rights` | Fail for uncleared original/portrait assets and permissions |
| `npm run export:docs` | Incrementally generate PDF/EPUB explanations and their artifact manifest |
| `npm run validate:exports` | Verify checksums, selectable PDF text and EPUBCheck |
| `npm run audit:coverage` | Produce the per-year JSON/Markdown completion ledger |
| `npm run build` | Validate content/rights/exports, build static pages, index search, audit internal links |
| `npm run test:e2e` | Chromium functionality, responsive layout and axe accessibility tests |

Exports use the same Markdown and structured citations as HTML. Draft downloads live under `downloads/drafts/` and are labeled inside each file. Failed or stale artifacts are not advertised. Third-party originals are external links unless exact-version rights have been explicitly recorded.

## Layout

- `content/awards/`, `content/works/`: canonical authored Markdown; official-facts-only entries have empty bodies.
- `data/raw/nobel/`: accepted source snapshots and provenance.
- `data/generated/`: normalized awards/people and generated download manifest.
- `data/curated/`: manually selected bibliography, work associations, topics and portrait permissions.
- `data/reports/`: import differences, scholarly matching, coverage, rights and export diagnostics.
- `src/`: static routes, typed collections, reading templates and responsive/print CSS.
- `templates/`: PDF typography and EPUB stylesheet.
- `scripts/`, `tests/`: ingestion, research, generation, integrity checks and browser regression tests.

Read [editorial workflow](docs/EDITORIAL_WORKFLOW.md), [quality gates](docs/QA.md), and the [original implementation plan](docs/implementation-plan.md) to resume research. Do not edit generated data to invent awards or paper associations. Do not commit third-party research PDFs.

## GitHub Pages

The existing account custom domain is retained. Default `site` is `https://williamvdg.me`, and `base` is `/econ-nobel`. All routes/assets/downloads are base-safe. Override `SITE_URL` and `BASE_PATH` for another deployment; use `BASE_PATH=/` for a root-hosted site.

`deploy.yml` calls the reusable validation workflow, builds exports and search, runs tests, uploads the static artifact, then deploys through GitHub Pages. Set Pages → Source to **GitHub Actions**. Pushes to `main` and manual runs deploy; pull requests only validate. The manually triggered update workflow stages API candidates as an artifact; it never auto-publishes a new essay.

For private hosting, publish the same `dist/` behind your organization’s authenticated static host. GitHub Pages does not protect restricted reading copies. Keep such copies outside the public source/build; changing hosting does not establish copyright permission.

## Integrity and limits

- Award coverage is derived from the official API’s returned years; it is not permanently hardcoded to 58.
- A title/DOI match is not proof of association with a prize. Each curated association needs evidence.
- “Free to read” is not permission to host or convert. Permission defaults to denied.
- Missing portraits use monograms. Approved image credit/license and display modifications are adjacent to the photo.
- Published status requires a real reviewer record and both validated overview formats. Automated tests do not replace scholarly review.
- PDF/EPUB math is generated from TeX and EPUB MathML. Reader compatibility and representative layout need visual QA as well as integrity checks.

Code: MIT. Original explanatory prose: CC BY 4.0. Official data and third-party materials retain their respective rights. This project has no official Nobel affiliation.
