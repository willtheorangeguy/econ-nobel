import type { APIRoute } from 'astro';
import manifest from '../../../data/generated/download-manifest.json';
// Static endpoint: publish the manifest from this build, including this runner's exact document hashes.
export const GET: APIRoute = () => new Response(JSON.stringify(manifest, null, 2), {
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
});
