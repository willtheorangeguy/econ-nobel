import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { workSchema, portraitSchema, type Version } from '../src/lib/schema';
import { json, hash, write, today, articles } from './common';
export function checkVersion(v: Version, publicRoot = 'public') {
  if ((v.allows_hosting || v.allows_format_conversion || v.local_pdf_path || v.local_epub_path) && (!v.license_id || !v.license_evidence_url || !v.license_verified_at || !v.license_verified_by)) throw new Error(`Permission evidence missing for ${v.version_id}`);
  if ((v.local_pdf_path || v.local_epub_path) && !v.allows_hosting) throw new Error(`Hosting not cleared: ${v.version_id}`);
  if (v.local_epub_path && !v.epub_provenance) throw new Error(`EPUB provenance required: ${v.version_id}`);
  if (v.local_epub_path && v.epub_provenance === 'converted' && !v.allows_format_conversion) throw new Error(`EPUB conversion not cleared: ${v.version_id}`);
  if (v.allows_format_conversion && /(?:^|-)ND(?:-|$)/i.test(v.license_id || '')) throw new Error(`NoDerivatives conversion requires separate authorization: ${v.version_id}`);
  for (const [path, checksum] of [[v.local_pdf_path,v.pdf_checksum_sha256],[v.local_epub_path,v.epub_checksum_sha256]]) {
    if (!path) continue;
    if (!/^\/downloads\/originals\/[a-zA-Z0-9/_.-]+$/.test(path) || path.includes('..')) throw new Error('Unsafe original path');
    if (!checksum) throw new Error(`Artifact checksum required: ${path}`);
    const file = join(publicRoot, path);
    if (!existsSync(file) || hash(readFileSync(file))!==checksum) throw new Error(`Missing or changed original ${path}`);
  }
}
if (process.argv[1]?.endsWith('audit-rights.ts')) {
  const works = json<any[]>('data/curated/works.json').map(w=>workSchema.parse(w));
  const portraits = json<any[]>('data/curated/portraits.json').map(p=>portraitSchema.parse(p));
  const allowed = new Set<string>();
  works.forEach(w=>w.versions.forEach(v=>{ checkVersion(v); [v.local_pdf_path,v.local_epub_path].filter(Boolean).forEach(p=>allowed.add(`public${p}`)); }));
  portraits.forEach(p=>{ const path=`public${p.local_path}`; if (!existsSync(path)||hash(readFileSync(path))!==p.checksum_sha256) throw new Error(`Missing/changed portrait ${path}`); allowed.add(path); });
  function walk(dir: string) { if (!existsSync(dir)) return; for (const f of readdirSync(dir,{withFileTypes:true})) { const path=join(dir,f.name); if (f.isDirectory()) walk(path); else if (!allowed.has(path)) throw new Error(`Unregistered public third-party asset: ${path}`); } }
  walk('public/downloads/originals'); walk('public/portraits');
  const manifests=json<any>('data/generated/download-manifest.json');
  const authored=new Set(manifests.artifacts.map((a:any)=>`public/${a.path}`));
  // Recognize exact exporter-owned paths so an interrupted build can recover before the next public build.
  for (const kind of ['awards','works'] as const) for (const a of articles(kind)) for (const stage of ['', 'drafts/']) for (const ext of ['pdf','epub']) {
    authored.add(`public/downloads/${stage}${kind}/${a.id}/${a.id}-overview.${ext}`);
    authored.add(`public/downloads/${stage}${kind}/${a.id}/.building-${a.id}.${ext}`);
  }
  function scanPublic(dir:string) { for (const f of readdirSync(dir,{withFileTypes:true})) { const path=join(dir,f.name); if(f.isDirectory())scanPublic(path); else if(/\.(pdf|epub)$/i.test(f.name)&&!allowed.has(path)&&!authored.has(path)) throw new Error(`Unregistered public document ${path}`); } }
  scanPublic('public');
  write('data/reports/rights-audit.json',{ checked_at:today(),works:works.length,portraits:portraits.length,hosted_originals:allowed.size-portraits.length,failures:[] });
  console.log(`Rights audit passed: ${works.length} works, ${portraits.length} cleared portraits. Hosting defaults to denied.`);
}
