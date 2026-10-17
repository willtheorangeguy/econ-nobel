import { expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { versionSchema } from '../../src/lib/schema';
import { checkVersion } from '../../scripts/audit-rights';
import { hash } from '../../scripts/common';

function withFiles(test: (root: string, version: ReturnType<typeof versionSchema.parse>) => void) {
  const root = mkdtempSync(join(tmpdir(), 'econ-original-rights-'));
  try {
    mkdirSync(join(root, 'downloads/originals'), { recursive: true });
    // Private test bytes exercise permission/integrity logic, not file-format QA.
    const pdf = Buffer.from('synthetic PDF fixture'), epub = Buffer.from('synthetic EPUB fixture');
    writeFileSync(join(root, 'downloads/originals/test.pdf'), pdf);
    writeFileSync(join(root, 'downloads/originals/test.epub'), epub);
    test(root, versionSchema.parse({ version_id: 'test', version_label: 'TEST ONLY', source_provider: 'Fixture', landing_page_url: 'https://example.org/paper', checked_at: '2026-10-17', license_id: 'TEST-PERMISSION', license_evidence_url: 'https://example.org/permission', license_verified_at: '2026-10-17', license_verified_by: 'Synthetic test fixture', allows_hosting: true, local_pdf_path: '/downloads/originals/test.pdf', local_epub_path: '/downloads/originals/test.epub', pdf_checksum_sha256: hash(pdf), epub_checksum_sha256: hash(epub), epub_provenance: 'native' }));
  } finally { rmSync(root, { recursive: true, force: true }); }
}

it('accepts two distinct artifact hashes and a cleared native EPUB without conversion permission', () => {
  withFiles((root, v) => {
    expect(v.pdf_checksum_sha256).not.toBe(v.epub_checksum_sha256);
    expect(v.allows_format_conversion).toBe(false);
    expect(() => checkVersion(v, root)).not.toThrow();
  });
});

it('rejects each artifact independently when its bytes change or its own hash is missing', () => {
  withFiles((root, v) => {
    expect(() => checkVersion({ ...v, pdf_checksum_sha256: null }, root)).toThrow('checksum required');
    expect(() => checkVersion({ ...v, epub_checksum_sha256: null }, root)).toThrow('checksum required');
    expect(() => checkVersion({ ...v, epub_checksum_sha256: v.pdf_checksum_sha256 }, root)).toThrow('Missing or changed');
    writeFileSync(join(root, 'downloads/originals/test.epub'), 'tampered');
    expect(() => checkVersion(v, root)).toThrow('test.epub');
    writeFileSync(join(root, 'downloads/originals/test.pdf'), 'tampered');
    expect(() => checkVersion(v, root)).toThrow('test.pdf');
  });
});

it('requires EPUB provenance and additional permission for converted editions', () => {
  withFiles((root, v) => {
    expect(() => checkVersion({ ...v, epub_provenance: null }, root)).toThrow('provenance');
    expect(() => checkVersion({ ...v, epub_provenance: 'converted' }, root)).toThrow('conversion not cleared');
    expect(() => checkVersion({ ...v, epub_provenance: 'converted', allows_format_conversion: true }, root)).not.toThrow();
  });
});

it('keeps native EPUB hosting evidence separate from conversion rights and rejects unsafe paths', () => {
  withFiles((root, v) => {
    expect(() => checkVersion({ ...v, allows_hosting: false }, root)).toThrow('Hosting not cleared');
    expect(() => checkVersion({ ...v, license_evidence_url: null }, root)).toThrow('Permission evidence');
    expect(() => checkVersion({ ...v, license_id: 'CC-BY-ND-4.0' }, root)).not.toThrow();
    expect(() => checkVersion({ ...v, license_id: 'CC-BY-ND-4.0', epub_provenance: 'converted', allows_format_conversion: true }, root)).toThrow('NoDerivatives');
    expect(() => checkVersion({ ...v, local_pdf_path: '/downloads/originals/../secret.pdf' }, root)).toThrow('Unsafe original path');
  });
});

it('rejects the retired shared checksum field instead of silently ignoring it', () => {
  withFiles((_root, v) => expect(() => versionSchema.parse({ ...v, checksum_sha256: v.pdf_checksum_sha256 })).toThrow('Unrecognized key'));
});
