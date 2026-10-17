import { existsSync, readFileSync, renameSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { json, articles, hash, write, today, optionalJson } from './common';
import { pandoc, pdfEngine, run } from './toolchain';
const manifestPath='data/generated/download-manifest.json';
const prior=optionalJson<any>(manifestPath,{artifacts:[],toolchain:{}});
const candidates=(['awards','works'] as const).flatMap(kind=>articles(kind).filter(a=>a.data.status!=='metadata-only'&&a.content.trim()).map(a=>({...a,kind})));
if(!candidates.length){write(manifestPath,{artifacts:[],toolchain:{}});console.log('No editorial explanations to export yet.');process.exit(0);}
const toolchain={pandoc:run(pandoc(),['--version']).split('\n')[0],pdf_engine:run(pdfEngine(),['--version']).split('\n')[0]};
const bibliography=json<any[]>('data/curated/citations.json');
const csl=bibliography.map(c=>({id:c.id,type:c.type==='journal-article'?'article-journal':c.type==='book'?'book':'webpage',title:c.title,author:c.authors.map((name:string)=>({literal:name})),issued:{'date-parts':[[c.year]]},URL:c.url,DOI:c.doi,'container-title':c.venue,volume:c.volume,page:c.pages,accessed:{'date-parts':[c.accessed.split('-').map(Number)]}}));
mkdirSync('.cache/exports',{recursive:true});write('.cache/exports/bibliography.json',csl);
const template=readFileSync('templates/overview.tex','utf8'),css=readFileSync('templates/epub.css','utf8');
const artifacts:any[]=[],diagnostics:any[]=[];
const site=process.env.SITE_URL||'https://williamvdg.me',base=(process.env.BASE_PATH||'/econ-nobel').replace(/\/$/,'');
for(const a of candidates){
 const source_hash=hash(JSON.stringify({raw:a.raw,csl,template,css,toolchain,site,base}));
 const draft=a.data.status!=='published';
 const relative=`downloads/${draft?'drafts/':''}${a.kind}/${a.id}`;
 const destination=`public/${relative}`;mkdirSync(destination,{recursive:true});
 const metadata={title:a.data.title,subtitle:`${a.kind==='awards'?'Award':'Work'} overview · independent educational explanation`,author:['Economics Prize Archive contributors'],date:today(),lang:'en-US','editorial-status':draft?'UNREVIEWED DRAFT':a.data.status,'source-url':`${site}${base}/${a.kind}/${a.id}/`,'reference-section-title':'Sources and further reading',rights:'Original explanatory prose: CC BY 4.0. Third-party sources retain their rights.'};
 const input=`.cache/exports/${a.kind}-${a.id}.md`;
 const notice=`> **Editorial status: ${draft?'UNREVIEWED DRAFT':a.data.status}.** Independent explanatory overview by Economics Prize Archive contributors. ${draft?'This edition has not passed editorial review. ':''}Source: ${metadata['source-url']}. Generated ${today()}. Original prose: CC BY 4.0. Independent educational project; not affiliated with the Nobel Foundation or the Royal Swedish Academy of Sciences.\n\n`;
 write(input,notice+a.content+'\n\n## Sources and further reading\n\n');
 const metaPath=`.cache/exports/${a.kind}-${a.id}.json`;write(metaPath,metadata);
 for(const format of ['pdf','epub'] as const){
  const path=`${relative}/${a.id}-overview.${format}`,target=`public/${path}`;
  const cached=prior.artifacts.find((f:any)=>f.kind===a.kind&&f.id===a.id&&f.format===format&&f.source_hash===source_hash);
  if(cached&&existsSync(target)&&hash(readFileSync(target))===cached.sha256){artifacts.push(cached);continue;}
  const tmp=`${destination}/.building-${a.id}.${format}`;
  try{
   const args=[input,'--from=markdown+tex_math_dollars+footnotes+citations','--standalone','--toc','--citeproc','--bibliography=.cache/exports/bibliography.json',`--metadata-file=${metaPath}`,'--resource-path=.:public',`--output=${tmp}`];
   if(format==='pdf')args.push(`--pdf-engine=${pdfEngine()}`,'--template=templates/overview.tex');
   else args.push('--to=epub3','--mathml','--css=templates/epub.css','--split-level=2');
   run(pandoc(),args,{timeout:300000});
   const bytes=readFileSync(tmp);
   if(bytes.length<1000||(format==='pdf'?!bytes.subarray(0,4).equals(Buffer.from('%PDF')):!bytes.subarray(0,2).equals(Buffer.from('PK'))))throw new Error(`Invalid ${format} output`);
   renameSync(tmp,target);
   artifacts.push({kind:a.kind,id:a.id,format,path,sha256:hash(bytes),bytes:bytes.length,source_hash,generated_at:today(),editorial_status:a.data.status,license:'CC-BY-4.0',provenance:a.path});
   console.log(`Generated ${path}`);
  }catch(error){diagnostics.push({kind:a.kind,id:a.id,format,error:String(error)});}
 }
}
// Keep only files declared by this run. Abandoned output is never copied to dist.
const allowed=new Set(artifacts.map(a=>resolve(`public/${a.path}`)));
function prune(dir:string){if(!existsSync(dir))return;for(const f of readdirSync(dir,{withFileTypes:true})){const p=`${dir}/${f.name}`;if(f.isDirectory())prune(p);else if(!allowed.has(resolve(p))){mkdirSync('.cache/exports/rejected',{recursive:true});renameSync(p,`.cache/exports/rejected/${hash(p).slice(0,12)}-${f.name}`);}}}
prune('public/downloads/awards');prune('public/downloads/works');prune('public/downloads/drafts');
write(manifestPath,{artifacts,toolchain});write('data/reports/export-diagnostics.json',{failures:diagnostics});
if(diagnostics.length){console.error(`${diagnostics.length} export failures; see data/reports/export-diagnostics.json. Successful unrelated exports retained.`);process.exitCode=1;}
else console.log(`Export manifest: ${artifacts.length} verified artifacts.`);
