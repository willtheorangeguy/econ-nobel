# Quality gates

- `npm run validate:content`: official snapshot/year/recipient consistency, shares, IDs, structured citations, references, topic/work relationships, required reviewed sections, review records and math parsing.
- `npm run audit:rights`: permission evidence, hashes, version-specific hosting/conversion and portrait clearance; denied by default.
- `npm run export:docs`: same canonical Markdown and citation metadata for web/PDF/EPUB, incremental source hashes, atomic file replacement, manifest and structured failure diagnostics. Failed artifact links never appear; export failures block release.
- `npm run validate:exports`: SHA-256/length checks, PDF signature/selectable text/page count, and EPUBCheck with warnings treated as errors. Every published item needs both formats.
- `npm run build`: all of the above, coverage report, Astro static routes, Pagefind and all internal HTML links/anchors/assets checked under the configured base.
- `npm test`: data/rights/review regression tests.
- `npm run test:e2e`: real Chromium, search and base URL navigation, filters/sorting, every shared-recipient panel, valid downloads, keyboard/no-JS reading, 320/390/1280px overflow and axe WCAG AA checks.

A successful automated check does not imply scholarly accuracy, legal clearance of an unrecorded version, screen-reader user testing, or perfect rendering in every ebook reader. Editorial review, representative PDF/EPUB visual inspection and external-source checks remain separate tasks. Lighthouse targets require measured runs; never claim them from an Astro build alone.
