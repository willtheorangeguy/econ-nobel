import { fetchJson, json, write, today } from './common';
// Curated queue; candidates NEVER become work associations or approved rights automatically.
const queue = json<any[]>('data/curated/research-queue.json');
const normalize = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g,'');
const results=[];
for (const q of queue) {
  const data = await fetchJson(`https://api.crossref.org/works/${encodeURIComponent(q.doi)}`);
  const m=data.message;
  const years=[m.published?.['date-parts']?.[0]?.[0],m['published-print']?.['date-parts']?.[0]?.[0],m['published-online']?.['date-parts']?.[0]?.[0]].filter(Boolean);
  const foundAuthors=(m.author||[]).map((a:any)=>a.family);
  const titleMatches=normalize(m.title[0])===normalize(q.expected_title);
  const authorsMatch=q.expected_author_families.every((n:string)=>foundAuthors.some((f:string)=>normalize(f)===normalize(n)))&&foundAuthors.length===q.expected_author_families.length;
  const verified=titleMatches&&authorsMatch&&years.includes(q.expected_year)&&m.DOI.toLowerCase()===q.doi.toLowerCase();
  results.push({checked_at:today(),query:q,metadata_verified:verified,checks:{titleMatches,authorsMatch,years},association_review_required:true,rights_review_required:true,full_text_candidates:(m.link||[]).map((l:any)=>({url:l.URL,content_type:l['content-type'],version:l['content-version']||null,verified_access:false,allows_hosting:false,allows_format_conversion:false})),crossref:{doi:m.DOI,title:m.title[0],authors:m.author,year:years[0],venue:m['container-title']?.[0],volume:m.volume,issue:m.issue,pages:m.page,url:m.URL,type:m.type}});
  await new Promise(r=>setTimeout(r,300));
}
write('data/reports/scholarly-matches.json',{checked_at:today(),candidates:results,unmatched:results.filter(r=>!r.metadata_verified).length});
console.log(`Checked ${results.length} curated candidates; ${results.filter(r=>!r.metadata_verified).length} metadata mismatches. No works, associations or rights automatically approved.`);
if(results.some(r=>!r.metadata_verified))process.exitCode=1;
