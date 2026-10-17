import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
export function executable(env: string, local: string, fallback: string) { return process.env[env] || (existsSync(local)?resolve(local):fallback); }
export const pandoc = () => executable('PANDOC_BIN','.tools/pandoc-3.12.1/bin/pandoc','pandoc');
export const pdfEngine = () => executable('PDF_ENGINE','.tools/tectonic/tectonic','xelatex');
export const java = () => executable('JAVA_BIN','.tools/jre/bin/java','java');
export const epubcheck = () => executable('EPUBCHECK_JAR','.tools/epubcheck-5.4.0/epubcheck.jar','/usr/share/java/epubcheck.jar');
export function run(command: string, args: string[], options: {timeout?:number}={}) {
 const r=spawnSync(command,args,{encoding:'utf8',timeout:options.timeout||180000, maxBuffer:8*1024*1024});
 if(r.error||r.status!==0)throw new Error(`${command} ${args.join(' ')}\n${r.error?.message||''}\n${r.stdout}\n${r.stderr}`);
 return r.stdout.trim();
}
