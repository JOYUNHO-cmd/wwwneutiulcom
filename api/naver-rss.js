import { ALLOWED_NAVER_BLOGS, parseNaverRss } from '../lib/naverRss.mjs';
export const config = { runtime: 'edge' };
const MAX_ITEMS = 50;
const MAX_BYTES = 2 * 1024 * 1024;
const json = (body, status, cacheControl) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cacheControl, 'X-Content-Type-Options': 'nosniff' },
});

async function readBounded(response) {
  if (Number(response.headers.get('content-length')) > MAX_BYTES) throw new Error('Feed too large');
  if (!response.body) throw new Error('Empty feed');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let text = '';
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BYTES) throw new Error('Feed too large');
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export default async function handler(request) {
  if (request.method !== 'GET') {
    const response = json({ status: 'error', message: 'method not allowed' }, 405, 'no-store');
    response.headers.set('Allow', 'GET');
    return response;
  }
  const blogs = new URL(request.url).searchParams.getAll('blog');
  const blog = blogs[0];
  if (blogs.length !== 1 || !ALLOWED_NAVER_BLOGS.includes(blog)) {
    return json({ status: 'error', message: 'unknown blog' }, 400, 'no-store');
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const upstream = await fetch('https://rss.blog.naver.com/' + blog + '.xml', {
      headers: { 'User-Agent': 'neutiul.com field-log feed' },
      redirect: 'error',
      signal: controller.signal,
    });
    if (!upstream.ok) {
      await upstream.body?.cancel();
      return json({ status: 'error', message: 'upstream unavailable' }, 502, 'no-store');
    }
    const payload = parseNaverRss(await readBounded(upstream));
    payload.items = payload.items.slice(0, MAX_ITEMS);
    return json(payload, 200, 'public, s-maxage=1800, stale-while-revalidate=86400');
  } catch {
    return json({ status: 'error', message: 'fetch failed' }, 502, 'no-store');
  } finally {
    clearTimeout(timeout);
  }
}
