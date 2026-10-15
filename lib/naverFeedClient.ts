// lib/naverFeedClient.ts
//
// Browser-side loader for the two Naver field-log blogs, shared by the home
// page's "현장 일지" section (components/home/LiveWorkFeedSection.tsx) and the
// /portfolio field-log grid. Both used to call api.rss2json.com directly; that
// service broke, and fixing only one copy left the other showing the error.
// Everything goes through our own api/naver-rss.js function now.

export const NAVER_FEEDS = [
  { blogCode: 'kslee0143', blogName: '현장 일지 1' },
  { blogCode: 'decline11731', blogName: '현장 일지 2' },
] as const;

// One automatic retry per blog: a single dropped request on a flaky mobile
// connection shouldn't land visitors on the error notice.
async function fetchFeed(blogCode: string): Promise<any[]> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`/api/naver-rss?blog=${blogCode}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.status === 'ok' && Array.isArray(data.items)) return data.items;
      }
    } catch {
      // fall through to the retry
    }
    if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 1200));
  }
  return [];
}

// Naver only serves its post thumbnails as PNG: ~200KB at 365px (?type=s3),
// 0.6–0.9MB at 743px (?type=w2) — six of those made /portfolio ~4MB heavier.
// Vercel Image Optimization (configured under "images" in vercel.json) resizes
// and re-encodes them to a ~384px WebP at the edge and caches the result.
const NAVER_IMAGE = /^https:\/\/(blogthumb|postfiles)\.pstatic\.net\//;
const CARD_WIDTH = 384; // must be one of vercel.json images.sizes

export function optimizedNaverThumb(url: string): string {
  if (!NAVER_IMAGE.test(url)) return url;
  return `/_vercel/image?url=${encodeURIComponent(url)}&w=${CARD_WIDTH}&q=70`;
}

// If the optimizer is unavailable (e.g. local dev), fall back once to Naver's
// own small thumbnail, loaded without a Referer (Naver blocks other sites').
export function naverThumbFallback(event: { currentTarget: HTMLImageElement }) {
  const img = event.currentTarget;
  const fallback = img.dataset.fallback;
  if (fallback && img.src !== fallback) {
    img.removeAttribute('data-fallback');
    img.src = fallback;
  }
}

export function smallNaverThumb(url: string): string {
  return NAVER_IMAGE.test(url) ? url.replace(/\?type=[^&]*$/, '?type=s3') : url;
}

/** Posts from both blogs, newest first, each tagged with blogName/blogCode. */
export async function fetchNaverFieldLogs<T = any>(): Promise<T[]> {
  const perBlog = await Promise.all(
    NAVER_FEEDS.map(async ({ blogCode, blogName }) =>
      (await fetchFeed(blogCode)).map((item) => ({ ...item, blogName, blogCode }))
    )
  );
  return perBlog
    .flat()
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()) as T[];
}
