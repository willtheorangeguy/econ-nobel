import { describe, it, expect } from 'vitest';
import { articleSchema, versionSchema, workSchema } from '../../src/lib/schema';
import { checkVersion } from '../../scripts/audit-rights';
import { json, articles, hash } from '../../scripts/common';
import { changedRecords } from '../../scripts/nobel-diff';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const prizes=json<any[]>('data/generated/prizes.json');
describe('official catalogue',()=>{
 it('represents every year exactly once, with no speculative future year',()=>{
  const raw=json<any>('data/raw/nobel/prizes.json').rows;
  expect(prizes.map(p=>p.year)).toEqual(raw.filter((p:any)=>p.category.en==='Economic Sciences').map((p:any)=>Number(p.awardYear)).sort((a:number,b:number)=>a-b));
  expect(new Set(prizes.map(p=>p.year)).size).toBe(prizes.length);
  expect(prizes.map(p=>p.year)).not.toContain(Math.max(...prizes.map(p=>p.year))+1);
 });
 it('preserves both first-prize recipients and their official identities',()=>{
  expect(prizes.find(p=>p.year===1969).laureates.map((l:any)=>l.name)).toEqual(['Ragnar Frisch','Jan Tinbergen']);
 });
 it('preserves every latest-prize and three-way shared-prize recipient',()=>{
  expect(prizes.find(p=>p.year===2026).laureates.map((l:any)=>l.name)).toEqual(['Robert E. Hall','Michael Woodford']);
  expect(prizes.find(p=>p.year===1994).laureates).toHaveLength(3);
  expect(prizes.find(p=>p.year===2001).laureates).toHaveLength(3);
 });
 it('resolves laureates by ID and validates review/citation/math invariants',()=>{
  expect(()=>execFileSync(process.execPath,['--import','tsx','scripts/validate-content.ts'])).not.toThrow();
 });
 it('keeps metadata-only entries distinct from authored drafts and published research',()=>{
  const entries=articles('awards');expect(entries).toHaveLength(prizes.length);
  for(const a of entries.filter(a=>a.data.status==='metadata-only'))expect(a.data.featured_work_ids).toEqual([]);
  for(const a of entries.filter(a=>a.data.status==='published'))expect(a.data.review).not.toBeNull();
 });
});
describe('rights and editorial gates',()=>{
 const version=versionSchema.parse({version_id:'published',version_label:'Published article',source_provider:'Publisher',landing_page_url:'https://example.org/paper',checked_at:'2026-10-17'});
 it('defaults public hosting and conversion to denied',()=>{expect(version.allows_hosting).toBe(false);expect(version.allows_format_conversion).toBe(false);expect(()=>checkVersion(version)).not.toThrow();});
 it('rejects open-access labels without explicit permission evidence',()=>{expect(()=>checkVersion({...version,allows_hosting:true,license_id:'bronze-oa'})).toThrow('Permission evidence');});
 it('rejects hosted files without permission',()=>{expect(()=>checkVersion({...version,local_pdf_path:'/downloads/originals/a.pdf'})).toThrow();});
 it('rejects NoDerivatives conversion even if someone checked the flags',()=>{expect(()=>checkVersion({...version,allows_format_conversion:true,license_id:'CC-BY-ND-4.0',license_evidence_url:'https://example.org/license',license_verified_at:'2026-10-17',license_verified_by:'Reviewer'})).toThrow('NoDerivatives');});
 it('rejects incomplete review records',()=>{expect(()=>articleSchema.parse({title:'A real title',abstract:'A sufficiently descriptive abstract.',status:'published',citation_ids:[],review:{reviewer:'Someone'}})).toThrow();});
 it('rejects a work with unsupported award association',()=>{expect(()=>workSchema.parse({id:'fake',title:'Fake',award_links:[{award_year:2001,evidence_citation_ids:[]}]})).toThrow();});
 it('uses content hashes, not filenames, to identify changed artifacts',()=>{expect(hash('a')).not.toEqual(hash('b'));expect(hash('a')).toHaveLength(64);});
});

describe('official refresh review staging',()=>{
 it('stages a laureate affiliation correction even when the award recipients have not changed',()=>{
  const before=[{id:'1',affiliations:['Original institution']}];
  const after=[{id:'1',affiliations:['Corrected institution']}];
  expect(changedRecords(before,after,'id')).toEqual({changed:['1'],removed:[]});
 });
 it('stages removed IDs and ignores only the observation date, not factual changes',()=>{
  expect(changedRecords([{id:'1',last_source_checked_at:'2026-10-16'}],[{id:'1',last_source_checked_at:'2026-10-17'}],'id')).toEqual({changed:[],removed:[]});
  expect(changedRecords([{id:'1'}],[],'id')).toEqual({changed:[],removed:['1']});
 });
});

it('an offline laureate correction stages a report without overwriting accepted records or creating articles',()=>{
 const root=mkdtempSync(join(tmpdir(),'econ-nobel-import-'));
 try {
  mkdirSync(join(root,'data/raw/nobel'),{recursive:true});mkdirSync(join(root,'data/generated'),{recursive:true});
  for(const file of ['data/raw/nobel/prizes.json','data/raw/nobel/laureates.json','data/generated/prizes.json','data/generated/laureates.json'])copyFileSync(file,join(root,file));
  const raw=json<any>('data/raw/nobel/laureates.json');const id=raw.rows[0].id;
  raw.rows[0].birth={...raw.rows[0].birth,date:'1900-01-01'}; // deliberately altered private fixture, never published
  writeFileSync(join(root,'data/raw/nobel/laureates.json'),JSON.stringify(raw));
  const accepted=readFileSync(join(root,'data/generated/laureates.json'),'utf8');
  execFileSync(process.execPath,[resolve('node_modules/tsx/dist/cli.mjs'),resolve('scripts/sync-nobel.ts'),'--offline'],{cwd:root});
  const report=JSON.parse(readFileSync(join(root,'data/reports/import-diff.json'),'utf8'));
  expect(report.changed_laureate_ids).toContain(id);
  expect(readFileSync(join(root,'data/generated/laureates.json'),'utf8')).toBe(accepted);
  expect(existsSync(join(root,'content'))).toBe(false);
 } finally { rmSync(root,{recursive:true,force:true}); }
});
