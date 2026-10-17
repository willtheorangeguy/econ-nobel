import { existsSync, readFileSync } from 'node:fs';
import { json, hash, articles } from './common';
import { java, epubcheck, run } from './toolchain';
const manifest=json<any>('data/generated/download-manifest.json');
for(const a of manifest.artifacts){
 const path=`public/${a.path}`;
 if(!existsSync(path))throw new Error(`Missing artifact ${path}`);
 const bytes=readFileSync(path);
 if(hash(bytes)!==a.sha256||bytes.length!==a.bytes)throw new Error(`Artifact integrity failure ${path}`);
 if(a.format==='epub'){
  if(!existsSync(epubcheck()))throw new Error('EPUBCheck missing. Install tooling or set EPUBCHECK_JAR.');
  run(java(),['-jar',epubcheck(),path,'--failonwarnings']);
 }else{
  if(bytes.subarray(0,4).toString()!=='%PDF')throw new Error('Invalid PDF signature');
  run(process.env.PYTHON_BIN||'python3',['scripts/validate-pdf.py',path]);
 }
}
for(const kind of ['awards','works'] as const)for(const a of articles(kind).filter(a=>a.data.status==='published'))for(const format of ['pdf','epub'])if(!manifest.artifacts.some((f:any)=>f.kind===kind&&f.id===a.id&&f.format===format&&f.editorial_status==='published'))throw new Error(`Published ${kind}/${a.id} missing ${format}`);
console.log(`Validated ${manifest.artifacts.length} export artifacts (PDF text, checksums and EPUBCheck).`);
