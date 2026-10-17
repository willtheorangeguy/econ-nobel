import { expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { assertReviewedBody } from '../../scripts/editorial-gate';
import { requiredSections } from '../../src/lib/schema';
import { articles } from '../../scripts/common';

const annual = articles('awards').find(a => a.id === '1969')!;

it('allows a substantive annual manuscript through the mechanical body check without granting review', () => {
  expect(() => assertReviewedBody(annual.content, 'awards')).not.toThrow();
  expect(annual.data.review).toBeNull();
  expect(annual.data.status).toBe('needs-review');
});

it('rejects heading-only articles and math/code/comment/citation padding', () => {
  const padding = `<!-- ${'hidden words '.repeat(1000)} -->\n\n\`\`\`\n${'code words '.repeat(1000)}\n\`\`\`\n\n$$\n${'x + y '.repeat(1000)}\n$$\n\n${'[@academy-1969] '.repeat(1000)}`;
  expect(() => assertReviewedBody(requiredSections.map(h => `## ${h}`).join('\n\n'), 'awards')).toThrow('prose words');
  expect(() => assertReviewedBody(padding, 'works')).toThrow('prose words');
});

it('rejects an empty required section even when the rest of the essay is long', () => {
  const content = requiredSections.map((h, i) => `## ${h}\n\n${i === 4 ? '[@academy-1969]\n\n$x=1$' : 'This paragraph explains the economic mechanism and its limits. '.repeat(20)}`).join('\n\n');
  expect(() => assertReviewedBody(content, 'awards')).toThrow('A concrete worked example');
});

it('rejects required headings hidden in fenced code and repeated required sections', () => {
  const longProse = 'This paragraph explains the mechanism and its limits. '.repeat(120);
  const headings = requiredSections.map(h => `## ${h}`).join('\n\n');
  expect(() => assertReviewedBody(`${longProse}\n\n\`\`\`\n${headings}\n\`\`\``, 'awards')).toThrow('exactly one section');
  expect(() => assertReviewedBody(`${annual.content}\n\n## Abstract\n\n${longProse}`, 'awards')).toThrow('exactly one section');
});

it('accepts the three substantive work drafts mechanically without inferring review', () => {
  for (const a of articles('works')) {
    expect(() => assertReviewedBody(a.content, 'works')).not.toThrow();
    expect(a.data.review).toBeNull();
  }
});

it('enforces the body gate in the actual content validator using an isolated synthetic review fixture', () => {
  const root = mkdtempSync(join(tmpdir(), 'econ-editorial-gate-'));
  try {
    cpSync('content', join(root, 'content'), { recursive: true });
    for (const file of ['data/generated/prizes.json', 'data/generated/laureates.json', 'data/raw/nobel/prizes.json', 'data/curated/works.json', 'data/curated/citations.json', 'data/curated/portraits.json', 'data/curated/topics.json']) {
      mkdirSync(join(root, file, '..'), { recursive: true });
      cpSync(file, join(root, file));
    }
    // A test-only record, never copied back into real content or used for exports.
    const review = { reviewer: 'SYNTHETIC TEST ONLY', reviewed_at: '2026-10-17', citations_checked: true, math_checked: true, rights_checked: true, contributions_checked: true, limitations: ['Not scholarly approval'] };
    const header = annual.raw.slice(0, annual.raw.length - annual.content.length).replace('status: needs-review', 'status: published').replace('review: null', `review: ${JSON.stringify(review)}`);
    const target = join(root, annual.path);
    const run = () => execFileSync(process.execPath, [resolve('node_modules/tsx/dist/cli.mjs'), resolve('scripts/validate-content.ts')], { cwd: root, stdio: 'pipe' });
    writeFileSync(target, header + requiredSections.map(h => `## ${h}`).join('\n\n'));
    expect(run).toThrow('prose words');
    writeFileSync(target, header + annual.content);
    expect(run).not.toThrow();
    expect(readFileSync(annual.path, 'utf8')).toBe(annual.raw);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
