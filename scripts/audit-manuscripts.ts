import { existsSync } from 'node:fs';
import { articles, hash, json, today, write } from './common';

// This inventory records evidence, not editorial approval. In particular,
// a long manuscript and a dossier do not establish the truth of its claims.
const years = articles('awards').sort((a, b) => Number(a.id) - Number(b.id)).map(article => {
  const path = `data/curated/dossiers/${article.id}.json`;
  const dossier = existsSync(path) ? json<any>(path) : null;
  if (dossier && dossier.year !== Number(article.id)) throw new Error(`Dossier year mismatch: ${path}`);
  if (dossier) {
    const ids = new Set((dossier.citations ?? []).map((citation: any) => citation.id));
    for (const id of article.data.citation_ids) {
      if (!ids.has(id)) throw new Error(`Dossier omits ${id}: ${path}`);
    }
  }
  return {
    year: Number(article.id),
    status: article.data.status,
    body_word_count_whitespace: article.content.trim().split(/\s+/).filter(Boolean).length,
    source_sha256: hash(article.raw),
    dossier: dossier ? path : null,
    review_record_present: article.data.review !== null && article.data.review !== undefined,
  };
});

write('data/reports/essay-manuscripts.json', {
  checked_at: today(),
  scope: 'Annual manuscript inventory; presence, size and hashes do not establish scholarly accuracy or independent approval',
  catalogue_years: years.length,
  authored_drafts: years.filter(year => ['draft', 'needs-review'].includes(year.status)).length,
  metadata_only: years.filter(year => year.status === 'metadata-only').length,
  review_records: years.filter(year => year.review_record_present).length,
  years,
});
console.log(`Manuscript inventory: ${years.length} years; ${years.filter(year => year.status === 'metadata-only').length} metadata-only. No approval inferred.`);
