// Crossref titles can contain presentation markup (for example italic n in
// Nash's 1950 title). Ignore that markup without relaxing the word comparison.
export function normalizeScholarlyText(value: string): string {
  const entities: Record<string, string> = {
    amp: '&', quot: '"', apos: "'", nbsp: ' ', lt: '<', gt: '>', ndash: '–', mdash: '—',
  };
  return value.replace(/<[^>]*>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|nbsp|lt|gt|ndash|mdash);/gi, (match, entity: string) => {
      if (!entity.startsWith('#')) return entities[entity.toLowerCase()] ?? match;
      const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
      return code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    })
    .toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '');
}
