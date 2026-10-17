import { existsSync } from 'node:fs';
import { awardSchema, laureateSchema } from '../src/lib/schema';
import { fetchJson, write, today, optionalJson, hash } from './common';

const origin = 'https://api.nobelprize.org';
const accept = process.argv.includes('--accept');
const offline = process.argv.includes('--offline');
async function fetchPages(resource: string, key: string) {
  let url: string | null = `${origin}/2.1/${resource}?nobelPrizeCategory=eco&limit=100`;
  const rows: any[] = [], pages: unknown[] = [], seen = new Set<string>();
  while (url) {
    if (seen.has(url)) throw new Error('API pagination loop');
    seen.add(url);
    const page = await fetchJson(url);
    if (!Array.isArray(page[key]) || !page[key].length) throw new Error(`Empty/malformed ${key} response`);
    rows.push(...page[key]); pages.push(page);
    const next: string | undefined = page.links?.next;
    if (next) {
      const parsed = new URL(next);
      // API emits Azure aliases. Retain only documented query parameters on the canonical API host.
      url = `${origin}/2.1/${resource}${parsed.search}`;
    } else url = null;
  }
  if (new Set(rows.map(r => key === "laureates" ? r.id : r.awardYear)).size !== rows.length) throw new Error(`Duplicate ${key} records across pagination`);
  if (pages.length && rows.length !== Number((pages[0] as any).meta.count)) throw new Error(`Pagination count mismatch for ${key}`);
  return { rows, pages };
}
const prizesInput = offline ? optionalJson<any>('data/raw/nobel/prizes.json', null) : await fetchPages('nobelPrizes', 'nobelPrizes');
const peopleInput = offline ? optionalJson<any>('data/raw/nobel/laureates.json', null) : await fetchPages('laureates', 'laureates');
if (!prizesInput || !peopleInput) throw new Error('Offline snapshots unavailable; run sync:nobel online first');
const checked = offline ? prizesInput.checked_at : today();
const prizeRows = prizesInput.rows.filter((p: any) => p.category?.en === 'Economic Sciences');
const people = new Map<string, any>(peopleInput.rows.map((p: any) => [p.id,p]));
const prizes = prizeRows.map((p: any) => {
  const year = Number(p.awardYear);
  return awardSchema.parse({ year, official_prize_id: `eco-${year}`, official_name: p.categoryFullName.en,
    official_motivation: p.topMotivation?.en || [...new Set(p.laureates.map((l: any) => l.motivation.en))].join('; '),
    official_page_url: `https://www.nobelprize.org/prizes/economic-sciences/${year}/summary/`,
    official_api_url: p.links.find((l: any) => l.rel === 'nobelPrize').href,
    laureates: p.laureates.map((l: any) => ({ id: l.id, name: l.knownName?.en || l.fullName.en, motivation: l.motivation.en, portion: l.portion })),
    last_source_checked_at: checked,
  });
}).sort((a: any,b: any) => a.year-b.year);
const years = prizes.map((p: any) => p.year);
if (new Set(years).size !== years.length || years[0] !== 1969) throw new Error('Duplicate/missing initial year');
for (let year = 1969; year <= years.at(-1)!; year++) if (!years.includes(year)) throw new Error(`Missing year ${year}`);
const laureates = [...new Set<string>(prizes.flatMap((p: any) => p.laureates.map((l: any) => l.id)))].map(id => {
  const detail = people.get(id);
  if (!detail) throw new Error(`Missing laureate detail ${id}`);
  const awards = prizes.filter((p: any) => p.laureates.some((l: any) => l.id === id));
  const profile = detail.links?.find((l: any) => l.rel === 'external')?.href;
  if (!profile) throw new Error(`Missing official profile ${id}`);
  return laureateSchema.parse({ id, display_name: awards[0].laureates.find((l: any) => l.id === id)!.name,
    official_profile_url: profile, birth_date: detail.birth?.date || null,
    birth_place: detail.birth?.place?.locationString?.en || null,
    affiliations: [...new Set(detail.nobelPrizes.filter((p: any) => p.category?.en === 'Economic Sciences').flatMap((p: any) => (p.affiliations || []).map((a: any) => a.name.en)))],
    award_years: awards.map((p: any) => p.year), source_url: `${origin}/2.1/laureate/${id}`,
  });
});
const old = optionalJson<any[]>('data/generated/prizes.json', []);
const clean = (x: any) => { const { last_source_checked_at, ...record } = x; return record; };
const changed = prizes.filter((p: any) => { const o = old.find(a => a.year === p.year); return !o || hash(JSON.stringify(clean(o))) !== hash(JSON.stringify(clean(p))); }).map((p: any) => p.year);
const removed = old.filter(o => !years.includes(o.year)).map(o => o.year);
const candidate = { checked_at: checked, prizes, laureates, changed_years: changed, removed_years: removed };
write('data/reports/import-diff.json', candidate);
if (!accept && (changed.length || removed.length)) {
  console.log('Candidate staged in data/reports/import-diff.json. Review and rerun with --accept. No canonical metadata/content changed.');
  process.exit(0);
}
if (!offline) {
  write('data/raw/nobel/prizes.json', { ...prizesInput, checked_at: checked });
  write('data/raw/nobel/laureates.json', { ...peopleInput, checked_at: checked });
}
write('data/generated/prizes.json', prizes);
write('data/generated/laureates.json', laureates);
for (const p of prizes) {
  const path = `content/awards/${p.year}.md`;
  if (!existsSync(path)) write(path, `---\ntitle: ${JSON.stringify(`${p.year} — Economic Sciences`)}\nabstract: "Official award facts are available. The researched explanation is in preparation."\nstatus: metadata-only\ncitation_ids: []\ntopic_slugs: []\nfeatured_work_ids: []\nreview: null\n---\n`);
}
console.log(`Imported ${prizes.length} awards (${years[0]}–${years.at(-1)}), ${laureates.length} laureates. Curated research untouched.`);
