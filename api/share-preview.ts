import curated from "./_curated-previews.json";
import { buildShareResponse, localeFor, type ShareDeps } from "./_share";

type Req = { query: Record<string, string | string[] | undefined>; headers: Record<string, string | string[] | undefined> };
type Res = { status(n: number): Res; setHeader(k: string, v: string): Res; send(body: string): void };

const env = (k: string) => (typeof process !== "undefined" ? process.env[k] : undefined);

const fetchPublic: ShareDeps["fetchPublic"] = async (id) => {
  const url = env("SUPABASE_URL");
  const anon = env("SUPABASE_ANON_KEY");
  if (!url || !anon) return null;
  // public_stories only exposes published stories; the anon key is safe here.
  const res = await fetch(`${url}/rest/v1/public_stories?id=eq.${encodeURIComponent(id)}&select=id,title,summary,cover_url,languages`, {
    headers: { apikey: anon, Authorization: `Bearer ${anon}` },
  });
  if (!res.ok) return null;
  const [row] = (await res.json()) as { title: string; summary: string; cover_url: string | null; languages: string[] }[];
  return row ? { title: row.title, description: row.summary, image: row.cover_url, locale: localeFor(row.languages) } : null;
};

export default async function handler(req: Req, res: Res) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const host = String(req.headers["x-forwarded-host"] ?? req.headers.host ?? "");
  const origin = env("PUBLIC_ORIGIN") || `https://${host}`;
  const out = await buildShareResponse(id, origin, { curated: curated as ShareDeps["curated"], fetchPublic });
  res.status(out.status).setHeader("Content-Type", "text/html; charset=utf-8").setHeader("Cache-Control", out.cache).send(out.html);
}
