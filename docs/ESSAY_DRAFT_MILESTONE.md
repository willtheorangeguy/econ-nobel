# Annual essay drafting milestone — 17 October 2026

Every award year from 1969 through the officially announced 2026 award now has a substantive annual manuscript. **All 58 are unreviewed drafts. None is a completed, independently reviewed or published scholarly explanation.** This milestone completes annual draft coverage, not the full implementation plan.

## Actual content

- 58 annual manuscripts, 1,202–1,638 whitespace-delimited body words each, totaling 73,765 words. Word counts include headings, notation and citation markers; they measure size rather than quality.
- All ten required annual sections, including historical context, distinct recipient contributions, worked examples, mathematical explanations, caveats and references.
- A research dossier for every year, with source versions, attribution, illustration checks and remaining research. The 1969/2001 dossiers explicitly distinguish inherited provenance from new consultation.
- Three unreviewed work explanations associated with 2001: Akerlof, Spence and Rothschild–Stiglitz. Their bodies contain 706–766 words each. This is three work pages, not archive-wide foundational-work coverage.
- 187 structured citations. Bibliographic verification is distinct from reading an original text; consulted versions and partial reading are declared. Original reading copies remain outside Git and public hosting.
- All 101 recipients' surnames occur in their corresponding annual bodies. That presence check does not independently verify their intellectual contributions.

The new annual drafts cover 1970–2000 and 2002–2026. The preexisting 1969 and 2001 manuscripts were retained and improved where new bibliography or original-work consultation made their earlier gap statements obsolete.

## Research corrections and boundaries

- Rejected an unrelated DOI candidate for Maskin and an unrelated regulation-paper candidate; matched actual titles rather than accepting a successful DOI response alone.
- Kept Shiller's 1980 and Bernanke's 1983 working-paper records distinct from their journal editions.
- Distinguished the original dates of Mokyr's and Woodford's books from later digital-edition metadata.
- Rejected a search result pointing to Tinbergen's 1956 United Kingdom volume as evidence of reading his 1939 United States volume. The latter's bibliography is checked; its full original text remains unread here.
- Recorded Frisch's 1933 work through a clearly identified 1995 excerpt and publisher introduction, without claiming full original consultation.
- Read selected original sections of Spence and Rothschild–Stiglitz for their new work drafts. The explanations distinguish a self-selecting menu from competitive equilibrium and signaling from productive education.
- Used the October 2026 official announcement and selected scientific-background passages for Hall/Woodford. No future December ceremony or lecture is cited as available evidence.

A fresh recheck covered 68 curated publication candidates. Sixty-seven matched Crossref's DOI/title/author/year expectations. The remaining record, Sargent–Wallace (1981), has a known provider omission: Crossref lists only Sargent. The publisher's [interview with Neil Wallace](https://www.minneapolisfed.org/article/2013/interview-with-neil-wallace), under “Fiscal-monetary policy interdependence,” corroborates both authors. The mismatch stays visible, and `npm run research:works` exits nonzero until the provider record matches. Do not remove Wallace merely to obtain a green metadata report.

The expanded queue remains a candidate recheck list. It does not automatically select works, certify substantive claims, establish accessible full text or grant hosting/conversion rights. Its title comparison now handles presentation markup such as italic *n* in Nash's actual Crossref title; regression tests preserve distinctions between different publications.

## Reproducible evidence

`npm run audit:manuscripts` records every annual status, source SHA-256, word count, dossier path and review-record presence. It runs in the build. Coverage and document manifests are generated separately; presence and hashes never imply scholarly approval.

The full local build validated 122 overview files, 189 static HTML pages and 5,179 internal links/assets. Astro check returned zero diagnostics; 17 unit tests and nine browser regressions passed. Final-batch browser checks covered nine changed routes at three widths and 18 real download bodies. Accumulated per-milestone checks cover all 58 annual routes at three widths plus the two new work routes (180 combinations), with dates and hashes retained. Four additional EPUBs passed actual reader navigation/MathML/bibliography checks. Annual draft revision `715d281` passed clean-checkout validation and deployment in [run 39071113462](https://github.com/willtheorangeguy/econ-nobel/actions/runs/39071113462); all 122 live files matched the public manifest and recomputed source fingerprints. See `data/reports/live-annual-draft-verification.json`. Subsequent engineering repairs have their own verification record in progress. A subsequent complete live pass checked all 61 essay routes at three widths (183 combinations), with zero automated accessibility violations/overflow and all 122 overview bodies matching the deployed manifest; its report records the earlier incomplete invocation and full diagnostic rerun. Earlier reports retain their own scope; automated checks are not scholarly approval.

## Remaining work

Full original-text research and later-literature assessment remain incomplete for many entries. Most awards still need curated foundational-work records and dedicated work explanations. All annual and work drafts need actual independent editorial review, including claims, equations, attribution and source editions.

Only one portrait has verified display permission. No original research files are hosted, and no permission to convert those originals is inferred. Research biographies and broader original-access workflows remain unfinished.

The annual drafting milestone itself did not repair the audit's engineering findings. Subsequent targeted fixes reject empty reviewed sections, separate original-artifact checksums and distinguish native EPUB hosting from conversion. Fresh-preview startup investigation and current validation are recorded separately in [progress](../IMPLEMENTATION_PROGRESS.md). These repairs do not supply independent research review or complete original-document acquisition/conversion. See [the audit](COMPLETION_AUDIT.md) for remaining limits.
