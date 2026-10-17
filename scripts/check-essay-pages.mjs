import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { articles } from './common.ts';

// Run after a production build, with preview already available. This checks
// presentation and bytes, never scholarly accuracy or independent approval.
const authored = ['awards','works'].flatMap(kind => articles(kind).filter(a => a.data.status !== 'metadata-only').map(a => ({...a, route: `${kind}/${a.id}`})));
const requested = process.argv.slice(2);
const selected = requested.length ? requested.map(route => { const a=authored.find(a=>a.route===route);if(!a)throw Error(`Unknown or unwritten route: ${route}`);return a; }) : authored;
const site = process.env.QA_SITE_URL || 'http://127.0.0.1:4321/econ-nobel/';
const manifestSource = process.env.QA_MANIFEST_URL || 'data/generated/download-manifest.json';
const reportPath = process.env.QA_REPORT_PATH || 'data/reports/essay-browser-qa-current.json';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext();const page=await context.newPage();const checks=[];
try {
 let manifest;
 if(process.env.QA_MANIFEST_URL){
  const res=await fetch(manifestSource,{signal:AbortSignal.timeout(30000)});
  if(!res.ok)throw Error(`Manifest ${manifestSource}: ${res.status}`);
  manifest=await res.json();
 }else manifest=JSON.parse(readFileSync(manifestSource));
 for(const width of [320,390,1280]){
  await page.setViewportSize({width,height:900});
  for(const article of selected){
   const route=article.route;
   const year=route;
   console.log(`Checking ${route} at ${width}px`);
   const response=await page.goto(new URL(`${route}/`,site).href);
   if(!response?.ok())throw Error(`${route} at ${width}px: HTTP ${response?.status()} (${page.url()})`);
   await page.evaluate(()=>document.fonts.ready);
   if(article.data.status==='needs-review'&&!await page.locator('.editorial-banner').innerText().then(t=>t.toLowerCase().includes('unreviewed')))throw Error(`${year} status missing`);
   const math=await page.locator('.katex-display').count();if(article.content.includes('$$')&&!math)throw Error(`${year} missing math`);
   if(!await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1))throw Error(`${year} overflow at ${width}`);
   const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
   if(result.violations.length)throw Error(JSON.stringify({year,width,violations:result.violations}));
   const links=page.locator('a[download][href*="-overview."]');if(await links.count()!==2)throw Error(`${year} formats missing`);
   if(width===1280)for(const link of await links.all()){
    const url=await link.getAttribute('href');const res=await page.request.get(new URL(url, page.url()).href);if(!res.ok())throw Error(`${url}: ${res.status()}`);
    const bytes=await res.body(), artifact=manifest.artifacts.find(a=>url.endsWith(a.path));if(!artifact||createHash('sha256').update(bytes).digest('hex')!==artifact.sha256)throw Error(`${url}: checksum`);
   }
   checks.push({route,width,math_blocks:math,axe_violations:0,overflow:false,download_links:2});
  }
 }
 const report={checked_at:new Date().toISOString(),site,manifest_source:manifestSource,scope:`${selected.length} authored routes at three widths; overview download bodies checked at 1280px against the ${process.env.QA_MANIFEST_URL?'deployed':'local build'} manifest. Automated accessibility only, not scholarly review.`,checks};
 writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');console.log(report.scope);
}finally{await browser.close();}
