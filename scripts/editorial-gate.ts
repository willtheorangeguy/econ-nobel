import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import { requiredSections } from '../src/lib/schema';

const parser = unified().use(remarkParse).use(remarkMath);
interface Node { type: string; value?: string; depth?: number; children?: Node[] }
const excluded = new Set(['heading', 'code', 'inlineCode', 'math', 'inlineMath', 'html', 'image', 'imageReference', 'definition', 'footnoteDefinition']);

function prose(node: Node): string {
  if (excluded.has(node.type)) return '';
  if (node.type === 'text') return (node.value || '').replace(/\[@[^\]]+\]|https?:\/\/\S+/g, ' ');
  return (node.children || []).map(prose).join(' ');
}
function words(text: string) { return text.match(/\p{L}+(?:[’'-]\p{L}+)*/gu)?.length || 0; }
function headingText(node: Node): string {
  return node.value || (node.children || []).map(headingText).join('');
}

// These floors reject empty/skeletal submissions. They do not assess economic
// correctness or replace the independent review record and export checks.
export function assertReviewedBody(content: string, kind: 'awards' | 'works') {
  const tree = parser.parse(content);
  const minimum = kind === 'awards' ? 800 : 300;
  if (words(prose(tree)) < minimum) throw new Error(`Reviewed ${kind} body requires at least ${minimum} prose words`);
  if (kind !== 'awards') return;
  for (const title of requiredSections) {
    const starts = tree.children.flatMap((n, i) => n.type === 'heading' && n.depth === 2 && headingText(n) === title ? [i] : []);
    if (starts.length !== 1) throw new Error(`Reviewed award requires exactly one section: ${title}`);
    const start = starts[0];
    let end = start + 1;
    while (end < tree.children.length && !(tree.children[end].type === 'heading' && (tree.children[end] as Node).depth! <= 2)) end++;
    const body = tree.children.slice(start + 1, end).map(prose).join(' ');
    if (words(body) < 20) throw new Error(`Reviewed award section needs at least 20 prose words: ${title}`);
  }
}
