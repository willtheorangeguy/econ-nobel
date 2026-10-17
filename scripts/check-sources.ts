import { json, write, today } from './common';
// Explicit maintainer action; never visitor-side and never automatically grants rights.
const sources=json<any[]>('data/curated/citations.json');
const checks=[];
for(const source of sources){
 let status:number|null=null,error:string|null=null;
 try {const r=await fetch(source.url,{method:'GET',redirect:'follow',signal:AbortSignal.timeout(20000),headers:{'User-Agent':'EconomicsPrizeArchive/0.1 (source link validation)'}});status=r.status;await r.body?.cancel();}
 catch(e){error=String(e);}
 checks.push({citation_id:source.id,url:source.url,status,error,accessible:status!==null&&status>=200&&status<400,checked_at:today()});
 await new Promise(r=>setTimeout(r,500));
}
write('data/reports/source-links.json',{checked_at:today(),checks});
console.log(`Checked ${checks.length} source URLs; ${checks.filter(c=>!c.accessible).length} require manual recheck (blocking/redirect errors do not establish that a source is false).`);
if(checks.some(c=>c.status===404||c.status===410))process.exitCode=1;
