import { readFileSync, existsSync, mkdirSync, writeFileSync, renameSync, readdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { parse } from 'yaml';
import { articleSchema } from '../src/lib/schema';
export const today = () => new Date().toISOString().slice(0,10);
export const json = <T = any>(path: string): T => JSON.parse(readFileSync(path, 'utf8'));
export function write(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(`${path}.tmp`, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');
  renameSync(`${path}.tmp`, path);
}
export const hash = (input: string | Buffer) => createHash('sha256').update(input).digest('hex');
export function articles(kind: 'awards' | 'works') {
  return readdirSync(`content/${kind}`).filter(f => f.endsWith('.md')).map(file => {
    const path = `content/${kind}/${file}`;
    const raw = readFileSync(path, 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!match) throw new Error(`Missing frontmatter in ${path}`);
    const data = parse(match[1]);
    const content = raw.slice(match[0].length);
    return { id: file.slice(0,-3), path, raw, content, data: articleSchema.parse(data) };
  });
}
export async function fetchJson(url: string, attempts = 4): Promise<any> {
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'EconomicsPrizeArchive/0.1 (educational metadata research)' } });
      if (!res.ok) throw new Error(`${res.status} from ${url}`);
      return await res.json();
    } catch (error) {
      if (attempt === attempts - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** attempt));
    }
  }
}
export const optionalJson = <T>(path: string, fallback: T): T => existsSync(path) ? json<T>(path) : fallback;
