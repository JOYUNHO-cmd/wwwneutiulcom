// api/naver-rss.js — Vercel Edge Function
//
// GET /api/naver-rss?blog=kslee0143  ->  rss2json-compatible JSON
// Replaces the third-party api.rss2json.com proxy the /portfolio page used
// (see lib/naverRss.mjs). Only allow-listed blogs are fetched, and the result
// is cached at the edge so Naver is hit at most every 30 minutes per blog.
import { ALLOWED_NAVER_BLOGS, parseNaverRss } from '../lib/naverRss.mjs';

export const config = { runtime: 'edge' };

const MAX_ITEMS = 10;

const json = (body, status, cacheControl) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': cacheControl,
    },
  });

export default async function handler(request) {
  const blog = new URL(request.url).searchParams.get('blog');
  if (!ALLOWED_NAVER_BLOGS.includes(blog)) {
    return json({ status: 'error', message: 'unknown blog' }, 400, 'no-store');
  }

  try {
    const upstream = await fetch(`https://rss.blog.naver.com/${blog}.xml`, {
      headers: { 'User-Agent': 'neutiul.com field-log feed' },
    });
    if (!upstream.ok) {
      return json({ status: 'error', message: `naver ${upstream.status}` }, 502, 'no-store');
    }
    const payload = parseNaverRss(await upstream.text());
    // The feed carries the latest 50 posts; rss2json's free tier returned 10,
    // which is what the page's card grid was laid out for.
    payload.items = payload.items.slice(0, MAX_ITEMS);
    return json(payload, 200, 'public, s-maxage=1800, stale-while-revalidate=86400');
  } catch (err) {
    return json({ status: 'error', message: 'fetch failed' }, 502, 'no-store');
  }
}
