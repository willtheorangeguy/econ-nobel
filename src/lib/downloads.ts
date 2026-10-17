import manifest from '../../data/generated/download-manifest.json';
export interface Artifact { kind: 'awards' | 'works'; id: string; format: 'pdf' | 'epub'; path: string; sha256: string; bytes: number; source_hash: string; generated_at: string; editorial_status: string; }
export const artifacts = manifest.artifacts as Artifact[];
export const downloadsFor = (kind: string, id: string) => artifacts.filter(a => a.kind === kind && a.id === id);
