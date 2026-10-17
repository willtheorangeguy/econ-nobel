import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const sha=x=>createHash('sha256').update(x).digest('hex');
// Run after the supplied revision has deployed. Live PDF bytes may differ
// from local bytes; verify the public manifest and its actual toolchain.
const site=process.env.SITE_URL||'https://williamvdg.me',base=(process.env.BASE_PATH||'/econ-nobel').replace(/\/$/,''),revision=process.argv[2],run=process.argv[3];
if(!revision||!run)throw Error('Supply deployed source revision and workflow URL');
const get=async path=>{const r=await fetch(`${site}${base}/${path}?revision=${revision}`,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`${path}: ${r.status}`);return r;};
const manifest=await (await get('downloads/manifest.json')).json();
const expected=JSON.parse(readFileSync('data/generated/download-manifest.json'));
if(manifest.artifacts.length!==expected.artifacts.length)throw Error(`Expected ${expected.artifacts.length} artifacts, found ${manifest.artifacts.length}`);
const expectedByPath=new Map(expected.artifacts.map(a=>[a.path,a]));
if(new Set(manifest.artifacts.map(a=>a.path)).size!==expectedByPath.size||manifest.artifacts.some(a=>!expectedByPath.has(a.path)))throw Error('Deployed artifact paths differ from the local build');
const bibliography=JSON.parse(readFileSync('data/curated/citations.json'));
const csl=bibliography.map(c=>({id:c.id,type:c.type==='journal-article'?'article-journal':c.type==='book'?'book':'webpage',title:c.title,author:c.authors.map(name=>({literal:name})),issued:{'date-parts':[[c.year]]},URL:c.url,DOI:c.doi,'container-title':c.venue,volume:c.volume,page:c.pages,accessed:{'date-parts':[c.accessed.split('-').map(Number)]}}));
const template=readFileSync('templates/overview.tex','utf8'),css=readFileSync('templates/epub.css','utf8');const checks=[];
let next=0;
await Promise.all(Array.from({length:4},async()=>{
 while(next<manifest.artifacts.length){
  const a=manifest.artifacts[next++];
  const raw=readFileSync(`content/${a.kind}/${a.id}.md`,'utf8');
  const source_hash=sha(JSON.stringify({raw,csl,template,css,style:sha(readFileSync('templates/chicago-author-date.csl')),toolchain:manifest.toolchain,site,base,exporter:sha(readFileSync('scripts/build-exports.ts'))}));
  if(a.source_hash!==source_hash)throw Error(`${a.path}: deployed source fingerprint differs`);
  if(a.editorial_status!==expectedByPath.get(a.path).editorial_status)throw Error(`${a.path}: unexpected editorial state`);
  const r=await get(a.path),bytes=Buffer.from(await r.arrayBuffer()),type=r.headers.get('content-type')?.split(';')[0];
  if(sha(bytes)!==a.sha256||bytes.length!==a.bytes)throw Error(`${a.path}: public manifest integrity mismatch`);
  if(type!==(a.format==='pdf'?'application/pdf':'application/epub+zip'))throw Error(`${a.path}: MIME ${type}`);
  checks.push({path:a.path,bytes:bytes.length,sha256:a.sha256,content_type:type,source_fingerprint_matches:true});
 }
}));
checks.sort((a,b)=>a.path.localeCompare(b.path));
writeFileSync(process.env.QA_REPORT_PATH||'data/reports/live-essay-verification.json',JSON.stringify({checked_at:new Date().toISOString(),site:site+base+'/',deployed_revision:revision,workflow_run:run,status:'passed',annual_explanations:new Set(manifest.artifacts.filter(a=>a.kind==='awards').map(a=>a.id)).size,work_explanations:new Set(manifest.artifacts.filter(a=>a.kind==='works').map(a=>a.id)).size,manifest_toolchain:manifest.toolchain,verified_downloads:checks,limits:'Checks prove deployment, declared source fingerprints and document bytes/MIME types. No scholarly approval is inferred from these checks.'},null,2)+'\n');
console.log(`Verified ${checks.length} live files against public manifest and declared deployed toolchain/source fingerprints.`);
