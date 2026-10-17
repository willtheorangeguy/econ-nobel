import { expect, it } from 'vitest';
import { normalizeScholarlyText } from '../../scripts/scholarly-text';

it('matches the actual Crossref presentation markup in Nash’s title', () => {
  expect(normalizeScholarlyText('Equilibrium points in\n <i>n</i>\n -person games'))
    .toBe(normalizeScholarlyText('Equilibrium points in n-person games'));
});

it('decodes presentation entities while retaining differences between publications', () => {
  expect(normalizeScholarlyText('Risk &amp; Insurance &#8212; Theory'))
    .toBe(normalizeScholarlyText('Risk & Insurance — Theory'));
  expect(normalizeScholarlyText('Nash Equilibrium and Welfare Optimality'))
    .not.toBe(normalizeScholarlyText('Competition, Financial Discipline and Growth'));
});
