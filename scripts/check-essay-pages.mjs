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
const reportPath = process.env.QA_REPORT_PATH || 'data/reports/essay-browser-qa-current.json';
const browser=await chromium.launch({headless:true});
const context=await browser.newContext();const page=await context.newPage();const checks=[];
try {
 const manifest=JSON.parse(readFileSync('data/generated/download-manifest.json'));
 for(const width of [320,390,1280]){
  await page.setViewportSize({width,height:900});
  for(const article of selected){
   const route=article.route;
   const year=route;
   await page.goto(new URL(`${route}/`,site).href);await page.evaluate(()=>document.fonts.ready);
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
 const report={checked_at:new Date().toISOString(),scope:`${selected.length} authored routes at three widths; overview download bodies checked at 1280px against the local build manifest. Automated accessibility only, not scholarly review.`,checks};
 writeFileSync(reportPath,JSON.stringify(report,null,2)+'\n');console.log(report.scope);
}finally{await browser.close();}
