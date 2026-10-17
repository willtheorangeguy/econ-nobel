import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const base='/econ-nobel/';
test('catalogue filters by year, laureate and tagged topic; sorting works',async({page})=>{
 await page.goto(base+'awards/');
 await page.getByLabel('Year, laureate or idea').fill('1994');
 await expect(page.locator('[data-award-list]>li:visible')).toHaveCount(1);
 await expect(page.locator('[data-award-list]>li:visible')).toContainText('Nash');
 await page.getByLabel('Year, laureate or idea').fill('');
 await page.getByLabel('Topic',{exact:true}).selectOption('information-economics');
 await expect(page.locator('[data-award-list]>li:visible')).toHaveCount(1);
 await page.getByLabel('Topic',{exact:true}).selectOption('');
 await page.getByLabel('Order',{exact:true}).selectOption('asc');
 await expect(page.locator('[data-award-list]>li').first()).toContainText('1969');
});
test('latest and shared awards show all recipients and no future navigation',async({page})=>{
 await page.goto(base+'awards/2026/');
 await expect(page.locator('.byline')).toContainText('Robert E. Hall');await expect(page.locator('.byline')).toContainText('Michael Woodford');
 await expect(page.locator('a[href*="/2027/"]')).toHaveCount(0);
 await expect(page.locator('.laureate-panel')).toHaveCount(2);
 await expect(page.locator('a[download]')).toHaveCount(0);
 await page.goto(base+'awards/1994/');await expect(page.locator('.laureate-panel')).toHaveCount(3);
});
test('full-text search returns correct links under the repository base',async({page})=>{
 await page.goto(base+'search/?q=Tinbergen');
 await expect(page.locator('.pagefind-ui__result-link').first()).toBeVisible({timeout:20000});
 const link=page.locator('.pagefind-ui__result-link').filter({hasText:/1969/}).first();
 await expect(link).toBeVisible();
 expect(await link.getAttribute('href')).toContain('/econ-nobel/');
 await link.click();await expect(page).toHaveURL(/econ-nobel\/awards\/1969\//);
});
test('draft equations, bibliography and downloads are real; originals are honestly labeled',async({page,request})=>{
 await page.goto(base+'awards/2001/');
 await expect(page.locator('.katex-display')).toHaveCount(2);
 const section=page.locator('.article-toc a[href="#the-core-economics"]');await section.click();await expect(section).toHaveAttribute('aria-current','location');
 await expect(page.locator('#ref-akerlof-1970')).toBeVisible();
 await expect(page.locator('.editorial-banner')).toContainText('unreviewed');
 const links=page.locator('a[download]');await expect(links).toHaveCount(2);
 for(const link of await links.all()) { const res=await request.get((await link.getAttribute('href'))!);expect(res.ok()).toBe(true);const bytes=await res.body();expect(bytes.length).toBeGreaterThan(1000); }
 await page.goto(base+'works/akerlof-lemons-1970/');
 await expect(page.locator('.rights-state')).toContainText('Redistribution permission has not been established');
 await expect(page.locator('a[download][href*="/originals/"]')).toHaveCount(0);
});
for(const width of [320,390,1280])test(`layout and accessibility at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});
 for(const path of ['', 'awards/2001/', 'awards/2026/', 'works/akerlof-lemons-1970/', 'coverage/']){
  await page.goto(base+path);
  await page.evaluate(()=>document.fonts.ready);
  // Coverage deliberately provides an accessible table scroll region; the viewport itself must fit.
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),path).toBe(true);
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(result.violations,JSON.stringify(result.violations,null,2)).toEqual([]);
 }
});
test('keyboard skip link and no-JavaScript reading work',async({browser,page})=>{
 await page.goto(base);await page.keyboard.press('Tab');await expect(page.getByText('Skip to content',{exact:true})).toBeFocused();
 const context=await browser.newContext({javaScriptEnabled:false});const p=await context.newPage();await p.goto('http://127.0.0.1:4321'+base+'awards/2001/');
 await expect(p.getByRole('heading',{name:'In plain English',exact:true})).toBeVisible();await expect(p.locator('.katex-display')).toHaveCount(2);await context.close();
});
