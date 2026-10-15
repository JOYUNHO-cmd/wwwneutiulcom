// lib/naverRss.mjs
//
// Turns a Naver blog RSS feed (rss.blog.naver.com/<id>.xml) into the JSON
// shape the /portfolio "현장 시공 일지" section reads. That section used to go
// through the free api.rss2json.com service, which started answering
// {"status":"error","message":"Internal error"} — so the feed is now fetched
// by our own Vercel function (api/naver-rss.js) and parsed here. Plain JS with
// no DOM/XML dependency so it runs in the Edge runtime and under node --test.

// Only these blogs can be fetched through the function, so it can't be used
// as an open proxy for arbitrary URLs.
export const ALLOWED_NAVER_BLOGS = ['kslee0143', 'decline11731'];

const unwrap = (value) =>
  (value || '')
    .replace(/^\s*<!\[CDATA\[/, '')
    .replace(/\]\]>\s*$/, '')
    .trim();

function tag(block, name) {
  const match = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return match ? unwrap(match[1]) : '';
}

/** @returns {{ status: 'ok', items: object[] }} rss2json-compatible payload */
export function parseNaverRss(xml) {
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRe.exec(xml))) {
    const block = match[1];
    const description = tag(block, 'description');
    const guid = tag(block, 'guid');
    const img = description.match(/<img[^>]+src="([^">]+)"/);
    // The feed embeds a tiny ?type=s3 thumbnail; Naver serves the same image
    // at a card-sized width with ?type=w2.
    const thumbnail = img ? img[1].replace(/\?type=s\d+$/, '?type=w2') : '';
    const category = tag(block, 'category');
    items.push({
      title: tag(block, 'title'),
      pubDate: tag(block, 'pubDate'),
      link: guid || tag(block, 'link'),
      guid,
      author: tag(block, 'author'),
      thumbnail,
      description,
      content: description,
      categories: category ? [category] : [],
    });
  }
  return { status: 'ok', items };
}
