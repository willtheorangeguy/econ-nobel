import type { Citation } from './schema';
export const citationText = (c: Citation) => `${c.authors.join('; ')} (${c.year}). ${c.title}.${c.venue ? ` ${c.venue}.` : ''}${c.volume ? ` ${c.volume}` : ''}${c.pages ? `: ${c.pages}.` : ''}`;
