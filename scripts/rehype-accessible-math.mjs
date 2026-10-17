// Display equations can overflow at narrow widths. Keep their existing MathML,
// and make the scrolling container keyboard reachable even without JavaScript.
export default function accessibleMath() {
  return tree => {
    function visit(node) {
      if (node.type === 'element' && node.properties?.className?.includes('katex-display')) {
        Object.assign(node.properties, {
          tabIndex: 0,
          role: 'group',
          ariaLabel: 'Mathematical expression',
        });
      }
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
