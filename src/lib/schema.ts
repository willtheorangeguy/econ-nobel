import { z } from 'zod';

export const statusSchema = z.enum(['metadata-only', 'researched', 'draft', 'needs-review', 'reviewed', 'published']);
const url = z.url();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const reviewSchema = z.object({
  reviewer: z.string().min(2), reviewed_at: date,
  citations_checked: z.literal(true), math_checked: z.literal(true), rights_checked: z.literal(true),
  contributions_checked: z.literal(true), limitations: z.array(z.string()),
});
export const articleSchema = z.object({
  title: z.string().min(3), abstract: z.string().min(20), status: statusSchema,
  citation_ids: z.array(z.string()), topic_slugs: z.array(z.string()).default([]),
  featured_work_ids: z.array(z.string()).default([]), review: reviewSchema.nullable().default(null),
  source_version: z.string().optional(),
}).superRefine((a, context) => {
  if (['reviewed', 'published'].includes(a.status) && !a.review) context.addIssue({ code: 'custom', message: 'Reviewed/published content requires an explicit reviewer record', path: ['review'] });
});
export const awardSchema = z.object({
  year: z.number().int().min(1969), official_prize_id: z.string(), official_name: z.string(),
  official_motivation: z.string().min(5), official_page_url: url, official_api_url: url,
  laureates: z.array(z.object({ id: z.string(), name: z.string(), motivation: z.string(), portion: z.string() })).min(1),
  last_source_checked_at: date,
});
export const laureateSchema = z.object({
  id: z.string(), display_name: z.string(), official_profile_url: url,
  birth_date: z.string().nullable(), birth_place: z.string().nullable(),
  affiliations: z.array(z.string()), award_years: z.array(z.number().int()), source_url: url,
});
export const citationSchema = z.object({
  id: z.string(), title: z.string(), authors: z.array(z.string()).min(1), year: z.number().int(),
  url, accessed: date, type: z.enum(['official', 'journal-article', 'book', 'report', 'webpage']),
  doi: z.string().regex(/^10\.\d{4,9}\/\S+$/i).optional(),
  venue: z.string().optional(), volume: z.string().optional(), pages: z.string().optional(),
  verified: z.boolean(), consulted_version: z.string().min(4),
});
export const versionSchema = z.object({
  version_id: z.string(), version_label: z.string(), source_provider: z.string(),
  landing_page_url: url, pdf_url: url.nullable().default(null), epub_url: url.nullable().default(null),
  checked_at: date, license_id: z.string().nullable().default(null),
  license_evidence_url: url.nullable().default(null), license_verified_at: date.nullable().default(null),
  license_verified_by: z.string().nullable().default(null),
  allows_hosting: z.boolean().default(false), allows_format_conversion: z.boolean().default(false),
  local_pdf_path: z.string().nullable().default(null), local_epub_path: z.string().nullable().default(null),
  pdf_checksum_sha256: z.string().regex(/^[a-f0-9]{64}$/).nullable().default(null),
  epub_checksum_sha256: z.string().regex(/^[a-f0-9]{64}$/).nullable().default(null),
  epub_provenance: z.enum(['native', 'converted']).nullable().default(null),
}).strict();
export const workSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), title: z.string(), authors: z.array(z.string()).min(1),
  year: z.number().int(), work_type: z.enum(['journal-article','working-paper','book','chapter','lecture','report','other']),
  doi: z.string().regex(/^10\.\d{4,9}\/\S+$/i).nullable(), journal_or_publisher: z.string(),
  citation_id: z.string(), source_citation_ids: z.array(z.string()).min(1),
  award_links: z.array(z.object({ award_year: z.number().int(),
    classification: z.enum(['officially-discussed','central-landmark','additional-reading']),
    why_linked: z.string().min(30), evidence_citation_ids: z.array(z.string()).min(1) })).min(1),
  versions: z.array(versionSchema),
});
export const portraitSchema = z.object({
  laureate_id: z.string(), local_path: z.string().startsWith('/portraits/'), source_url: url,
  credit: z.string().min(3), license: z.string().min(3), license_url: url,
  permitted_public_display: z.literal(true), checked_at: date, checked_by: z.string().min(2),
  checksum_sha256: z.string().regex(/^[a-f0-9]{64}$/),
});
export type Award = z.infer<typeof awardSchema>;
export type Laureate = z.infer<typeof laureateSchema>;
export type Article = z.infer<typeof articleSchema>;
export type Citation = z.infer<typeof citationSchema>;
export type Work = z.infer<typeof workSchema>;
export type Version = z.infer<typeof versionSchema>;
export const requiredSections = ['Abstract','In plain English','The problem before this work','What the laureates contributed','A concrete worked example','The core economics','The foundational works','What changed as a result','Criticisms, caveats and unresolved questions','Key takeaways'];
