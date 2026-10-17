import { readFileSync } from 'node:fs';
// Canonical Markdown uses Pandoc citation keys. Transform the same keys into bibliography links for HTML.
export default function citations() {
  const records = JSON.parse(readFileSync(new URL('../data/curated/citations.json', import.meta.url), 'utf8'));
  const byId = new Map(records.map(c => [c.id,c]));
  return tree => {
    function visit(node) {
      if (!node.children || ['link','code','inlineCode'].includes(node.type)) return;
      node.children = node.children.flatMap(child => {
        if (child.type !== 'text') { visit(child); return [child]; }
        const parts = []; let end = 0;
        for (const match of child.value.matchAll(/\[@([a-zA-Z0-9-]+)\]/g)) {
          const c = byId.get(match[1]);
          if (!c) throw new Error(`Unknown citation ${match[1]}`);
          if (match.index > end) parts.push({ type: 'text', value: child.value.slice(end,match.index) });
          parts.push({ type: 'link', url: `#ref-${c.id}`, children: [{ type:'text', value: `(${c.authors.map(name => /Academy|Nobel/.test(name) ? name : name.split(' ').at(-1)).join(' & ')}, ${c.year})` }] });
          end = match.index + match[0].length;
        }
        if (!parts.length) return [child];
        if (end < child.value.length) parts.push({ type:'text', value:child.value.slice(end) });
        return parts;
      });
    }
    visit(tree);
  };
}
