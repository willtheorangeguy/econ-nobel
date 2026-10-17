import { awardSchema, laureateSchema, workSchema, citationSchema, portraitSchema } from '../src/lib/schema';
import { json, articles } from './common';
import { assertReviewedBody } from './editorial-gate';
import katex from 'katex';

const prizes = json<any[]>('data/generated/prizes.json').map(p => awardSchema.parse(p));
const people = json<any[]>('data/generated/laureates.json').map(p => laureateSchema.parse(p));
const works = json<any[]>('data/curated/works.json').map(w => workSchema.parse(w));
const citations = json<any[]>('data/curated/citations.json').map(c => citationSchema.parse(c));
json<any[]>('data/curated/portraits.json').forEach(p => portraitSchema.parse(p));
const topics = json<any[]>('data/curated/topics.json');
const ensure = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
function unique(ids: (string|number)[], kind: string) { ensure(new Set(ids).size === ids.length, `Duplicate ${kind}`); }
unique(prizes.map(p=>p.year),'award years'); unique(people.map(p=>p.id),'laureates'); unique(citations.map(c=>c.id),'citation IDs'); unique(works.map(w=>w.id),'work IDs');
const raw = json<any>('data/raw/nobel/prizes.json');
const rawYears = raw.rows.filter((p: any) => p.category?.en === 'Economic Sciences').map((p:any)=>Number(p.awardYear)).sort();
ensure(JSON.stringify(prizes.map(p=>p.year).sort()) === JSON.stringify(rawYears), 'Generated years do not match raw official snapshot');
for (let y=1969; y<=Math.max(...prizes.map(p=>p.year)); y++) ensure(prizes.some(p=>p.year===y),`Missing annual award ${y}`);
for (const p of prizes) {
  const r = raw.rows.find((r: any)=>Number(r.awardYear)===p.year);
  ensure(p.official_name===r.categoryFullName.en, `Official name mismatch ${p.year}`);
  ensure(JSON.stringify(p.laureates.map(l=>[l.id,l.name,l.motivation,l.portion])) === JSON.stringify(r.laureates.map((l:any)=>[l.id,l.knownName?.en||l.fullName.en,l.motivation.en,l.portion])), `Laureate facts drifted ${p.year}`);
  unique(p.laureates.map(l=>l.id),`recipients in ${p.year}`);
  let share=0;
  p.laureates.forEach(l => { const [n,d] = l.portion.split('/').map(Number); share+=n/(d||1); ensure(people.some(a=>a.id===l.id&&a.award_years.includes(p.year)),`Unresolved laureate ${l.id}`); });
  ensure(Math.abs(share-1)<1e-9, `Prize shares do not sum to one: ${p.year}`);
}
const awardArticles=articles('awards'), workArticles=articles('works');
ensure(JSON.stringify(awardArticles.map(a=>Number(a.id)).sort())===JSON.stringify(rawYears),'Missing or orphan award Markdown');
for (const a of [...awardArticles,...workArticles]) {
  const refs = [...a.content.matchAll(/\[@([\w-]+)\]/g)].map(m=>m[1]);
  for (const id of [...refs,...a.data.citation_ids]) ensure(citations.some(c=>c.id===id&&c.verified),`${a.path}: unknown/unverified citation ${id}`);
  for (const id of refs) ensure(a.data.citation_ids.includes(id),`${a.path}: cited source ${id} missing bibliography`);
  for (const slug of a.data.topic_slugs) ensure(topics.some(t=>t.slug===slug), `${a.path}: unknown topic ${slug}`);
  for (const id of a.data.featured_work_ids) {
    const work=works.find(w=>w.id===id); ensure(work,`${a.path}: missing work ${id}`);
    if (awardArticles.includes(a)) ensure(work!.award_links.some(l=>l.award_year===Number(a.id)),`${a.path}: unsupported work association`);
  }
  for (const m of a.content.matchAll(/\$\$([\s\S]+?)\$\$|(?<!\$)\$([^\n$]+)\$(?!\$)/g)) katex.renderToString(m[1]||m[2],{throwOnError:true,strict:'error'});
  if (['reviewed','published'].includes(a.data.status)) {
    ensure(a.data.review,`${a.path}: review record required`);
    ensure(!/TODO|TBD|placeholder|coming soon/i.test(a.content),`${a.path}: unfinished text cannot be reviewed`);
    ensure(a.data.citation_ids.length>=2,`${a.path}: insufficient bibliography`);
    try { assertReviewedBody(a.content, awardArticles.includes(a) ? 'awards' : 'works'); }
    catch (error) { throw new Error(`${a.path}: ${(error as Error).message}`); }
    if (awardArticles.includes(a)) {
      ensure(a.data.citation_ids.some(id=>citations.find(c=>c.id===id)?.type==='official'),`${a.path}: official source required`);
    } else ensure(a.data.source_version,`${a.path}: consulted primary version required`);
  }
}
for (const w of works) {
  ensure(workArticles.some(a=>a.id===w.id),`Missing work article ${w.id}`);
  for (const id of [w.citation_id,...w.source_citation_ids,...w.award_links.flatMap(l=>l.evidence_citation_ids)]) ensure(citations.some(c=>c.id===id&&c.verified),`Work ${w.id}: unverified evidence ${id}`);
  for (const l of w.award_links) ensure(prizes.some(p=>p.year===l.award_year),`Work ${w.id}: missing award ${l.award_year}`);
}
ensure(workArticles.every(a=>works.some(w=>w.id===a.id)),'Orphan work Markdown');
console.log(`Validated ${prizes.length} annual records, ${people.length} laureates, ${works.length} works, ${citations.length} citations and ${awardArticles.length+workArticles.length} content entries.`);
