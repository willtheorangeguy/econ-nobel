import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
const root=resolve('dist'), base=(process.env.BASE_PATH||'/econ-nobel').replace(/\/$/,'');
let pages=0, links=0; const failures:string[]=[];
function walk(dir:string) { for (const entry of readdirSync(dir,{withFileTypes:true})) { const file=join(dir,entry.name); if(entry.isDirectory())walk(file); else if(entry.name.endsWith('.html'))check(file); } }
function check(file:string) {
 pages++;const text=readFileSync(file,'utf8');
 for (const match of text.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  const target=match[1].replaceAll('&amp;','&'); if (/^(?:https?:|mailto:|data:|tel:|javascript:)/.test(target))continue;
  const url=new URL(target,`https://local.test${base}/${file.slice(root.length+1).replace(/index\.html$/,'')}`);
  if (base && !(url.pathname===base||url.pathname.startsWith(base+'/'))) { failures.push(`${file}: escaped base ${target}`);continue; }
  let local=join(root,decodeURIComponent(url.pathname.slice(base.length)));
  if (local.endsWith('/')||!local.split('/').at(-1)!.includes('.'))local=join(local,'index.html');
  links++;
  if (!existsSync(local)) {failures.push(`${file}: missing ${target}`);continue;}
  if(url.hash&&local.endsWith('.html')) { const id=decodeURIComponent(url.hash.slice(1)); if(!readFileSync(local,'utf8').includes(`id="${id}"`))failures.push(`${file}: missing anchor ${target}`); }
 }
}
walk(root);
if(failures.length)throw new Error(failures.slice(0,30).join('\n'));
console.log(`Internal link audit passed: ${pages} pages, ${links} links/assets.`);
